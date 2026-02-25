import { formatMinutes } from '@/utils';
import { isBefore, parseISO, isValid, formatDistanceToNow } from 'date-fns';
import { cn } from '@/utils';

interface Props {
  timeEstimate: number;
  dueDate?: string;
  status?: string;
  showDue?: boolean;
}

export default function TimeEstimate({ timeEstimate, dueDate, status, showDue = true }: Props) {
  const now = new Date();
  const isOverdue = dueDate && isValid(parseISO(dueDate)) && isBefore(parseISO(dueDate), now) && status !== 'completed';
  const isDueSoon =
    dueDate &&
    isValid(parseISO(dueDate)) &&
    !isOverdue &&
    isBefore(parseISO(dueDate), new Date(now.getTime() + 24 * 60 * 60 * 1000));

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      {timeEstimate > 0 && (
        <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {formatMinutes(timeEstimate)}
        </span>
      )}
      {showDue && dueDate && isValid(parseISO(dueDate)) && (
        <span
          className={cn(
            'flex items-center gap-1 font-medium',
            isOverdue
              ? 'text-red-600 dark:text-red-400'
              : isDueSoon
                ? 'text-orange-600 dark:text-orange-400'
                : 'text-slate-600 dark:text-slate-400'
          )}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {isOverdue ? '⚠ Overdue · ' : ''}
          {formatDistanceToNow(parseISO(dueDate), { addSuffix: true })}
        </span>
      )}
    </div>
  );
}
