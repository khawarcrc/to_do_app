import { Fragment } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advanced React & Next.js — System Design Interview Guide",
  description:
    "20 advanced interview questions covering React internals, concurrent features, Next.js architecture, performance, and production system design.",
};

/* ═══════════════════════════════════════════════════════════
   TYPES — pure JSON data structures, zero HTML
   ═══════════════════════════════════════════════════════════ */
type Seg = string | { c: string } | { b: string };
type CodeTok = string | [string, string];

interface Question {
  id: number;
  question: Seg[];
  answer: Seg[];
  tag: string;
  tagType: string;
  code: { file: string; lang: string; lines: CodeTok[][] } | null;
  callout: { type: string; content: Seg[] } | null;
}

/* ═══════════════════════════════════════════════════════════
   Minimal CSS — only things Tailwind cannot express inline:
   font imports, inline-code styling, tag badges, callouts,
   and syntax-highlight token colors.
   ═══════════════════════════════════════════════════════════ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300&family=JetBrains+Mono:wght@300;400;500;700&family=Epilogue:wght@300;400;500;700&display=swap');

body { overflow: auto !important; height: auto !important; }

.ff-display { font-family: 'Fraunces', serif; }
.ff-mono    { font-family: 'JetBrains Mono', monospace; }
.ff-body    { font-family: 'Epilogue', sans-serif; }

.ic {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  background: var(--bg-hover);
  border: 1px solid var(--border-default);
  padding: 1px 6px;
  border-radius: 3px;
  color: var(--accent);
}

.cb-dot::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #3fb950;
}

/* tag badge colors — theme-aware */
:root {
  --tag-react-bg: rgba(12,102,228,0.08);
  --tag-react-text: #0c66e4;
  --tag-react-border: rgba(12,102,228,0.18);
  --tag-next-bg: rgba(207,92,17,0.08);
  --tag-next-text: #cf5c11;
  --tag-next-border: rgba(207,92,17,0.18);
  --tag-sys-bg: rgba(26,127,55,0.08);
  --tag-sys-text: #1a7f37;
  --tag-sys-border: rgba(26,127,55,0.18);
  --tag-perf-bg: rgba(130,80,223,0.08);
  --tag-perf-text: #8250df;
  --tag-perf-border: rgba(130,80,223,0.18);
  --callout-warn-border: #9a6700;
  --callout-warn-bg: rgba(154,103,0,0.06);
  --callout-warn-text: #9a6700;
  --callout-info-border: #0c66e4;
  --callout-info-bg: rgba(12,102,228,0.06);
  --callout-info-text: #0c66e4;
  --callout-good-border: #1a7f37;
  --callout-good-bg: rgba(26,127,55,0.06);
  --callout-good-text: #1a7f37;
}
.dark {
  --tag-react-bg: rgba(88,166,255,0.12);
  --tag-react-text: #58a6ff;
  --tag-react-border: rgba(88,166,255,0.2);
  --tag-next-bg: rgba(247,129,102,0.12);
  --tag-next-text: #f78166;
  --tag-next-border: rgba(247,129,102,0.2);
  --tag-sys-bg: rgba(63,185,80,0.12);
  --tag-sys-text: #3fb950;
  --tag-sys-border: rgba(63,185,80,0.2);
  --tag-perf-bg: rgba(210,168,255,0.12);
  --tag-perf-text: #d2a8ff;
  --tag-perf-border: rgba(210,168,255,0.2);
  --callout-warn-border: #e3b341;
  --callout-warn-bg: rgba(227,179,65,0.06);
  --callout-warn-text: #e3b341;
  --callout-info-border: #58a6ff;
  --callout-info-bg: rgba(88,166,255,0.06);
  --callout-info-text: #58a6ff;
  --callout-good-border: #3fb950;
  --callout-good-bg: rgba(63,185,80,0.06);
  --callout-good-text: #3fb950;
}

.tag-react { background: var(--tag-react-bg); color: var(--tag-react-text); border: 1px solid var(--tag-react-border); }
.tag-next  { background: var(--tag-next-bg);  color: var(--tag-next-text);  border: 1px solid var(--tag-next-border); }
.tag-sys   { background: var(--tag-sys-bg);   color: var(--tag-sys-text);   border: 1px solid var(--tag-sys-border); }
.tag-perf  { background: var(--tag-perf-bg);  color: var(--tag-perf-text);  border: 1px solid var(--tag-perf-border); }

/* callouts */
.callout {
  margin: 16px 0 4px;
  padding: 14px 18px;
  border-left: 3px solid var(--callout-warn-border);
  background: var(--callout-warn-bg);
  border-radius: 0 3px 3px 0;
}
.callout p {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.7;
}
.callout strong { color: var(--callout-warn-text); font-weight: 500; }
.callout .ic { font-size: 11px; }
.callout.info { border-color: var(--callout-info-border); background: var(--callout-info-bg); }
.callout.info strong { color: var(--callout-info-text); }
.callout.good { border-color: var(--callout-good-border); background: var(--callout-good-bg); }
.callout.good strong { color: var(--callout-good-text); }

