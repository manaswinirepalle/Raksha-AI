import landingPhoto from '../assets/landing-photo.jpg';

export default function VictimIllustration() {
  return (
    <div className="w-full relative group -mx-5 sm:-mx-8 lg:-mx-12 xl:-mx-16">
      <div
        className="relative overflow-hidden"
        style={{
          borderRadius: 0,
          boxShadow: '0 8px 60px rgba(0,0,0,0.6), inset 0 0 80px rgba(0,0,0,0.3)',
        }}
      >
        <img
          src={landingPhoto}
          alt="Person illuminated by phone screen in the dark — representing the stress and isolation of scam victims"
          className="w-full h-auto block"
          style={{
            aspectRatio: '16/9',
            objectFit: 'cover',
            filter: 'brightness(0.9) contrast(1.08) saturate(1.1)',
          }}
        />
        {/* Gradient overlays for cinematic blending */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(180deg, rgba(9,9,11,0.7) 0%, transparent 20%, transparent 80%, rgba(9,9,11,0.8) 100%),
              linear-gradient(90deg, rgba(9,9,11,0.4) 0%, transparent 30%, transparent 70%, rgba(9,9,11,0.4) 100%)
            `,
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
          }}
        />
        {/* Bottom RAKSHA AI label */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-4 py-2 rounded-full"
          style={{
            background: 'rgba(10,10,14,0.75)',
            border: '1px solid rgba(59,130,246,0.2)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <span className="text-[11px] font-bold text-blue-400 tracking-wide">RAKSHA AI</span>
          <span className="w-px h-3 bg-zinc-700" />
          <span className="text-[10px] text-emerald-400 font-mono font-medium">PROTECTED</span>
        </div>
      </div>
      {/* Edge fade into surrounding dark */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 100px 40px rgba(9,9,11,0.9)',
        }}
      />
    </div>
  );
}
