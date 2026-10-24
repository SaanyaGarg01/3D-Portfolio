import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, X, Zap, Users, Award, Sparkles, CheckCircle2 } from 'lucide-react'
import { journeyStore, INNOVATION_SPARKS, type JourneyState } from '../game/journeyStore'
import { RESUME_DATA } from '../game/resumeData'

export default function DiscoveryJournalModal() {
  const [state, setState] = useState<JourneyState>(() => journeyStore.getState())
  const [activeTab, setActiveTab] = useState<'sparks' | 'characters' | 'achievements'>('sparks')

  useEffect(() => {
    return journeyStore.subscribe(setState)
  }, [])

  if (!state.journalOpen) return null

  const collectedCount = state.collectedSparks.length

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          background: 'rgba(5, 7, 15, 0.78)',
          backdropFilter: 'blur(16px)',
        }}
        onClick={() => journeyStore.toggleJournal()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25 }}
          style={{
            width: 'min(580px, 94vw)',
            maxHeight: '82vh',
            background: 'rgba(15, 23, 42, 0.94)',
            border: '1.5px solid rgba(56, 189, 248, 0.35)',
            borderRadius: 20,
            boxShadow: '0 25px 70px rgba(0,0,0,0.7), 0 0 40px rgba(56, 189, 248, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: '"Space Grotesk", sans-serif',
            color: '#fff',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              padding: '18px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(10, 15, 30, 0.5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38bdf8',
                }}
              >
                <BookOpen size={18} />
              </div>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: '#ffffff', letterSpacing: '-0.01em' }}>
                  Discovery Journal
                </h2>
                <div style={{ fontSize: 11, color: '#38bdf8', letterSpacing: '0.04em' }}>
                  {collectedCount} / 8 Innovation Sparks Collected
                </div>
              </div>
            </div>

            <button
              onClick={() => journeyStore.toggleJournal()}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              padding: '10px 24px 0',
              gap: 8,
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {[
              { id: 'sparks', label: 'Tech Sparks', icon: Zap },
              { id: 'characters', label: 'Characters', icon: Users },
              { id: 'achievements', label: 'Milestones', icon: Award },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px',
                  borderRadius: '8px 8px 0 0',
                  border: 'none',
                  background: activeTab === tab.id ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                  borderBottom: activeTab === tab.id ? '2px solid #38bdf8' : '2px solid transparent',
                  color: activeTab === tab.id ? '#38bdf8' : 'rgba(255,255,255,0.6)',
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <tab.icon size={13} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Body */}
          <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* TAB 1: Sparks */}
            {activeTab === 'sparks' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 10 }}>
                {INNOVATION_SPARKS.map((spark) => {
                  const isUnlocked = state.collectedSparks.includes(spark.id)
                  return (
                    <div
                      key={spark.id}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 12,
                        background: isUnlocked ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255,255,255,0.03)',
                        border: isUnlocked ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(255,255,255,0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: isUnlocked ? '#ffffff' : 'rgba(255,255,255,0.4)' }}>
                          {spark.name}
                        </div>
                        <div style={{ fontSize: 10.5, color: isUnlocked ? '#38bdf8' : 'rgba(255,255,255,0.3)' }}>
                          {spark.category}
                        </div>
                      </div>

                      {isUnlocked ? (
                        <CheckCircle2 size={16} color="#34d399" />
                      ) : (
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Locked</span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* TAB 2: Characters Encountered */}
            {activeTab === 'characters' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { name: 'Byte', role: 'AI Floating Copilot', desc: 'Accompanies the motorcycle journey with real-time tips.', icon: '🤖' },
                  { name: 'Prof. Miller', role: 'University Academic Guide', desc: 'Introduces VIT Bhopal education, coursework, and 9.19 CGPA.', icon: '🎓' },
                  { name: 'Devon Vance', role: 'Lead Systems Architect', desc: 'Explains AmasQIS.ai, AICTE, and Codveda enterprise internships.', icon: '💻' },
                  { name: 'Maya Lin', role: 'Social Tech Innovator', desc: 'Guides you through SaathiCircle & LaadliBachao platforms.', icon: '🚀' },
                  { name: 'Coach Marcus', role: 'Hackathon Host', desc: 'Presents state & national hackathon accolades and medals.', icon: '🏆' },
                ].map((char) => (
                  <div
                    key={char.name}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{char.icon}</span>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: '#fff' }}>{char.name}</div>
                      <div style={{ fontSize: 11, color: '#38bdf8' }}>{char.role}</div>
                      <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{char.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: Milestones & Hackathons */}
            {activeTab === 'achievements' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {RESUME_DATA.achievements.map((ach, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 12,
                      background: 'rgba(245, 158, 11, 0.08)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: '#fff' }}>{ach.title}</div>
                      <span style={{ padding: '2px 8px', borderRadius: 10, background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', fontSize: 10, fontWeight: 700 }}>
                        {ach.metric}
                      </span>
                    </div>
                    <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.8)', marginTop: 4, lineHeight: 1.45 }}>
                      {ach.description}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
