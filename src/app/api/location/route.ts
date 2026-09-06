import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const JHARKHAND_DISTRICT_CENTERS: Record<string, { lat: number; lng: number }> = {
  Ranchi: { lat: 23.3441, lng: 85.3096 },
  Dhanbad: { lat: 23.7957, lng: 86.4304 },
  'East Singhbhum': { lat: 22.8046, lng: 86.2029 },
  Bokaro: { lat: 23.6693, lng: 86.1511 },
  Hazaribagh: { lat: 23.9925, lng: 85.3637 },
  Dumka: { lat: 24.2676, lng: 87.2484 },
  Deoghar: { lat: 24.4826, lng: 86.7003 },
  Palamu: { lat: 24.0416, lng: 84.0722 },
  Giridih: { lat: 24.1856, lng: 86.3117 },
  'West Singhbhum': { lat: 22.5702, lng: 85.8152 },
  Ramgarh: { lat: 23.6300, lng: 85.5133 },
  'Saraikela Kharsawan': { lat: 22.7006, lng: 85.9298 },
  Khunti: { lat: 23.0734, lng: 85.2778 },
  Lohardaga: { lat: 23.4419, lng: 84.6826 },
  Gumla: { lat: 23.0441, lng: 84.5414 },
  Simdega: { lat: 22.6167, lng: 84.5000 },
  Latehar: { lat: 23.7431, lng: 84.4983 },
  Garhwa: { lat: 24.1612, lng: 83.8090 },
  Chatra: { lat: 24.2092, lng: 84.8722 },
  Koderma: { lat: 24.4674, lng: 85.5939 },
  Jamtara: { lat: 23.9599, lng: 86.8021 },
  Godda: { lat: 24.8267, lng: 87.2132 },
  Pakur: { lat: 24.6340, lng: 87.8492 },
  Sahebganj: { lat: 25.2425, lng: 87.6433 },
};

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function findNearestDistrict(lat: number, lng: number): string {
  let nearestDistrict = 'Ranchi';
  let minDistance = Infinity;

  for (const [district, coords] of Object.entries(JHARKHAND_DISTRICT_CENTERS)) {
    const dist = calculateDistanceKm(lat, lng, coords.lat, coords.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearestDistrict = district;
    }
  }

  return nearestDistrict;
}

