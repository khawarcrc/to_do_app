export const metadata = {
  title: "Advanced React & Next.js — System Design Interview Guide",
  description:
    "20 advanced interview questions covering React internals, concurrent features, Next.js architecture, performance, and production system design.",
};

const css = `
body { overflow: auto !important; height: auto !important; }

@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300&family=JetBrains+Mono:wght@300;400;500;700&family=Epilogue:wght@300;400;500;700&display=swap');

:root {
  --bg:       #080c10;
  --surface:  #0d1117;
  --surface2: #161b22;
  --border:   #21262d;
  --border2:  #30363d;
  --text:     #e6edf3;
  --muted:    #7d8590;
  --dim:      #484f58;
  --accent:   #f78166;
  --accent2:  #58a6ff;
  --accent3:  #3fb950;
  --accent4:  #d2a8ff;
  --accent5:  #ffa657;
  --warn:     #e3b341;
  --s-kw:     #ff7b72;
  --s-fn:     #d2a8ff;
  --s-str:    #a5d6ff;
  --s-num:    #f2cc60;
  --s-cmt:    #8b949e;
  --s-tag:    #7ee787;
  --s-attr:   #79c0ff;
  --s-op:     #ff7b72;
  --s-type:   #ffa657;
  --s-plain:  #e6edf3;
}

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
html { scroll-behavior: smooth; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Epilogue', sans-serif;
  font-weight: 300;
  font-size: 14.5px;
  line-height: 1.8;
}

.adv-back {
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 9999;
  background: var(--surface2);
  border: 1px solid var(--border2);
  color: var(--muted);
  padding: 6px 14px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  text-decoration: none;
  border-radius: 4px;
  transition: color 0.15s, border-color 0.15s;
}
.adv-back:hover { color: var(--text); border-color: var(--accent2); }

/* ─── COVER ─────────────────────────────────────────── */
.cover {
  min-height: 100vh;
  display: grid;
  grid-template-rows: 1fr auto;
  padding: 0;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid var(--border);
}
.cover-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: calc(100vh - 60px);
}
.cover-left {
  padding: 80px 64px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-right: 1px solid var(--border);
  position: relative;
  z-index: 1;
}
.cover-right {
  background: var(--surface);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px;
  position: relative;
  overflow: hidden;
}
.cover-right::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.5;
}
.cover-right::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 30%, var(--surface) 80%);
}
.cover-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--accent3);
  border: 1px solid var(--accent3);
  padding: 4px 12px;
  margin-bottom: 36px;
  width: fit-content;
}
.cover-badge::before { content: '▶'; font-size: 8px; }
.cover h1 {
  font-family: 'Fraunces', serif;
  font-size: clamp(44px, 5.5vw, 72px);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -2px;
  color: var(--text);
  margin-bottom: 8px;
}
.cover h1 em {
  font-style: italic;
  color: var(--accent);
}
.cover-sub {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: var(--accent2);
  margin-bottom: 40px;
  letter-spacing: 0.02em;
}
.cover-desc {
  font-size: 15px;
  color: var(--muted);
  max-width: 420px;
  line-height: 1.7;
  border-left: 2px solid var(--accent);
  padding-left: 20px;
  margin-bottom: 56px;
}
.cover-stats {
  display: flex;
  gap: 40px;
}
.stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.stat-value {
  font-family: 'Fraunces', serif;
  font-size: 36px;
  font-weight: 700;
  color: var(--text);
  line-height: 1;
}
.stat-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: var(--dim);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.cover-code-preview {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
}
.cover-code-preview .code-win {
  background: #0d1117;
  border: 1px solid var(--border2);
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0,0,0,0.6);
}
.code-win-bar {
  background: var(--surface2);
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  border-bottom: 1px solid var(--border);
}
.dot { width: 10px; height: 10px; border-radius: 50%; }
.dot-r { background: #ff5f57; }
.dot-y { background: #febc2e; }
.dot-g { background: #28c840; }
.code-win-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--muted);
  margin-left: 8px;
}
.code-win pre {
  padding: 20px 24px;
  font-size: 12px;
  line-height: 1.7;
  overflow-x: auto;
}
.cover-bottom {
  height: 60px;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 64px;
  gap: 32px;
}
.cover-bottom-item {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--dim);
  display: flex;
  align-items: center;
  gap: 8px;
}
.cover-bottom-item span { color: var(--muted); }

/* ─── TOC ─────────────────────────────────────────── */
.toc-wrap {
  border-bottom: 1px solid var(--border);
  background: var(--surface);
}
.toc-header {
  padding: 48px 80px 32px;
  display: flex;
  align-items: baseline;
  gap: 24px;
  border-bottom: 1px solid var(--border);
}
.toc-header h2 {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent2);
}
.toc-header .toc-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--dim);
}
.toc-body {
  padding: 32px 80px 48px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px 48px;
}
.toc-row {
  display: grid;
  grid-template-columns: 32px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 9px 0;
  border-bottom: 1px solid var(--border);
  text-decoration: none;
  color: var(--muted);
  font-size: 13px;
  transition: color 0.15s;
}
.toc-row:hover { color: var(--text); }
.toc-row:hover .toc-n { color: var(--accent); }
.toc-n {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: var(--dim);
  transition: color 0.15s;
}
.toc-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  padding: 2px 7px;
  border-radius: 2px;
  white-space: nowrap;
}
.tag-react { background: rgba(88,166,255,0.12); color: var(--accent2); border: 1px solid rgba(88,166,255,0.2); }
.tag-next  { background: rgba(247,129,102,0.12); color: var(--accent);  border: 1px solid rgba(247,129,102,0.2); }
.tag-sys   { background: rgba(63,185,80,0.12);  color: var(--accent3); border: 1px solid rgba(63,185,80,0.2);  }
.tag-perf  { background: rgba(210,168,255,0.12); color: var(--accent4); border: 1px solid rgba(210,168,255,0.2); }

/* ─── MAIN ─────────────────────────────────────────── */
.main {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 72px 100px;
}
.cat-divider {
  margin: 80px 0 48px;
  position: relative;
}
.cat-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--border);
}
.cat-divider-inner {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 16px;
  background: var(--bg);
  padding-right: 24px;
}
.cat-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: var(--dim);
  letter-spacing: 0.1em;
}
.cat-title {
  font-family: 'Fraunces', serif;
  font-size: 26px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.5px;
}
.cat-pill {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  padding: 3px 10px;
  border-radius: 20px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* ─── QUESTION CARD ─────────────────────────────────── */
.qcard {
  margin-bottom: 64px;
  position: relative;
}
.qcard-inner {
  border: 1px solid var(--border);
  border-radius: 4px;
  overflow: hidden;
  background: var(--surface);
  transition: border-color 0.2s;
}
.qcard:hover .qcard-inner {
  border-color: var(--border2);
}
.qcard-head {
  padding: 20px 28px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: start;
  gap: 16px;
  border-bottom: 1px solid var(--border);
  background: var(--surface2);
}
.qcard-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--accent);
  margin-top: 3px;
  min-width: 24px;
}
.qcard-q {
  font-family: 'Fraunces', serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.35;
  color: var(--text);
  letter-spacing: -0.3px;
}
.qcard-body {
  padding: 24px 28px;
}
.qcard-answer {
  font-size: 14px;
  line-height: 1.85;
  color: #b1bac4;
}
.qcard-answer code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  background: rgba(110,118,129,0.1);
  border: 1px solid var(--border2);
  padding: 1px 6px;
  border-radius: 3px;
  color: var(--s-type);
}

/* ─── CODE BLOCK ─────────────────────────────────────── */
.cb {
  margin: 20px 0 4px;
  border: 1px solid var(--border2);
  border-radius: 4px;
  overflow: hidden;
}
.cb-bar {
  background: #161b22;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
}
.cb-filename {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--muted);
  display: flex;
  align-items: center;
  gap: 8px;
}
.cb-filename::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent3);
}
.cb-lang {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: var(--dim);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.cb pre {
  background: #0d1117;
  padding: 20px 24px;
  overflow-x: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12.5px;
  line-height: 1.7;
  color: var(--s-plain);
  tab-size: 2;
}

/* syntax */
.kw   { color: var(--s-kw); }
.fn   { color: var(--s-fn); }
.str  { color: var(--s-str); }
.num  { color: var(--s-num); }
.cmt  { color: var(--s-cmt); font-style: italic; }
.tag  { color: var(--s-tag); }
.attr { color: var(--s-attr); }
.tp   { color: var(--s-type); }
.op   { color: var(--s-op); }

/* ─── CALLOUT ─────────────────────────────────────────── */
.callout {
  margin: 16px 0 4px;
  padding: 14px 18px;
  border-left: 3px solid var(--warn);
  background: rgba(227,179,65,0.06);
  border-radius: 0 3px 3px 0;
}
.callout.info {
  border-color: var(--accent2);
  background: rgba(88,166,255,0.06);
}
.callout.good {
  border-color: var(--accent3);
  background: rgba(63,185,80,0.06);
}
.callout p {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--muted);
  line-height: 1.7;
}
.callout strong { color: var(--warn); font-weight: 500; }
.callout.info strong { color: var(--accent2); }
.callout.good strong { color: var(--accent3); }

/* ─── FOOTER ─────────────────────────────────────────── */
.footer {
  border-top: 1px solid var(--border);
  padding: 32px 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--surface);
}
.footer-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.footer-logo {
  font-family: 'Fraunces', serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
  font-style: italic;
}
.footer-sep { color: var(--border2); }
.footer-desc {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--dim);
}
.footer-right {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--dim);
  text-align: right;
  line-height: 1.9;
}

@media (max-width: 900px) {
  .cover-grid { grid-template-columns: 1fr; }
  .cover-right { display: none; }
  .cover-left, .toc-header, .toc-body, .cover-bottom, .footer { padding-left: 32px; padding-right: 32px; }
  .toc-body { grid-template-columns: 1fr; }
  .main { padding: 0 28px 80px; }
}
`;

