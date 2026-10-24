import { useState } from 'react'
import { motion } from 'framer-motion'
import { Compass, FileText, ArrowLeft } from 'lucide-react'
import Navigation from './Navigation'
import ChapterHero from './chapters/ChapterHero'
import ChapterAbout from './chapters/ChapterAbout'
import ChapterJourney from './chapters/ChapterJourney'
import ChapterProjects from './chapters/ChapterProjects'
import ChapterSkills from './chapters/ChapterSkills'
import ChapterAchievements from './chapters/ChapterAchievements'
import ChapterCertifications from './chapters/ChapterCertifications'
import ChapterConnect from './chapters/ChapterConnect'
import CustomCursor from './CustomCursor'
import ScrollProgress from './ScrollProgress'

interface EditorialPortfolioProps {
  onSwitchTo3D: () => void
}

export default function EditorialPortfolio({ onSwitchTo3D }: EditorialPortfolioProps) {
  const [currentChapter, setCurrentChapter] = useState(0)

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: 'var(--color-bg, #0d0d0f)',
        color: 'var(--color-ivory, #f0ece4)',
        overflowX: 'hidden',
      }}
    >
      <CustomCursor />
      <ScrollProgress />

      {/* Floating Mode Switcher Button: Jump directly into 3D World */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onSwitchTo3D}
        style={{
          position: 'fixed',
          top: 24,
          right: 40,
          zIndex: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 18px',
          background: 'rgba(14, 165, 233, 0.15)',
          border: '1.5px solid rgba(56, 189, 248, 0.4)',
          borderRadius: 30,
          color: '#38bdf8',
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.06em',
          backdropFilter: 'blur(16px)',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(14, 165, 233, 0.25)',
        }}
      >
        <Compass size={14} />
        ENTER 3D WORLD
      </motion.button>

      {/* Fixed Navigation bar */}
      <Navigation
        currentChapter={currentChapter}
        onChapterSelect={(ch) => setCurrentChapter(ch)}
      />

      {/* Chapter Sections */}
      <main style={{ position: 'relative', zIndex: 10 }}>
        <ChapterHero
          onEnter={() => setCurrentChapter(0)}
          onChapterChange={(ch) => setCurrentChapter(ch)}
        />
        <ChapterAbout onChapterChange={(ch) => setCurrentChapter(ch)} />
        <ChapterJourney onChapterChange={(ch) => setCurrentChapter(ch)} />
        <ChapterProjects onChapterChange={(ch) => setCurrentChapter(ch)} />
        <ChapterSkills onChapterChange={(ch) => setCurrentChapter(ch)} />
        <ChapterAchievements onChapterChange={(ch) => setCurrentChapter(ch)} />
        <ChapterCertifications onChapterChange={(ch) => setCurrentChapter(ch)} />
        <ChapterConnect onChapterChange={(ch) => setCurrentChapter(ch)} />
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '40px 20px',
          textAlign: 'center',
          fontSize: 12,
          color: 'rgba(255, 255, 255, 0.4)',
          fontFamily: '"Space Grotesk", sans-serif',
        }}
      >
        <p style={{ margin: 0 }}>
          Designed & Developed by Saanya Garg · Vellore Institute of Technology
        </p>
      </footer>
    </div>
  )
}
