# Saanya Garg — 3D Portfolio

A cinematic, immersive 3D developer portfolio built with React, Three.js, GSAP, and Framer Motion. 

## ✨ Features

- **Full WebGL 3D environment** — animated hero orb with orbiting rings, particle field, tech nodes, connection lines, grid floor, and ambient geometry
- **Scroll-driven camera choreography** — GSAP ScrollTrigger moves the camera through 8 distinct viewpoints
- **Mouse parallax** — subtle cursor-based camera offset
- **7 narrative chapters** — Hero, About, Journey, Projects, Skills, Achievements, Certifications, Connect
- **Interactive project cards** — full detail modals for SaathiCircle, LaadliBachao, and Garg Associates
- **Skill tooltips** — hover technologies to see where they've been applied
- **Custom cursor** with trailing ring animation
- **Chapter navigation dots** and hamburger menu overlay
- **Scroll progress bar**
- **Loading screen** with progress animation
- **Sound toggle** (disabled by default)
- **WebGL fallback** for unsupported browsers
- **SEO metadata** and Open Graph tags
- **Reduced-motion** support
- **Resume download** button

## 🛠 Tech Stack

| Layer | Library |
|---|---|
| Framework | React 18 + TypeScript |
| Bundler | Vite |
| 3D Rendering | Three.js + React Three Fiber |
| 3D Helpers | Drei (Stars, Float, MeshDistortMaterial, Sphere, Torus) |
| Animation | GSAP + ScrollTrigger |
| UI Transitions | Framer Motion |
| Icons | Lucide React |
| Fonts | Syne, Space Grotesk, Space Mono (Google Fonts) |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
cd "3D Portfolio"
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
```

Output goes to the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── chapters/
│   │   ├── ChapterHero.tsx       # Landing / intro
│   │   ├── ChapterAbout.tsx      # Who I am + stats
│   │   ├── ChapterJourney.tsx    # Education + experience timeline
│   │   ├── ChapterProjects.tsx   # Project cards + modals
│   │   ├── ChapterSkills.tsx     # Tech skills with tooltips
│   │   ├── ChapterAchievements.tsx # Hackathon results
│   │   ├── ChapterCertifications.tsx # Credentials
│   │   └── ChapterConnect.tsx    # Contact + footer
│   ├── three/
│   │   └── MainScene.tsx         # Three.js 3D scene + camera
│   ├── LoadingScreen.tsx
│   ├── Navigation.tsx
│   ├── Scene.tsx                 # Canvas wrapper
│   ├── ScrollProgress.tsx
│   ├── SoundToggle.tsx
│   ├── CustomCursor.tsx
│   └── NoWebGL.tsx               # Fallback
├── App.tsx
├── main.tsx
└── index.css                     # Design tokens + global styles
public/
├── resume.pdf                    # ⚠️ REPLACE with actual resume
└── favicon.svg
```

## 📄 Adding Your Resume

Replace `public/resume.pdf` with Saanya's actual resume PDF. The file **must be named `resume.pdf`** for the download link to work.

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Drag the dist/ folder to netlify.com/drop
```

### GitHub Pages

```bash
npm run build
# Push the dist/ folder to your gh-pages branch
```

Add this to `vite.config.ts` if deploying to a subdirectory:
```ts
export default defineConfig({
  base: '/your-repo-name/',
  // ...
})
```

## 🎨 Customization

### Colors
Edit CSS variables in `src/index.css` → `:root { ... }`

### 3D Scene
Edit `src/components/three/MainScene.tsx`:
- Camera positions per chapter: `CAMERA_STATES[]`
- Orb size/position: `HeroOrb` component
- Particle count: `count` in `ParticleField`

### Content
All portfolio content is hardcoded in the chapter components. To update:
- **Personal info** → `ChapterHero.tsx`, `ChapterConnect.tsx`
- **Experience** → `ChapterJourney.tsx`
- **Projects** → `ChapterProjects.tsx` → `PROJECTS[]` array
- **Skills** → `ChapterSkills.tsx` → `SKILLS` object
- **Achievements** → `ChapterAchievements.tsx` → `ACHIEVEMENTS[]`
- **Certifications** → `ChapterCertifications.tsx` → `CERTIFICATIONS[]`

## 📱 Mobile Support

The portfolio adapts for touch devices:
- Custom cursor hidden on mobile
- 3D scene scales with viewport
- Chapter navigation uses touch-friendly dots
- All text and CTAs remain accessible
- `body { cursor: auto }` restored on mobile

## ♿ Accessibility

- Semantic HTML landmarks
- ARIA labels on interactive elements
- Keyboard navigation (Escape closes modals)
- Visible focus states
- `prefers-reduced-motion` respected
- WebGL fallback with contact links

---

Built with ❤️ for Saanya Garg's developer portfolio.
