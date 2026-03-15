import type { Metadata } from 'next';
import data from '@/content/backend-interview-guide.json';

export const metadata: Metadata = {
  title: 'Backend Development — Interview Preparation Guide',
  description:
    '30 essential questions spanning APIs, databases, authentication, server architecture, and performance optimization — written for developers preparing for their first backend engineering interview.',
};

/* ── helpers ── */

const categoryStyles: Record<string, string> = {
  api:  'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  db:   'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400',
  auth: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  arch: 'bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-400',
  perf: 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400',
  sec:  'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
};

function catBadge(key: string) {
  return categoryStyles[key] ?? categoryStyles.api;
}

/** Renders inline `code` from backtick-delimited text */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('`') && part.endsWith('`') ? (
          <code
            key={i}
            className="font-mono text-[13px] bg-[var(--bg-hover)] border border-[var(--border-default)] px-1.5 py-px text-[var(--accent)] rounded-sm"
          >
            {part.slice(1, -1)}
          </code>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

/** Renders a markdown-ish note with bold markers */
function NoteText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part.includes('`') ? <RichText text={part} /> : part}</span>
        ),
      )}
    </>
  );
}

/* flatten all questions for the TOC lookup */
const allQuestions = data.sections.flatMap((s) => s.questions);
const questionMap = Object.fromEntries(allQuestions.map((q) => [q.id, q]));

/* ──────────────────────────────────────────────────────── */

