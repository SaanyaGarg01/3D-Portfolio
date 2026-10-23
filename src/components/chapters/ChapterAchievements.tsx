import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Trophy, Award, Star, Target } from 'lucide-react'

interface Props {
  onChapterChange: (ch: number) => void
}

const ACHIEVEMENTS = [
  {
    rank: '3rd Place',
    event: 'MP Police Cyber Safety Hackathon',
    detail: 'Ranked 3rd among 300+ competing teams.',
    icon: Trophy,
    color: '#d4956a',
    size: 'large',
  },
  {
    rank: 'Top 10',
    event: 'Epsilon Texpedition Hackathon 2026',
    detail: 'Selected as a Top 10 Finalist.',
    icon: Star,
    color: '#60a5fa',
    size: 'medium',
  },
  {
    rank: 'Semifinalist',
    event: 'Flipkart Grid 8.0',
    detail: 'Advanced to the semifinal round.',
    icon: Award,
    color: '#4ecdc4',
    size: 'medium',
  },
  {
    rank: 'Top 100',
    event: 'Samsung Solve for Tomorrow',
    detail: 'Advanced to the Top 100 in the ideation round — top 0.5% among 20,000+ participants.',
    icon: Target,
    color: '#c084fc',
    size: 'large',
  },
]

export default function ChapterAchievements({ onChapterChange }: Props) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { amount: 0.2 })

  useEffect(() => {
    if (isInView) onChapterChange(5)
  }, [isInView])

  return (
    <section
      id="chapter-achievements"
      ref={ref}
      className="chapter-section"
      style={{
        minHeight: '100vh',
        padding: '120px 40px',
        position: 'relative',
        display: 'block',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: 100 }}
        >
          <p className="chapter-number" style={{ marginBottom: 16 }}>05 · Achievements</p>
          <h2 className="display-lg font-display" style={{ color: 'var(--color-ivory)', maxWidth: 500 }}>
            Competing at the
            <br />
            <span style={{ color: 'var(--color-blue-glow)' }}>edge of ambition.</span>
          </h2>
        </motion.div>

        {/* Achievements */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {ACHIEVEMENTS.map((ach, i) => {
            const Icon = ach.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(80px, 120px) 1fr auto',
                  gap: '24px 40px',
                  alignItems: 'center',
                  padding: '36px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  position: 'relative',
                }}
              >
                {/* Rank */}
                <div>
                  <div className="font-display" style={{
                    fontSize: ach.size === 'large' ? 'clamp(28px, 3vw, 40px)' : 'clamp(22px, 2.5vw, 32px)',
                    fontWeight: 800,
                    color: ach.color,
                    lineHeight: 1,
                    marginBottom: 4,
                  }}>
                    {ach.rank}
                  </div>
                </div>

                {/* Event + detail */}
                <div>
                  <h3 className="font-display" style={{
                    fontSize: 'clamp(16px, 1.8vw, 22px)',
                    fontWeight: 600,
                    color: 'var(--color-ivory)',
                    marginBottom: 8,
                  }}>
                    {ach.event}
                  </h3>
                  <p style={{
                    fontSize: 14,
                    color: 'var(--color-ivory-muted)',
                    lineHeight: 1.6,
                  }}>
                    {ach.detail}
                  </p>
                </div>

                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  style={{
                    width: 56,
                    height: 56,
                    border: `1px solid ${ach.color}30`,
                    background: `${ach.color}0a`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={24} color={ach.color} />
                </motion.div>

                {/* Decorative number */}
                <div style={{
                  position: 'absolute',
                  right: 80,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontFamily: 'Syne, sans-serif',
                  fontSize: 120,
                  fontWeight: 800,
                  color: 'rgba(255,255,255,0.015)',
                  userSelect: 'none',
                  zIndex: -1,
                  lineHeight: 1,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
