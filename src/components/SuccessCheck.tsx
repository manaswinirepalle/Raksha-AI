interface SuccessCheckProps {
  size?: number;
  color?: string;
  className?: string;
}

export default function SuccessCheck({ size = 48, color = '#10b981', className = '' }: SuccessCheckProps) {
  return (
    <div className={`success-check ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 52 52" width={size} height={size}>
        <circle
          cx="26" cy="26" r="25"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.3"
        />
        <circle
          cx="26" cy="26" r="25"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.1 27.2l7.1 7.2 16.7-16.8"
        />
      </svg>
    </div>
  );
}
