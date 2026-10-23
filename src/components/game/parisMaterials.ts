import * as THREE from 'three'

export const PARIS_COLORS = {
  // Sunset Palette
  skySun: '#ffedd5',
  skyHorizon: '#fdba74',
  skyZenith: '#64748b',
  fogSunset: '#dca59e',
  fogTwilight: '#4a3b5c',
  fogNight: '#0f172a',
  sunLight: '#ffe4cc',
  ambientSunset: '#f6d5ce',
  ambientTwilight: '#8b7a9e',
  ambientNight: '#1e293b',

  // Architecture palette (monochromatic warm Parisian stone)
  stoneLight: '#edd2cc',
  stoneMid: '#dfaba2',
  stoneDark: '#cb9890',
  mansardRoof: '#334155', // elegant slate zinc roof
  chimney: '#9c6d67',

  // Bridge & Boulevard
  bridgeWall: '#edd0cb',
  bridgeArch: '#dfaba2',
  boulevardRoad: '#1e222a', // sleek dark asphalt for gorgeous contrast
  boulevardPavement: '#d6b8b0',
  roadLine: '#fef3c7',

  // River
  waterSurface: '#1e3a8a',
  waterSkyReflect: '#93c5fd',

  // Scooter & Props - Two-Tone Vintage Italian Riviera Aesthetic
  scooterPrimary: '#0ea5e9', // vivid sky blue / Riviera teal lacquer
  scooterSecondary: '#fffbeb', // vintage warm cream two-tone panels
  scooterChrome: '#f8fafc',
  scooterLeather: '#27201c', // dark espresso leather saddle
  scooterTire: '#18181b',

  // Character Outfit (Avatar Reference: South Asian girl, dark hair, glasses, black top, pink skirt, white shoes)
  skinTone: '#cf956e', // warm South Asian complexion
  skinBlush: '#e08b79',
  hairDark: '#120b06', // rich deep brown-black
  glassesWire: '#71717a',
  topBlack: '#141417', // fitted black graphic tee
  skirtPink: '#e11d48', // rose-pink pleated skirt
  skirtPinkLight: '#fb7185',
  sneakersWhite: '#ffffff',
  backpackBlack: '#09090b',
}

let cachedMaterials: ReturnType<typeof initParisMaterials> | null = null

