type ProbatorLogoIconProps = {
  iconOnly?: boolean
  className?: string
}

export function ProbatorLogoIcon({ iconOnly = false, className = '' }: ProbatorLogoIconProps) {
  return (
    <svg
      viewBox={iconOnly ? '80 70 410 280' : '0 0 536 452'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="blueGradient" x1="94" y1="230" x2="407" y2="230" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#006D7A" />
          <stop offset="0.55" stopColor="#004B78" />
          <stop offset="1" stopColor="#005C95" />
        </linearGradient>

        <linearGradient id="tealGradient" x1="196" y1="204" x2="378" y2="204" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#004B78" />
          <stop offset="0.55" stopColor="#007D76" />
          <stop offset="1" stopColor="#009C86" />
        </linearGradient>

        <linearGradient id="checkGradient" x1="202" y1="144" x2="456" y2="144" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#004B78" />
          <stop offset="0.55" stopColor="#008778" />
          <stop offset="1" stopColor="#00A187" />
        </linearGradient>

        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#000000" floodOpacity="0.25" />
        </filter>
      </defs>

      <rect width="536" height="452" fill="transparent" />

      <g filter="url(#softShadow)">
        <path
          d="M100 169L162 100H265V321H100V169Z"
          stroke="url(#blueGradient)"
          strokeWidth="9"
          strokeLinejoin="round"
        />

        <path
          d="M101 169H151C158 169 163 164 163 157V101"
          stroke="url(#blueGradient)"
          strokeWidth="9"
          strokeLinejoin="round"
        />

        <path d="M128 196H158" stroke="url(#blueGradient)" strokeWidth="7" strokeLinecap="round" />
        <path d="M128 215H174" stroke="url(#blueGradient)" strokeWidth="7" strokeLinecap="round" />
        <path d="M128 234H184" stroke="url(#blueGradient)" strokeWidth="7" strokeLinecap="round" />
        <path d="M128 253H197" stroke="url(#blueGradient)" strokeWidth="7" strokeLinecap="round" />
        <path d="M128 272H212" stroke="url(#blueGradient)" strokeWidth="7" strokeLinecap="round" />
        <path d="M128 291H222" stroke="url(#blueGradient)" strokeWidth="7" strokeLinecap="round" />

        <circle cx="128" cy="196" r="3.5" fill="url(#blueGradient)" />
        <circle cx="128" cy="215" r="3.5" fill="url(#blueGradient)" />
        <circle cx="128" cy="234" r="3.5" fill="url(#blueGradient)" />
        <circle cx="128" cy="253" r="3.5" fill="url(#blueGradient)" />
        <circle cx="128" cy="272" r="3.5" fill="url(#blueGradient)" />
        <circle cx="128" cy="291" r="3.5" fill="url(#blueGradient)" />
      </g>

      <circle cx="285" cy="212" r="91" fill="url(#tealGradient)" />
      <circle cx="285" cy="212" r="113" stroke="url(#blueGradient)" strokeWidth="17" fill="none" />

      <path
        d="M338 106C313 94 283 91 253 97C204 107 166 146 156 195"
        stroke="white"
        strokeWidth="13"
        strokeLinecap="round"
        opacity="0.9"
      />

      <path
        d="M338 106C313 94 283 91 253 97C204 107 166 146 156 195"
        stroke="url(#blueGradient)"
        strokeWidth="13"
        strokeLinecap="round"
      />

      <path
        d="M199 190L243 180L276 211C313 147 374 70 457 17C401 80 351 151 318 214L289 266C285 273 279 273 273 266L199 190Z"
        fill="#052C46"
        stroke="#052C46"
        strokeWidth="7"
        strokeLinejoin="round"
      />

      <path
        d="M201 188L243 177L276 207C314 142 373 69 456 17C400 79 352 147 320 210L289 261C285 268 280 268 274 262L201 188Z"
        fill="url(#checkGradient)"
        stroke="#D9F2EE"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      <path
        d="M203 202L244 181L276 211L289 188L318 210L288 259C284 266 280 266 274 260L203 202Z"
        fill="#043F65"
        opacity="0.95"
      />

      <path
        d="M276 207C314 142 373 69 456 17C400 79 352 147 320 210L289 261C285 268 280 268 274 262L276 207Z"
        fill="url(#checkGradient)"
      />

      {!iconOnly && (
        <g filter="url(#softShadow)">
          <text
            x="37"
            y="421"
            fontFamily="Manrope, Montserrat, Arial, sans-serif"
            fontSize="54"
            fontWeight="500"
            letterSpacing="2"
            fill="#004F7D"
            stroke="#0A79A6"
            strokeWidth="1"
          >
            PROBATOR-IA
          </text>
        </g>
      )}
    </svg>
  )
}
