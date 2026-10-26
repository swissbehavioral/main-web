/** Decorative illustration only; not a photograph of an SBH facility. */
export function RetreatLandscape() {
  return (
    <svg
      className="hero-landscape"
      viewBox="0 0 640 440"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="sbh-landscape-sky" x2="0" y2="1">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#d3d2d4" />
        </linearGradient>
        <linearGradient id="sbh-landscape-hill" x2="1" y2="1">
          <stop stopColor="#5da4a2" />
          <stop offset="1" stopColor="#082e6b" />
        </linearGradient>
      </defs>
      <rect width="640" height="440" fill="url(#sbh-landscape-sky)" />
      <circle cx="440" cy="130" r="85" fill="#ffffff" fillOpacity=".8" />
      <circle
        cx="440"
        cy="130"
        r="112"
        fill="none"
        stroke="#ffffff"
        strokeOpacity=".6"
      />
      <path d="M-50 400 180 90 440 400Z" fill="#5da4a2" />
      <path d="m180 90 73 167-72-35-58 50Z" fill="#ffffff" />
      <path d="M180 460 420 190 720 460Z" fill="url(#sbh-landscape-hill)" />
      <path d="m420 190 70 160-75-30-68 40Z" fill="#ffffff" />
      <path d="M-30 440Q180 300 380 390T690 350V470H-30" fill="#ffffff" />
    </svg>
  );
}