function initParisMaterials() {
  return {
    // Architecture
    facadeLight: new THREE.MeshStandardMaterial({
      color: PARIS_COLORS.stoneLight,
      roughness: 0.82,
      metalness: 0.05,
    }),
    facadeMid: new THREE.MeshStandardMaterial({
      color: PARIS_COLORS.stoneMid,
      roughness: 0.85,
      metalness: 0.05,
    }),
    facadeDark: new THREE.MeshStandardMaterial({
      color: PARIS_COLORS.stoneDark,
      roughness: 0.88,
      metalness: 0.05,
    }),
    mansardRoof: new THREE.MeshStandardMaterial({
      color: PARIS_COLORS.mansardRoof,
      roughness: 0.55,
      metalness: 0.35,
    }),
    windowGlass: new THREE.MeshStandardMaterial({
      color: '#f8fafc',
      roughness: 0.15,
      metalness: 0.85,
    }),
    windowGlowWarm: new THREE.MeshStandardMaterial({
      color: '#fef08a',
      emissive: '#f59e0b',
      emissiveIntensity: 1.8,
      roughness: 0.3,
    }),
    windowGlowCyan: new THREE.MeshStandardMaterial({
      color: '#a5f3fc',
      emissive: '#06b6d4',
      emissiveIntensity: 1.4,
      roughness: 0.3,
    }),
    bridgeStone: new THREE.MeshStandardMaterial({
      color: PARIS_COLORS.bridgeWall,
      roughness: 0.78,
      metalness: 0.05,
    }),
    curbStone: new THREE.MeshStandardMaterial({
      color: '#c29d95',
      roughness: 0.85,
      metalness: 0.05,
    }),

    // Roadway & Sidewalk
    roadAsphalt: new THREE.MeshStandardMaterial({
      color: '#1a1e26', // rich deep asphalt
      roughness: 0.65,
      metalness: 0.25,
    }),
    pavement: new THREE.MeshStandardMaterial({
      color: PARIS_COLORS.boulevardPavement,
      roughness: 0.82,
      metalness: 0.05,
    }),
    roadLine: new THREE.MeshStandardMaterial({
      color: '#fef08a',
      roughness: 0.35,
      emissive: '#fef08a',
      emissiveIntensity: 0.3,
    }),
    roadCatEye: new THREE.MeshStandardMaterial({
      color: '#ffffff',
      emissive: '#38bdf8',
      emissiveIntensity: 2.2,
      roughness: 0.1,
    }),

    // Landmarks & River
    eiffelMetal: new THREE.MeshStandardMaterial({
      color: '#94a3b8',
      roughness: 0.5,
      metalness: 0.6,
    }),
    eiffelGlow: new THREE.MeshStandardMaterial({
      color: '#fef08a',
      emissive: '#f59e0b',
      emissiveIntensity: 2.5,
    }),
    lampPost: new THREE.MeshStandardMaterial({
      color: '#1e293b',
      roughness: 0.35,
      metalness: 0.85,
    }),
    lampGlow: new THREE.MeshStandardMaterial({
      color: '#fef9c3',
      emissive: '#fde047',
      emissiveIntensity: 2.8,
    }),
    treeFoliage: new THREE.MeshStandardMaterial({
      color: '#4d7c0f', // lush Parisian plane tree green
      roughness: 0.85,
      metalness: 0.05,
    }),
    treeFoliageAutumn: new THREE.MeshStandardMaterial({
      color: '#d97706', // warm golden sunset foliage
      roughness: 0.85,
      metalness: 0.05,
    }),
    treeTrunk: new THREE.MeshStandardMaterial({
      color: '#3e2723',
      roughness: 0.9,
    }),
    water: new THREE.MeshStandardMaterial({
      color: '#1e3a8a',
      roughness: 0.05,
      metalness: 0.8,
      transparent: true,
      opacity: 0.92,
    }),

    // Motorcycle / Vintage Scooter
    scooterBody: new THREE.MeshStandardMaterial({
      color: PARIS_COLORS.scooterPrimary,
      roughness: 0.18,
      metalness: 0.45,
    }),
    scooterCowlCream: new THREE.MeshStandardMaterial({
      color: PARIS_COLORS.scooterSecondary,
      roughness: 0.22,
      metalness: 0.25,
    }),
    scooterChrome: new THREE.MeshStandardMaterial({
      color: '#f8fafc',
      roughness: 0.08,
      metalness: 0.98,
    }),
    scooterSeat: new THREE.MeshStandardMaterial({
      color: PARIS_COLORS.scooterLeather,
      roughness: 0.6,
      metalness: 0.1,
    }),
    scooterTire: new THREE.MeshStandardMaterial({
      color: '#111113',
      roughness: 0.92,
      metalness: 0.05,
    }),
    headlightLens: new THREE.MeshStandardMaterial({
      color: '#ffffff',
      emissive: '#fef08a',
      emissiveIntensity: 3.5,
      roughness: 0.1,
    }),
    taillightRed: new THREE.MeshStandardMaterial({
      color: '#dc2626',
      emissive: '#ef4444',
      emissiveIntensity: 2.5,
      roughness: 0.2,
    }),

    // Female Rider
    skin: new THREE.MeshStandardMaterial({
      color: PARIS_COLORS.skinTone,
      roughness: 0.65,
      metalness: 0.0,
    }),
    skinBlush: new THREE.MeshStandardMaterial({
      color: PARIS_COLORS.skinBlush,
      roughness: 0.7,
    }),
    hair: new THREE.MeshStandardMaterial({
      color: PARIS_COLORS.hairDark,
      roughness: 0.8,
    }),
    glasses: new THREE.MeshStandardMaterial({
      color: PARIS_COLORS.glassesWire,
      roughness: 0.2,
      metalness: 0.85,
    }),
    blackTop: new THREE.MeshStandardMaterial({
      color: PARIS_COLORS.topBlack,
      roughness: 0.8,
    }),
    pinkSkirt: new THREE.MeshStandardMaterial({
      color: PARIS_COLORS.skirtPink,
      roughness: 0.65,
    }),
    pinkSkirtLight: new THREE.MeshStandardMaterial({
      color: PARIS_COLORS.skirtPinkLight,
      roughness: 0.65,
    }),
    whiteShoes: new THREE.MeshStandardMaterial({
      color: PARIS_COLORS.sneakersWhite,
      roughness: 0.45,
    }),
    backpack: new THREE.MeshStandardMaterial({
      color: PARIS_COLORS.backpackBlack,
      roughness: 0.75,
    }),
  }
}

export function createParisMaterials() {
  if (!cachedMaterials) {
    cachedMaterials = initParisMaterials()
  }
  return cachedMaterials
}
