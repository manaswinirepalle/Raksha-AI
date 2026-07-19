export default function VictimIllustration() {
  return (
    <div className="w-full max-w-2xl mx-auto relative group">
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.3)',
        }}
      >
        <img
          src="https://images.pexels.com/photos/12304661/pexels-photo-12304661.jpeg?auto=compress&cs=tinysrgb&w=800&q=80"
          alt="Person illuminated by phone screen in the dark — representing the stress and isolation of scam victims"
          className="w-full h-auto block"
          style={{
            aspectRatio: '16/9',
            objectFit: 'cover',
            filter: 'brightness(0.85) contrast(1.05)',
          }}
          loading="lazy"
        />
        {/* Gradient overlay for blending into dark theme */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(9,9,11,0.3) 0%, transparent 25%, transparent 75%, rgba(9,9,11,0.6) 100%)',
          }}
        />
        {/* RAKSHA AI badge */}
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            background: 'rgba(15,15,18,0.8)',
            border: '1px solid rgba(59,130,246,0.25)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <span className="text-[10px] font-semibold text-blue-400 tracking-wide">RAKSHA AI</span>
          <span className="text-[9px] text-emerald-400 font-mono">PROTECTED</span>
        </div>
      </div>
      {/* Subtle glow behind the image */}
      <div
        className="absolute -inset-4 -z-10 rounded-3xl opacity-20 blur-2xl pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.15), transparent 70%)',
        }}
      />
    </div>
  );
}