export default function BackendInterviewGuidePage() {
  const { cover, sections, tocOrder } = data;

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] font-sans text-[15px] leading-7">

      {/* ════════ SIDEBAR + MAIN LAYOUT ════════ */}
      <div className="lg:flex">

        {/* ── LEFT SIDEBAR NAV ── */}
        <nav className="hidden lg:block lg:w-72 xl:w-80 shrink-0 sticky top-0 h-screen overflow-y-auto bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] px-5 py-10">
          {/* brand */}
          <div className="mb-8 pb-4 border-b border-[var(--border-subtle)]">
            <p className="font-serif text-lg font-bold text-[var(--text-primary)] leading-tight">
              Back<span className="text-amber-600 italic">end</span>
            </p>
            <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--text-muted)] mt-1">
              Interview Guide
            </p>
          </div>

          {/* heading */}
          <div className="mb-6 pb-3 border-b border-[var(--border-subtle)]">
            <h2 className="font-serif text-lg italic text-[var(--text-primary)]">Contents</h2>
            <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--text-muted)]">
              30 questions · 6 domains
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            {tocOrder.map((qId) => {
              const q = questionMap[qId];
              if (!q) return null;
              const num = String(q.id).padStart(2, '0');
              return (
                <a
                  key={q.id}
                  href={`#q${q.id}`}
                  className="group flex items-baseline gap-2 py-1.5 border-b border-dotted border-[var(--border-subtle)] text-[var(--text-secondary)] text-[12px] no-underline transition-colors hover:text-amber-500"
                >
                  <span className="font-mono text-[10px] text-[var(--text-muted)] min-w-5 shrink-0 group-hover:text-amber-500 transition-colors">
                    {num}
                  </span>
                  <span className="flex-1 truncate">{q.question}</span>
                  <span
                    className={`text-[8px] font-semibold tracking-widest uppercase px-1 py-0.5 shrink-0 rounded-sm ${catBadge(q.categoryKey)}`}
                  >
                    {q.category}
                  </span>
                </a>
              );
            })}
          </div>

          {/* stats in sidebar */}
          <div className="mt-8 pt-4 border-t border-[var(--border-subtle)] flex justify-between">
            {cover.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-0.5">
                <span className="font-serif text-lg font-bold text-[var(--text-primary)] leading-none">
                  {stat.value}
                </span>
                <span className="text-[9px] font-semibold tracking-[0.12em] uppercase text-[var(--text-muted)]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </nav>

        {/* ── RIGHT: CONTENT AREA ── */}
        <div className="flex-1 min-w-0 bg-[var(--bg-surface)]">

      {/* ════════ COVER ════════ */}
      <header className="relative bg-[var(--bg-surface)] text-[var(--text-primary)] overflow-hidden">
        {/* grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-100"
          style={{
            background:
              'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(128,128,128,0.08) 39px,rgba(128,128,128,0.08) 40px),' +
              'repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(128,128,128,0.08) 39px,rgba(128,128,128,0.08) 40px)',
          }}
        />

        {/* top bar */}
        <div className="relative z-10 flex justify-between items-center px-7 md:px-14 py-6 border-b border-[var(--border-default)]">
          <span className="font-semibold text-xs tracking-[0.15em] uppercase text-[var(--text-muted)]">
            Interview Preparation Series
          </span>
          <span className="font-mono text-[11px] text-[var(--text-muted)]">{'// backend-interview-guide'}</span>
        </div>

        {/* body */}
        <div className="relative z-10 max-w-4xl mx-auto px-7 md:px-14 py-16 text-center">
          <p className="text-[13px] font-semibold tracking-[0.2em] uppercase text-amber-600 mb-5">
            {cover.kicker}
          </p>
          <h1 className="font-serif text-[clamp(40px,5vw,72px)] font-bold leading-none tracking-[-2px] text-[var(--text-primary)] mb-6">
            {cover.title[0]}
            <span className="text-amber-600 italic">{cover.title[1]}</span>{' '}
            {cover.title[2]}
          </h1>
          <p className="max-w-2xl mx-auto text-base leading-relaxed text-[var(--text-secondary)] mb-10">
            {cover.description}
          </p>
          <div className="flex flex-wrap justify-center gap-2.5 mb-10">
            {cover.pills.map((pill) => (
              <span
                key={pill}
                className="text-[11px] font-semibold tracking-widest uppercase px-3.5 py-1.5 border border-[var(--border-default)] text-[var(--text-muted)]"
              >
                {pill}
              </span>
            ))}
          </div>

          {/* stats */}
          <div className="flex justify-center gap-14 pt-6 border-t border-[var(--border-default)]">
            {cover.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-0.5">
                <span className="font-serif text-[28px] font-bold text-[var(--text-primary)] leading-none">
                  {stat.value}
                </span>
                <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[var(--text-muted)]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ════════ MAIN CONTENT ════════ */}
      <main className="max-w-265 mx-auto px-7 md:px-18 py-16 pb-24">
        {sections.map((section) => (
          <div key={section.num}>
            {/* section header */}
            <div className="mt-20 mb-10 grid grid-cols-[auto_1fr] items-center gap-6 max-md:grid-cols-1">
              <div className="flex items-center gap-3.5 whitespace-nowrap">
                <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[var(--text-muted)]">
                  {section.num}
                </span>
                <span className="font-serif text-[26px] font-bold italic text-[var(--text-primary)]">
                  {section.title}
                </span>
                <span className="text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 text-white bg-[var(--accent)]">
                  {section.badge}
                </span>
              </div>
              <div className="h-px bg-[var(--border-default)] max-md:hidden" />
            </div>

            {/* questions */}
            {section.questions.map((q) => (
              <div
                key={q.id}
                id={`q${q.id}`}
                className="mb-13 grid grid-cols-[48px_1fr] gap-x-6 max-md:grid-cols-1"
              >
                {/* sidebar number + line */}
                <div className="flex flex-col items-center pt-1 max-md:hidden">
                  <div className="flex items-center justify-center w-11 h-11 shrink-0 font-serif text-[22px] font-bold bg-[var(--bg-hover)] text-[var(--text-primary)]">
                    {q.id}
                  </div>
                  <div className="w-px flex-1 bg-[var(--border-subtle)] mt-2" />
                </div>

                {/* question content */}
                <div>
                  <p className="font-serif text-[17.5px] font-bold leading-snug text-[var(--text-primary)] mb-3.5">
                    {q.question}
                  </p>
                  <p className="text-[14.5px] leading-[1.85] text-[var(--text-secondary)]">
                    <RichText text={q.answer} />
                  </p>

                  {/* code block */}
                  {q.codeBlock && (
                    <div className="mt-4.5 rounded-sm overflow-hidden border border-slate-700">
                      <div className="flex justify-between items-center px-4.5 py-2 bg-[#141c2b] border-b border-slate-700">
                        <span className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
                          <span className="inline-block w-1.75 h-1.75 rounded-full bg-amber-700" />
                          {q.codeBlock.name}
                        </span>
                        <span className="text-[9px] font-semibold tracking-[0.12em] uppercase text-slate-600">
                          {q.codeBlock.lang}
                        </span>
                      </div>
                      <pre className="bg-[#1e2736] text-slate-200 px-5.5 py-4.5 overflow-x-auto font-mono text-[13px] leading-relaxed whitespace-pre">
                        {q.codeBlock.code}
                      </pre>
                    </div>
                  )}

                  {/* note */}
                  {'note' in q && q.note && (
                    <div
                      className={`mt-3.5 px-4.5 py-3 border-l-[3px] text-[13px] leading-relaxed ${
                        (q.note as { type: string; content: string }).type === 'warn'
                          ? 'border-amber-500 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-500/10 dark:text-amber-200'
                          : 'border-teal-500 bg-teal-50 text-teal-800 dark:border-teal-700 dark:bg-teal-500/10 dark:text-teal-200'
                      }`}
                    >
                      <NoteText text={(q.note as { type: string; content: string }).content} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </main>

      {/* ════════ FOOTER ════════ */}
      <footer className="bg-[var(--bg-surface)] text-[var(--text-primary)] px-7 md:px-18 py-10 flex justify-between items-center max-md:flex-col max-md:gap-6 max-md:text-center border-t border-[var(--border-default)]">
        <div className="font-serif text-[19px] italic">
          Backend Development <span className="text-amber-600">Interview Guide</span>
        </div>
        <div className="text-[11px] font-semibold tracking-widest uppercase text-[var(--text-muted)] text-right leading-loose max-md:text-center">
          30 Questions · Intermediate Level
          <br />
          APIs · Databases · Auth · Architecture · Security
        </div>
      </footer>

        </div>{/* /right content area */}
      </div>{/* /sidebar+main flex */}
    </div>
  );
}
