import { Priority, PRIORITY_CONFIG } from '@/types';
import { cn } from '@/utils';

interface Props {
  priority: Priority;
  size?: 'xs' | 'sm' | 'md';
  showLabel?: boolean;
}

export default function PriorityBadge({ priority, size = 'sm', showLabel = true }: Props) {
  const config = PRIORITY_CONFIG[priority];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-md  select-none',
        size === 'xs' ? 'px-1.5 py-0.5 text-[11px]' : size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
        config.color,
        config.bgColor,
        config.darkColor,
        config.darkBgColor
      )}
    >
      <span className={size === 'xs' ? 'text-[10px]' : 'text-xs'}>{config.emoji}</span>
      {showLabel && config.label}
    </span>
  );
}

