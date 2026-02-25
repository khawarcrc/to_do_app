import { TaskStats } from '@/types';
import { formatMinutes } from '@/utils';

interface Props {
  stats: TaskStats;
}

function Stat({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
      <span className={`text-2xl font-bold ${color ?? 'text-slate-800 dark:text-slate-100'}`}>{value}</span>
      <span className="text-xs text-slate-500 dark:text-slate-400 text-center mt-0.5 leading-tight">{label}</span>
    </div>
  );
}

export default function StatsDashboard({ stats }: Props) {
  const completionPct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Stat label="Total" value={stats.total} />
        <Stat label="Pending" value={stats.pending} color="text-slate-600 dark:text-slate-300" />
        <Stat label="In Progress" value={stats.inProgress} color="text-indigo-600 dark:text-indigo-400" />
        <Stat label="Completed" value={stats.completed} color="text-emerald-600 dark:text-emerald-400" />
      </div>

      {stats.overdue > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <span className="text-red-600 dark:text-red-400 text-sm font-medium">⚠ {stats.overdue} overdue task{stats.overdue !== 1 ? 's' : ''}</span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Stat label="🔴 Critical" value={stats.criticalCount} color="text-red-600 dark:text-red-400" />
        <Stat label="🟠 High" value={stats.highCount} color="text-orange-600 dark:text-orange-400" />
        <Stat label="🟡 Medium" value={stats.mediumCount} color="text-yellow-600 dark:text-yellow-400" />
        <Stat label="🔵 Low" value={stats.lowCount} color="text-blue-600 dark:text-blue-400" />
      </div>

      {stats.total > 0 && (
        <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-600 dark:text-slate-400">Completion</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{completionPct}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Est: {formatMinutes(stats.totalEstimatedTime)}</span>
            <span>Done: {formatMinutes(stats.completedTime)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
