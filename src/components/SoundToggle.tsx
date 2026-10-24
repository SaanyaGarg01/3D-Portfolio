import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'

import { audioEngine } from '../utils/audio'

interface Props {
  enabled: boolean
  onToggle: () => void
}

export default function SoundToggle({ enabled, onToggle }: Props) {
  const handleClick = () => {
    if (enabled) {
      audioEngine.disable()
    } else {
      audioEngine.enable()
    }
    onToggle()
  }
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.8 }}
      onClick={handleClick}
      title={enabled ? 'Mute' : 'Enable sound (currently off)'}
      aria-label={enabled ? 'Mute ambient sound' : 'Enable ambient sound'}
      style={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        width: 44,
        height: 44,
        background: 'rgba(13,13,15,0.8)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'none',
        zIndex: 500,
        color: enabled ? 'var(--color-blue-glow)' : 'var(--color-ivory-muted)',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(96,165,250,0.4)'
        e.currentTarget.style.color = 'var(--color-blue-glow)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
        e.currentTarget.style.color = enabled ? 'var(--color-blue-glow)' : 'var(--color-ivory-muted)'
      }}
    >
      {enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
    </motion.button>
  )
}
