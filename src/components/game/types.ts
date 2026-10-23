export type JourneyPhase = 'opening' | 'mounting' | 'riding' | 'arrived'

export interface WorldDefinition {
  id: number
  key: string
  title: string
  subtitle: string
  startProgress: number
  endProgress: number
  zPos: number
  color: string
}

export const WORLDS: WorldDefinition[] = [
  {
    id: 0,
    key: 'beginning',
    title: 'World 0 · The Beginning',
    subtitle: 'Where every journey starts',
    startProgress: 0.0,
    endProgress: 0.08,
    zPos: 0,
    color: '#3b82f6',
  },
  {
    id: 1,
    key: 'identity',
    title: 'World 1 · Identity & Purpose',
    subtitle: 'Full-Stack Developer & Innovator',
    startProgress: 0.08,
    endProgress: 0.20,
    zPos: -350,
    color: '#60a5fa',
  },
  {
    id: 2,
    key: 'education',
    title: 'World 2 · Academic Foundation',
    subtitle: 'VIT Bhopal University · B.Tech CSE',
    startProgress: 0.20,
    endProgress: 0.35,
    zPos: -750,
    color: '#38bdf8',
  },
  {
    id: 3,
    key: 'internships',
    title: 'World 3 · Industry Experience',
    subtitle: 'AmasQIS.ai · UptoSkills · Codveda Technologies',
    startProgress: 0.35,
    endProgress: 0.52,
    zPos: -1250,
    color: '#818cf8',
  },
  {
    id: 4,
    key: 'projects',
    title: 'World 4 · Project Universe',
    subtitle: 'SaathiCircle · LaadliBachao · Garg Associates',
    startProgress: 0.52,
    endProgress: 0.68,
    zPos: -1750,
    color: '#c084fc',
  },
  {
    id: 5,
    key: 'achievements',
    title: 'World 5 · Achievements Pass',
    subtitle: 'Hackathons & National Competitions',
    startProgress: 0.68,
    endProgress: 0.80,
    zPos: -2250,
    color: '#fbbf24',
  },
  {
    id: 6,
    key: 'skills',
    title: 'World 6 · Skills & Architecture',
    subtitle: 'Languages, Cloud, Databases & Frameworks',
    startProgress: 0.80,
    endProgress: 0.90,
    zPos: -2650,
    color: '#34d399',
  },
  {
    id: 7,
    key: 'certifications',
    title: 'World 7 · Certifications Observatory',
    subtitle: 'AWS, Stanford, Meta & Microsoft Credentials',
    startProgress: 0.90,
    endProgress: 0.96,
    zPos: -2950,
    color: '#f472b6',
  },
  {
    id: 8,
    key: 'contact',
    title: 'World 8 · Final Horizon',
    subtitle: 'Building the Future Together',
    startProgress: 0.96,
    endProgress: 1.0,
    zPos: -3200,
    color: '#fb923c',
  },
]

export const ROAD_TOTAL_LENGTH = 3200
