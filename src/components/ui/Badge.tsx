interface BadgeProps {
  label: string;
  variant?: 'green' | 'blue' | 'amber' | 'teal' | 'rose' | 'gray' | 'lime';
}

const variantClasses: Record<string, string> = {
  green: 'bg-green-100 text-green-800',
  blue: 'bg-blue-100 text-blue-800',
  amber: 'bg-amber-100 text-amber-800',
  teal: 'bg-teal-100 text-teal-800',
  rose: 'bg-rose-100 text-rose-800',
  gray: 'bg-gray-100 text-gray-700',
  lime: 'bg-lime-100 text-lime-800',
};

export default function Badge({ label, variant = 'gray' }: BadgeProps) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]}`}
    >
      {label}
    </span>
  );
}
