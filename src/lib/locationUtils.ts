// Utilities for Geolocation, Reverse Geocoding, and Jharkhand Boundary Verification

export interface GeocodedLocation {
  district: string;
  village: string;
  formattedAddress: string;
  latitude: number;
  longitude: number;
  source?: string;
}

export const JHARKHAND_DISTRICTS = [
  'Ranchi',
  'Dhanbad',
  'East Singhbhum',
  'Bokaro',
  'Hazaribagh',
  'Dumka',
  'Deoghar',
  'Palamu',
  'Giridih',
  'West Singhbhum',
  'Ramgarh',
  'Saraikela Kharsawan',
  'Khunti',
  'Lohardaga',
  'Gumla',
  'Simdega',
  'Latehar',
  'Garhwa',
  'Chatra',
  'Koderma',
  'Jamtara',
  'Godda',
  'Pakur',
  'Sahebganj',
] as const;

export type JharkhandDistrict = (typeof JHARKHAND_DISTRICTS)[number];

export const JHARKHAND_DISTRICT_CENTERS: Record<string, { lat: number; lng: number }> = {
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
};

export const JHARKHAND_DISTRICT_BLOCKS: Record<string, string[]> = {
  Ranchi: ['Kanke Block, Pithoriya', 'Angara Block, Hesal', 'Namkum Panchayat', 'Ratu Block', 'Ormanjhi Block', 'Mandar Block'],
  Dhanbad: ['Baghmara Block, Tola 4', 'Jharia Coalfield Ward', 'Govindpur Panchayat', 'Nirsa Block', 'Baliapur Block', 'Tundi Block'],
  'East Singhbhum': ['Potka Block, Sankhabhanga', 'Ghatshila Sub-Division', 'Golmuri cum Jugsalai', 'Baharagora Block', 'Patamda Block'],
  Bokaro: ['Chas Municipal Ward', 'Bermo Block', 'Chandankiyari Block', 'Petarwar Block', 'Gomia Block'],
  Hazaribagh: ['Barhi Block', 'Ichak Panchayat', 'Barkagaon Block', 'Chauparan Block', 'Katkamsandi Block'],
  Dumka: ['Santhal Pargana Cluster', 'Ranishwar Block', 'Jama Panchayat', 'Jarmundi Block', 'Shikaripara Block'],
  Deoghar: ['Madhupur Block', 'Sarwan Panchayat', 'Mohanpur Block', 'Devipur Block'],
  Palamu: ['Medininagar Ward', 'Satbarwa Block', 'Panki Block', 'Chattarpur Block', 'Hussainabad Block'],
  Giridih: ['Bagodar Block', 'Dumri Panchayat', 'Deori Block', 'Tisri Block', 'Gandey Block'],
  'West Singhbhum': ['Chaibasa Sadar', 'Chakradharpur Ward', 'Manoharpur Block', 'Noamundi Mining Cluster'],
  Ramgarh: ['Patratu Thermal Ward', 'Gola Block', 'Mandu Panchayat', 'Chitarpur Block'],
  'Saraikela Kharsawan': ['Adityapur Industrial Ward', 'Gamharia Block', 'Kharsawan Block', 'Chandil Block'],
  Khunti: ['Torpa Block', 'Karra Panchayat', 'Rania Block', 'Murhu Block, Ulihatu'],
  Lohardaga: ['Kuru Block', 'Senha Panchayat', 'Bhandra Block', 'Kisko Block'],
  Gumla: ['Bishunpur Tribal Cluster', 'Raidih Block', 'Chainpur Block', 'Ghaghra Block'],
  Simdega: ['Kolebira Block', 'Bano Panchayat', 'Thethaitangar Block', 'Kurdeg Block'],
  Latehar: ['Netarhat Plateau Ward', 'Mahuadanr Block', 'Balumath Block', 'Chandwa Block'],
  Garhwa: ['Nagar Untari Block', 'Ranka Panchayat', 'Meral Block', 'Bhavnathpur Block'],
  Chatra: ['Hunterganj Block', 'Itkhori Heritage Ward', 'Simaria Block', 'Tandwa Block'],
  Koderma: ['Jhumri Telaiya Ward', 'Jainagar Block', 'Markacho Block', 'Satgawan Block'],
  Jamtara: ['Mihijam Ward', 'Narayanpur Block', 'Kundhit Block', 'Fatehpur Block'],
  Godda: ['Mahagama Block', 'Boarijor Tribal Cluster', 'Pathargama Block', 'Sundarpahari Block'],
  Pakur: ['Hiranpur Block', 'Maheshpur Block', 'Pakuria Panchayat', 'Litipara Block'],
  Sahebganj: ['Rajmahal Ganga Basin', 'Barharwa Block', 'Borio Block', 'Taljhari Block'],
};

