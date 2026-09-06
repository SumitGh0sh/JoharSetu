/**
 * Issue Image Prompt Engine (Imagen 3 Anti-Studio Realism)
 * Constructs structured Imagen 3 prompts that simulate raw, candid, citizen-captured
 * smartphone photographs from rural Jharkhand, banning artificial stock-photo and 3D aesthetics.
 */

import { TicketCategory } from './types';

export interface ImagePromptRequest {
  title: string;
  description: string;
  category: TicketCategory;
  district?: string;
  village?: string;
  latitude?: number;
  longitude?: number;
}

export interface StructuredImagePrompt {
  prompt: string;
  negativePrompt: string;
  aspectRatio: '4:3' | '16:9' | '1:1';
  presetImageUrl: string;
  cameraSimulated: string;
  lightingCondition: string;
  watermarkText: string;
  jharkhandLandscapeFeatures: string[];
}

export const CATEGORY_PRESET_IMAGES: Record<TicketCategory, string> = {
  WATER_MANAGEMENT: '/images/issues/handpump_broken.jpg',
  ROAD_INFRASTRUCTURE: '/images/issues/road_culvert.jpg',
  RURAL_ELECTRIFICATION_SOLAR: '/images/issues/solar_inverter.jpg',
  SUSTAINABLE_AGRICULTURE: '/images/issues/crop_blight.jpg',
  SANITATION_WASTE: '/images/issues/handpump_broken.jpg',
  HEALTHCARE_DELIVERY: '/images/issues/solar_inverter.jpg',
  PRIMARY_EDUCATION_DIGITAL: '/images/issues/solar_inverter.jpg',
  FORESTRY_ENVIRONMENT: '/images/issues/crop_blight.jpg',
};

const CATEGORY_REALISM_PROMPTS: Record<TicketCategory, { subject: string; details: string; context: string }> = {
  WATER_MANAGEMENT: {
    subject: 'A rusted rural India Mark II iron handpump with chipped blue paint on a cracked damp concrete foundation',
    details: 'Reddish iron-contaminated turbid water pooling in a muddy ditch, corroded lever handle, worn rubber washers, water stains on stone basin',
    context: 'Rural village square in Jharkhand, red laterite clay soil, barefoot children footprints in red mud, bamboo grove in background'
  },
  ROAD_INFRASTRUCTURE: {
    subject: 'A collapsed rural dirt road culvert bridge washed away after torrential monsoon rains in Jharkhand',
    details: 'Exposed broken cylindrical concrete drainage pipe half-submerged in a deep eroded mud trench, muddy water flowing through, crumbling road edge with visible stone aggregate',
    context: 'Unpaved village connecting road, bicycle tire tracks pressed into wet red clay, lush wild monsoon foliage along embankment'
  },
  RURAL_ELECTRIFICATION_SOLAR: {
    subject: 'A damaged rural off-grid solar inverter box and weathered battery unit on an outdoor brick panchayat wall',
    details: 'Scorched wire casing, exposed dangling copper cables, weathered junction box with warning stickers, dust and rain streaks on aged brickwork, solar panel visible on corrugated tin roof above',
    context: 'Jharkhand village public facility, harsh midday overhead sun casting sharp dark shadows, dry dusty courtyard'
  },
  SUSTAINABLE_AGRICULTURE: {
    subject: 'Close-up handheld view of diseased paddy rice plant leaves showing yellow bacterial blight lesions',
    details: 'Brown and yellow scorched blotches along paddy leaf edges, water droplet condensation on leaf blades, natural agricultural blight symptoms, rough working hands holding the leaf',
    context: 'Terraced rainfed rice field in Chotanagpur plateau, muddy bunds with grass, cloudy overcast monsoon sky'
  },
  SANITATION_WASTE: {
    subject: 'Overflown open drainage channel and unpaved soak pit near village community tap in Jharkhand',
    details: 'Stagnant wastewater pooling on red soil, broken concrete slabs, uncollected domestic organic residue',
    context: 'Dense rural tola settlement, mud house walls with hand-painted patterns, humid afternoon lighting'
  },
  HEALTHCARE_DELIVERY: {
    subject: 'Primary health sub-centre cold-chain medicine vaccine refrigerator powered by faulty solar battery',
    details: 'Flashing digital temperature meter reading high alert, dust on heat sink vents, cracked wall plaster',
    context: 'Rural Jharkhand sub-health centre building with faded blue government livery, dim indoor ambient light'
  },
  PRIMARY_EDUCATION_DIGITAL: {
    subject: 'Village government primary school smart classroom tablet charging dock with burnt surge protector',
    details: 'Discolored plastic casing, disconnected USB multi-hub cables on rustic wooden desk, chalk dust on surface',
    context: 'School room with Hindi alphabet charts on weathered wall, bright outdoor window light washing in'
  },
  FORESTRY_ENVIRONMENT: {
    subject: 'Severe ravine gully soil erosion exposing roots of Sal trees on Chotanagpur forest ridge',
    details: 'Cracked dried red clay embankments, washed out seasonal stream bed with gravel stones, tree trunk lean',
    context: 'Protected tribal village forest edge, hazy dry-season afternoon sunlight with airborne dust particles'
  }
};