// Pre block HTML strings for dangerouslySetInnerHTML
const coverPre = `<span class="cmt">// React Fiber — work loop</span>
<span class="kw">function</span> <span class="fn">workLoopConcurrent</span>() {
  <span class="kw">while</span> (workInProgress !== <span class="kw">null</span>
    &amp;&amp; !<span class="fn">shouldYield</span>()) {
    <span class="fn">performUnitOfWork</span>(workInProgress);
  }
}

<span class="cmt">// Each fiber = unit of work</span>
<span class="kw">interface</span> <span class="tp">Fiber</span> {
  type:         <span class="tp">ElementType</span>;
  stateNode:    <span class="tp">Node</span> | <span class="kw">null</span>;
  child:        <span class="tp">Fiber</span> | <span class="kw">null</span>;
  sibling:      <span class="tp">Fiber</span> | <span class="kw">null</span>;
  return:       <span class="tp">Fiber</span> | <span class="kw">null</span>;
  pendingProps: <span class="tp">Props</span>;
  memoizedState:<span class="tp">Hook</span> | <span class="kw">null</span>;
  lanes:        <span class="tp">Lanes</span>; <span class="cmt">// priority</span>
}

<span class="cmt">// Double buffering</span>
<span class="kw">const</span> current     = fiber.alternate;
<span class="kw">const</span> workInProg  = <span class="fn">createWorkInProgress</span>(
  current, pendingProps
);`;

const q1Pre = `<span class="cmt">// Simplified Fiber node shape</span>
<span class="kw">interface</span> <span class="tp">FiberNode</span> {
  tag:           <span class="tp">WorkTag</span>;        <span class="cmt">// FunctionComponent, HostComponent, etc.</span>
  type:          <span class="tp">any</span>;            <span class="cmt">// e.g. 'div' | MyComponent</span>
  stateNode:     <span class="tp">any</span>;            <span class="cmt">// DOM node or class instance</span>
  pendingProps:  <span class="tp">Props</span>;
  memoizedProps: <span class="tp">Props</span>;
  memoizedState: <span class="tp">Hook</span> | <span class="kw">null</span>;   <span class="cmt">// hook linked list for function components</span>
  child:         <span class="tp">FiberNode</span> | <span class="kw">null</span>;
  sibling:       <span class="tp">FiberNode</span> | <span class="kw">null</span>;
  return:        <span class="tp">FiberNode</span> | <span class="kw">null</span>; <span class="cmt">// parent</span>
  alternate:     <span class="tp">FiberNode</span> | <span class="kw">null</span>; <span class="cmt">// double buffer pair</span>
  lanes:         <span class="tp">Lanes</span>;           <span class="cmt">// scheduled priority bitmask</span>
  flags:         <span class="tp">Flags</span>;           <span class="cmt">// Placement | Update | Deletion</span>
}`;

const q2Pre = `<span class="cmt">// ❌ BAD: type changes → full unmount/remount every toggle</span>
{isAdmin ? <span class="tag">&lt;AdminPanel</span> /&gt; : <span class="tag">&lt;UserPanel</span> /&gt;}

<span class="cmt">// ✅ GOOD: same type, only props change → in-place update</span>
<span class="tag">&lt;Panel</span> <span class="attr">variant</span>={isAdmin ? <span class="str">"admin"</span> : <span class="str">"user"</span>} /&gt;

<span class="cmt">// ❌ BAD: index key breaks reconciliation on sort/filter</span>
items.<span class="fn">map</span>((item, i) =&gt; <span class="tag">&lt;Row</span> <span class="attr">key</span>={i} {...item} /&gt;)

<span class="cmt">// ✅ GOOD: stable identity key</span>
items.<span class="fn">map</span>(item =&gt; <span class="tag">&lt;Row</span> <span class="attr">key</span>={item.id} {...item} /&gt;)`;

const q3Pre = `<span class="kw">function</span> <span class="fn">Search</span>() {
  <span class="kw">const</span> [query, setQuery] = <span class="fn">useState</span>(<span class="str">""</span>);
  <span class="kw">const</span> [results, setResults] = <span class="fn">useState</span>([]);
  <span class="kw">const</span> [isPending, startTransition] = <span class="fn">useTransition</span>();

  <span class="kw">const</span> <span class="fn">handleChange</span> = (e: <span class="tp">ChangeEvent&lt;HTMLInputElement&gt;</span>) =&gt; {
    setQuery(e.target.value);              <span class="cmt">// urgent — keep input snappy</span>
    <span class="fn">startTransition</span>(() =&gt; {
      setResults(<span class="fn">heavyFilter</span>(e.target.value)); <span class="cmt">// non-urgent</span>
    });
  };

  <span class="kw">return</span> (
    <span class="tag">&lt;&gt;</span>
      <span class="tag">&lt;input</span> <span class="attr">value</span>={query} <span class="attr">onChange</span>={handleChange} /&gt;
      {isPending &amp;&amp; <span class="tag">&lt;Spinner</span> /&gt;}
      <span class="tag">&lt;ResultList</span> <span class="attr">items</span>={results} /&gt;
    <span class="tag">&lt;/&gt;</span>
  );
}`;

const q4Pre = `<span class="cmt">// HTML shell renders instantly; each boundary streams in</span>
<span class="kw">export default function</span> <span class="fn">Dashboard</span>() {
  <span class="kw">return</span> (
    <span class="tag">&lt;main&gt;</span>
      <span class="tag">&lt;Header</span> /&gt;                     {<span class="cmt">/* static — renders immediately */</span>}
      <span class="tag">&lt;Suspense</span> <span class="attr">fallback</span>=<span class="str">&lt;MetricsSkeleton /&gt;</span>&gt;
        <span class="tag">&lt;MetricsPanel</span> /&gt;              {<span class="cmt">/* streams when DB query resolves */</span>}
      <span class="tag">&lt;/Suspense&gt;</span>
      <span class="tag">&lt;Suspense</span> <span class="attr">fallback</span>=<span class="str">&lt;FeedSkeleton /&gt;</span>&gt;
        <span class="tag">&lt;ActivityFeed</span> /&gt;              {<span class="cmt">/* streams independently */</span>}
      <span class="tag">&lt;/Suspense&gt;</span>
    <span class="tag">&lt;/main&gt;</span>
  );
}`;

const q5Pre = `<span class="str">"use client"</span>;

<span class="kw">async function</span> <span class="fn">toggleLike</span>(postId: <span class="tp">string</span>): <span class="tp">Promise&lt;void&gt;</span> {
  <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">\`/api/posts/\${postId}/like\`</span>, { method: <span class="str">"POST"</span> });
}

<span class="kw">function</span> <span class="fn">LikeButton</span>({ postId, initialLikes }: <span class="tp">Props</span>) {
  <span class="kw">const</span> [likes, setLikes] = <span class="fn">useState</span>(initialLikes);
  <span class="kw">const</span> [optimisticLikes, addOptimistic] = <span class="fn">useOptimistic</span>(
    likes,
    (current, delta: <span class="tp">number</span>) =&gt; current + delta
  );

  <span class="kw">return</span> (
    <span class="tag">&lt;button</span>
      <span class="attr">onClick</span>={<span class="kw">async</span> () =&gt; {
        <span class="fn">addOptimistic</span>(<span class="num">1</span>);          <span class="cmt">// instant UI update</span>
        <span class="kw">await</span> <span class="fn">toggleLike</span>(postId); <span class="cmt">// real mutation</span>
        <span class="fn">setLikes</span>(l =&gt; l + <span class="num">1</span>);    <span class="cmt">// confirm real state</span>
      }}
    &gt;
      ♥ {optimisticLikes}
    <span class="tag">&lt;/button&gt;</span>
  );
}`;

