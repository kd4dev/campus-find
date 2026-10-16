export default function BackgroundEnvironment() {
  return (
    <div 
      className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-50 select-none"
      aria-hidden="true"
    >
      {/* Light mode ChaiCode warm gradient wash spanning entire screen */}
      <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-transparent via-orange-100/70 to-transparent dark:hidden pointer-events-none" />
      <div className="absolute inset-0 h-full w-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,125,12,0.06),transparent_60%)] dark:hidden pointer-events-none" />

      {/* Dark mode atmospheric illumination spanning entire screen */}
      <div className="hidden dark:block absolute inset-0 h-full w-full bg-[radial-gradient(ellipse_100%_70%_at_50%_0%,rgba(255,125,12,0.1),rgba(10,10,11,0)_75%)] pointer-events-none" />
      <div className="hidden dark:block absolute inset-0 h-full w-full bg-[radial-gradient(circle_at_80%_80%,rgba(247,155,74,0.04),transparent_50%)] pointer-events-none" />

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
        className="absolute inset-0 h-full w-full object-cover object-top chai-bg-invert max-2xl:block max-sm:hidden opacity-95 dark:opacity-100"
        style={{ color: "transparent" }}
        src="/images/chaicode-bg.svg"
      />

      {/* 4K Ultra-wide displays (2048px+) */}
      <img
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 hidden h-full w-full object-cover object-top chai-bg-invert max-sm:hidden min-[2048px]:block opacity-95 dark:opacity-100"
        style={{ color: "transparent" }}
        src="/images/chaicode-bg-4k.svg"
      />
    </div>
  );
}
