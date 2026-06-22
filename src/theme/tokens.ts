export type BoldTokens = {
  bg: string
  surface: string
  surfaceAlt: string
  bento: string
  border: string
  borderStrong: string
  text: string
  textDim: string
  textMute: string
  primary: string
  primaryAlt: string
  ai: string
  ai2: string
  aiGrad: string
  aiBg: string
  aiBorder: string
  success: string
  warn: string
  danger: string
  hero: string
}

export function boldTokens(dark: boolean): BoldTokens {
  if (dark) {
    return {
      bg: '#06070a',
      surface: '#0f1117',
      surfaceAlt: '#161922',
      bento: '#0f1117',
      border: 'rgba(255,255,255,0.07)',
      borderStrong: 'rgba(255,255,255,0.14)',
      text: '#f3f5fa',
      textDim: '#98a0b3',
      textMute: '#5d6678',
      primary: '#1e3a8a',
      primaryAlt: '#3b6bff',
      ai: '#a855f7',
      ai2: '#6366f1',
      aiGrad: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
      aiBg: 'rgba(168,85,247,0.12)',
      aiBorder: 'rgba(168,85,247,0.32)',
      success: '#22c55e',
      warn: '#f59e0b',
      danger: '#ef4444',
      hero: 'radial-gradient(circle at 20% 20%, #2c2456 0%, #0a0c14 70%)',
    }
  }
  return {
    bg: '#f4f5f7',
    surface: '#ffffff',
    surfaceAlt: '#eef0f4',
    bento: '#ffffff',
    border: 'rgba(11,17,32,0.07)',
    borderStrong: 'rgba(11,17,32,0.14)',
    text: '#0a0e1a',
    textDim: '#4a5468',
    textMute: '#8b94a5',
    primary: '#0b1f4d',
    primaryAlt: '#1d4ed8',
    ai: '#7c3aed',
    ai2: '#4f46e5',
    aiGrad: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    aiBg: 'rgba(124,58,237,0.07)',
    aiBorder: 'rgba(124,58,237,0.22)',
    success: '#16a34a',
    warn: '#d97706',
    danger: '#dc2626',
    hero: 'linear-gradient(135deg, #0b1f4d 0%, #2c1d6b 100%)',
  }
}