const q6Pre = `<span class="cmt">// Layer 1: Server State — TanStack Query</span>
<span class="kw">const</span> { data: user } = <span class="fn">useQuery</span>({
  queryKey: [<span class="str">'user'</span>, userId],
  queryFn: () =&gt; <span class="fn">fetchUser</span>(userId),
  staleTime: <span class="num">5</span> * <span class="num">60</span> * <span class="num">1000</span>,   <span class="cmt">// 5 min cache</span>
});

<span class="cmt">// Layer 2: Global Client State — Zustand</span>
<span class="kw">const</span> useUIStore = <span class="fn">create</span>&lt;<span class="tp">UIState</span>&gt;()((set) =&gt; ({
  sidebarOpen: <span class="kw">false</span>,
  toggleSidebar: () =&gt; set(s =&gt; ({ sidebarOpen: !s.sidebarOpen })),
}));

<span class="cmt">// Layer 3: Local — useState stays local</span>
<span class="kw">const</span> [tab, setTab] = <span class="fn">useState</span>(<span class="str">"overview"</span>);`;

const q7Pre = `<span class="cmt">// ❌ New object reference every render → all consumers re-render</span>
<span class="tag">&lt;Ctx.Provider</span> <span class="attr">value</span>={{ user, logout }} /&gt;

<span class="cmt">// ✅ Memoize context value</span>
<span class="kw">const</span> value = <span class="fn">useMemo</span>(
  () =&gt; ({ user, logout }),
  [user, logout]    <span class="cmt">// only changes when user or logout changes</span>
);
<span class="tag">&lt;Ctx.Provider</span> <span class="attr">value</span>={value} /&gt;

<span class="cmt">// ✅ Or split contexts by update frequency</span>
<span class="tag">&lt;UserCtx.Provider</span> <span class="attr">value</span>={user}&gt;
  <span class="tag">&lt;AuthActionsCtx.Provider</span> <span class="attr">value</span>={stableActions}&gt;
    {children}
  <span class="tag">&lt;/AuthActionsCtx.Provider&gt;</span>
<span class="tag">&lt;/UserCtx.Provider&gt;</span>`;

const q8Pre = `<span class="kw">import</span> dynamic <span class="kw">from</span> <span class="str">'next/dynamic'</span>;

<span class="cmt">// Deferred: only loads when rendered</span>
<span class="kw">const</span> RichEditor = <span class="fn">dynamic</span>(
  () =&gt; <span class="kw">import</span>(<span class="str">'@/components/RichEditor'</span>),
  { loading: () =&gt; <span class="tag">&lt;EditorSkeleton</span> /&gt;, ssr: <span class="kw">false</span> }
);

<span class="cmt">// next.config.js — tree-shake large icon libs</span>
<span class="kw">const</span> config = {
  experimental: {
    optimizePackageImports: [<span class="str">'lucide-react'</span>, <span class="str">'@heroicons/react'</span>]
  }
};`;

const q10Pre = `<span class="kw">const</span> TabsCtx = <span class="fn">createContext</span>&lt;<span class="tp">TabsContextType</span>&gt;(<span class="kw">null</span>!);

<span class="kw">function</span> <span class="fn">Tabs</span>({ children, defaultTab }: <span class="tp">TabsProps</span>) {
  <span class="kw">const</span> [active, setActive] = <span class="fn">useState</span>(defaultTab);
  <span class="kw">return</span> <span class="tag">&lt;TabsCtx.Provider</span> <span class="attr">value</span>={{ active, setActive }}&gt;{children}<span class="tag">&lt;/TabsCtx.Provider&gt;</span>;
}

<span class="fn">Tabs</span>.Tab = <span class="kw">function</span> <span class="fn">Tab</span>({ id, children }: <span class="tp">TabProps</span>) {
  <span class="kw">const</span> { active, setActive } = <span class="fn">useContext</span>(TabsCtx);
  <span class="kw">return</span> <span class="tag">&lt;button</span> <span class="attr">aria-selected</span>={active === id} <span class="attr">onClick</span>={() =&gt; <span class="fn">setActive</span>(id)}&gt;{children}<span class="tag">&lt;/button&gt;</span>;
};

<span class="fn">Tabs</span>.Panel = <span class="kw">function</span> <span class="fn">Panel</span>({ id, children }: <span class="tp">PanelProps</span>) {
  <span class="kw">const</span> { active } = <span class="fn">useContext</span>(TabsCtx);
  <span class="kw">return</span> active === id ? <span class="tag">&lt;&gt;</span>{children}<span class="tag">&lt;/&gt;</span> : <span class="kw">null</span>;
};

<span class="cmt">// Usage — consumer controls composition</span>
<span class="tag">&lt;Tabs</span> <span class="attr">defaultTab</span>=<span class="str">"overview"</span>&gt;
  <span class="tag">&lt;Tabs.Tab</span> <span class="attr">id</span>=<span class="str">"overview"</span>&gt;Overview<span class="tag">&lt;/Tabs.Tab&gt;</span>
  <span class="tag">&lt;Tabs.Panel</span> <span class="attr">id</span>=<span class="str">"overview"</span>&gt;<span class="tag">&lt;OverviewContent</span> /&gt;<span class="tag">&lt;/Tabs.Panel&gt;</span>
<span class="tag">&lt;/Tabs&gt;</span>`;

const q11Pre = `<span class="kw">import</span> { NextRequest, NextResponse } <span class="kw">from</span> <span class="str">'next/server'</span>;
<span class="kw">import</span> { verifyToken } <span class="kw">from</span> <span class="str">'@/lib/jwt-edge'</span>; <span class="cmt">// Web Crypto only</span>

<span class="kw">export async function</span> <span class="fn">middleware</span>(req: <span class="tp">NextRequest</span>) {
  <span class="kw">const</span> token = req.cookies.<span class="fn">get</span>(<span class="str">'session'</span>)?.value;
  <span class="kw">const</span> valid = token &amp;&amp; <span class="kw">await</span> <span class="fn">verifyToken</span>(token);

  <span class="kw">if</span> (!valid &amp;&amp; req.nextUrl.pathname.<span class="fn">startsWith</span>(<span class="str">'/dashboard'</span>)) {
    <span class="kw">return</span> NextResponse.<span class="fn">redirect</span>(<span class="kw">new</span> <span class="fn">URL</span>(<span class="str">'/login'</span>, req.url));
  }
  <span class="kw">return</span> NextResponse.<span class="fn">next</span>();
}

<span class="kw">export const</span> config = {
  matcher: [<span class="str">'/dashboard/:path*'</span>, <span class="str">'/api/protected/:path*'</span>],
};`;

const q13Pre = `<span class="str">"use server"</span>;

<span class="kw">import</span> { z } <span class="kw">from</span> <span class="str">'zod'</span>;
<span class="kw">import</span> { auth } <span class="kw">from</span> <span class="str">'@/lib/auth'</span>;

<span class="kw">const</span> CreateSchema = z.<span class="fn">object</span>({
  title: z.<span class="fn">string</span>().<span class="fn">min</span>(<span class="num">1</span>).<span class="fn">max</span>(<span class="num">200</span>),
  body:  z.<span class="fn">string</span>().<span class="fn">min</span>(<span class="num">10</span>),
});

<span class="kw">export async function</span> <span class="fn">createPost</span>(formData: <span class="tp">FormData</span>) {
  <span class="kw">const</span> session = <span class="kw">await</span> <span class="fn">auth</span>();   <span class="cmt">// ← always re-authorize</span>
  <span class="kw">if</span> (!session) <span class="kw">throw new</span> <span class="fn">Error</span>(<span class="str">"Unauthorized"</span>);

  <span class="kw">const</span> input = CreateSchema.<span class="fn">parse</span>({  <span class="cmt">// ← always validate</span>
    title: formData.<span class="fn">get</span>(<span class="str">"title"</span>),
    body:  formData.<span class="fn">get</span>(<span class="str">"body"</span>),
  });

  <span class="kw">await</span> db.post.<span class="fn">create</span>({ data: { ...input, authorId: session.userId } });
  <span class="fn">revalidateTag</span>(<span class="str">"posts"</span>);
}`;

const q16Pre = `<span class="kw">import</span> { auth } <span class="kw">from</span> <span class="str">'@/auth'</span>;
<span class="kw">import</span> { redirect } <span class="kw">from</span> <span class="str">'next/navigation'</span>;

<span class="kw">export default async function</span> <span class="fn">AdminPage</span>() {
  <span class="kw">const</span> session = <span class="kw">await</span> <span class="fn">auth</span>();

  <span class="kw">if</span> (!session)             <span class="fn">redirect</span>(<span class="str">'/login'</span>);
  <span class="kw">if</span> (session.user.role !== <span class="str">'admin'</span>) <span class="fn">redirect</span>(<span class="str">'/403'</span>);

  <span class="cmt">// Only admins reach here — safe to fetch sensitive data</span>
  <span class="kw">const</span> data = <span class="kw">await</span> <span class="fn">fetchAdminData</span>();
  <span class="kw">return</span> <span class="tag">&lt;AdminDashboard</span> <span class="attr">data</span>={data} /&gt;;
}`;