/* syntax tokens */
.kw   { color: #ff7b72; }
.fn   { color: #d2a8ff; }
.str  { color: #a5d6ff; }
.num  { color: #f2cc60; }
.cmt  { color: #8b949e; font-style: italic; }
.tag  { color: #7ee787; }
.attr { color: #79c0ff; }
.tp   { color: #ffa657; }
.op   { color: #ff7b72; }

@media print {
  [id^="q"] { page-break-inside: avoid; }
}
`;

/* ═══════════════════════════════════════════════════════════
   PAGE DATA — 100% pure JSON, zero HTML strings
   ═══════════════════════════════════════════════════════════ */
const PAGE_DATA = {
  cover: {
    badge: "Advanced \u00b7 System Design",
    titleLine1: "React &",
    titleAccent: "Next.js",
    titleLine2: "Deep Dive",
    sub: "// 20 advanced interview questions",
    desc: "Architecture, internals, performance, and production system design \u2014 the questions that separate senior engineers from mid-level ones.",
    stats: [
      { value: "20", label: "Questions" },
      { value: "12", label: "React Core" },
      { value: "8", label: "Next.js" },
    ],
  },
  toc: [
    { num: "01", title: "React Fiber & Concurrent Rendering", tag: "react", tagType: "react" },
    { num: "02", title: "Reconciliation & the Diffing Algorithm", tag: "react", tagType: "react" },
    { num: "03", title: "Transitions & useDeferredValue", tag: "react", tagType: "react" },
    { num: "04", title: "Suspense & Streaming SSR", tag: "react", tagType: "react" },
    { num: "05", title: "React 19 \u2014 useOptimistic & useActionState", tag: "react", tagType: "react" },
    { num: "06", title: "State Management Architecture", tag: "system", tagType: "sys" },
    { num: "07", title: "Render & Re-render Optimization", tag: "perf", tagType: "perf" },
    { num: "08", title: "Code Splitting & Bundle Strategy", tag: "perf", tagType: "perf" },
    { num: "09", title: "React Query / Server State Management", tag: "react", tagType: "react" },
    { num: "10", title: "Compound Components & Advanced Patterns", tag: "react", tagType: "react" },
    { num: "11", title: "Next.js Middleware & Edge Runtime", tag: "next", tagType: "next" },
    { num: "12", title: "Caching Layers in Next.js", tag: "next", tagType: "next" },
    { num: "13", title: "Server Actions & Mutations", tag: "next", tagType: "next" },
    { num: "14", title: "Route Handlers & API Layer Design", tag: "next", tagType: "next" },
    { num: "15", title: "Parallel & Intercepting Routes", tag: "next", tagType: "next" },
    { num: "16", title: "Authentication Patterns in Next.js", tag: "next", tagType: "next" },
    { num: "17", title: "Monorepo & Micro-frontend Architecture", tag: "system", tagType: "sys" },
    { num: "18", title: "Real-time UI: WebSockets & SSE", tag: "system", tagType: "sys" },
    { num: "19", title: "Designing a Component Library", tag: "system", tagType: "sys" },
    { num: "20", title: "Observability & Error Tracking", tag: "system", tagType: "sys" },
  ],
  categories: [
    { startQ: 1, range: "01 \u2013 05", title: "React Internals & Concurrent Features", tagType: "react", tagLabel: "react core" },
    { startQ: 6, range: "06 \u2013 10", title: "Architecture & Performance Patterns", tagType: "sys", tagLabel: "system design" },
    { startQ: 11, range: "11 \u2013 16", title: "Next.js Deep Internals", tagType: "next", tagLabel: "next.js" },
    { startQ: 17, range: "17 \u2013 20", title: "Production System Design", tagType: "sys", tagLabel: "system design" },
  ],
  questions: [
    // ── Q1 ──
    {
      id: 1,
      question: ["What is the React Fiber architecture, and why was it a fundamental rewrite of the original reconciler?"],
      answer: [
        "React Fiber, introduced in React 16, replaced the original stack-based reconciler with a linked-list data structure where each component instance maps to a \u201cfiber\u201d node containing its type, props, state, effect list, and pointers to its child, sibling, and parent fibers. The critical problem with the original reconciler was that the diffing of a large component tree was a single synchronous, uninterruptible call stack traversal \u2014 on slow devices, this would block the main thread and drop frames. Fiber breaks that traversal into small units of work that can be paused, resumed, aborted, and prioritized using a scheduler that integrates with the browser\u2019s ",
        { c: "requestIdleCallback" },
        " API. React maintains two fiber trees simultaneously \u2014 the current tree (what\u2019s on screen) and the work-in-progress tree (what\u2019s being computed) \u2014 committing the new tree atomically only when all work is complete, a technique called double buffering. This architecture is what enables all of Concurrent Mode\u2019s features: time-slicing, Suspense, transitions, and streaming SSR.",
      ],
      tag: "internals",
      tagType: "react",
      code: {
        file: "fiber-node.ts",
        lang: "typescript",
        lines: [
          [["cmt", "// Simplified Fiber node shape"]],
          [["kw", "interface"], " ", ["tp", "FiberNode"], " {"],
          ["  tag:           ", ["tp", "WorkTag"], ";        ", ["cmt", "// FunctionComponent, HostComponent, etc."]],
          ["  type:          ", ["tp", "any"], ";            ", ["cmt", "// e.g. 'div' | MyComponent"]],
          ["  stateNode:     ", ["tp", "any"], ";            ", ["cmt", "// DOM node or class instance"]],
          ["  pendingProps:  ", ["tp", "Props"], ";"],
          ["  memoizedProps: ", ["tp", "Props"], ";"],
          ["  memoizedState: ", ["tp", "Hook"], " | ", ["kw", "null"], ";   ", ["cmt", "// hook linked list for function components"]],
          ["  child:         ", ["tp", "FiberNode"], " | ", ["kw", "null"], ";"],
          ["  sibling:       ", ["tp", "FiberNode"], " | ", ["kw", "null"], ";"],
          ["  return:        ", ["tp", "FiberNode"], " | ", ["kw", "null"], "; ", ["cmt", "// parent"]],
          ["  alternate:     ", ["tp", "FiberNode"], " | ", ["kw", "null"], "; ", ["cmt", "// double buffer pair"]],
          ["  lanes:         ", ["tp", "Lanes"], ";           ", ["cmt", "// scheduled priority bitmask"]],
          ["  flags:         ", ["tp", "Flags"], ";           ", ["cmt", "// Placement | Update | Deletion"]],
          ["}"],
        ],
      },
      callout: null,
    },
    // ── Q2 ──
    {
      id: 2,
      question: ["How does React\u2019s reconciliation algorithm work, and what are the assumptions it makes to achieve O(n) complexity?"],
      answer: [
        "A naive tree diffing algorithm comparing two arbitrary trees has O(n\u00b3) time complexity, which is prohibitive for UI trees. React\u2019s reconciler achieves O(n) by making two heuristic assumptions: first, elements of different types produce entirely different trees, so React tears down the old tree and builds a new one from scratch when the root element type changes rather than diffing children. Second, developers signal element identity across renders using the ",
        { c: "key" },
        " prop \u2014 without a key, React matches elements by position, which breaks on reordering; with a stable key, React can track which item moved, was added, or was removed in a list efficiently. The algorithm walks the tree level-by-level (breadth-first), comparing each fiber by type: same type means update in place (reconcile props), different type means unmount and remount. Understanding this is critical for performance \u2014 placing components conditionally can cause expensive unmount/remount cycles instead of cheap in-place updates if the element type or key position changes.",
      ],
      tag: "internals",
      tagType: "react",
      code: {
        file: "reconciliation-pitfall.tsx",
        lang: "tsx",
        lines: [
          [["cmt", "// \u274c BAD: type changes \u2192 full unmount/remount every toggle"]],
          ["{isAdmin ? ", ["tag", "<AdminPanel"], " /> : ", ["tag", "<UserPanel"], " />}"],
          [""],
          [["cmt", "// \u2705 GOOD: same type, only props change \u2192 in-place update"]],
          [["tag", "<Panel"], " ", ["attr", "variant"], "={isAdmin ? ", ["str", "\"admin\""], " : ", ["str", "\"user\""], "} />"],
          [""],
          [["cmt", "// \u274c BAD: index key breaks reconciliation on sort/filter"]],
          ["items.", ["fn", "map"], "((item, i) => ", ["tag", "<Row"], " ", ["attr", "key"], "={i} {...item} />)"],
          [""],
          [["cmt", "// \u2705 GOOD: stable identity key"]],
          ["items.", ["fn", "map"], "(item => ", ["tag", "<Row"], " ", ["attr", "key"], "={item.id} {...item} />)"],
        ],
      },
      callout: null,
    },
    // ── Q3 ──
    {
      id: 3,
      question: [
        "What are React Transitions (",
        { c: "useTransition" },
        " and ",
        { c: "startTransition" },
        "), and how do they differ from ",
        { c: "useDeferredValue" },
        "?",
      ],
      answer: [
        { c: "startTransition" },
        " marks a state update as non-urgent, telling React\u2019s scheduler that it can be interrupted by higher-priority updates like user input. This is used to keep the UI responsive during expensive state transitions \u2014 for example, filtering a large dataset where you want the input to feel instant while the list update can lag slightly. ",
        { c: "useTransition" },
        " is the hook version that also returns an ",
        { c: "isPending" },
        " boolean, allowing you to show a loading indicator while the transition is in progress without blocking the current UI. ",
        { c: "useDeferredValue" },
        " is semantically different: instead of wrapping a state setter, you wrap a derived value, and React may render the component with the old deferred value while the new value is still being calculated \u2014 useful when you receive props you can\u2019t wrap in ",
        { c: "startTransition" },
        ". A key rule: transitions work only with React state and state-derived renders, not with native DOM input values, so the controlled input\u2019s state update must remain urgent while only the expensive downstream computation is deferred.",
      ],
      tag: "concurrent",
      tagType: "react",
      code: {
        file: "search-with-transition.tsx",
        lang: "tsx",
        lines: [
          [["kw", "function"], " ", ["fn", "Search"], "() {"],
          ["  ", ["kw", "const"], " [query, setQuery] = ", ["fn", "useState"], "(", ["str", "\"\""], ");"],
          ["  ", ["kw", "const"], " [results, setResults] = ", ["fn", "useState"], "([]);"],
          ["  ", ["kw", "const"], " [isPending, startTransition] = ", ["fn", "useTransition"], "();"],
          [""],
          ["  ", ["kw", "const"], " ", ["fn", "handleChange"], " = (e: ", ["tp", "ChangeEvent<HTMLInputElement>"], ") => {"],
          ["    setQuery(e.target.value);              ", ["cmt", "// urgent \u2014 keep input snappy"]],
          ["    ", ["fn", "startTransition"], "(() => {"],
          ["      setResults(", ["fn", "heavyFilter"], "(e.target.value)); ", ["cmt", "// non-urgent"]],
          ["    });"],
          ["  };"],
          [""],
          ["  ", ["kw", "return"], " ("],
          ["    ", ["tag", "<>"]],
          ["      ", ["tag", "<input"], " ", ["attr", "value"], "={query} ", ["attr", "onChange"], "={handleChange} />"],
          ["      {isPending && ", ["tag", "<Spinner"], " />}"],
          ["      ", ["tag", "<ResultList"], " ", ["attr", "items"], "={results} />"],
          ["    ", ["tag", "</>"]],
          ["  );"],
          ["}"],
        ],
      },
      callout: null,
    },
    // ── Q4 ──
    {
      id: 4,
      question: ["How does React Suspense work at a deep level, and what does Streaming SSR actually mean in Next.js?"],
      answer: [
        "Suspense works by having a child component \u201cthrow\u201d a Promise during rendering \u2014 a contract that React\u2019s concurrent renderer understands. React catches the thrown Promise, renders the nearest ",
        { c: "<Suspense>" },
        " boundary\u2019s fallback, and subscribes to the Promise; when it resolves, React re-renders the subtree. This is how ",
        { c: "React.lazy" },
        " enables code splitting and how data-fetching frameworks like Relay integrate. In Next.js, Streaming SSR extends this to the server: instead of waiting for all server-side data fetching to finish before sending any HTML (the traditional SSR waterfall), Next.js streams the HTML shell immediately and sends each Suspense boundary\u2019s content as its data resolves, via HTTP chunked transfer encoding. The browser progressively renders each chunk as it arrives, dramatically reducing Time to First Byte (TTFB) and Time to Interactive (TTI) for data-heavy pages. This is powered by React\u2019s ",
        { c: "renderToPipeableStream" },
        " (Node.js) and ",
        { c: "renderToReadableStream" },
        " (Edge) APIs.",
      ],
      tag: "concurrent",
      tagType: "react",
      code: {
        file: "app/dashboard/page.tsx",
        lang: "tsx",
        lines: [
          [["cmt", "// HTML shell renders instantly; each boundary streams in"]],
          [["kw", "export default function"], " ", ["fn", "Dashboard"], "() {"],
          ["  ", ["kw", "return"], " ("],
          ["    ", ["tag", "<main>"]],
          ["      ", ["tag", "<Header"], " />                     {", ["cmt", "/* static \u2014 renders immediately */"], "}"],
          ["      ", ["tag", "<Suspense"], " ", ["attr", "fallback"], "=", ["str", "<MetricsSkeleton />"], ">"],
          ["        ", ["tag", "<MetricsPanel"], " />              {", ["cmt", "/* streams when DB query resolves */"], "}"],
          ["      ", ["tag", "</Suspense>"]],
          ["      ", ["tag", "<Suspense"], " ", ["attr", "fallback"], "=", ["str", "<FeedSkeleton />"], ">"],
          ["        ", ["tag", "<ActivityFeed"], " />              {", ["cmt", "/* streams independently */"], "}"],
          ["      ", ["tag", "</Suspense>"]],
          ["    ", ["tag", "</main>"]],
          ["  );"],
          ["}"],
        ],
      },
      callout: {
        type: "info",
        content: [
          { b: "Key insight:" },
          " wrapping each slow data-fetching component in its own Suspense boundary means they stream in parallel \u2014 the slowest component no longer holds up everything else.",
        ],
      },
    },
    // ── Q5 ──
    {
      id: 5,
      question: [
        "What are ",
        { c: "useOptimistic" },
        " and ",
        { c: "useActionState" },
        " in React 19, and how do they change how you handle mutations?",
      ],
      answer: [
        { c: "useOptimistic" },
        " lets you immediately show an assumed-success state while an async mutation is in flight, rolling back automatically if the mutation fails. This eliminates the manual boilerplate of tracking optimistic state alongside real state \u2014 you pass it the real state and a reducer that computes the optimistic view, and React handles the reconciliation when the server responds. ",
        { c: "useActionState" },
        " (formerly ",
        { c: "useFormState" },
        ") is designed for form-based mutations \u2014 it wraps an async action function and returns the current state, the action handler, and an ",
        { c: "isPending" },
        " flag. Together with HTML ",
        { c: "<form action={...}>" },
        " (which React 19 natively supports), these hooks make form mutations fully declarative with no manual loading/error state management. Critically, these patterns work with both Server Actions and client-side async functions, and they integrate with React\u2019s transition system so the UI stays interactive during the mutation.",
      ],
      tag: "react 19",
      tagType: "react",
      code: {
        file: "like-button.tsx",
        lang: "tsx",
        lines: [
          [["str", "\"use client\""], ";"],
          [""],
          [["kw", "async function"], " ", ["fn", "toggleLike"], "(postId: ", ["tp", "string"], "): ", ["tp", "Promise<void>"], " {"],
          ["  ", ["kw", "await"], " ", ["fn", "fetch"], "(", ["str", "`/api/posts/${postId}/like`"], ", { method: ", ["str", "\"POST\""], " });"],
          ["}"],
          [""],
          [["kw", "function"], " ", ["fn", "LikeButton"], "({ postId, initialLikes }: ", ["tp", "Props"], ") {"],
          ["  ", ["kw", "const"], " [likes, setLikes] = ", ["fn", "useState"], "(initialLikes);"],
          ["  ", ["kw", "const"], " [optimisticLikes, addOptimistic] = ", ["fn", "useOptimistic"], "("],
          ["    likes,"],
          ["    (current, delta: ", ["tp", "number"], ") => current + delta"],
          ["  );"],
          [""],
          ["  ", ["kw", "return"], " ("],
          ["    ", ["tag", "<button"]],
          ["      ", ["attr", "onClick"], "={", ["kw", "async"], " () => {"],
          ["        ", ["fn", "addOptimistic"], "(", ["num", "1"], ");          ", ["cmt", "// instant UI update"]],
          ["        ", ["kw", "await"], " ", ["fn", "toggleLike"], "(postId); ", ["cmt", "// real mutation"]],
          ["        ", ["fn", "setLikes"], "(l => l + ", ["num", "1"], ");    ", ["cmt", "// confirm real state"]],
          ["      }}"],
          ["    >"],
          ["      \u2665 {optimisticLikes}"],
          ["    ", ["tag", "</button>"]],
          ["  );"],
          ["}"],
        ],
      },
      callout: null,
    },
    // ── Q6 ──
    {
      id: 6,
      question: ["How do you choose between local state, Context, Zustand, and a server-state library like TanStack Query? Design the state layer for a large app."],
      answer: [
        "The first distinction to make is between server state (remote data that lives on a server and must be fetched, cached, and synchronized) and client state (UI state that lives entirely in the browser, like modal open/closed or a selected tab). Server state should be managed by a dedicated library like TanStack Query or SWR \u2014 they handle caching, background revalidation, deduplication, optimistic updates, and race conditions in ways that ",
        { c: "useEffect" },
        "-based manual fetching never will. Client state should start as local component state and only be lifted or globalized when multiple unrelated components genuinely need it. For shared client state, React Context is sufficient for low-frequency updates like theme or auth user, but it is not optimized for high-frequency updates because all consumers re-render on any change. For more complex or high-frequency shared client state, a fine-grained store like Zustand or Jotai is appropriate \u2014 they use subscriptions that re-render only the components that read the changed slice. A mature large-scale app typically uses TanStack Query for all server state, Zustand for shared client state, and local ",
        { c: "useState" },
        "/",
        { c: "useReducer" },
        " for everything else.",
      ],
      tag: "architecture",
      tagType: "sys",
      code: {
        file: "state-architecture.ts",
        lang: "typescript",
        lines: [
          [["cmt", "// Layer 1: Server State \u2014 TanStack Query"]],
          [["kw", "const"], " { data: user } = ", ["fn", "useQuery"], "({"],
          ["  queryKey: [", ["str", "'user'"], ", userId],"],
          ["  queryFn: () => ", ["fn", "fetchUser"], "(userId),"],
          ["  staleTime: ", ["num", "5"], " * ", ["num", "60"], " * ", ["num", "1000"], ",   ", ["cmt", "// 5 min cache"]],
          ["});"],
          [""],
          [["cmt", "// Layer 2: Global Client State \u2014 Zustand"]],
          [["kw", "const"], " useUIStore = ", ["fn", "create"], "<", ["tp", "UIState"], ">()((set) => ({"],
          ["  sidebarOpen: ", ["kw", "false"], ","],
          ["  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),"],
          ["}));"],
          [""],
          [["cmt", "// Layer 3: Local \u2014 useState stays local"]],
          [["kw", "const"], " [tab, setTab] = ", ["fn", "useState"], "(", ["str", "\"overview\""], ");"],
        ],
      },
      callout: null,
    },
    // ── Q7 ──
    {
      id: 7,
      question: ["Walk through a systematic approach to diagnosing and fixing excessive re-renders in a React application."],
      answer: [
        "The first tool is React DevTools Profiler \u2014 record an interaction, then inspect which components re-rendered and why (it shows \u201crendered because props changed\u201d, \u201crendered because parent rendered\u201d, etc.). The most common cause of wasted renders is an unstable reference passed as a prop: a new object or array literal ",
        { c: "{}" },
        " / ",
        { c: "[]" },
        " or an inline function created during a parent\u2019s render has a new identity on every render, defeating ",
        { c: "React.memo" },
        "\u2019s shallow comparison. Fix these with ",
        { c: "useMemo" },
        " for objects/arrays and ",
        { c: "useCallback" },
        " for functions \u2014 but only after profiling confirms the component is expensive to re-render. The second common cause is Context value instability: if you pass an inline object to a Provider\u2019s ",
        { c: "value" },
        " prop, all consumers re-render on every provider re-render regardless of whether relevant data changed; fix by memoizing the context value with ",
        { c: "useMemo" },
        " or splitting into separate contexts for different update frequencies. For lists, ensure keys are stable and use virtualization (TanStack Virtual) once items exceed a few hundred. Finally, state colocation \u2014 moving state down to the leaf component that actually uses it \u2014 is often the highest-leverage fix because it narrows the re-render blast radius without any memoization overhead.",
      ],
      tag: "performance",
      tagType: "perf",
      code: {
        file: "stable-context.tsx",
        lang: "tsx",
        lines: [
          [["cmt", "// \u274c New object reference every render \u2192 all consumers re-render"]],
          [["tag", "<Ctx.Provider"], " ", ["attr", "value"], "={{ user, logout }} />"],
          [""],
          [["cmt", "// \u2705 Memoize context value"]],
          [["kw", "const"], " value = ", ["fn", "useMemo"], "("],
          ["  () => ({ user, logout }),"],
          ["  [user, logout]    ", ["cmt", "// only changes when user or logout changes"]],
          [");"],
          [["tag", "<Ctx.Provider"], " ", ["attr", "value"], "={value} />"],
          [""],
          [["cmt", "// \u2705 Or split contexts by update frequency"]],
          [["tag", "<UserCtx.Provider"], " ", ["attr", "value"], "={user}>"],
          ["  ", ["tag", "<AuthActionsCtx.Provider"], " ", ["attr", "value"], "={stableActions}>"],
          ["    {children}"],
          ["  ", ["tag", "</AuthActionsCtx.Provider>"]],
          [["tag", "</UserCtx.Provider>"]],
        ],
      },
      callout: null,
    },
    // ── Q8 ──
    {
      id: 8,
      question: ["How does code splitting work in React and Next.js, and how do you design a bundle splitting strategy for a large application?"],
      answer: [
        "Webpack and Turbopack (Next.js\u2019s bundler) use dynamic ",
        { c: "import()" },
        " expressions as split points, emitting a separate chunk for each one that is only downloaded when needed. In React, ",
        { c: "React.lazy(() => import('./Modal'))" },
        " paired with ",
        { c: "Suspense" },
        " defers a component\u2019s chunk until the first render. Next.js handles route-level splitting automatically in both the Pages and App Router \u2014 each route segment gets its own JS bundle. The design decisions concern what to split beyond route boundaries: heavy third-party libraries that are not needed on the initial render (chart libraries, rich text editors, date pickers) are prime candidates for lazy loading. In the App Router, marking a component ",
        { c: "\"use client\"" },
        " already scopes it out of the server bundle; within client components, ",
        { c: "dynamic(() => import(...), { ssr: false })" },
        " prevents SSR for browser-only modules like D3 or Mapbox. You can analyze your bundles with ",
        { c: "@next/bundle-analyzer" },
        " to find unexpected large dependencies and duplication across chunks, then use ",
        { c: "optimizePackageImports" },
        " in ",
        { c: "next.config.js" },
        " to enable tree-shaking for libraries that don\u2019t support it natively.",
      ],
      tag: "performance",
      tagType: "perf",
      code: {
        file: "dynamic-import.tsx",
        lang: "tsx",
        lines: [
          [["kw", "import"], " dynamic ", ["kw", "from"], " ", ["str", "'next/dynamic'"], ";"],
          [""],
          [["cmt", "// Deferred: only loads when rendered"]],
          [["kw", "const"], " RichEditor = ", ["fn", "dynamic"], "("],
          ["  () => ", ["kw", "import"], "(", ["str", "'@/components/RichEditor'"], "),"],
          ["  { loading: () => ", ["tag", "<EditorSkeleton"], " />, ssr: ", ["kw", "false"], " }"],
          [");"],
          [""],
          [["cmt", "// next.config.js \u2014 tree-shake large icon libs"]],
          [["kw", "const"], " config = {"],
          ["  experimental: {"],
          ["    optimizePackageImports: [", ["str", "'lucide-react'"], ", ", ["str", "'@heroicons/react'"], "]"],
          ["  }"],
          ["};"],
        ],
      },
      callout: null,
    },
    // ── Q9 ──
    {
      id: 9,
      question: ["How does TanStack Query manage server state, and how do you design cache invalidation and synchronization strategies?"],
      answer: [
        "TanStack Query (React Query) represents each piece of server state as a cache entry identified by a ",
        { c: "queryKey" },
        " array. When a query\u2019s data ages beyond ",
        { c: "staleTime" },
        ", it is marked stale and will be refetched in the background on the next mount, window focus, or network reconnect \u2014 the component is never left with a loading spinner, it renders stale data immediately while fresh data arrives. Mutations use ",
        { c: "useMutation" },
        " and their ",
        { c: "onSuccess" },
        " callback is the primary place for cache invalidation via ",
        { c: "queryClient.invalidateQueries({ queryKey: [...] })" },
        ", which marks matching entries stale and triggers background refetches. For instant UI feedback, optimistic updates can be implemented in ",
        { c: "onMutate" },
        " with a rollback in ",
        { c: "onError" },
        ". At scale, the key design decision is query key structure \u2014 using hierarchical keys like ",
        { c: "['posts', { page, filter }]" },
        " enables precise or broad invalidation: ",
        { c: "['posts']" },
        " as the invalidation key invalidates all post-related queries. In Next.js App Router, TanStack Query\u2019s ",
        { c: "prefetchQuery" },
        " and ",
        { c: "HydrationBoundary" },
        " allow you to prefetch on the server and hydrate on the client with zero loading state on first render.",
      ],
      tag: "server state",
      tagType: "react",
      code: null,
      callout: null,
    },
    // ── Q10 ──
    {
      id: 10,
      question: ["What are Compound Components and the Render Props pattern? When are they the right architectural choice?"],
      answer: [
        "The Compound Component pattern models a group of related components that share implicit state through Context \u2014 similar to how ",
        { c: "<select>" },
        " and ",
        { c: "<option>" },
        " work natively. The parent component owns and provides the shared state; child components consume it via context without any explicit prop-drilling. This gives consumers declarative, flexible composition \u2014 they can reorder, omit, or augment child components freely, unlike a monolithic component controlled by a single ",
        { c: "config" },
        " prop. The Render Props pattern passes a function as a prop (or as ",
        { c: "children" },
        ") and calls it with internal state, giving the consumer full control over rendering. In modern React, custom hooks largely replace render props since they extract the logic without influencing the component hierarchy, which is cleaner. Compound components remain the right choice when the API is inherently structural and compositional \u2014 ",
        { c: "<Tabs>" },
        ", ",
        { c: "<Accordion>" },
        ", ",
        { c: "<Select>" },
        ", ",
        { c: "<Menu>" },
        " \u2014 especially in component libraries where consumers must be able to slot in their own markup within the structure.",
      ],
      tag: "patterns",
      tagType: "react",
      code: {
        file: "tabs-compound.tsx",
        lang: "tsx",
        lines: [
          [["kw", "const"], " TabsCtx = ", ["fn", "createContext"], "<", ["tp", "TabsContextType"], ">(", ["kw", "null"], "!);"],
          [""],
          [["kw", "function"], " ", ["fn", "Tabs"], "({ children, defaultTab }: ", ["tp", "TabsProps"], ") {"],
          ["  ", ["kw", "const"], " [active, setActive] = ", ["fn", "useState"], "(defaultTab);"],
          ["  ", ["kw", "return"], " ", ["tag", "<TabsCtx.Provider"], " ", ["attr", "value"], "={{ active, setActive }}>{children}", ["tag", "</TabsCtx.Provider>"], ";"],
          ["}"],
          [""],
          [["fn", "Tabs"], ".Tab = ", ["kw", "function"], " ", ["fn", "Tab"], "({ id, children }: ", ["tp", "TabProps"], ") {"],
          ["  ", ["kw", "const"], " { active, setActive } = ", ["fn", "useContext"], "(TabsCtx);"],
          ["  ", ["kw", "return"], " ", ["tag", "<button"], " ", ["attr", "aria-selected"], "={active === id} ", ["attr", "onClick"], "={() => ", ["fn", "setActive"], "(id)}>{children}", ["tag", "</button>"], ";"],
          ["};"],
          [""],
          [["fn", "Tabs"], ".Panel = ", ["kw", "function"], " ", ["fn", "Panel"], "({ id, children }: ", ["tp", "PanelProps"], ") {"],
          ["  ", ["kw", "const"], " { active } = ", ["fn", "useContext"], "(TabsCtx);"],
          ["  ", ["kw", "return"], " active === id ? ", ["tag", "<>"], "{children}", ["tag", "</>"], " : ", ["kw", "null"], ";"],
          ["};"],
          [""],
          [["cmt", "// Usage \u2014 consumer controls composition"]],
          [["tag", "<Tabs"], " ", ["attr", "defaultTab"], "=", ["str", "\"overview\""], ">"],
          ["  ", ["tag", "<Tabs.Tab"], " ", ["attr", "id"], "=", ["str", "\"overview\""], ">Overview", ["tag", "</Tabs.Tab>"]],
          ["  ", ["tag", "<Tabs.Panel"], " ", ["attr", "id"], "=", ["str", "\"overview\""], ">", ["tag", "<OverviewContent"], " />", ["tag", "</Tabs.Panel>"]],
          [["tag", "</Tabs>"]],
        ],
      },
      callout: null,
    },
    // ── Q11 ──
    {
      id: 11,
      question: ["What is Next.js Middleware, and how does it differ from running code in a Route Handler or a Server Component?"],
      answer: [
        "Middleware runs on the Edge Runtime at the CDN layer before the request reaches your application \u2014 before any route matching, Server Components, or Route Handlers execute. It receives a ",
        { c: "NextRequest" },
        " and must return a ",
        { c: "NextResponse" },
        " (rewrite, redirect, or pass through), making it the right place for logic that must run on every request with minimal latency: auth token validation, A/B test routing, geolocation-based redirects, and bot protection. Because it runs on the Edge Runtime, it has access only to the Web Fetch API and a constrained runtime \u2014 it cannot use Node.js APIs like ",
        { c: "fs" },
        ", native database drivers, or most npm packages. A Route Handler (",
        { c: "route.ts" },
        ") runs in the full Node.js environment and is appropriate for full API endpoints with database access. A Server Component runs during the render phase and is appropriate for fetching data to hydrate HTML. A common pattern is to use Middleware only for fast, stateless routing decisions (verify JWT signature against a secret) and push any database lookups into Server Components or Route Handlers.",
      ],
      tag: "edge",
      tagType: "next",
      code: {
        file: "middleware.ts",
        lang: "typescript",
        lines: [
          [["kw", "import"], " { NextRequest, NextResponse } ", ["kw", "from"], " ", ["str", "'next/server'"], ";"],
          [["kw", "import"], " { verifyToken } ", ["kw", "from"], " ", ["str", "'@/lib/jwt-edge'"], "; ", ["cmt", "// Web Crypto only"]],
          [""],
          [["kw", "export async function"], " ", ["fn", "middleware"], "(req: ", ["tp", "NextRequest"], ") {"],
          ["  ", ["kw", "const"], " token = req.cookies.", ["fn", "get"], "(", ["str", "'session'"], ")?.value;"],
          ["  ", ["kw", "const"], " valid = token && ", ["kw", "await"], " ", ["fn", "verifyToken"], "(token);"],
          [""],
          ["  ", ["kw", "if"], " (!valid && req.nextUrl.pathname.", ["fn", "startsWith"], "(", ["str", "'/dashboard'"], ")) {"],
          ["    ", ["kw", "return"], " NextResponse.", ["fn", "redirect"], "(", ["kw", "new"], " ", ["fn", "URL"], "(", ["str", "'/login'"], ", req.url));"],
          ["  }"],
          ["  ", ["kw", "return"], " NextResponse.", ["fn", "next"], "();"],
          ["}"],
          [""],
          [["kw", "export const"], " config = {"],
          ["  matcher: [", ["str", "'/dashboard/:path*'"], ", ", ["str", "'/api/protected/:path*'"], "],"],
          ["};"],
        ],
      },
      callout: null,
    },
    // ── Q12 ──
    {
      id: 12,
      question: ["Explain the four caching layers in Next.js App Router and how they interact with each other."],
      answer: [
        "Next.js App Router has four distinct caching mechanisms that operate at different layers. The Request Memoization layer deduplicates identical ",
        { c: "fetch()" },
        " calls made during a single render pass on the server \u2014 if two Server Components independently call the same API endpoint, only one network request is made; this is scoped to a single request lifecycle and is automatic. The Data Cache is a persistent server-side HTTP cache that stores ",
        { c: "fetch" },
        " responses across requests and deployments, controlled by ",
        { c: "{ cache: 'force-cache' }" },
        " (default) or ",
        { c: "{ next: { revalidate: N } }" },
        " for time-based ISR; it persists until explicitly revalidated via ",
        { c: "revalidatePath()" },
        " or ",
        { c: "revalidateTag()" },
        ". The Full Route Cache stores the rendered HTML and RSC payload for statically generated routes at build time; dynamic routes bypass it. The Router Cache is a client-side in-memory cache of visited route segments that allows instant back/forward navigation without re-fetching from the server; it uses prefetched route data from ",
        { c: "<Link>" },
        " components. A common gotcha is that ",
        { c: "revalidatePath()" },
        " only clears the Data Cache and Full Route Cache on the server \u2014 users who have the old route in their Router Cache still see stale UI until they hard-refresh or the cache TTL expires.",
      ],
      tag: "caching",
      tagType: "next",
      code: null,
      callout: {
        type: "warn",
        content: [
          { b: "Production tip:" },
          " use ",
          { c: "revalidateTag()" },
          " over ",
          { c: "revalidatePath()" },
          " for surgical cache busting \u2014 tag each fetch with a domain tag (",
          { c: "{ next: { tags: ['posts'] } }" },
          ") and invalidate the whole domain when a mutation occurs.",
        ],
      },
    },
    // ── Q13 ──
    {
      id: 13,
      question: ["How do Next.js Server Actions work internally, and what security considerations must you design around?"],
      answer: [
        "Server Actions are async functions marked with ",
        { c: "\"use server\"" },
        " that are compiled by Next.js into POST endpoints with auto-generated, encrypted action IDs \u2014 when called from the client, React serializes the arguments, sends a POST request to the current URL with the action ID, and deserializes the return value. They can be called from form ",
        { c: "action" },
        " attributes (which works even before JS hydrates, providing progressive enhancement) or programmatically from event handlers. Internally, they participate in the React transition system, so the UI stays interactive and ",
        { c: "useActionState" },
        " captures pending/error state automatically. The critical security consideration is that Server Actions are public HTTP endpoints \u2014 any user can call any action by its ID with arbitrary arguments. This means you must validate every argument server-side (never trust client input), authorize the current session on every action (re-check permissions, never assume the call came from a legitimate UI flow), and be aware that action IDs are stable across builds if the function doesn\u2019t change. You should also rate-limit action endpoints and validate ",
        { c: "Content-Type" },
        " and ",
        { c: "Origin" },
        " headers to prevent CSRF from third-party sites.",
      ],
      tag: "mutations",
      tagType: "next",
      code: {
        file: "actions/posts.ts",
        lang: "typescript",
        lines: [
          [["str", "\"use server\""], ";"],
          [""],
          [["kw", "import"], " { z } ", ["kw", "from"], " ", ["str", "'zod'"], ";"],
          [["kw", "import"], " { auth } ", ["kw", "from"], " ", ["str", "'@/lib/auth'"], ";"],
          [""],
          [["kw", "const"], " CreateSchema = z.", ["fn", "object"], "({"],
          ["  title: z.", ["fn", "string"], "().", ["fn", "min"], "(", ["num", "1"], ").", ["fn", "max"], "(", ["num", "200"], "),"],
          ["  body:  z.", ["fn", "string"], "().", ["fn", "min"], "(", ["num", "10"], "),"],
          ["});"],
          [""],
          [["kw", "export async function"], " ", ["fn", "createPost"], "(formData: ", ["tp", "FormData"], ") {"],
          ["  ", ["kw", "const"], " session = ", ["kw", "await"], " ", ["fn", "auth"], "();   ", ["cmt", "// \u2190 always re-authorize"]],
          ["  ", ["kw", "if"], " (!session) ", ["kw", "throw new"], " ", ["fn", "Error"], "(", ["str", "\"Unauthorized\""], ");"],
          [""],
          ["  ", ["kw", "const"], " input = CreateSchema.", ["fn", "parse"], "({  ", ["cmt", "// \u2190 always validate"]],
          ["    title: formData.", ["fn", "get"], "(", ["str", "\"title\""], "),"],
          ["    body:  formData.", ["fn", "get"], "(", ["str", "\"body\""], "),"],
          ["  });"],
          [""],
          ["  ", ["kw", "await"], " db.post.", ["fn", "create"], "({ data: { ...input, authorId: session.userId } });"],
          ["  ", ["fn", "revalidateTag"], "(", ["str", "\"posts\""], ");"],
          ["}"],
        ],
      },
      callout: null,
    },
    // ── Q14 ──
    {
      id: 14,
      question: ["When should you use Route Handlers in Next.js, and how do you design the API layer in an App Router project?"],
      answer: [
        "Route Handlers (",
        { c: "app/api/.../route.ts" },
        ") are Next.js\u2019s first-class API endpoints running in the full Node.js environment. In an App Router project, they are most necessary for four cases: serving external clients (mobile apps, third-party integrations) that can\u2019t use Server Actions; handling webhooks from external services; implementing OAuth callback flows; and serving streaming responses like SSE. For internal data fetching from your own Next.js UI, Server Components can call database/service functions directly \u2014 bypassing the HTTP layer entirely \u2014 which is more efficient and type-safe than going through a ",
        { c: "/api" },
        " Route Handler. Server Actions replace the \u201cPOST to an internal API endpoint\u201d pattern entirely. When you do design Route Handlers, structure them around resources and use standard HTTP semantics, apply authentication middleware consistently, validate request bodies with Zod, and return proper status codes. For complex APIs, consider co-locating route handlers alongside the feature they serve (",
        { c: "app/(api)/posts/[id]/route.ts" },
        ") rather than isolating them all in ",
        { c: "app/api/" },
        ".",
      ],
      tag: "api design",
      tagType: "next",
      code: null,
      callout: null,
    },
    // ── Q15 ──
    {
      id: 15,
      question: ["What are Parallel Routes and Intercepting Routes in Next.js, and what UI patterns do they enable?"],
      answer: [
        "Parallel Routes allow you to render multiple independent pages simultaneously within the same layout using named slots (directories prefixed with ",
        { c: "@" },
        "). The layout receives each slot as a separate prop and can render them side-by-side \u2014 this enables dashboards where different panels load and refresh independently with their own loading and error states, or split-view UIs. Each slot is a fully independent route segment with its own Suspense boundary. Intercepting Routes (directories prefixed with ",
        { c: "(..)" },
        " or ",
        { c: "(...)" },
        ") allow you to \u201cintercept\u201d a navigation to show a different UI in the current context while preserving the destination URL. The canonical example is an Instagram-style photo modal: clicking a photo in a feed intercepts the navigation to ",
        { c: "/photos/[id]" },
        " and renders it as a modal overlay on the feed page; navigating directly to ",
        { c: "/photos/[id]" },
        " or refreshing shows the full photo page. Together, Parallel and Intercepting Routes are combined to implement the \u201cmodal as a route\u201d pattern \u2014 the modal has a real URL, is shareable, supports back/forward navigation, and renders as a full page on direct access, all without complex client-side modal state management.",
      ],
      tag: "routing",
      tagType: "next",
      code: null,
      callout: null,
    },
    // ── Q16 ──
    {
      id: 16,
      question: ["Design a complete authentication system in Next.js App Router \u2014 covering session storage, protected routes, and role-based access control."],
      answer: [
        "A production auth system in Next.js App Router uses Auth.js (NextAuth v5) as the foundation, configured with appropriate providers (OAuth, credentials, magic link). Sessions are stored in encrypted, ",
        { c: "HttpOnly" },
        ", ",
        { c: "Secure" },
        " cookies using JWT or database sessions \u2014 JWT sessions are stateless and scale without a session store, but can\u2019t be invalidated instantly; database sessions support instant revocation at the cost of a DB read per request. Route protection is layered: Middleware handles the coarse-grained redirect (unauthenticated users \u2192 ",
        { c: "/login" },
        ") using only a fast cryptographic JWT check, keeping the edge fast. Server Components perform fine-grained authorization by calling ",
        { c: "auth()" },
        " to get the session and checking roles or permissions before rendering sensitive data. Server Actions must re-verify auth on every call since they\u2019re public endpoints. For RBAC, permissions should be stored on the session object (or derived from it) to avoid a DB round-trip on every check \u2014 but the authoritative role data must be re-read on any mutation that requires up-to-date permissions. Never implement access control in client components alone; they are not a security boundary.",
      ],
      tag: "auth",
      tagType: "next",
      code: {
        file: "app/admin/page.tsx",
        lang: "tsx",
        lines: [
          [["kw", "import"], " { auth } ", ["kw", "from"], " ", ["str", "'@/auth'"], ";"],
          [["kw", "import"], " { redirect } ", ["kw", "from"], " ", ["str", "'next/navigation'"], ";"],
          [""],
          [["kw", "export default async function"], " ", ["fn", "AdminPage"], "() {"],
          ["  ", ["kw", "const"], " session = ", ["kw", "await"], " ", ["fn", "auth"], "();"],
          [""],
          ["  ", ["kw", "if"], " (!session)             ", ["fn", "redirect"], "(", ["str", "'/login'"], ");"],
          ["  ", ["kw", "if"], " (session.user.role !== ", ["str", "'admin'"], ") ", ["fn", "redirect"], "(", ["str", "'/403'"], ");"],
          [""],
          ["  ", ["cmt", "// Only admins reach here \u2014 safe to fetch sensitive data"]],
          ["  ", ["kw", "const"], " data = ", ["kw", "await"], " ", ["fn", "fetchAdminData"], "();"],
          ["  ", ["kw", "return"], " ", ["tag", "<AdminDashboard"], " ", ["attr", "data"], "={data} />;"],
          ["}"],
        ],
      },
      callout: null,
    },
    // ── Q17 ──
    {
      id: 17,
      question: ["How would you architect a large React/Next.js application as a monorepo, and what are the tradeoffs vs. a micro-frontend approach?"],
      answer: [
        "A monorepo consolidates multiple packages (the Next.js app, a shared UI component library, shared utility functions, type definitions) into a single repository managed by a tool like Turborepo or Nx. The primary benefits are atomic commits across packages, shared TypeScript types without publishing, centralized dependency management, and a single CI pipeline with incremental task caching \u2014 Turborepo\u2019s build cache means only packages affected by a commit are rebuilt. The recommended structure separates ",
        { c: "apps/" },
        " (deployable applications) from ",
        { c: "packages/" },
        " (shared libraries), with each package having its own ",
        { c: "package.json" },
        " and TypeScript config. A micro-frontend architecture instead deploys each feature as an independently deployable app, stitched together at runtime via Module Federation or at the CDN via edge composition. Micro-frontends solve genuine organizational scale problems \u2014 multiple teams owning independent deployments \u2014 but introduce significant complexity: shared state between apps, routing coordination, duplicated dependencies increasing bundle size, and debugging across deployment boundaries. For most organizations, a monorepo is the right choice; micro-frontends should only be considered when independent deployability per team is a hard requirement.",
      ],
      tag: "architecture",
      tagType: "sys",
      code: null,
      callout: null,
    },
    // ── Q18 ──
    {
      id: 18,
      question: ["How do you implement real-time features in a Next.js application \u2014 comparing WebSockets, Server-Sent Events, and polling?"],
      answer: [
        "The right real-time primitive depends on communication directionality and infrastructure constraints. Server-Sent Events (SSE) are unidirectional (server \u2192 client) over a standard HTTP connection, easy to implement in Next.js Route Handlers with ",
        { c: "ReadableStream" },
        ", and automatically reconnect; they work through HTTP/2 multiplexing, proxies, and CDNs. SSE is the right choice for live notifications, activity feeds, and streaming AI responses. WebSockets are bidirectional and lower-latency, suited for collaborative editing, multiplayer features, and chat \u2014 but they require a persistent server connection which conflicts with serverless and Edge deployments; you typically need a dedicated WebSocket service (Ably, Pusher, Supabase Realtime, or a Node.js server). Polling (repeated ",
        { c: "fetch" },
        " on an interval) is the simplest implementation and appropriate when latency of 5\u201330 seconds is acceptable \u2014 it works everywhere but wastes bandwidth. In Next.js, integrate real-time subscriptions in a client-side custom hook and combine with TanStack Query\u2019s ",
        { c: "queryClient.setQueryData()" },
        " to merge real-time updates directly into the cache, keeping the rest of your data layer consistent.",
      ],
      tag: "real-time",
      tagType: "sys",
      code: {
        file: "app/api/stream/route.ts",
        lang: "typescript",
        lines: [
          [["kw", "export async function"], " ", ["fn", "GET"], "() {"],
          ["  ", ["kw", "const"], " stream = ", ["kw", "new"], " ", ["tp", "ReadableStream"], "({"],
          ["    ", ["kw", "async"], " ", ["fn", "start"], "(controller) {"],
          ["      ", ["kw", "const"], " ", ["fn", "send"], " = (data: ", ["tp", "unknown"], ") =>"],
          ["        controller.", ["fn", "enqueue"], "(", ["kw", "new"], " ", ["tp", "TextEncoder"], "().", ["fn", "encode"], "("],
          ["          ", ["str", "`data: ${JSON.stringify(data)}\\n\\n`"]],
          ["        ));"],
          [""],
          ["      ", ["kw", "const"], " unsub = db.", ["fn", "subscribe"], "(", ["str", "'events'"], ", ", ["fn", "send"], ");"],
          ["      ", ["cmt", "// cleanup on disconnect not shown for brevity"]],
          ["    },"],
          ["  });"],
          [""],
          ["  ", ["kw", "return new"], " ", ["tp", "Response"], "(stream, {"],
          ["    headers: {"],
          ["      ", ["str", "'Content-Type'"], ": ", ["str", "'text/event-stream'"], ","],
          ["      ", ["str", "'Cache-Control'"], ": ", ["str", "'no-cache'"], ","],
          ["    },"],
          ["  });"],
          ["}"],
        ],
      },
      callout: null,
    },
    // ── Q19 ──
    {
      id: 19,
      question: ["How would you design and build a scalable React component library for use across multiple Next.js applications?"],
      answer: [
        "A production-grade component library has distinct concerns across API design, build configuration, and distribution. For API design, components should follow the Open/Closed principle \u2014 expose a polymorphic ",
        { c: "as" },
        " prop or use the Radix UI \u201casChild\u201d pattern to let consumers change the underlying element without forking the component, and forward refs everywhere so host apps can imperatively access DOM nodes. Build-wise, you need to output both ESM and CJS from tools like tsup or Rollup, with separate ",
        { c: ".d.ts" },
        " type declarations and a proper ",
        { c: "exports" },
        " map in ",
        { c: "package.json" },
        " for subpath imports. CSS-in-JS libraries that generate styles at runtime (Emotion, styled-components) create challenges in Next.js App Router Server Components; a CSS Modules or Tailwind approach is more compatible. For the token system, define design tokens as CSS custom properties so they cascade and are overridable without rebuilding the library. Version your components semantically, maintain a storybook for visual testing and documentation, and implement visual regression tests with Chromatic to catch unintended UI changes across component updates before they reach consumers.",
      ],
      tag: "design system",
      tagType: "sys",
      code: null,
      callout: null,
    },
    // ── Q20 ──
    {
      id: 20,
      question: ["How do you instrument a Next.js application for production observability \u2014 error tracking, performance monitoring, and logging?"],
      answer: [
        "Production observability covers three pillars: errors, performance metrics, and structured logs. For error tracking, Sentry is the standard \u2014 install ",
        { c: "@sentry/nextjs" },
        " and its wizard configures source map uploading and wraps both the client and server automatically; the ",
        { c: "instrumentation.ts" },
        " file (Next.js\u2019s official hook for server-side SDK initialization) is the correct place for server SDK setup. For performance, Next.js\u2019s built-in ",
        { c: "useReportWebVitals" },
        " hook sends LCP, INP, and CLS to any analytics endpoint; for deeper tracing, OpenTelemetry integration in ",
        { c: "instrumentation.ts" },
        " provides distributed traces across server components, route handlers, and database calls. Structured JSON logging on the server (using ",
        { c: "pino" },
        " or ",
        { c: "winston" },
        ") is essential for searchable logs in platforms like Datadog or Grafana Loki \u2014 always include request ID, route, user ID, and duration in every log entry. Client-side, the ",
        { c: "web-vitals" },
        " package provides exact metric values for real-user monitoring. Finally, Next.js\u2019s ",
        { c: "experimental.instrumentationHook" },
        " combined with OpenTelemetry lets you trace the entire request lifecycle from Middleware through Server Components to database calls in a single distributed trace, which is invaluable for diagnosing latency regressions in production.",
      ],
      tag: "observability",
      tagType: "sys",
      code: {
        file: "instrumentation.ts",
        lang: "typescript",
        lines: [
          [["kw", "export async function"], " ", ["fn", "register"], "() {"],
          ["  ", ["kw", "if"], " (process.env.NEXT_RUNTIME === ", ["str", "'nodejs'"], ") {"],
          ["    ", ["kw", "const"], " { ", ["fn", "init"], " } = ", ["kw", "await import"], "(", ["str", "'@sentry/nextjs'"], ");"],
          ["    ", ["fn", "init"], "({"],
          ["      dsn: process.env.SENTRY_DSN,"],
          ["      tracesSampleRate: ", ["num", "0.1"], ",         ", ["cmt", "// 10% of transactions"]],
          ["      profilesSampleRate: ", ["num", "0.1"], ","],
          ["    });"],
          [""],
          ["    ", ["cmt", "// OpenTelemetry \u2014 full distributed tracing"]],
          ["    ", ["kw", "const"], " { ", ["tp", "NodeSDK"], " } = ", ["kw", "await import"], "(", ["str", "'@opentelemetry/sdk-node'"], ");"],
          ["    ", ["kw", "new"], " ", ["tp", "NodeSDK"], "({ ", ["cmt", "/* exporter config */"], " }).", ["fn", "start"], "();"],
          ["  }"],
          ["}"],
        ],
      },
      callout: {
        type: "good",
        content: [
          { b: "Best practice:" },
          " always upload source maps to Sentry and add them to ",
          { c: ".gitignore" },
          " / ",
          { c: ".vercelignore" },
          " so stack traces in production show original TypeScript line numbers, not minified bundle offsets.",
        ],
      },
    },
  ] as Question[],
  footer: {
    logo: "React & Next.js",
    desc: "// advanced interview preparation guide",
    right: [
      "20 questions \u00b7 Advanced & System Design",
      "React 19 \u00b7 Next.js 15 \u00b7 App Router",
    ],
  },
};

/* ═══════════════════════════════════════════════════════════
   RENDERERS — pure JSON → React elements, zero dangerouslySetInnerHTML
   ═══════════════════════════════════════════════════════════ */
function renderSegs(segs: Seg[]) {
  return segs.map((s, i) => {
    if (typeof s === "string") return s;
    if ("c" in s) return <code key={i} className="ic">{s.c}</code>;
    if ("b" in s) return <strong key={i}>{s.b}</strong>;
    return null;
  });
}

function renderCode(lines: CodeTok[][]) {
  return lines.map((line, li) => (
    <Fragment key={li}>
      {line.map((tok, ti) =>
        typeof tok === "string" ? (
          tok
        ) : (
          <span key={ti} className={tok[0]}>
            {tok[1]}
          </span>
        )
      )}
      {li < lines.length - 1 && "\n"}
    </Fragment>
  ));
}

/* ═══════════════════════════════════════════════════════════
   COMPONENT — renders PAGE_DATA using Tailwind CSS
   ═══════════════════════════════════════════════════════════ */
export default function AdvancedReactNextjsPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="ff-body min-h-screen bg-background text-foreground font-light leading-[1.8] text-[14.5px]">

        {/* ── COVER (simple, centered) ── */}
        <div className="flex flex-col items-center justify-center text-center py-16 px-6 max-md:py-10 border-b border-(--border-default)">
          <div className="ff-mono text-[11px] tracking-[0.08em] uppercase text-[--tag-sys-text] border border-[--tag-sys-border] px-3 py-1 mb-8 inline-flex items-center gap-2">
            <span className="text-[8px]">&#9654;</span>
            {PAGE_DATA.cover.badge}
          </div>
          <h1 className="ff-display text-[clamp(36px,5.5vw,64px)] font-black leading-[1.05] tracking-tight text-foreground mb-2">
            {PAGE_DATA.cover.titleLine1}
            <br />
            <em className="italic text-(--accent)">{PAGE_DATA.cover.titleAccent}</em>
            <br />
            {PAGE_DATA.cover.titleLine2}
          </h1>
          <p className="ff-mono text-[13px] text-(--accent) mb-8 tracking-[0.02em]">
            {PAGE_DATA.cover.sub}
          </p>
          <p className="text-[15px] text-(--text-secondary) max-w-xl leading-[1.7] mb-12">
            {PAGE_DATA.cover.desc}
          </p>
          <div className="flex gap-10 max-sm:gap-6">
            {PAGE_DATA.cover.stats.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <span className="ff-display text-4xl font-bold text-foreground leading-none">
                  {s.value}
                </span>
                <span className="ff-mono text-[10px] tracking-widest uppercase text-(--text-muted)">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── TABLE OF CONTENTS ── */}
        <div className="bg-(--bg-surface) border-b border-(--border-default)">
          <div className="py-12 px-20 max-md:px-6 border-b border-(--border-default) flex items-baseline gap-6">
            <h2 className="ff-mono text-[11px] tracking-[0.15em] uppercase text-(--accent)">
              // index
            </h2>
            <span className="ff-mono text-[11px] text-(--text-muted)">
              20 questions across 4 domains
            </span>
          </div>
          <div className="py-8 px-20 max-md:px-6 grid grid-cols-2 max-md:grid-cols-1 gap-x-12 gap-y-0.5">
            {PAGE_DATA.toc.map((item) => (
              <a
                key={item.num}
                href={`#q${item.num}`}
                className="grid grid-cols-[32px_1fr_auto] items-center gap-3 py-2.5 border-b border-(--border-default) no-underline text-(--text-secondary) text-[13px] hover:text-foreground transition-colors"
              >
                <span className="ff-mono text-[10px] text-(--text-muted)">
                  {item.num}
                </span>
                <span>{item.title}</span>
                <span
                  className={`tag-${item.tagType} ff-mono text-[9px] px-1.5 py-0.5 rounded-sm whitespace-nowrap`}
                >
                  {item.tag}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="max-w-250 mx-auto px-18 max-md:px-6 pb-25">
          {PAGE_DATA.questions.map((q) => {
            const cat = PAGE_DATA.categories.find((c) => c.startQ === q.id);
            return (
              <div key={q.id}>
                {cat && (
                  <div
                    className={`${q.id === 1 ? "mt-16" : "mt-20"} mb-12 flex items-center gap-4`}
                  >
                    <span className="ff-mono text-[10px] tracking-widest text-(--text-muted) shrink-0">
                      {cat.range}
                    </span>
                    <span className="ff-display text-[26px] font-bold text-foreground tracking-tight shrink-0">
                      {cat.title}
                    </span>
                    <span
                      className={`tag-${cat.tagType} ff-mono text-[9px] px-2.5 py-1 rounded-full tracking-[0.05em] uppercase shrink-0`}
                    >
                      {cat.tagLabel}
                    </span>
                    <div className="flex-1 h-px bg-(--border-default)" />
                  </div>
                )}

                <div
                  id={`q${String(q.id).padStart(2, "0")}`}
                  className="mb-16 border border-(--border-default) rounded overflow-hidden bg-(--bg-surface) hover:border-(--border-strong) transition-colors"
                >
                  {/* Question header */}
                  <div className="px-7 py-5 max-md:px-4 grid grid-cols-[auto_1fr_auto] items-start gap-4 border-b border-(--border-default) bg-(--bg-hover)">
                    <span className="ff-mono text-[11px] text-(--accent) mt-1 min-w-6">
                      {String(q.id).padStart(2, "0")}
                    </span>
                    <p className="ff-display text-[18px] font-bold leading-[1.35] text-foreground tracking-tight">
                      {renderSegs(q.question)}
                    </p>
                    <span
                      className={`tag-${q.tagType} ff-mono text-[9px] px-1.5 py-0.5 rounded-sm whitespace-nowrap mt-1`}
                    >
                      {q.tag}
                    </span>
                  </div>

                  {/* Answer body */}
                  <div className="px-7 py-6 max-md:px-4">
                    <p className="text-(--text-secondary) text-[14px] leading-[1.85]">
                      {renderSegs(q.answer)}
                    </p>

                    {q.code && (
                      <div className="mt-5 border border-[#21262d] rounded overflow-hidden">
                        <div className="bg-[#161b22] px-4 py-2 flex items-center justify-between border-b border-[#21262d]">
                          <span className="cb-dot ff-mono text-[11px] text-[#7d8590] flex items-center gap-2">
                            {q.code.file}
                          </span>
                          <span className="ff-mono text-[9px] text-[#484f58] uppercase tracking-widest">
                            {q.code.lang}
                          </span>
                        </div>
                        <pre className="bg-[#0d1117] px-6 py-5 overflow-x-auto ff-mono text-[12.5px] leading-[1.7] text-[#e6edf3] m-0">
                          {renderCode(q.code.lines)}
                        </pre>
                      </div>
                    )}

                    {q.callout && (
                      <div
                        className={`callout ${q.callout.type === "info" ? "info" : q.callout.type === "good" ? "good" : ""} mt-4`}
                      >
                        <p>{renderSegs(q.callout.content)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── FOOTER ── */}
        <div className="border-t border-(--border-default) px-20 max-md:px-6 py-8 flex max-md:flex-col max-md:gap-4 justify-between items-center bg-(--bg-surface)">
          <div className="flex items-center gap-4">
            <span className="ff-display text-lg font-bold italic text-foreground">
              {PAGE_DATA.footer.logo}
            </span>
            <span className="text-(--border-default)">|</span>
            <span className="ff-mono text-[11px] text-(--text-muted)">
              {PAGE_DATA.footer.desc}
            </span>
          </div>
          <div className="ff-mono text-[11px] text-(--text-muted) text-right leading-[1.9]">
            {PAGE_DATA.footer.right[0]}
            <br />
            {PAGE_DATA.footer.right[1]}
          </div>
        </div>
      </div>
    </>
  );
}