export function getDefaultVillageForDistrict(district: string): string {
  return JHARKHAND_DISTRICT_BLOCKS[district]?.[0] || `${district} Ward 4`;
}


/**
 * Checks whether coordinates fall roughly inside the geopolitical bounds of Jharkhand
 */
export function isWithinJharkhand(lat: number, lng: number): boolean {
  return lat >= 21.9 && lat <= 25.4 && lng >= 83.3 && lng <= 87.9;
}

/**
 * Calculates distance in kilometers between two coordinates using Haversine formula
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

/**
 * Finds geometrically nearest Jharkhand district
 */
export function findNearestJharkhandDistrict(lat: number, lng: number): string {
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

/**
 * Matches raw address text to one of Jharkhand's 24 official districts
 */
export function matchJharkhandDistrict(addressText: string, lat?: number, lng?: number): string {
  const lower = addressText.toLowerCase();
  for (const dist of JHARKHAND_DISTRICTS) {
    if (lower.includes(dist.toLowerCase())) {
      return dist;
    }
  }
  // Common aliases
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

  if (typeof lat === 'number' && typeof lng === 'number') {
    return findNearestJharkhandDistrict(lat, lng);
  }

  return 'Ranchi';
}

/**
 * Robust two-tier browser geolocation acquisition with timeouts:
 * 1. High accuracy (GPS) with 6-second timeout
 * 2. Standard accuracy (WiFi/Cell triangulation) with 8-second timeout
 */
export async function acquireBrowserPosition(): Promise<{
  latitude: number;
  longitude: number;
  accuracy?: number;
}> {
  if (typeof window === 'undefined' || !('geolocation' in navigator)) {
    throw new Error('Geolocation is not supported by your browser.');
  }

  const getHighAccuracy = () =>
    new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 6000,
        maximumAge: 0,
      });
    });

  const getStandardAccuracy = () =>
    new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 0,
      });
    });

  try {
    const pos = await getHighAccuracy();
    return {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
    };
  } catch (err: any) {
    if (err && err.code === 1) {
      throw err;
    }
    const pos = await getStandardAccuracy();
    return {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
    };
  }
}

/**
 * Reverse-geocodes (lat, lng) to district, village, and formatted address
 * Delegates to /api/location to eliminate client CORS and forbidden header restrictions
 */
export async function reverseGeocodeCoordinates(
  lat: number,
  lng: number
): Promise<GeocodedLocation> {
  try {
    const res = await fetch('/api/location', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reverse', lat, lng }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return {
          district: data.district || 'Ranchi',
          village: data.village || 'Local Ward',
          formattedAddress: data.formattedAddress || '',
          latitude: data.latitude ?? lat,
          longitude: data.longitude ?? lng,
          source: data.source,
        };
      }
    }
  } catch (err) {
    console.warn('[ReverseGeocode] Server API call failed, falling back locally:', err);
  }

  // Local fallback calculation if offline or API route unavailable
  const nearest = findNearestJharkhandDistrict(lat, lng);
  const fallbackVillage = getDefaultVillageForDistrict(nearest);
  return {
    district: nearest,
    village: fallbackVillage,
    formattedAddress: `${fallbackVillage}, ${nearest}, Jharkhand`,
    latitude: lat,
    longitude: lng,
    source: 'local_fallback',
  };

}

/**
 * Fallback to approximate location via IP lookup
 */
export async function fetchIpLocation(): Promise<GeocodedLocation> {
  try {
    const res = await fetch('/api/location', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'ip' }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return {
          district: data.district || 'Ranchi',
          village: data.village || 'Ranchi Main Road',
          formattedAddress: data.formattedAddress || 'Ranchi, Jharkhand',
          latitude: data.latitude || 23.3441,
          longitude: data.longitude || 85.3096,
          source: data.source,
        };
      }
    }
  } catch (err) {
    console.warn('[IP Location] Call failed:', err);
  }

  return {
    district: 'Ranchi',
    village: 'Ranchi Main Road',
    formattedAddress: 'Ranchi, Jharkhand',
    latitude: 23.3441,
    longitude: 85.3096,
    source: 'default',
  };
}

/**
 * Forward geocodes a search string to coordinates
 */
export async function forwardGeocodeAddress(
  query: string
): Promise<Array<{ label: string; lat: number; lng: number }>> {
  if (!query || !query.trim()) return [];

  try {
    const res = await fetch('/api/location', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'search', query: query.trim() }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.results)) {
        return data.results;
      }
    }
  } catch (err) {
    console.warn('[ForwardGeocode] Search failed:', err);
  }

  return [];
}