function matchJharkhandDistrict(addressText: string, lat?: number, lng?: number): string {
  const lower = addressText.toLowerCase();

  for (const dist of Object.keys(JHARKHAND_DISTRICT_CENTERS)) {
    if (lower.includes(dist.toLowerCase())) {
      return dist;
    }
  }

  // Common aliases & prominent towns in Jharkhand
  if (lower.includes('jamshedpur') || lower.includes('tatanagar') || lower.includes('ghatshila')) return 'East Singhbhum';
  if (lower.includes('chaibasa') || lower.includes('chakradharpur')) return 'West Singhbhum';
  if (lower.includes('medininagar') || lower.includes('daltonganj')) return 'Palamu';
  if (lower.includes('chas') || lower.includes('phusro') || lower.includes('bermo')) return 'Bokaro';
  if (lower.includes('madhupur')) return 'Deoghar';
  if (lower.includes('patratu')) return 'Ramgarh';
  if (lower.includes('netarhat')) return 'Latehar';
  if (lower.includes('rajmahal')) return 'Sahebganj';
  if (lower.includes('sindri') || lower.includes('katras') || lower.includes('jharia')) return 'Dhanbad';
  if (lower.includes('barhi')) return 'Hazaribagh';
  if (lower.includes('jhumri telaiya') || lower.includes('telaiya')) return 'Koderma';

  // If coordinates are provided, find geometrically nearest district
  if (typeof lat === 'number' && typeof lng === 'number') {
    return findNearestDistrict(lat, lng);
  }

  return 'Ranchi';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, lat, lng, query } = body;

    // --- Action 1: IP Geolocation ---
    if (action === 'ip') {
      try {
        const ipRes = await fetch('https://ipapi.co/json/', {
          headers: { 'User-Agent': 'JoharSetu-SIH2026/1.0' },
        });

        if (ipRes.ok) {
          const ipData = await ipRes.json();
          const ipLat = parseFloat(ipData.latitude);
          const ipLng = parseFloat(ipData.longitude);

          if (!isNaN(ipLat) && !isNaN(ipLng)) {
            const district = matchJharkhandDistrict(
              `${ipData.city || ''} ${ipData.region || ''}`,
              ipLat,
              ipLng
            );
            const locality = ipData.city || 'Local Area';

            return NextResponse.json({
              success: true,
              district,
              village: `${locality}`,
              formattedAddress: `${locality}, ${ipData.region || 'Jharkhand'}, India`,
              latitude: ipLat,
              longitude: ipLng,
              source: 'ip',
            });
          }
        }
      } catch (err) {
        console.warn('[Location API] IP geolocation failed:', err);
      }

      // Default state capital if IP lookup fails
      return NextResponse.json({
        success: true,
        district: 'Ranchi',
        village: 'Ranchi Main Road',
        formattedAddress: 'Ranchi, Jharkhand, India',
        latitude: 23.3441,
        longitude: 85.3096,
        source: 'default',
      });
    }

    // --- Action 2: Forward Address Search ---
    if (action === 'search') {
      if (!query || typeof query !== 'string' || !query.trim()) {
        return NextResponse.json({ success: true, results: [] });
      }

      const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;

      // 1. Attempt Google Geocoding API if key configured
      if (googleApiKey && googleApiKey.trim() !== '') {
        try {
          const gRes = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              query.trim() + ', Jharkhand, India'
            )}&key=${googleApiKey}`
          );
          if (gRes.ok) {
            const gData = await gRes.json();
            if (gData.status === 'OK' && gData.results && gData.results.length > 0) {
              const results = gData.results.slice(0, 5).map((r: any) => ({
                label: r.formatted_address,
                lat: r.geometry.location.lat,
                lng: r.geometry.location.lng,
              }));
              return NextResponse.json({ success: true, results, source: 'google' });
            }
          }
        } catch {}
      }

      // 2. OpenStreetMap / Nominatim Fallback
      try {
        let osmRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query.trim() + ', Jharkhand, India'
          )}&limit=5`,
          {
            headers: {
              'Accept-Language': 'en',
              'User-Agent': 'JoharSetu-SIH2026/1.0',
            },
          }
        );

        let osmData = osmRes.ok ? await osmRes.json() : [];

        // If no results, try broader query with India context
        if (!osmData || osmData.length === 0) {
          osmRes = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              query.trim() + ', India'
            )}&limit=5`,
            {
              headers: {
                'Accept-Language': 'en',
                'User-Agent': 'JoharSetu-SIH2026/1.0',
              },
            }
          );
          if (osmRes.ok) {
            osmData = await osmRes.json();
          }
        }

        if (osmData && osmData.length > 0) {
          const results = osmData.map((item: any) => ({
            label: item.display_name,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
          }));
          return NextResponse.json({ success: true, results, source: 'osm' });
        }
      } catch (err) {
        console.warn('[Location API] OSM search failed:', err);
      }

      return NextResponse.json({ success: true, results: [] });
    }

    // --- Action 3: Reverse Geocoding Coordinates ---
    if (action === 'reverse') {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);

      if (isNaN(latitude) || isNaN(longitude)) {
        return NextResponse.json(
          { success: false, error: 'Valid latitude and longitude required' },
          { status: 400 }
        );
      }

      const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;

      // 1. Google Maps Geocoding API if configured & active
      if (googleApiKey && googleApiKey.trim() !== '') {
        try {
          const gRes = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleApiKey}`
          );
          if (gRes.ok) {
            const gData = await gRes.json();
            if (gData.status === 'OK' && gData.results && gData.results.length > 0) {
              const first = gData.results[0];
              const formatted = first.formatted_address || '';
              const matchedDistrict = matchJharkhandDistrict(formatted, latitude, longitude);

              let locality = '';
              for (const comp of first.address_components || []) {
                if (
                  comp.types.includes('sublocality') ||
                  comp.types.includes('neighborhood') ||
                  comp.types.includes('locality')
                ) {
                  locality = comp.long_name;
                  break;
                }
              }

              return NextResponse.json({
                success: true,
                district: matchedDistrict,
                village: locality || `${matchedDistrict} Ward`,
                formattedAddress: formatted,
                latitude,
                longitude,
                source: 'google',
              });
            }
          }
        } catch {}
      }

      // 2. OpenStreetMap / Nominatim Fallback
      try {
        const osmRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
          {
            headers: {
              'Accept-Language': 'en',
              'User-Agent': 'JoharSetu-SIH2026/1.0',
            },
          }
        );

        if (osmRes.ok) {
          const osmData = await osmRes.json();
          const addr = osmData.address || {};
          const rawText = osmData.display_name || '';
          const fullAddressText = `${addr.county || ''} ${addr.state_district || ''} ${addr.city || ''} ${rawText}`;
          const matchedDistrict = matchJharkhandDistrict(fullAddressText, latitude, longitude);

          const localityName =
            addr.village ||
            addr.suburb ||
            addr.neighbourhood ||
            addr.hamlet ||
            addr.town ||
            addr.road ||
            'Ward / Locality';

          return NextResponse.json({
            success: true,
            district: matchedDistrict,
            village: localityName,
            formattedAddress: rawText,
            latitude,
            longitude,
            source: 'osm',
          });
        }
      } catch (err) {
        console.warn('[Location API] OSM reverse geocoding failed:', err);
      }

      // Nearest district fallback
      const fallbackDistrict = findNearestDistrict(latitude, longitude);
      return NextResponse.json({
        success: true,
        district: fallbackDistrict,
        village: `Area near ${fallbackDistrict} (${latitude.toFixed(3)}°N, ${longitude.toFixed(3)}°E)`,
        formattedAddress: `${latitude.toFixed(4)} N, ${longitude.toFixed(4)} E, ${fallbackDistrict}, Jharkhand`,
        latitude,
        longitude,
        source: 'geometric_fallback',
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    console.error('[Location API Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
