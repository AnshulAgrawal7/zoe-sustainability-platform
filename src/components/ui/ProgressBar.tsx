interface ProgressBarProps {
  value: number; // 0–100
  color?: string; // Tailwind bg color class
  showLabel?: boolean;
}

export default function ProgressBar({
  value,
  color = 'bg-green-500',
  showLabel = true,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all ${color}`}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-gray-600 w-10 text-right">
          {clamped}%
        </span>
      )}
    </div>
  );
}
