interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: 'sm' | 'md';
  disabled?: boolean;
}

export default function Toggle({ checked, onChange, label, size = 'md', disabled = false }: ToggleProps) {
  const trackWidth = size === 'sm' ? 34 : 40;
  const trackHeight = size === 'sm' ? 18 : 22;
  const thumbSize = size === 'sm' ? 12 : 16;
  const thumbTravel = trackWidth - thumbSize - 4;

  return (
    <label className={`inline-flex items-center gap-2.5 cursor-pointer ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}>
      <button
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className="relative flex-shrink-0 rounded-full transition-all duration-350 cursor-pointer"
        style={{
          width: trackWidth,
          height: trackHeight,
          background: checked ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.08)',
          border: `1px solid ${checked ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.08)'}`,
          boxShadow: checked ? '0 0 12px rgba(59,130,246,0.15)' : 'none',
        }}
      >
        <span
          className="absolute rounded-full transition-all duration-350"
          style={{
            width: thumbSize,
            height: thumbSize,
            top: 2,
            left: checked ? thumbTravel + 2 : 2,
            background: checked ? '#3b82f6' : '#71717a',
            boxShadow: checked ? '0 0 8px rgba(59,130,246,0.4)' : '0 1px 3px rgba(0,0,0,0.3)',
            borderRadius: checked ? (size === 'sm' ? 6 : 8) : '50%',
            transition: 'all 350ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />
      </button>
      {label && (
        <span className="text-[12px] sm:text-[13px] text-zinc-300 font-medium select-none">{label}</span>
      )}
    </label>
  );
}