const q18Pre = `<span class="kw">export async function</span> <span class="fn">GET</span>() {
  <span class="kw">const</span> stream = <span class="kw">new</span> <span class="tp">ReadableStream</span>({
    <span class="kw">async</span> <span class="fn">start</span>(controller) {
      <span class="kw">const</span> <span class="fn">send</span> = (data: <span class="tp">unknown</span>) =&gt;
        controller.<span class="fn">enqueue</span>(<span class="kw">new</span> <span class="tp">TextEncoder</span>().<span class="fn">encode</span>(
          <span class="str">\`data: \${JSON.stringify(data)}\\n\\n\`</span>
        ));

      <span class="kw">const</span> unsub = db.<span class="fn">subscribe</span>(<span class="str">'events'</span>, <span class="fn">send</span>);
      <span class="cmt">// cleanup on disconnect not shown for brevity</span>
    },
  });

  <span class="kw">return new</span> <span class="tp">Response</span>(stream, {
    headers: {
      <span class="str">'Content-Type'</span>: <span class="str">'text/event-stream'</span>,
      <span class="str">'Cache-Control'</span>: <span class="str">'no-cache'</span>,
    },
  });
}`;

const q20Pre = `<span class="kw">export async function</span> <span class="fn">register</span>() {
  <span class="kw">if</span> (process.env.NEXT_RUNTIME === <span class="str">'nodejs'</span>) {
    <span class="kw">const</span> { <span class="fn">init</span> } = <span class="kw">await import</span>(<span class="str">'@sentry/nextjs'</span>);
    <span class="fn">init</span>({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: <span class="num">0.1</span>,         <span class="cmt">// 10% of transactions</span>
      profilesSampleRate: <span class="num">0.1</span>,
    });

    <span class="cmt">// OpenTelemetry — full distributed tracing</span>
    <span class="kw">const</span> { <span class="tp">NodeSDK</span> } = <span class="kw">await import</span>(<span class="str">'@opentelemetry/sdk-node'</span>);
    <span class="kw">new</span> <span class="tp">NodeSDK</span>({ <span class="cmt">/* exporter config */</span> }).<span class="fn">start</span>();
  }
}`;

