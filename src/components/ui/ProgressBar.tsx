interface ProgressBarProps {
  value: number; // 0–100
  color?: string; // Tailwind bg color class
  showLabel?: boolean;
  /** Accessible name for the progressbar (required by ARIA). */
  label?: string;
}

export default function ProgressBar({
  value,
  color = 'bg-green-500',
  showLabel = true,
  label,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-2 rounded-full transition-all ${color}`}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-label={label ?? `${clamped}%`}
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && (
        <span className="w-10 text-right text-sm font-medium text-gray-600">
          {clamped}%
        </span>
      )}
    </div>
  );
}
