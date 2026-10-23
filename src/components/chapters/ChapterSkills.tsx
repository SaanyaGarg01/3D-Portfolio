import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface Props {
  onChapterChange: (ch: number) => void
}

const SKILLS = {
  'Languages': ['Java', 'Python', 'C++', 'JavaScript'],
  'Frontend': ['HTML5', 'CSS3', 'React.js', 'Next.js'],
  'Backend': ['Node.js', 'Express.js', 'FastAPI', 'REST APIs'],
  'Databases': ['MySQL', 'MongoDB', 'SQL', 'Firebase'],
  'Cloud & DevOps': ['AWS EC2', 'AWS S3', 'AWS IAM', 'AWS Lambda', 'Docker', 'CI/CD', 'GitHub Actions', 'Vercel'],
  'Tools': ['Git', 'GitHub'],
  'Foundations': ['OOP', 'DBMS'],
}

const SKILL_CONTEXT: Record<string, string> = {
  'Node.js': 'Used in banking applications at AmasQIS.ai and across multiple personal projects',
  'React.js': 'Primary frontend framework — used in SaathiCircle, LaadliBachao, and internship work',
  'MongoDB': 'Database layer for SaathiCircle, LaadliBachao, and Garg Associates',
  'Firebase': 'Authentication in SaathiCircle',
  'GitHub Actions': 'CI/CD automation at AmasQIS.ai',
  'REST APIs': 'Designed and integrated in all backend projects',
  'AWS EC2': 'Cloud infrastructure',
  'Express.js': 'Backend framework used in LaadliBachao',
  'FastAPI': 'Python-based API framework',
  'Docker': 'Containerization for deployment workflows',
}

const CATEGORY_COLORS: Record<string, string> = {
  'Languages': '#3b82f6',
  'Frontend': '#60a5fa',
  'Backend': '#4ecdc4',
  'Databases': '#d4956a',
  'Cloud & DevOps': '#c084fc',
  'Tools': '#fb923c',
  'Foundations': '#94a3b8',
}

function SkillPill({
  skill,
  color,
  delay,
}: {
  skill: string
  color: string
  delay: number
}) {
  const [hovered, setHovered] = useState(false)
  const context = SKILL_CONTEXT[skill]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        padding: '10px 16px',
        border: `1px solid ${hovered ? color + '60' : color + '20'}`,
        background: hovered ? color + '0f' : 'transparent',
        cursor: 'none',
        transition: 'all 0.3s ease',
        zIndex: hovered ? 10 : 1,
      }}
    >
      <span className="font-mono" style={{
        fontSize: 12,
        color: hovered ? color : 'var(--color-ivory-dim)',
        letterSpacing: '0.05em',
        transition: 'color 0.3s ease',
      }}>
        {skill}
      </span>

      {/* Tooltip */}
      {context && hovered && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'absolute',
            bottom: '110%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--color-charcoal-mid)',
            border: `1px solid ${color}30`,
            padding: '10px 14px',
            width: 220,
            zIndex: 100,
            pointerEvents: 'none',
          }}
        >
          <p style={{
            fontSize: 12,
            color: 'var(--color-ivory-dim)',
            lineHeight: 1.5,
          }}>{context}</p>
          <div style={{
            width: 6,
            height: 6,
            background: 'var(--color-charcoal-mid)',
            border: `1px solid ${color}30`,
            borderTop: 'none',
            borderLeft: 'none',
            transform: 'rotate(45deg)',
            position: 'absolute',
            bottom: -4,
            left: '50%',
            marginLeft: -3,
          }} />
        </motion.div>
      )}
    </motion.div>
  )
}

export default function ChapterSkills({ onChapterChange }: Props) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { amount: 0.2 })

  useEffect(() => {
    if (isInView) onChapterChange(4)
  }, [isInView])

  let globalDelay = 0

  return (
    <section
      id="chapter-skills"
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
          style={{ marginBottom: 80, textAlign: 'center' }}
        >
          <p className="chapter-number" style={{ marginBottom: 16 }}>04 · The Technology I Build With</p>
          <h2 className="display-lg font-display" style={{ color: 'var(--color-ivory)' }}>
            Tools of the
            <span style={{ color: 'var(--color-blue-glow)' }}> craft.</span>
          </h2>
          <p style={{
            fontSize: 14,
            color: 'var(--color-ivory-muted)',
            marginTop: 20,
            fontFamily: 'Space Mono, monospace',
            letterSpacing: '0.1em',
          }}>
            Hover a technology to see how I've applied it.
          </p>
        </motion.div>

        {/* Skills by category */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          {Object.entries(SKILLS).map(([category, skills]) => {
            const color = CATEGORY_COLORS[category]
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7 }}
                style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 32, alignItems: 'start' }}
              >
                {/* Category label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <span className="font-mono" style={{
                    fontSize: 10,
                    letterSpacing: '0.25em',
                    color: color,
                    textTransform: 'uppercase',
                  }}>{category}</span>
                </div>

                {/* Skills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {skills.map((skill) => {
                    const delay = globalDelay++ * 0.04
                    return (
                      <SkillPill key={skill} skill={skill} color={color} delay={delay} />
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Decorative bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 1 }}
          style={{
            marginTop: 80,
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent)',
          }}
        />
      </div>
    </section>
  )
}