/**
 * Builds a hyper-realistic Imagen 3 prompt adhering to mid-range Android phone camera realism.
 */
export function generateIssueImagePrompt(req: ImagePromptRequest): StructuredImagePrompt {
  const catConfig = CATEGORY_REALISM_PROMPTS[req.category] || CATEGORY_REALISM_PROMPTS.WATER_MANAGEMENT;
  const districtName = req.district || 'Dhanbad';
  const villageName = req.village || 'rural village';

  // Anti-studio aesthetic tokens
  const cameraSignature = 'Shot on mid-range Android smartphone camera (12 megapixel sensor, f/2.2 aperture, slight handheld motion blur, non-ideal candid angle, raw compression artifacts, natural outdoor lighting with harsh shadows)';
  
  const jharkhandTokens = [
    'authentic red laterite clay soil of Chotanagpur',
    'weathered burnt-clay brick construction',
    'natural monsoon or dry-season rural Indian atmosphere',
    'uncropped ground reality, imperfect framing by village resident'
  ];

  const prompt = [
    `Authentic candid mobile photograph: ${catConfig.subject}.`,
    `Problem details: "${req.title.trim()}" - ${catConfig.details}.`,
    `Location context: ${villageName}, ${districtName} district, Jharkhand, India. ${catConfig.context}.`,
    `${cameraSignature}.`,
    `True-to-life documentary realism, raw unedited citizen report photo.`
  ].join(' ');

  const negativePrompt = [
    'studio lighting',
    'professional DSLR shallow depth-of-field',
    'bokeh blur background',
    '3D digital render',
    'CGI illustration',
    'vector artwork',
    'hyper-saturated fantasy colors',
    'polished commercial stock photo',
    'artificial HDR glow',
    'fake cinematic lighting',
    'watermark overlays in image render',
    'cartoonish textures'
  ].join(', ');

  const lat = req.latitude ?? 23.8145;
  const lng = req.longitude ?? 86.4412;
  const watermarkText = `📍 ${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E • Mobile Capture • ${villageName}, ${districtName}`;

  return {
    prompt,
    negativePrompt,
    aspectRatio: '4:3',
    presetImageUrl: CATEGORY_PRESET_IMAGES[req.category] || '/images/issues/handpump_broken.jpg',
    cameraSimulated: 'Redmi / Realme 12MP Mobile Sensor (Auto Mode)',
    lightingCondition: req.category === 'WATER_MANAGEMENT' || req.category === 'ROAD_INFRASTRUCTURE' ? 'Overcast Monsoon Daylight' : 'Harsh Direct Sunlight (12:30 PM)',
    watermarkText,
    jharkhandLandscapeFeatures: jharkhandTokens
  };
}
