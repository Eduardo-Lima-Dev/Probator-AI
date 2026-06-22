type BoldLogoProps = {
  size?: number
}

export function BoldLogo({ size = 32 }: BoldLogoProps) {
  return (
    <img
      src="/favicon.svg"
      alt="Probator AI"
      width={size}
      height={size}
      style={{ display: 'block', flexShrink: 0, userSelect: 'none' }}
    />
  )
}
