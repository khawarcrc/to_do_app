import { Priority, PRIORITY_CONFIG } from '@/types';
import { cn } from '@/utils';

interface Props {
  priority: Priority;
  size?: 'sm' | 'md';
}

export default function PriorityBadge({ priority, size = 'md' }: Props) {
  const config = PRIORITY_CONFIG[priority];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full border',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
        config.color,
        config.bgColor,
        config.borderColor,
        config.darkColor,
        config.darkBgColor
      )}
    >
      <span>{config.emoji}</span>
      {config.label}
    </span>
  );
}
