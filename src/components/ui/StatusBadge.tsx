import type { ProjectStatus } from '../../types';

interface StatusBadgeProps {
  status: ProjectStatus;
}

const statusConfig: Record<ProjectStatus, { label: string; classes: string }> = {
  Active: { label: 'Active', classes: 'bg-green-100 text-green-800' },
  Planning: { label: 'Planning', classes: 'bg-blue-100 text-blue-800' },
  Completed: { label: 'Completed', classes: 'bg-gray-100 text-gray-700' },
  Paused: { label: 'Paused', classes: 'bg-amber-100 text-amber-800' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { label, classes } = statusConfig[status];
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${classes}`}
    >
      {label}
    </span>
  );
}
