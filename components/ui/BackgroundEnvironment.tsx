export default function BackgroundEnvironment() {
  return (
    <div 
      className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-50 select-none bg-[#FAF5EE] dark:bg-[#0a0a0b] transition-colors"
      aria-hidden="true"
    >
      {/* 1. Underlying SVG Vector Mesh Layers */}
      {/* Mobile background SVG (covers entire screen height/width) */}
      <img
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-top chai-bg-invert sm:hidden"
        style={{ color: "transparent" }}
        src="/images/chaicode-bg.svg"
      />

      {/* Desktop / Tablet background SVG (covers entire screen seamlessly while scrolling) */}
      <img
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-top chai-bg-invert max-2xl:block max-sm:hidden"
        style={{ color: "transparent" }}
        src="/images/chaicode-bg.svg"
      />

      {/* 4K Ultra-wide displays (2048px+) */}
      <img
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 hidden h-full w-full object-cover object-top chai-bg-invert max-sm:hidden min-[2048px]:block"
        style={{ color: "transparent" }}
        src="/images/chaicode-bg-4k.svg"
      />

      {/* 2. Light Mode Warm Chai / Skin-Toned Atmospheric Overlays (Overlaid directly on top of inverted vector) */}
      <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-[#fff7ed]/90 via-[#fed7aa]/40 to-[#fef3c7]/40 dark:hidden pointer-events-none" />
      <div className="absolute inset-0 h-full w-full bg-[radial-gradient(ellipse_100%_80%_at_50%_0%,rgba(254,215,170,0.55),rgba(250,245,238,0)_75%)] dark:hidden pointer-events-none" />

      {/* 3. Dark Mode Atmospheric Deep Obsidian & Amber Illumination */}
      <div className="hidden dark:block absolute inset-0 h-full w-full bg-[radial-gradient(ellipse_100%_70%_at_50%_0%,rgba(255,125,12,0.1),rgba(10,10,11,0)_75%)] pointer-events-none" />
      <div className="hidden dark:block absolute inset-0 h-full w-full bg-[radial-gradient(circle_at_80%_80%,rgba(247,155,74,0.04),transparent_50%)] pointer-events-none" />
    </div>
  );
}
