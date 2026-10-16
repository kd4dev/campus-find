export default function BackgroundEnvironment() {
  return (
    <div 
      className="absolute top-0 left-0 right-0 h-[1150px] overflow-hidden pointer-events-none -z-50 select-none"
      aria-hidden="true"
    >
      {/* Light mode ChaiCode warm gradient wash */}
      <div className="absolute inset-0 -z-10 h-full bg-gradient-to-br from-transparent via-orange-100/75 to-transparent dark:hidden pointer-events-none" />

      {/* Mobile background SVG (inverted in light mode, raw obsidian in dark mode) */}
      <img
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        className="absolute top-0 left-1/2 -z-50 h-[120dvh] w-full -translate-x-1/2 object-cover chai-bg-invert sm:hidden"
        style={{ color: "transparent" }}
        src="/images/chaicode-bg.svg"
      />

      {/* Desktop / Tablet background SVG (2842px wide constellation and grid mesh) */}
      <img
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        className="absolute top-0 left-1/2 -z-50 w-[2842px] max-w-none -translate-x-1/2 chai-bg-invert max-2xl:block max-sm:hidden"
        style={{ color: "transparent" }}
        src="/images/chaicode-bg.svg"
      />

      {/* 4K Ultra-wide displays (2048px+) */}
      <img
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 -z-50 hidden h-dvh w-dvw object-cover chai-bg-invert max-sm:hidden min-[2048px]:block"
        style={{ color: "transparent" }}
        src="/images/chaicode-bg-4k.svg"
      />

      {/* Seamless bottom fade into page canvas */}
      <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-white dark:from-[#0a0a0b] to-transparent pointer-events-none" />
    </div>
  );
}