export default function AdvancedReactNextjsPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <a href="/" className="adv-back">
        ← Back
      </a>

      {/* ═══════════════ COVER ═══════════════ */}
      <div className="cover">
        <div className="cover-grid">
          <div className="cover-left">
            <div className="cover-badge">Advanced · System Design</div>
            <h1>
              React &amp;
              <br />
              <em>Next.js</em>
              <br />
              Deep Dive
            </h1>
            <p className="cover-sub">// 20 advanced interview questions</p>
            <p className="cover-desc">
              Architecture, internals, performance, and production system design
              — the questions that separate senior engineers from mid-level
              ones.
            </p>
            <div className="cover-stats">
              <div className="stat">
                <span className="stat-value">20</span>
                <span className="stat-label">Questions</span>
              </div>
              <div className="stat">
                <span className="stat-value">12</span>
                <span className="stat-label">React Core</span>
              </div>
              <div className="stat">
                <span className="stat-value">8</span>
                <span className="stat-label">Next.js</span>
              </div>
            </div>
          </div>
          <div className="cover-right">
            <div className="cover-code-preview">
              <div className="code-win">
                <div className="code-win-bar">
                  <div className="dot dot-r"></div>
                  <div className="dot dot-y"></div>
                  <div className="dot dot-g"></div>
                  <span className="code-win-title">fiber-reconciler.ts</span>
                </div>
                <pre dangerouslySetInnerHTML={{ __html: coverPre }} />
              </div>
            </div>
          </div>
        </div>
        <div className="cover-bottom">
          <div className="cover-bottom-item">
            stack <span>React 19 · Next.js 15</span>
          </div>
          <div className="cover-bottom-item">
            renderer <span>Concurrent Mode</span>
          </div>
          <div className="cover-bottom-item">
            topics <span>Internals · Architecture · Production</span>
          </div>
        </div>
      </div>

      {/* ═══════════════ TOC ═══════════════ */}
      <div className="toc-wrap">
        <div className="toc-header">
          <h2>// index</h2>
          <span className="toc-count">20 questions across 4 domains</span>
        </div>
        <div className="toc-body">
          <a href="#q1" className="toc-row">
            <span className="toc-n">01</span>
            <span>React Fiber &amp; Concurrent Rendering</span>
            <span className="toc-tag tag-react">react</span>
          </a>
          <a href="#q11" className="toc-row">
            <span className="toc-n">11</span>
            <span>Next.js Middleware &amp; Edge Runtime</span>
            <span className="toc-tag tag-next">next</span>
          </a>
          <a href="#q2" className="toc-row">
            <span className="toc-n">02</span>
            <span>Reconciliation &amp; the Diffing Algorithm</span>
            <span className="toc-tag tag-react">react</span>
          </a>
          <a href="#q12" className="toc-row">
            <span className="toc-n">12</span>
            <span>Caching Layers in Next.js</span>
            <span className="toc-tag tag-next">next</span>
          </a>
          <a href="#q3" className="toc-row">
            <span className="toc-n">03</span>
            <span>Transitions &amp; useDeferredValue</span>
            <span className="toc-tag tag-react">react</span>
          </a>
          <a href="#q13" className="toc-row">
            <span className="toc-n">13</span>
            <span>Server Actions &amp; Mutations</span>
            <span className="toc-tag tag-next">next</span>
          </a>
          <a href="#q4" className="toc-row">
            <span className="toc-n">04</span>
            <span>Suspense &amp; Streaming SSR</span>
            <span className="toc-tag tag-react">react</span>
          </a>
          <a href="#q14" className="toc-row">
            <span className="toc-n">14</span>
            <span>Route Handlers &amp; API Layer Design</span>
            <span className="toc-tag tag-next">next</span>
          </a>
          <a href="#q5" className="toc-row">
            <span className="toc-n">05</span>
            <span>React 19 — useOptimistic &amp; useActionState</span>
            <span className="toc-tag tag-react">react</span>
          </a>
          <a href="#q15" className="toc-row">
            <span className="toc-n">15</span>
            <span>Parallel &amp; Intercepting Routes</span>
            <span className="toc-tag tag-next">next</span>
          </a>
          <a href="#q6" className="toc-row">
            <span className="toc-n">06</span>
            <span>State Management Architecture</span>
            <span className="toc-tag tag-sys">system</span>
          </a>
          <a href="#q16" className="toc-row">
            <span className="toc-n">16</span>
            <span>Authentication Patterns in Next.js</span>
            <span className="toc-tag tag-next">next</span>
          </a>
          <a href="#q7" className="toc-row">
            <span className="toc-n">07</span>
            <span>Render &amp; Re-render Optimization</span>
            <span className="toc-tag tag-perf">perf</span>
          </a>
          <a href="#q17" className="toc-row">
            <span className="toc-n">17</span>
            <span>Monorepo &amp; Micro-frontend Architecture</span>
            <span className="toc-tag tag-sys">system</span>
          </a>
          <a href="#q8" className="toc-row">
            <span className="toc-n">08</span>
            <span>Code Splitting &amp; Bundle Strategy</span>
            <span className="toc-tag tag-perf">perf</span>
          </a>
          <a href="#q18" className="toc-row">
            <span className="toc-n">18</span>
            <span>Real-time UI: WebSockets &amp; SSE</span>
            <span className="toc-tag tag-sys">system</span>
          </a>
          <a href="#q9" className="toc-row">
            <span className="toc-n">09</span>
            <span>React Query / Server State Management</span>
            <span className="toc-tag tag-react">react</span>
          </a>
          <a href="#q19" className="toc-row">
            <span className="toc-n">19</span>
            <span>Designing a Component Library</span>
            <span className="toc-tag tag-sys">system</span>
          </a>
          <a href="#q10" className="toc-row">
            <span className="toc-n">10</span>
            <span>Compound Components &amp; Advanced Patterns</span>
            <span className="toc-tag tag-react">react</span>
          </a>
          <a href="#q20" className="toc-row">
            <span className="toc-n">20</span>
            <span>Observability &amp; Error Tracking</span>
            <span className="toc-tag tag-sys">system</span>
          </a>
        </div>
      </div>

      {/* ═══════════════ CONTENT ═══════════════ */}
      <div className="main">
        {/* ── SECTION A ── */}
        <div className="cat-divider">
          <div className="cat-divider-inner">
            <span className="cat-num">01 – 05</span>
            <span className="cat-title">
              React Internals &amp; Concurrent Features
            </span>
            <span className="toc-tag tag-react cat-pill">react core</span>
          </div>
        </div>

        {/* Q1 */}
        <div className="qcard" id="q1">
          <div className="qcard-inner">
            <div className="qcard-head">
              <span className="qcard-num">01</span>
              <p className="qcard-q">
                What is the React Fiber architecture, and why was it a
                fundamental rewrite of the original reconciler?
              </p>
              <span className="toc-tag tag-react">internals</span>
            </div>
            <div className="qcard-body">
              <p className="qcard-answer">
                React Fiber, introduced in React 16, replaced the original
                stack-based reconciler with a linked-list data structure where
                each component instance maps to a "fiber" node containing its
                type, props, state, effect list, and pointers to its child,
                sibling, and parent fibers. The critical problem with the
                original reconciler was that the diffing of a large component
                tree was a single synchronous, uninterruptible call stack
                traversal — on slow devices, this would block the main thread
                and drop frames. Fiber breaks that traversal into small units of
                work that can be paused, resumed, aborted, and prioritized using
                a scheduler that integrates with the browser's{" "}
                <code>requestIdleCallback</code> API. React maintains two fiber
                trees simultaneously — the current tree (what's on screen) and
                the work-in-progress tree (what's being computed) — committing
                the new tree atomically only when all work is complete, a
                technique called double buffering. This architecture is what
                enables all of Concurrent Mode's features: time-slicing,
                Suspense, transitions, and streaming SSR.
              </p>
              <div className="cb">
                <div className="cb-bar">
                  <span className="cb-filename">fiber-node.ts</span>
                  <span className="cb-lang">typescript</span>
                </div>
                <pre dangerouslySetInnerHTML={{ __html: q1Pre }} />
              </div>
            </div>
          </div>
        </div>

        {/* Q2 */}
        <div className="qcard" id="q2">
          <div className="qcard-inner">
            <div className="qcard-head">
              <span className="qcard-num">02</span>
              <p className="qcard-q">
                How does React's reconciliation algorithm work, and what are the
                assumptions it makes to achieve O(n) complexity?
              </p>
              <span className="toc-tag tag-react">internals</span>
            </div>
            <div className="qcard-body">
              <p className="qcard-answer">
                A naive tree diffing algorithm comparing two arbitrary trees has
                O(n³) time complexity, which is prohibitive for UI trees.
                React's reconciler achieves O(n) by making two heuristic
                assumptions: first, elements of different types produce entirely
                different trees, so React tears down the old tree and builds a
                new one from scratch when the root element type changes rather
                than diffing children. Second, developers signal element
                identity across renders using the <code>key</code> prop —
                without a key, React matches elements by position, which breaks
                on reordering; with a stable key, React can track which item
                moved, was added, or was removed in a list efficiently. The
                algorithm walks the tree level-by-level (breadth-first),
                comparing each fiber by type: same type means update in place
                (reconcile props), different type means unmount and remount.
                Understanding this is critical for performance — placing
                components conditionally can cause expensive unmount/remount
                cycles instead of cheap in-place updates if the element type or
                key position changes.
              </p>
              <div className="cb">
                <div className="cb-bar">
                  <span className="cb-filename">
                    reconciliation-pitfall.tsx
                  </span>
                  <span className="cb-lang">tsx</span>
                </div>
                <pre dangerouslySetInnerHTML={{ __html: q2Pre }} />
              </div>
            </div>
          </div>
        </div>

        {/* Q3 */}
        <div className="qcard" id="q3">
          <div className="qcard-inner">
            <div className="qcard-head">
              <span className="qcard-num">03</span>
              <p className="qcard-q">
                What are React Transitions (<code>useTransition</code> and{" "}
                <code>startTransition</code>), and how do they differ from{" "}
                <code>useDeferredValue</code>?
              </p>
              <span className="toc-tag tag-react">concurrent</span>
            </div>
            <div className="qcard-body">
              <p className="qcard-answer">
                <code>startTransition</code> marks a state update as non-urgent,
                telling React's scheduler that it can be interrupted by
                higher-priority updates like user input. This is used to keep
                the UI responsive during expensive state transitions — for
                example, filtering a large dataset where you want the input to
                feel instant while the list update can lag slightly.{" "}
                <code>useTransition</code> is the hook version that also returns
                an <code>isPending</code> boolean, allowing you to show a
                loading indicator while the transition is in progress without
                blocking the current UI. <code>useDeferredValue</code> is
                semantically different: instead of wrapping a state setter, you
                wrap a derived value, and React may render the component with
                the old deferred value while the new value is still being
                calculated — useful when you receive props you can't wrap in{" "}
                <code>startTransition</code>. A key rule: transitions work only
                with React state and state-derived renders, not with native DOM
                input values, so the controlled input's state update must remain
                urgent while only the expensive downstream computation is
                deferred.
              </p>
              <div className="cb">
                <div className="cb-bar">
                  <span className="cb-filename">
                    search-with-transition.tsx
                  </span>
                  <span className="cb-lang">tsx</span>
                </div>
                <pre dangerouslySetInnerHTML={{ __html: q3Pre }} />
              </div>
            </div>
          </div>
        </div>

        {/* Q4 */}
        <div className="qcard" id="q4">
          <div className="qcard-inner">
            <div className="qcard-head">
              <span className="qcard-num">04</span>
              <p className="qcard-q">
                How does React Suspense work at a deep level, and what does
                Streaming SSR actually mean in Next.js?
              </p>
              <span className="toc-tag tag-react">concurrent</span>
            </div>
            <div className="qcard-body">
              <p className="qcard-answer">
                Suspense works by having a child component "throw" a Promise
                during rendering — a contract that React's concurrent renderer
                understands. React catches the thrown Promise, renders the
                nearest <code>&lt;Suspense&gt;</code> boundary's fallback, and
                subscribes to the Promise; when it resolves, React re-renders
                the subtree. This is how <code>React.lazy</code> enables code
                splitting and how data-fetching frameworks like Relay integrate.
                In Next.js, Streaming SSR extends this to the server: instead of
                waiting for all server-side data fetching to finish before
                sending any HTML (the traditional SSR waterfall), Next.js
                streams the HTML shell immediately and sends each Suspense
                boundary's content as its data resolves, via HTTP chunked
                transfer encoding. The browser progressively renders each chunk
                as it arrives, dramatically reducing Time to First Byte (TTFB)
                and Time to Interactive (TTI) for data-heavy pages. This is
                powered by React's <code>renderToPipeableStream</code> (Node.js)
                and <code>renderToReadableStream</code> (Edge) APIs.
              </p>
              <div className="cb">
                <div className="cb-bar">
                  <span className="cb-filename">app/dashboard/page.tsx</span>
                  <span className="cb-lang">tsx</span>
                </div>
                <pre dangerouslySetInnerHTML={{ __html: q4Pre }} />
              </div>
              <div className="callout info">
                <p>
                  <strong>Key insight:</strong> wrapping each slow data-fetching
                  component in its own Suspense boundary means they stream in
                  parallel — the slowest component no longer holds up everything
                  else.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Q5 */}
        <div className="qcard" id="q5">
          <div className="qcard-inner">
            <div className="qcard-head">
              <span className="qcard-num">05</span>
              <p className="qcard-q">
                What are <code>useOptimistic</code> and{" "}
                <code>useActionState</code> in React 19, and how do they change
                how you handle mutations?
              </p>
              <span className="toc-tag tag-react">react 19</span>
            </div>
            <div className="qcard-body">
              <p className="qcard-answer">
                <code>useOptimistic</code> lets you immediately show an
                assumed-success state while an async mutation is in flight,
                rolling back automatically if the mutation fails. This
                eliminates the manual boilerplate of tracking optimistic state
                alongside real state — you pass it the real state and a reducer
                that computes the optimistic view, and React handles the
                reconciliation when the server responds.{" "}
                <code>useActionState</code> (formerly <code>useFormState</code>)
                is designed for form-based mutations — it wraps an async action
                function and returns the current state, the action handler, and
                an <code>isPending</code> flag. Together with HTML{" "}
                <code>&lt;form action={"{...}"}&gt;</code> (which React 19
                natively supports), these hooks make form mutations fully
                declarative with no manual loading/error state management.
                Critically, these patterns work with both Server Actions and
                client-side async functions, and they integrate with React's
                transition system so the UI stays interactive during the
                mutation.
              </p>
              <div className="cb">
                <div className="cb-bar">
                  <span className="cb-filename">like-button.tsx</span>
                  <span className="cb-lang">tsx</span>
                </div>
                <pre dangerouslySetInnerHTML={{ __html: q5Pre }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION B ── */}
        <div className="cat-divider">
          <div className="cat-divider-inner">
            <span className="cat-num">06 – 10</span>
            <span className="cat-title">
              Architecture &amp; Performance Patterns
            </span>
            <span className="toc-tag tag-sys cat-pill">system design</span>
          </div>
        </div>

        {/* Q6 */}
        <div className="qcard" id="q6">
          <div className="qcard-inner">
            <div className="qcard-head">
              <span className="qcard-num">06</span>
              <p className="qcard-q">
                How do you choose between local state, Context, Zustand, and a
                server-state library like TanStack Query? Design the state layer
                for a large app.
              </p>
              <span className="toc-tag tag-sys">architecture</span>
            </div>
            <div className="qcard-body">
              <p className="qcard-answer">
                The first distinction to make is between server state (remote
                data that lives on a server and must be fetched, cached, and
                synchronized) and client state (UI state that lives entirely in
                the browser, like modal open/closed or a selected tab). Server
                state should be managed by a dedicated library like TanStack
                Query or SWR — they handle caching, background revalidation,
                deduplication, optimistic updates, and race conditions in ways
                that <code>useEffect</code>-based manual fetching never will.
                Client state should start as local component state and only be
                lifted or globalized when multiple unrelated components
                genuinely need it. For shared client state, React Context is
                sufficient for low-frequency updates like theme or auth user,
                but it is not optimized for high-frequency updates because all
                consumers re-render on any change. For more complex or
                high-frequency shared client state, a fine-grained store like
                Zustand or Jotai is appropriate — they use subscriptions that
                re-render only the components that read the changed slice. A
                mature large-scale app typically uses TanStack Query for all
                server state, Zustand for shared client state, and local{" "}
                <code>useState</code>/<code>useReducer</code> for everything
                else.
              </p>
              <div className="cb">
                <div className="cb-bar">
                  <span className="cb-filename">state-architecture.ts</span>
                  <span className="cb-lang">typescript</span>
                </div>
                <pre dangerouslySetInnerHTML={{ __html: q6Pre }} />
              </div>
            </div>
          </div>
        </div>

        {/* Q7 */}
        <div className="qcard" id="q7">
          <div className="qcard-inner">
            <div className="qcard-head">
              <span className="qcard-num">07</span>
              <p className="qcard-q">
                Walk through a systematic approach to diagnosing and fixing
                excessive re-renders in a React application.
              </p>
              <span className="toc-tag tag-perf">performance</span>
            </div>
            <div className="qcard-body">
              <p className="qcard-answer">
                The first tool is React DevTools Profiler — record an
                interaction, then inspect which components re-rendered and why
                (it shows "rendered because props changed", "rendered because
                parent rendered", etc.). The most common cause of wasted renders
                is an unstable reference passed as a prop: a new object or array
                literal <code>{"{}"}</code> / <code>{"[]"}</code> or an inline
                function created during a parent's render has a new identity on
                every render, defeating <code>React.memo</code>'s shallow
                comparison. Fix these with <code>useMemo</code> for
                objects/arrays and <code>useCallback</code> for functions — but
                only after profiling confirms the component is expensive to
                re-render. The second common cause is Context value instability:
                if you pass an inline object to a Provider's <code>value</code>{" "}
                prop, all consumers re-render on every provider re-render
                regardless of whether relevant data changed; fix by memoizing
                the context value with <code>useMemo</code> or splitting into
                separate contexts for different update frequencies. For lists,
                ensure keys are stable and use virtualization (TanStack Virtual)
                once items exceed a few hundred. Finally, state colocation —
                moving state down to the leaf component that actually uses it —
                is often the highest-leverage fix because it narrows the
                re-render blast radius without any memoization overhead.
              </p>
              <div className="cb">
                <div className="cb-bar">
                  <span className="cb-filename">stable-context.tsx</span>
                  <span className="cb-lang">tsx</span>
                </div>
                <pre dangerouslySetInnerHTML={{ __html: q7Pre }} />
              </div>
            </div>
          </div>
        </div>

        {/* Q8 */}
        <div className="qcard" id="q8">
          <div className="qcard-inner">
            <div className="qcard-head">
              <span className="qcard-num">08</span>
              <p className="qcard-q">
                How does code splitting work in React and Next.js, and how do
                you design a bundle splitting strategy for a large application?
              </p>
              <span className="toc-tag tag-perf">performance</span>
            </div>
            <div className="qcard-body">
              <p className="qcard-answer">
                Webpack and Turbopack (Next.js's bundler) use dynamic{" "}
                <code>import()</code> expressions as split points, emitting a
                separate chunk for each one that is only downloaded when needed.
                In React, <code>React.lazy(() =&gt; import('./Modal'))</code>{" "}
                paired with <code>Suspense</code> defers a component's chunk
                until the first render. Next.js handles route-level splitting
                automatically in both the Pages and App Router — each route
                segment gets its own JS bundle. The design decisions concern
                what to split beyond route boundaries: heavy third-party
                libraries that are not needed on the initial render (chart
                libraries, rich text editors, date pickers) are prime candidates
                for lazy loading. In the App Router, marking a component{" "}
                <code>"use client"</code> already scopes it out of the server
                bundle; within client components,{" "}
                <code>dynamic(() =&gt; import(...), {"{ ssr: false }"})</code>{" "}
                prevents SSR for browser-only modules like D3 or Mapbox. You can
                analyze your bundles with <code>@next/bundle-analyzer</code> to
                find unexpected large dependencies and duplication across
                chunks, then use <code>optimizePackageImports</code> in{" "}
                <code>next.config.js</code> to enable tree-shaking for libraries
                that don't support it natively.
              </p>
              <div className="cb">
                <div className="cb-bar">
                  <span className="cb-filename">dynamic-import.tsx</span>
                  <span className="cb-lang">tsx</span>
                </div>
                <pre dangerouslySetInnerHTML={{ __html: q8Pre }} />
              </div>
            </div>
          </div>
        </div>

        {/* Q9 */}
        <div className="qcard" id="q9">
          <div className="qcard-inner">
            <div className="qcard-head">
              <span className="qcard-num">09</span>
              <p className="qcard-q">
                How does TanStack Query manage server state, and how do you
                design cache invalidation and synchronization strategies?
              </p>
              <span className="toc-tag tag-react">server state</span>
            </div>
            <div className="qcard-body">
              <p className="qcard-answer">
                TanStack Query (React Query) represents each piece of server
                state as a cache entry identified by a <code>queryKey</code>{" "}
                array. When a query's data ages beyond <code>staleTime</code>,
                it is marked stale and will be refetched in the background on
                the next mount, window focus, or network reconnect — the
                component is never left with a loading spinner, it renders stale
                data immediately while fresh data arrives. Mutations use{" "}
                <code>useMutation</code> and their <code>onSuccess</code>{" "}
                callback is the primary place for cache invalidation via{" "}
                <code>
                  queryClient.invalidateQueries({"{ queryKey: [...] }"})
                </code>
                , which marks matching entries stale and triggers background
                refetches. For instant UI feedback, optimistic updates can be
                implemented in <code>onMutate</code> with a rollback in{" "}
                <code>onError</code>. At scale, the key design decision is query
                key structure — using hierarchical keys like{" "}
                <code>['posts', {"{ page, filter }"}]</code> enables precise or
                broad invalidation: <code>['posts']</code> as the invalidation
                key invalidates all post-related queries. In Next.js App Router,
                TanStack Query's <code>prefetchQuery</code> and{" "}
                <code>HydrationBoundary</code> allow you to prefetch on the
                server and hydrate on the client with zero loading state on
                first render.
              </p>
            </div>
          </div>
        </div>

        {/* Q10 */}
        <div className="qcard" id="q10">
          <div className="qcard-inner">
            <div className="qcard-head">
              <span className="qcard-num">10</span>
              <p className="qcard-q">
                What are Compound Components and the Render Props pattern? When
                are they the right architectural choice?
              </p>
              <span className="toc-tag tag-react">patterns</span>
            </div>
            <div className="qcard-body">
              <p className="qcard-answer">
                The Compound Component pattern models a group of related
                components that share implicit state through Context — similar
                to how <code>&lt;select&gt;</code> and{" "}
                <code>&lt;option&gt;</code> work natively. The parent component
                owns and provides the shared state; child components consume it
                via context without any explicit prop-drilling. This gives
                consumers declarative, flexible composition — they can reorder,
                omit, or augment child components freely, unlike a monolithic
                component controlled by a single <code>config</code> prop. The
                Render Props pattern passes a function as a prop (or as{" "}
                <code>children</code>) and calls it with internal state, giving
                the consumer full control over rendering. In modern React,
                custom hooks largely replace render props since they extract the
                logic without influencing the component hierarchy, which is
                cleaner. Compound components remain the right choice when the
                API is inherently structural and compositional —{" "}
                <code>&lt;Tabs&gt;</code>, <code>&lt;Accordion&gt;</code>,{" "}
                <code>&lt;Select&gt;</code>, <code>&lt;Menu&gt;</code> —
                especially in component libraries where consumers must be able
                to slot in their own markup within the structure.
              </p>
              <div className="cb">
                <div className="cb-bar">
                  <span className="cb-filename">tabs-compound.tsx</span>
                  <span className="cb-lang">tsx</span>
                </div>
                <pre dangerouslySetInnerHTML={{ __html: q10Pre }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION C ── */}
        <div className="cat-divider">
          <div className="cat-divider-inner">
            <span className="cat-num">11 – 16</span>
            <span className="cat-title">Next.js Deep Internals</span>
            <span className="toc-tag tag-next cat-pill">next.js</span>
          </div>
        </div>

        {/* Q11 */}
        <div className="qcard" id="q11">
          <div className="qcard-inner">
            <div className="qcard-head">
              <span className="qcard-num">11</span>
              <p className="qcard-q">
                What is Next.js Middleware, and how does it differ from running
                code in a Route Handler or a Server Component?
              </p>
              <span className="toc-tag tag-next">edge</span>
            </div>
            <div className="qcard-body">
              <p className="qcard-answer">
                Middleware runs on the Edge Runtime at the CDN layer before the
                request reaches your application — before any route matching,
                Server Components, or Route Handlers execute. It receives a{" "}
                <code>NextRequest</code> and must return a{" "}
                <code>NextResponse</code> (rewrite, redirect, or pass through),
                making it the right place for logic that must run on every
                request with minimal latency: auth token validation, A/B test
                routing, geolocation-based redirects, and bot protection.
                Because it runs on the Edge Runtime, it has access only to the
                Web Fetch API and a constrained runtime — it cannot use Node.js
                APIs like <code>fs</code>, native database drivers, or most npm
                packages. A Route Handler (<code>route.ts</code>) runs in the
                full Node.js environment and is appropriate for full API
                endpoints with database access. A Server Component runs during
                the render phase and is appropriate for fetching data to hydrate
                HTML. A common pattern is to use Middleware only for fast,
                stateless routing decisions (verify JWT signature against a
                secret) and push any database lookups into Server Components or
                Route Handlers.
              </p>
              <div className="cb">
                <div className="cb-bar">
                  <span className="cb-filename">middleware.ts</span>
                  <span className="cb-lang">typescript</span>
                </div>
                <pre dangerouslySetInnerHTML={{ __html: q11Pre }} />
              </div>
            </div>
          </div>
        </div>

        {/* Q12 */}
        <div className="qcard" id="q12">
          <div className="qcard-inner">
            <div className="qcard-head">
              <span className="qcard-num">12</span>
              <p className="qcard-q">
                Explain the four caching layers in Next.js App Router and how
                they interact with each other.
              </p>
              <span className="toc-tag tag-next">caching</span>
            </div>
            <div className="qcard-body">
              <p className="qcard-answer">
                Next.js App Router has four distinct caching mechanisms that
                operate at different layers. The Request Memoization layer
                deduplicates identical <code>fetch()</code> calls made during a
                single render pass on the server — if two Server Components
                independently call the same API endpoint, only one network
                request is made; this is scoped to a single request lifecycle
                and is automatic. The Data Cache is a persistent server-side
                HTTP cache that stores <code>fetch</code> responses across
                requests and deployments, controlled by{" "}
                <code>{"{ cache: 'force-cache' }"}</code> (default) or{" "}
                <code>{"{ next: { revalidate: N } }"}</code> for time-based ISR;
                it persists until explicitly revalidated via{" "}
                <code>revalidatePath()</code> or <code>revalidateTag()</code>.
                The Full Route Cache stores the rendered HTML and RSC payload
                for statically generated routes at build time; dynamic routes
                bypass it. The Router Cache is a client-side in-memory cache of
                visited route segments that allows instant back/forward
                navigation without re-fetching from the server; it uses
                prefetched route data from <code>&lt;Link&gt;</code> components.
                A common gotcha is that <code>revalidatePath()</code> only
                clears the Data Cache and Full Route Cache on the server — users
                who have the old route in their Router Cache still see stale UI
                until they hard-refresh or the cache TTL expires.
              </p>
              <div className="callout">
                <p>
                  <strong>Production tip:</strong> use{" "}
                  <code>revalidateTag()</code> over{" "}
                  <code>revalidatePath()</code> for surgical cache busting — tag
                  each fetch with a domain tag (
                  <code>{"{ next: { tags: ['posts'] } }"}</code>) and invalidate
                  the whole domain when a mutation occurs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Q13 */}
        <div className="qcard" id="q13">
          <div className="qcard-inner">
            <div className="qcard-head">
              <span className="qcard-num">13</span>
              <p className="qcard-q">
                How do Next.js Server Actions work internally, and what security
                considerations must you design around?
              </p>
              <span className="toc-tag tag-next">mutations</span>
            </div>
            <div className="qcard-body">
              <p className="qcard-answer">
                Server Actions are async functions marked with{" "}
                <code>"use server"</code> that are compiled by Next.js into POST
                endpoints with auto-generated, encrypted action IDs — when
                called from the client, React serializes the arguments, sends a
                POST request to the current URL with the action ID, and
                deserializes the return value. They can be called from form{" "}
                <code>action</code> attributes (which works even before JS
                hydrates, providing progressive enhancement) or programmatically
                from event handlers. Internally, they participate in the React
                transition system, so the UI stays interactive and{" "}
                <code>useActionState</code> captures pending/error state
                automatically. The critical security consideration is that
                Server Actions are public HTTP endpoints — any user can call any
                action by its ID with arbitrary arguments. This means you must
                validate every argument server-side (never trust client input),
                authorize the current session on every action (re-check
                permissions, never assume the call came from a legitimate UI
                flow), and be aware that action IDs are stable across builds if
                the function doesn't change. You should also rate-limit action
                endpoints and validate <code>Content-Type</code> and{" "}
                <code>Origin</code> headers to prevent CSRF from third-party
                sites.
              </p>
              <div className="cb">
                <div className="cb-bar">
                  <span className="cb-filename">actions/posts.ts</span>
                  <span className="cb-lang">typescript</span>
                </div>
                <pre dangerouslySetInnerHTML={{ __html: q13Pre }} />
              </div>
            </div>
          </div>
        </div>

        {/* Q14 */}
        <div className="qcard" id="q14">
          <div className="qcard-inner">
            <div className="qcard-head">
              <span className="qcard-num">14</span>
              <p className="qcard-q">
                When should you use Route Handlers in Next.js, and how do you
                design the API layer in an App Router project?
              </p>
              <span className="toc-tag tag-next">api design</span>
            </div>
            <div className="qcard-body">
              <p className="qcard-answer">
                Route Handlers (<code>app/api/.../route.ts</code>) are Next.js's
                first-class API endpoints running in the full Node.js
                environment. In an App Router project, they are most necessary
                for four cases: serving external clients (mobile apps,
                third-party integrations) that can't use Server Actions;
                handling webhooks from external services; implementing OAuth
                callback flows; and serving streaming responses like SSE. For
                internal data fetching from your own Next.js UI, Server
                Components can call database/service functions directly —
                bypassing the HTTP layer entirely — which is more efficient and
                type-safe than going through a <code>/api</code> Route Handler.
                Server Actions replace the "POST to an internal API endpoint"
                pattern entirely. When you do design Route Handlers, structure
                them around resources and use standard HTTP semantics, apply
                authentication middleware consistently, validate request bodies
                with Zod, and return proper status codes. For complex APIs,
                consider co-locating route handlers alongside the feature they
                serve (<code>app/(api)/posts/[id]/route.ts</code>) rather than
                isolating them all in <code>app/api/</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Q15 */}
        <div className="qcard" id="q15">
          <div className="qcard-inner">
            <div className="qcard-head">
              <span className="qcard-num">15</span>
              <p className="qcard-q">
                What are Parallel Routes and Intercepting Routes in Next.js, and
                what UI patterns do they enable?
              </p>
              <span className="toc-tag tag-next">routing</span>
            </div>
            <div className="qcard-body">
              <p className="qcard-answer">
                Parallel Routes allow you to render multiple independent pages
                simultaneously within the same layout using named slots
                (directories prefixed with <code>@</code>). The layout receives
                each slot as a separate prop and can render them side-by-side —
                this enables dashboards where different panels load and refresh
                independently with their own loading and error states, or
                split-view UIs. Each slot is a fully independent route segment
                with its own Suspense boundary. Intercepting Routes (directories
                prefixed with <code>(..)</code> or <code>(...)</code>) allow you
                to "intercept" a navigation to show a different UI in the
                current context while preserving the destination URL. The
                canonical example is an Instagram-style photo modal: clicking a
                photo in a feed intercepts the navigation to{" "}
                <code>/photos/[id]</code> and renders it as a modal overlay on
                the feed page; navigating directly to <code>/photos/[id]</code>{" "}
                or refreshing shows the full photo page. Together, Parallel and
                Intercepting Routes are combined to implement the "modal as a
                route" pattern — the modal has a real URL, is shareable,
                supports back/forward navigation, and renders as a full page on
                direct access, all without complex client-side modal state
                management.
              </p>
            </div>
          </div>
        </div>

        {/* Q16 */}
        <div className="qcard" id="q16">
          <div className="qcard-inner">
            <div className="qcard-head">
              <span className="qcard-num">16</span>
              <p className="qcard-q">
                Design a complete authentication system in Next.js App Router —
                covering session storage, protected routes, and role-based
                access control.
              </p>
              <span className="toc-tag tag-next">auth</span>
            </div>
            <div className="qcard-body">
              <p className="qcard-answer">
                A production auth system in Next.js App Router uses Auth.js
                (NextAuth v5) as the foundation, configured with appropriate
                providers (OAuth, credentials, magic link). Sessions are stored
                in encrypted, <code>HttpOnly</code>, <code>Secure</code> cookies
                using JWT or database sessions — JWT sessions are stateless and
                scale without a session store, but can't be invalidated
                instantly; database sessions support instant revocation at the
                cost of a DB read per request. Route protection is layered:
                Middleware handles the coarse-grained redirect (unauthenticated
                users → <code>/login</code>) using only a fast cryptographic JWT
                check, keeping the edge fast. Server Components perform
                fine-grained authorization by calling <code>auth()</code> to get
                the session and checking roles or permissions before rendering
                sensitive data. Server Actions must re-verify auth on every call
                since they're public endpoints. For RBAC, permissions should be
                stored on the session object (or derived from it) to avoid a DB
                round-trip on every check — but the authoritative role data must
                be re-read on any mutation that requires up-to-date permissions.
                Never implement access control in client components alone; they
                are not a security boundary.
              </p>
              <div className="cb">
                <div className="cb-bar">
                  <span className="cb-filename">app/admin/page.tsx</span>
                  <span className="cb-lang">tsx</span>
                </div>
                <pre dangerouslySetInnerHTML={{ __html: q16Pre }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION D ── */}
        <div className="cat-divider">
          <div className="cat-divider-inner">
            <span className="cat-num">17 – 20</span>
            <span className="cat-title">Production System Design</span>
            <span className="toc-tag tag-sys cat-pill">system design</span>
          </div>
        </div>

        {/* Q17 */}
        <div className="qcard" id="q17">
          <div className="qcard-inner">
            <div className="qcard-head">
              <span className="qcard-num">17</span>
              <p className="qcard-q">
                How would you architect a large React/Next.js application as a
                monorepo, and what are the tradeoffs vs. a micro-frontend
                approach?
              </p>
              <span className="toc-tag tag-sys">architecture</span>
            </div>
            <div className="qcard-body">
              <p className="qcard-answer">
                A monorepo consolidates multiple packages (the Next.js app, a
                shared UI component library, shared utility functions, type
                definitions) into a single repository managed by a tool like
                Turborepo or Nx. The primary benefits are atomic commits across
                packages, shared TypeScript types without publishing,
                centralized dependency management, and a single CI pipeline with
                incremental task caching — Turborepo's build cache means only
                packages affected by a commit are rebuilt. The recommended
                structure separates <code>apps/</code> (deployable applications)
                from <code>packages/</code> (shared libraries), with each
                package having its own <code>package.json</code> and TypeScript
                config. A micro-frontend architecture instead deploys each
                feature as an independently deployable app, stitched together at
                runtime via Module Federation or at the CDN via edge
                composition. Micro-frontends solve genuine organizational scale
                problems — multiple teams owning independent deployments — but
                introduce significant complexity: shared state between apps,
                routing coordination, duplicated dependencies increasing bundle
                size, and debugging across deployment boundaries. For most
                organizations, a monorepo is the right choice; micro-frontends
                should only be considered when independent deployability per
                team is a hard requirement.
              </p>
            </div>
          </div>
        </div>

        {/* Q18 */}
        <div className="qcard" id="q18">
          <div className="qcard-inner">
            <div className="qcard-head">
              <span className="qcard-num">18</span>
              <p className="qcard-q">
                How do you implement real-time features in a Next.js application
                — comparing WebSockets, Server-Sent Events, and polling?
              </p>
              <span className="toc-tag tag-sys">real-time</span>
            </div>
            <div className="qcard-body">
              <p className="qcard-answer">
                The right real-time primitive depends on communication
                directionality and infrastructure constraints. Server-Sent
                Events (SSE) are unidirectional (server → client) over a
                standard HTTP connection, easy to implement in Next.js Route
                Handlers with <code>ReadableStream</code>, and automatically
                reconnect; they work through HTTP/2 multiplexing, proxies, and
                CDNs. SSE is the right choice for live notifications, activity
                feeds, and streaming AI responses. WebSockets are bidirectional
                and lower-latency, suited for collaborative editing, multiplayer
                features, and chat — but they require a persistent server
                connection which conflicts with serverless and Edge deployments;
                you typically need a dedicated WebSocket service (Ably, Pusher,
                Supabase Realtime, or a Node.js server). Polling (repeated{" "}
                <code>fetch</code> on an interval) is the simplest
                implementation and appropriate when latency of 5–30 seconds is
                acceptable — it works everywhere but wastes bandwidth. In
                Next.js, integrate real-time subscriptions in a client-side
                custom hook and combine with TanStack Query's{" "}
                <code>queryClient.setQueryData()</code> to merge real-time
                updates directly into the cache, keeping the rest of your data
                layer consistent.
              </p>
              <div className="cb">
                <div className="cb-bar">
                  <span className="cb-filename">app/api/stream/route.ts</span>
                  <span className="cb-lang">typescript</span>
                </div>
                <pre dangerouslySetInnerHTML={{ __html: q18Pre }} />
              </div>
            </div>
          </div>
        </div>

        {/* Q19 */}
        <div className="qcard" id="q19">
          <div className="qcard-inner">
            <div className="qcard-head">
              <span className="qcard-num">19</span>
              <p className="qcard-q">
                How would you design and build a scalable React component
                library for use across multiple Next.js applications?
              </p>
              <span className="toc-tag tag-sys">design system</span>
            </div>
            <div className="qcard-body">
              <p className="qcard-answer">
                A production-grade component library has distinct concerns
                across API design, build configuration, and distribution. For
                API design, components should follow the Open/Closed principle —
                expose a polymorphic <code>as</code> prop or use the Radix UI
                "asChild" pattern to let consumers change the underlying element
                without forking the component, and forward refs everywhere so
                host apps can imperatively access DOM nodes. Build-wise, you
                need to output both ESM and CJS from tools like tsup or Rollup,
                with separate <code>.d.ts</code> type declarations and a proper{" "}
                <code>exports</code> map in <code>package.json</code> for
                subpath imports. CSS-in-JS libraries that generate styles at
                runtime (Emotion, styled-components) create challenges in
                Next.js App Router Server Components; a CSS Modules or Tailwind
                approach is more compatible. For the token system, define design
                tokens as CSS custom properties so they cascade and are
                overridable without rebuilding the library. Version your
                components semantically, maintain a storybook for visual testing
                and documentation, and implement visual regression tests with
                Chromatic to catch unintended UI changes across component
                updates before they reach consumers.
              </p>
            </div>
          </div>
        </div>

        {/* Q20 */}
        <div className="qcard" id="q20">
          <div className="qcard-inner">
            <div className="qcard-head">
              <span className="qcard-num">20</span>
              <p className="qcard-q">
                How do you instrument a Next.js application for production
                observability — error tracking, performance monitoring, and
                logging?
              </p>
              <span className="toc-tag tag-sys">observability</span>
            </div>
            <div className="qcard-body">
              <p className="qcard-answer">
                Production observability covers three pillars: errors,
                performance metrics, and structured logs. For error tracking,
                Sentry is the standard — install <code>@sentry/nextjs</code> and
                its wizard configures source map uploading and wraps both the
                client and server automatically; the{" "}
                <code>instrumentation.ts</code> file (Next.js's official hook
                for server-side SDK initialization) is the correct place for
                server SDK setup. For performance, Next.js's built-in{" "}
                <code>useReportWebVitals</code> hook sends LCP, INP, and CLS to
                any analytics endpoint; for deeper tracing, OpenTelemetry
                integration in <code>instrumentation.ts</code> provides
                distributed traces across server components, route handlers, and
                database calls. Structured JSON logging on the server (using{" "}
                <code>pino</code> or <code>winston</code>) is essential for
                searchable logs in platforms like Datadog or Grafana Loki —
                always include request ID, route, user ID, and duration in every
                log entry. Client-side, the <code>web-vitals</code> package
                provides exact metric values for real-user monitoring. Finally,
                Next.js's <code>experimental.instrumentationHook</code> combined
                with OpenTelemetry lets you trace the entire request lifecycle
                from Middleware through Server Components to database calls in a
                single distributed trace, which is invaluable for diagnosing
                latency regressions in production.
              </p>
              <div className="cb">
                <div className="cb-bar">
                  <span className="cb-filename">instrumentation.ts</span>
                  <span className="cb-lang">typescript</span>
                </div>
                <pre dangerouslySetInnerHTML={{ __html: q20Pre }} />
              </div>
              <div className="callout good">
                <p>
                  <strong>Best practice:</strong> always upload source maps to
                  Sentry and add them to <code>.gitignore</code> /{" "}
                  <code>.vercelignore</code> so stack traces in production show
                  original TypeScript line numbers, not minified bundle offsets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <div className="footer">
        <div className="footer-left">
          <span className="footer-logo">React &amp; Next.js</span>
          <span className="footer-sep">|</span>
          <span className="footer-desc">
            // advanced interview preparation guide
          </span>
        </div>
        <div className="footer-right">
          20 questions · Advanced &amp; System Design
          <br />
          React 19 · Next.js 15 · App Router
        </div>
      </div>
    </>
  );
}
