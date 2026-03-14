import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frontend Developer Interview Guide",
  description:
    "30 essential questions covering the full spectrum of modern frontend development — from core web fundamentals to React and Next.js at an intermediate level.",
};

/* ═══════════════════════════════════════════════════════════
   Minimal CSS — only things Tailwind cannot express inline:
   font imports, pseudo-elements, and syntax-highlight tokens.
   ═══════════════════════════════════════════════════════════ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=IBM+Plex+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

body { overflow: auto !important; height: auto !important; }

.ff-display { font-family: 'Playfair Display', serif; }
.ff-mono    { font-family: 'IBM Plex Mono', monospace; }
.ff-body    { font-family: 'DM Sans', sans-serif; }

.section-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border-default);
}

.q-card::before {
  content: '';
  position: absolute;
  left: -24px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--border-default);
  transition: background 0.3s;
}
.q-card:hover::before { background: var(--accent); }

.code-dot::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
}

.q-text code { font-family: 'IBM Plex Mono', monospace; font-size: 13px; }
.a-text code {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12.5px;
  background: var(--bg-hover);
  padding: 1px 5px;
  border-radius: 3px;
}

.kw   { color: #89b4fa; }
.str  { color: #a6e3a1; }
.cmt  { color: #6c7086; font-style: italic; }
.fn   { color: #cba6f7; }
.num  { color: #fab387; }
.tag  { color: #f38ba8; }
.attr { color: #89b4fa; }
.val  { color: #a6e3a1; }

@media print {
  .q-card { page-break-inside: avoid; }
}
`;

/* ═══════════════════════════════════════════════════════════
   PAGE DATA — all visible text loaded from this JSON object
   ═══════════════════════════════════════════════════════════ */
const PAGE_DATA = {
  cover: {
    tag: "// Interview Preparation Guide",
    titleLines: ["Frontend", "Dev"],
    titleAccent: "Interview",
    description:
      "30 essential questions covering the full spectrum of modern frontend development — from core web fundamentals to React and Next.js at an intermediate level.",
    deco: "30",
    meta: [
      { label: "Questions", value: "30" },
      { label: "Level", value: "Intermediate" },
      { label: "Stack", value: "React · Next.js" },
    ],
  },
  toc: [
    "HTML Semantic Structure",
    "CSS Box Model",
    "CSS Flexbox vs Grid",
    "Responsive Design",
    "CSS Variables & Custom Properties",
    "JavaScript Event Loop",
    "Promises & Async/Await",
    "ES6+ Features",
    "DOM Manipulation",
    "Fetch API & HTTP",
    "React Component Lifecycle",
    "useState & useEffect",
    "useRef & useMemo",
    "useContext & useReducer",
    "Custom Hooks",
    "React Performance Optimization",
    "Props & State",
    "Conditional Rendering & Lists",
    "React Forms & Controlled Components",
    "Error Boundaries",
    "Next.js Rendering Strategies",
    "Next.js App Router",
    "Server vs Client Components",
    "Next.js Data Fetching",
    "Next.js Image & Font Optimization",
    "Web Accessibility (a11y)",
    "Web Performance Metrics",
    "Browser Storage",
    "TypeScript with React",
    "Testing Frontend Code",
  ],
  categories: [
    { tag: "01\u201305", title: "HTML & CSS Fundamentals", startQ: 1 },
    { tag: "06\u201310", title: "JavaScript Core", startQ: 6 },
    { tag: "11\u201320", title: "React", startQ: 11 },
    { tag: "21\u201325", title: "Next.js", startQ: 21 },
    { tag: "26\u201330", title: "Quality, Performance & Tooling", startQ: 26 },
  ],
  questions: [
    {
      id: 1,
      question:
        "What is semantic HTML, and why does it matter for web development?",
      answer:
        'Semantic HTML refers to using elements that carry inherent meaning about the content they wrap \u2014 such as <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;article&gt;</code>, <code>&lt;section&gt;</code>, and <code>&lt;footer&gt;</code> \u2014 rather than relying on generic <code>&lt;div&gt;</code> and <code>&lt;span&gt;</code> tags for everything. Using semantic elements improves accessibility because screen readers use the document structure to help users navigate; a <code>&lt;nav&gt;</code> landmark lets a screen reader user jump directly to navigation. Search engines also benefit because they can better understand the hierarchy and purpose of content on the page. From a maintainability standpoint, semantic HTML makes code more readable and self-documenting for other developers. Finally, semantic structure often reduces the need for extra CSS classes and JavaScript hooks, keeping code leaner.',
      code: null,
    },
    {
      id: 2,
      question:
        "Explain the CSS Box Model and how <code>box-sizing</code> affects layout.",
      answer:
        'Every HTML element is rendered as a rectangular box composed of four areas: content, padding, border, and margin \u2014 from inside out. By default, <code>box-sizing: content-box</code> means that <code>width</code> and <code>height</code> only measure the content area; padding and border are added on top of that, making elements larger than you declared. Switching to <code>box-sizing: border-box</code> makes <code>width</code> and <code>height</code> include padding and border, so a <code>width: 300px</code> element stays 300px regardless of padding. Most modern codebases apply <code>*, *::before, *::after { box-sizing: border-box }</code> globally to avoid sizing surprises. Understanding this distinction is essential for building predictable, pixel-accurate layouts without constant trial-and-error adjustments.',
      code: {
        header: "css \u2014 box-sizing example",
        html: `<span class="cmt">/* Apply border-box globally (recommended) */</span>
<span class="fn">*</span>, <span class="fn">*::before</span>, <span class="fn">*::after</span> {
  <span class="kw">box-sizing</span>: border-box;
}

<span class="fn">.card</span> {
  <span class="kw">width</span>: <span class="num">300px</span>;
  <span class="kw">padding</span>: <span class="num">24px</span>;
  <span class="kw">border</span>: <span class="num">2px</span> solid #ccc;
  <span class="cmt">/* Total rendered width: 300px (not 350px) */</span>
}`,
      },
    },
    {
      id: 3,
      question:
        "What are the key differences between CSS Flexbox and CSS Grid, and when should you use each?",
      answer:
        "Flexbox is a one-dimensional layout system that arranges items along a single axis \u2014 either row or column \u2014 making it ideal for components like navigation bars, button groups, and cards where items flow in a line with alignment control. CSS Grid is two-dimensional, managing both rows and columns simultaneously, which makes it perfect for macro page layouts, image galleries, and any design that requires precise placement across both axes. A practical rule of thumb: use Flexbox when content dictates size and flow, and use Grid when the layout dictates where content goes. They are also complementary \u2014 a common pattern is to use Grid for the overall page structure and Flexbox inside individual components. Both are widely supported and should be preferred over older techniques like floats and inline-block.",
      code: {
        header: "css \u2014 flexbox vs grid",
        html: `<span class="cmt">/* Flexbox: row of items */</span>
<span class="fn">.nav</span> {
  <span class="kw">display</span>: flex;
  <span class="kw">gap</span>: <span class="num">16px</span>;
  <span class="kw">align-items</span>: center;
}

<span class="cmt">/* Grid: 3-column page layout */</span>
<span class="fn">.page</span> {
  <span class="kw">display</span>: grid;
  <span class="kw">grid-template-columns</span>: <span class="num">240px</span> <span class="num">1fr</span> <span class="num">320px</span>;
  <span class="kw">gap</span>: <span class="num">24px</span>;
}`,
      },
    },
    {
      id: 4,
      question:
        "How do you approach responsive design, and what are CSS media queries?",
      answer:
        'Responsive design ensures a website looks and works well across a wide range of screen sizes, from mobile phones to large desktop monitors. The foundation is a mobile-first approach: you write base styles for small screens and use media queries to add complexity as the viewport grows, which keeps CSS manageable and prioritizes performance on mobile networks. CSS media queries use the <code>@media</code> rule to apply styles only when certain conditions \u2014 like <code>min-width</code> or <code>max-width</code> \u2014 are met. Beyond media queries, responsive design also involves using relative units like <code>%</code>, <code>em</code>, <code>rem</code>, <code>vw</code>, and <code>vh</code>, and leveraging fluid techniques like <code>clamp()</code> for typography that scales smoothly. Flexible Grid and Flexbox layouts with <code>auto-fill</code> and <code>minmax()</code> can often eliminate the need for many breakpoints altogether.',
      code: {
        header: "css \u2014 mobile-first media query",
        html: `<span class="cmt">/* Base (mobile) */</span>
<span class="fn">.grid</span> { <span class="kw">grid-template-columns</span>: <span class="num">1fr</span>; }

<span class="cmt">/* Tablet and up */</span>
<span class="kw">@media</span> (min-width: <span class="num">768px</span>) {
  <span class="fn">.grid</span> { <span class="kw">grid-template-columns</span>: repeat(<span class="num">2</span>, <span class="num">1fr</span>); }
}

<span class="cmt">/* Fluid typography */</span>
<span class="fn">h1</span> { <span class="kw">font-size</span>: clamp(<span class="num">28px</span>, <span class="num">5vw</span>, <span class="num">56px</span>); }`,
      },
    },
    {
      id: 5,
      question:
        "What are CSS Custom Properties (variables), and how do they improve styling workflows?",
      answer:
        'CSS Custom Properties, declared with a double-dash prefix (e.g., <code>--primary-color</code>) and accessed via <code>var()</code>, are native CSS variables that cascade and can be updated at runtime with JavaScript. Unlike preprocessor variables (Sass/Less), they are dynamic \u2014 changing a custom property on a parent element instantly updates all children that reference it, making runtime theming (like dark mode) straightforward without recompiling. They can be scoped to any selector, which enables component-level design tokens while maintaining a global token system on <code>:root</code>. They also work natively in all modern browsers without a build step. Using custom properties for colors, spacing, and typography creates a single source of truth that makes global style changes and theming dramatically easier to maintain.',
      code: {
        header: "css \u2014 custom properties for theming",
        html: `<span class="fn">:root</span> {
  <span class="kw">--color-bg</span>: #ffffff;
  <span class="kw">--color-text</span>: #0d0d0d;
  <span class="kw">--radius</span>: <span class="num">8px</span>;
}

<span class="fn">[data-theme="dark"]</span> {
  <span class="kw">--color-bg</span>: #0d0d0d;
  <span class="kw">--color-text</span>: #f5f5f5;
}

<span class="fn">.card</span> {
  <span class="kw">background</span>: var(<span class="kw">--color-bg</span>);
  <span class="kw">color</span>: var(<span class="kw">--color-text</span>);
  <span class="kw">border-radius</span>: var(<span class="kw">--radius</span>);
}`,
      },
    },
    {
      id: 6,
      question:
        "What is the JavaScript Event Loop, and how does it handle asynchronous code?",
      answer:
        "JavaScript is single-threaded, meaning it executes one piece of code at a time on the call stack. The event loop is the mechanism that allows JavaScript to handle asynchronous operations (like timers, network requests, and user events) without blocking. When an async operation completes, its callback is placed in the task queue (or microtask queue for Promises); the event loop continuously checks whether the call stack is empty and, if so, pushes the next queued task onto it. Microtasks (Promises, <code>queueMicrotask</code>) are prioritized and run before the next macrotask (setTimeout, setInterval). Understanding this explains why <code>console.log</code> after a resolved Promise runs before a <code>setTimeout(fn, 0)</code> callback \u2014 microtasks always drain first.",
      code: null,
    },
    {
      id: 7,
      question:
        "What are Promises, and how does <code>async/await</code> improve working with them?",
      answer:
        'A Promise is an object representing the eventual completion or failure of an asynchronous operation, with three states: pending, fulfilled, or rejected. You can chain async operations using <code>.then()</code> and handle errors with <code>.catch()</code>, but deeply nested chains become hard to read. <code>async/await</code>, introduced in ES2017, is syntactic sugar over Promises that lets you write asynchronous code that reads like synchronous code. An <code>async</code> function always returns a Promise, and <code>await</code> pauses execution inside that function until the awaited Promise settles. Wrapping <code>await</code> in a <code>try/catch</code> block provides clean, readable error handling, and <code>Promise.all()</code> lets you run multiple awaited calls in parallel rather than sequentially.',
      code: {
        header: "javascript \u2014 async/await",
        html: `<span class="kw">async function</span> <span class="fn">fetchUser</span>(id) {
  <span class="kw">try</span> {
    <span class="kw">const</span> res = <span class="kw">await</span> fetch(<span class="str">\`/api/users/\${id}\`</span>);
    <span class="kw">if</span> (!res.ok) <span class="kw">throw new</span> <span class="fn">Error</span>(<span class="str">"Not found"</span>);
    <span class="kw">const</span> data = <span class="kw">await</span> res.<span class="fn">json</span>();
    <span class="kw">return</span> data;
  } <span class="kw">catch</span> (err) {
    console.<span class="fn">error</span>(err);
  }
}`,
      },
    },
    {
      id: 8,
      question:
        "What are the most important ES6+ features every frontend developer should know?",
      answer:
        'ES6 and later editions introduced a substantial set of features that are now standard in modern frontend codebases. The most essential include <code>let</code>/<code>const</code> for block-scoped variables, arrow functions for concise syntax and lexical <code>this</code> binding, template literals for readable string interpolation, destructuring assignment for cleanly extracting values from objects and arrays, and the spread/rest operators (<code>...</code>) for immutable data manipulation. Modules (<code>import</code>/<code>export</code>) enable code splitting and a proper module system. Optional chaining (<code>?.</code>) and nullish coalescing (<code>??</code>) from ES2020 are daily-use features that prevent verbose null checks. Array methods like <code>.map()</code>, <code>.filter()</code>, <code>.reduce()</code>, and <code>.find()</code> are fundamental to the functional, declarative style used throughout React.',
      code: null,
    },
    {
      id: 9,
      question:
        "What is the difference between event bubbling and event capturing in the DOM?",
      answer:
        "When a user interaction (like a click) occurs, the browser dispatches the event in two phases. In the capturing phase, the event travels from the document root down through the DOM tree to the target element. In the bubbling phase, the event travels back up from the target through its ancestors to the root. By default, most event listeners fire during bubbling, which is why clicking a child element also triggers click handlers on its parents. You can stop an event from bubbling using <code>event.stopPropagation()</code>. Event delegation leverages this behavior intentionally \u2014 instead of attaching a listener to every list item, you attach one listener to the parent and check <code>event.target</code> to determine which child was clicked, which is far more memory-efficient for dynamic lists.",
      code: null,
    },
    {
      id: 10,
      question:
        "How does the Fetch API work, and what\u2019s the difference between <code>GET</code> and <code>POST</code> requests?",
      answer:
        'The Fetch API is the modern, Promise-based standard for making HTTP requests in the browser, replacing the older <code>XMLHttpRequest</code>. A <code>GET</code> request is used to retrieve data from a server and sends all parameters as URL query strings; it should have no side effects and be idempotent. A <code>POST</code> request sends data in the request body, typically as JSON, and is used to create or submit new data \u2014 it is not idempotent. One important Fetch gotcha: a failed HTTP status (like 404 or 500) does not cause the Promise to reject; you must manually check <code>response.ok</code> or <code>response.status</code>. In Next.js, the native <code>fetch</code> is extended with caching options, making it the primary data-fetching primitive in Server Components.',
      code: {
        header: "javascript \u2014 fetch post request",
        html: `<span class="kw">const</span> res = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">'/api/posts'</span>, {
  method: <span class="str">'POST'</span>,
  headers: { <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span> },
  body: <span class="fn">JSON.stringify</span>({ title: <span class="str">'Hello World'</span> }),
});

<span class="kw">if</span> (!res.ok) <span class="kw">throw new</span> <span class="fn">Error</span>(<span class="str">\`HTTP error: \${res.status}\`</span>);
<span class="kw">const</span> post = <span class="kw">await</span> res.<span class="fn">json</span>();`,
      },
    },
    {
      id: 11,
      question:
        "How does the React component lifecycle work in functional components?",
      answer:
        'In functional components, the lifecycle is managed through the <code>useEffect</code> hook rather than class-based methods like <code>componentDidMount</code>. When a component first renders, all effects with an empty dependency array <code>[]</code> run once \u2014 equivalent to <code>componentDidMount</code>. Effects with values in the dependency array run whenever those values change \u2014 equivalent to <code>componentDidUpdate</code>. A cleanup function returned from <code>useEffect</code> runs before the component unmounts or before the effect re-runs \u2014 equivalent to <code>componentWillUnmount</code>. React 18\u2019s Strict Mode intentionally mounts, unmounts, and remounts components in development to expose side effects that don\u2019t clean up properly. Understanding this order is critical for managing subscriptions, timers, and API calls correctly.',
      code: null,
    },
    {
      id: 12,
      question:
        "Explain <code>useState</code> and <code>useEffect</code> with a practical example.",
      answer:
        '<code>useState</code> is React\u2019s hook for declaring state variables in functional components; it returns the current value and a setter function, and calling the setter triggers a re-render. <code>useEffect</code> lets you perform side effects \u2014 like fetching data, subscribing to events, or manipulating the DOM \u2014 after a render. The dependency array controls when the effect re-runs: omitting it runs on every render, an empty array runs only on mount, and listing values runs whenever any of them change. It\u2019s important to declare every value used inside an effect in the dependency array to avoid stale closures. The cleanup function prevents memory leaks by canceling subscriptions or aborting fetch requests when the component unmounts.',
      code: {
        header: "jsx \u2014 useState + useEffect",
        html: `<span class="kw">import</span> { useState, useEffect } <span class="kw">from</span> <span class="str">'react'</span>;

<span class="kw">export default function</span> <span class="fn">UserProfile</span>({ userId }) {
  <span class="kw">const</span> [user, setUser] = <span class="fn">useState</span>(<span class="kw">null</span>);

  <span class="fn">useEffect</span>(() =&gt; {
    <span class="kw">const</span> controller = <span class="kw">new</span> <span class="fn">AbortController</span>();
    <span class="fn">fetch</span>(<span class="str">\`/api/users/\${userId}\`</span>, { signal: controller.signal })
      .<span class="fn">then</span>(r =&gt; r.<span class="fn">json</span>())
      .<span class="fn">then</span>(setUser);
    <span class="kw">return</span> () =&gt; controller.<span class="fn">abort</span>(); <span class="cmt">// cleanup</span>
  }, [userId]);

  <span class="kw">if</span> (!user) <span class="kw">return</span> &lt;<span class="tag">p</span>&gt;Loading...&lt;/<span class="tag">p</span>&gt;;
  <span class="kw">return</span> &lt;<span class="tag">h1</span>&gt;{user.name}&lt;/<span class="tag">h1</span>&gt;;
}`,
      },
    },
    {
      id: 13,
      question:
        "What are <code>useRef</code> and <code>useMemo</code>, and when would you use them?",
      answer:
        '<code>useRef</code> returns a mutable object whose <code>.current</code> property persists across renders without triggering a re-render when changed. Its two main uses are holding a reference to a DOM element (e.g., to focus an input or measure its size) and storing a mutable value that shouldn\u2019t cause re-renders, like a timer ID or a previous state snapshot. <code>useMemo</code> memoizes the result of an expensive computation, recomputing it only when its dependencies change; this prevents a costly calculation from running on every render. However, both hooks come with overhead, so they should be used purposefully rather than by default. The most common misuse of <code>useMemo</code> is wrapping cheap computations, which actually makes code slightly slower due to the memoization bookkeeping.',
      code: {
        header: "jsx \u2014 useRef & useMemo",
        html: `<span class="kw">const</span> inputRef = <span class="fn">useRef</span>(<span class="kw">null</span>);
<span class="kw">const</span> <span class="fn">focusInput</span> = () =&gt; inputRef.current.<span class="fn">focus</span>();

<span class="cmt">// Expensive computation only reruns when list changes</span>
<span class="kw">const</span> sorted = <span class="fn">useMemo</span>(
  () =&gt; [...list].<span class="fn">sort</span>((a, b) =&gt; a.score - b.score),
  [list]
);`,
      },
    },
    {
      id: 14,
      question:
        "What is the React Context API, and how does <code>useReducer</code> complement it for state management?",
      answer:
        'The Context API lets you share state across the component tree without manually passing props through intermediate components \u2014 a problem known as &quot;prop drilling.&quot; You create a context with <code>React.createContext()</code>, wrap a subtree in a Provider with a <code>value</code>, and consume it anywhere inside that tree with <code>useContext()</code>. <code>useReducer</code> is a state hook that manages more complex state through a pure reducer function, similar to Redux but built into React. Pairing them is a powerful pattern: <code>useReducer</code> holds the state and dispatch function, which are then passed down via Context, giving you a lightweight global state solution. This approach is ideal for medium-complexity apps that don\u2019t yet need a full external state management library.',
      code: {
        header: "jsx \u2014 context + useReducer",
        html: `<span class="kw">const</span> StoreCtx = <span class="fn">createContext</span>(<span class="kw">null</span>);

<span class="kw">function</span> <span class="fn">reducer</span>(state, action) {
  <span class="kw">switch</span> (action.type) {
    <span class="kw">case</span> <span class="str">'INCREMENT'</span>: <span class="kw">return</span> { count: state.count + <span class="num">1</span> };
    <span class="kw">default</span>: <span class="kw">return</span> state;
  }
}

<span class="kw">export function</span> <span class="fn">StoreProvider</span>({ children }) {
  <span class="kw">const</span> [state, dispatch] = <span class="fn">useReducer</span>(reducer, { count: <span class="num">0</span> });
  <span class="kw">return</span> (
    &lt;<span class="tag">StoreCtx.Provider</span> <span class="attr">value</span>=<span class="val">{{ state, dispatch }}</span>&gt;
      {children}
    &lt;/<span class="tag">StoreCtx.Provider</span>&gt;
  );
}`,
      },
    },
    {
      id: 15,
      question:
        "What are custom hooks in React, and why are they useful?",
      answer:
        'A custom hook is a plain JavaScript function whose name starts with <code>use</code> and that calls one or more built-in React hooks. They exist to extract and reuse stateful logic across multiple components without changing the component tree \u2014 unlike higher-order components or render props. For example, a <code>useFetch</code> hook encapsulates loading, data, and error state for API calls so that any component can use it with a single line. Custom hooks keep components thin and focused on rendering rather than logic, making them easier to test in isolation. They are also composable \u2014 one custom hook can call another, allowing complex behaviors to be assembled from smaller, well-tested pieces.',
      code: {
        header: "jsx \u2014 custom hook: useLocalStorage",
        html: `<span class="kw">function</span> <span class="fn">useLocalStorage</span>(key, initial) {
  <span class="kw">const</span> [value, setValue] = <span class="fn">useState</span>(() =&gt; {
    <span class="kw">const</span> stored = localStorage.<span class="fn">getItem</span>(key);
    <span class="kw">return</span> stored ? <span class="fn">JSON.parse</span>(stored) : initial;
  });

  <span class="kw">const</span> setStored = (v) =&gt; {
    setValue(v);
    localStorage.<span class="fn">setItem</span>(key, <span class="fn">JSON.stringify</span>(v));
  };

  <span class="kw">return</span> [value, setStored];
}`,
      },
    },
    {
      id: 16,
      question:
        "How do you optimize React performance, and what is <code>React.memo</code>?",
      answer:
        "React re-renders a component whenever its state or props change, and by default also re-renders all child components. <code>React.memo</code> is a higher-order component that wraps a functional component and shallowly compares its props; if they haven\u2019t changed, React skips the re-render entirely. <code>useCallback</code> memoizes a function reference so that passing it as a prop to a memoized child doesn\u2019t break memoization on every render. Code splitting with <code>React.lazy</code> and <code>Suspense</code> defers loading components until they\u2019re needed, shrinking the initial bundle. Virtualization libraries (like TanStack Virtual) are essential for rendering long lists efficiently. Finally, avoiding unnecessary state lifts and keeping state as close to where it\u2019s used as possible naturally reduces the scope of re-renders.",
      code: null,
    },
    {
      id: 17,
      question:
        "What is the difference between props and state in React?",
      answer:
        'Props (short for properties) are read-only values passed from a parent component to a child, used to configure how the child renders; a component cannot modify its own props. State is data owned and managed by the component itself, and it can change over time in response to user actions or other events \u2014 triggering a re-render when updated via the setter from <code>useState</code>. A good mental model: props are like function arguments (external input), while state is like local variables (internal memory). When multiple components need to share the same piece of state, you &quot;lift it up&quot; to their nearest common ancestor and pass it down as props. This unidirectional data flow \u2014 props flowing down, events flowing up \u2014 is a core architectural principle in React.',
      code: null,
    },
    {
      id: 18,
      question:
        "How does conditional rendering work in React, and what are the patterns for rendering lists?",
      answer:
        'React uses standard JavaScript logic for conditional rendering \u2014 you can use <code>if</code> statements, ternary expressions (<code>condition ? A : B</code>), or short-circuit evaluation (<code>condition &amp;&amp; &lt;Component /&gt;</code>) directly in JSX. The short-circuit pattern is convenient but has a pitfall: if the condition is a falsy number like <code>0</code>, React will render the number <code>0</code> instead of nothing, so prefer a boolean check. For rendering lists, you use <code>Array.map()</code> to transform an array of data into an array of JSX elements. Each list item must have a stable, unique <code>key</code> prop so React can identify which items changed during reconciliation. Keys should come from your data (like a database ID), not from the array index, as index-based keys break reconciliation when items are reordered or removed.',
      code: {
        header: "jsx \u2014 list rendering",
        html: `<span class="kw">const</span> <span class="fn">List</span> = ({ items, loading }) =&gt; (
  &lt;<span class="tag">div</span>&gt;
    {loading &amp;&amp; &lt;<span class="tag">Spinner</span> /&gt;}
    {!loading &amp;&amp; items.<span class="fn">map</span>(item =&gt; (
      &lt;<span class="tag">li</span> <span class="attr">key</span>=<span class="val">{item.id}</span>&gt;{item.name}&lt;/<span class="tag">li</span>&gt;
    ))}
  &lt;/<span class="tag">div</span>&gt;
);`,
      },
    },
    {
      id: 19,
      question:
        "What are controlled components in React forms, and how do you handle form submissions?",
      answer:
        "A controlled component is one where React state is the single source of truth for the input\u2019s value \u2014 the input\u2019s <code>value</code> is bound to a state variable, and an <code>onChange</code> handler updates that state on every keystroke. This gives you full programmatic control over the form data: you can validate, transform, or conditionally disable fields at any point. The alternative, uncontrolled components, use a <code>ref</code> to read the DOM directly on submit, which is simpler for trivial forms but harder to validate dynamically. For form handling at scale, libraries like React Hook Form offer better performance by minimizing re-renders and provide built-in validation integration with schema libraries like Zod. Form submissions are handled via an <code>onSubmit</code> handler where you call <code>event.preventDefault()</code> to stop the browser\u2019s default page reload.",
      code: null,
    },
    {
      id: 20,
      question:
        "What are React Error Boundaries, and when should you use them?",
      answer:
        "Error boundaries are React components that catch JavaScript errors thrown anywhere in their child component tree during rendering, in lifecycle methods, or in constructors, and display a fallback UI instead of crashing the entire page. They must be class components implementing <code>static getDerivedStateFromError()</code> and/or <code>componentDidCatch()</code>, since there is no hook equivalent yet. You should wrap distinct sections of your UI (like a sidebar, a chart, or a widget) in separate error boundaries so that one failing component doesn\u2019t break unrelated parts of the page. They are not suited for catching errors inside event handlers (use try/catch there) or in async code. In Next.js, the <code>error.js</code> file convention creates an error boundary automatically for a route segment, providing route-level error recovery.",
      code: null,
    },
    {
      id: 21,
      question:
        "What are the different rendering strategies in Next.js, and when do you use each?",
      answer:
        "Next.js supports four rendering strategies. Static Site Generation (SSG) pre-renders HTML at build time, making it the fastest for content that doesn\u2019t change often, like marketing pages or documentation. Server-Side Rendering (SSR) generates fresh HTML on every request, suitable for pages that need real-time data or user-specific content. Incremental Static Regeneration (ISR) combines both \u2014 pages are statically generated but can be revalidated in the background after a specified interval, ideal for frequently-updated but not real-time content. Client-Side Rendering (CSR) defers rendering to the browser, used for highly interactive dashboards where SEO is not a priority. In the App Router, the default is now static rendering; you opt into dynamic rendering by using functions like <code>cookies()</code>, <code>headers()</code>, or setting <code>dynamic = 'force-dynamic'</code>.",
      code: null,
    },
    {
      id: 22,
      question:
        "What is the Next.js App Router, and how does it differ from the Pages Router?",
      answer:
        "The App Router, introduced in Next.js 13 and stabilized in 14, uses the <code>app/</code> directory and is built on React Server Components. Routes are created through folder structure with a <code>page.js</code> file, and special files like <code>layout.js</code>, <code>loading.js</code>, <code>error.js</code>, and <code>not-found.js</code> handle different UI states automatically per route segment. The Pages Router (<code>pages/</code>) uses file-based routing but relies entirely on Client Components and uses <code>getServerSideProps</code>/<code>getStaticProps</code> for data fetching at the page level. The App Router co-locates data fetching directly inside any server component, enabling more granular, component-level data loading without waterfall prop-drilling. The two routers can coexist in the same project, enabling gradual migration.",
      code: null,
    },
    {
      id: 23,
      question:
        "What is the difference between Server Components and Client Components in Next.js?",
      answer:
        'Server Components (the default in the App Router) render exclusively on the server \u2014 they can directly access databases, file systems, and environment secrets, and their code is never sent to the browser, which reduces the JavaScript bundle. They cannot use browser APIs, React state, or event handlers. Client Components are marked with the <code>&quot;use client&quot;</code> directive at the top of the file and run in the browser; they support interactivity, hooks, and browser APIs. A key architectural insight is that you should push interactivity to leaf components \u2014 keep as much of your tree as server components and only switch to client at the boundary where you need state or events. Server Components can pass serializable props down to Client Components, but cannot import Client Components directly without wrapping them.',
      code: {
        header: "jsx \u2014 server vs client component",
        html: `<span class="cmt">// app/page.js \u2014 Server Component (default)</span>
<span class="kw">export default async function</span> <span class="fn">Page</span>() {
  <span class="kw">const</span> data = <span class="kw">await</span> <span class="fn">fetchFromDB</span>(); <span class="cmt">// direct DB access</span>
  <span class="kw">return</span> &lt;<span class="tag">ProductList</span> <span class="attr">items</span>=<span class="val">{data}</span> /&gt;;
}

<span class="cmt">// components/AddToCart.jsx \u2014 Client Component</span>
<span class="str">"use client"</span>;
<span class="kw">export default function</span> <span class="fn">AddToCart</span>({ id }) {
  <span class="kw">const</span> [added, setAdded] = <span class="fn">useState</span>(<span class="kw">false</span>);
  <span class="kw">return</span> &lt;<span class="tag">button</span> <span class="attr">onClick</span>=<span class="val">{() =&gt; setAdded(true)}</span>&gt;Add&lt;/<span class="tag">button</span>&gt;;
}`,
      },
    },
    {
      id: 24,
      question:
        "How does data fetching work in the Next.js App Router?",
      answer:
        "In the App Router, you fetch data directly inside async Server Components using the native <code>fetch</code> API extended by Next.js with caching and revalidation options. By default, <code>fetch</code> results are cached; you control the caching behavior with <code>{ cache: 'no-store' }</code> for always-fresh data or <code>{ next: { revalidate: 60 } }</code> for time-based ISR. Multiple <code>fetch</code> calls in the same render pass are automatically deduplicated if they request the same URL, preventing redundant network requests. For mutations (creating/updating data), Server Actions allow you to write server-side functions that can be called directly from forms or event handlers without building a separate API route. Parallel data fetching can be achieved by initiating multiple promises before awaiting them together with <code>Promise.all()</code>.",
      code: {
        header: "jsx \u2014 app router data fetching",
        html: `<span class="cmt">// Server Component \u2014 fetch with revalidation</span>
<span class="kw">async function</span> <span class="fn">getPosts</span>() {
  <span class="kw">const</span> res = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">'https://api.example.com/posts'</span>, {
    next: { revalidate: <span class="num">3600</span> }, <span class="cmt">// ISR: 1 hour</span>
  });
  <span class="kw">return</span> res.<span class="fn">json</span>();
}

<span class="kw">export default async function</span> <span class="fn">Blog</span>() {
  <span class="kw">const</span> posts = <span class="kw">await</span> <span class="fn">getPosts</span>();
  <span class="kw">return</span> posts.<span class="fn">map</span>(p =&gt; &lt;<span class="tag">PostCard</span> <span class="attr">key</span>=<span class="val">{p.id}</span> {...<span class="val">p</span>} /&gt;);
}`,
      },
    },
    {
      id: 25,
      question:
        "How does Next.js optimize images and fonts, and why does it matter?",
      answer:
        "Next.js provides a built-in <code>&lt;Image&gt;</code> component that automatically serves images in modern formats like WebP/AVIF, resizes them to the exact dimensions needed, lazy-loads them by default, and prevents Cumulative Layout Shift (CLS) by reserving space with explicit <code>width</code> and <code>height</code> props. This can dramatically reduce image payload \u2014 the single largest contributor to page weight on most sites. For fonts, <code>next/font</code> downloads Google Fonts or local fonts at build time and self-hosts them, eliminating the external network request to Google\u2019s servers that typically blocks rendering and introduces latency. Both optimizations directly improve Core Web Vitals scores (LCP, CLS) which affect both user experience and Google search ranking. The <code>priority</code> prop on the above-the-fold <code>&lt;Image&gt;</code> prevents lazy loading on hero images, further improving LCP.",
      code: null,
    },
    {
      id: 26,
      question:
        "What is web accessibility (a11y), and what are the most important practices?",
      answer:
        'Web accessibility means building interfaces that can be used by people with disabilities \u2014 including those using screen readers, keyboard navigation, voice control, or high-contrast display modes. The Web Content Accessibility Guidelines (WCAG) provide the widely-accepted standard, with Level AA being the target for most production applications. The most impactful practices are: using semantic HTML so assistive technologies understand structure, providing meaningful <code>alt</code> text on images, ensuring sufficient color contrast ratios (4.5:1 for normal text), making all interactive elements keyboard-focusable with visible focus indicators, and using ARIA attributes (<code>aria-label</code>, <code>aria-expanded</code>, <code>role</code>) only when semantic HTML is insufficient. In React, <code>eslint-plugin-jsx-a11y</code> catches common issues during development, and browser extensions like Axe provide automated audits.',
      code: null,
    },
    {
      id: 27,
      question:
        "What are Core Web Vitals, and how do you measure and improve them?",
      answer:
        "Core Web Vitals are Google\u2019s set of real-world performance metrics that measure user experience: Largest Contentful Paint (LCP) measures loading speed of the main content (target under 2.5s), Interaction to Next Paint (INP) measures responsiveness to user interactions (target under 200ms), and Cumulative Layout Shift (CLS) measures visual stability by tracking unexpected layout shifts (target under 0.1). You can measure them in production using Chrome User Experience Report data, in the lab using Lighthouse in Chrome DevTools or the PageSpeed Insights tool, and in code using the <code>web-vitals</code> npm package. Improving LCP typically means optimizing images, preloading critical resources, and using server-side rendering. Improving CLS means always specifying dimensions for images and embeds and avoiding injecting content above existing content.",
      code: null,
    },
    {
      id: 28,
      question:
        "What are the different browser storage options, and when should you use each?",
      answer:
        "<code>localStorage</code> provides persistent key-value string storage (up to ~5MB) that survives tab closes and browser restarts, making it suitable for user preferences and non-sensitive settings; it is synchronous and thus blocks the main thread if overused. <code>sessionStorage</code> works identically but is cleared when the browser tab closes, useful for single-session form state. Cookies are sent with every HTTP request to the server, making them the correct choice for authentication tokens and session IDs; they can be made <code>HttpOnly</code> (inaccessible to JavaScript) and <code>Secure</code> for protection. <code>IndexedDB</code> is an asynchronous, transactional database suitable for storing large amounts of structured data like offline-capable app content. In Next.js, authentication state is commonly managed with HTTP-only cookies via libraries like Auth.js, keeping tokens out of JavaScript entirely.",
      code: null,
    },
    {
      id: 29,
      question:
        "How does TypeScript improve React and Next.js development?",
      answer:
        'TypeScript adds static type checking to JavaScript, catching type errors at compile time (in your editor) rather than at runtime in the browser. In React, you type component props with interfaces or type aliases, which makes component APIs self-documenting and prevents incorrect usage across your codebase. Generic types allow you to build flexible, reusable hooks and utilities without sacrificing safety. Next.js has first-class TypeScript support \u2014 running <code>next dev</code> with a <code>.tsx</code> file automatically configures TypeScript, and types for <code>page.tsx</code> props like <code>params</code> and <code>searchParams</code> are provided by <code>next</code>. TypeScript also enables significantly better IDE autocomplete and refactoring, which pays off quickly in larger codebases; most modern React projects default to TypeScript from the start.',
      code: {
        header: "tsx \u2014 typed react component",
        html: `<span class="kw">interface</span> <span class="fn">ButtonProps</span> {
  label: string;
  variant?: <span class="str">'primary'</span> | <span class="str">'ghost'</span>;
  onClick: () =&gt; <span class="kw">void</span>;
}

<span class="kw">export function</span> <span class="fn">Button</span>({ label, variant = <span class="str">'primary'</span>, onClick }: <span class="fn">ButtonProps</span>) {
  <span class="kw">return</span> (
    &lt;<span class="tag">button</span> <span class="attr">className</span>=<span class="val">{\`btn btn--\${variant}\`}</span> <span class="attr">onClick</span>=<span class="val">{onClick}</span>&gt;
      {label}
    &lt;/<span class="tag">button</span>&gt;
  );
}`,
      },
    },
    {
      id: 30,
      question:
        "What are the fundamentals of testing frontend code in a React application?",
      answer:
        "Frontend testing is typically organized in three layers. Unit tests verify isolated functions or hooks in pure JavaScript using a test runner like Vitest or Jest. Component tests use React Testing Library (RTL) to render components and assert on what the user sees and can interact with \u2014 RTL intentionally queries elements by accessible roles and text rather than by class names, encouraging accessible markup and testing behavior rather than implementation details. End-to-end (E2E) tests with Playwright or Cypress simulate complete user flows in a real browser. A practical guiding principle is the testing pyramid: many unit tests, a moderate number of component tests, and a few critical E2E tests \u2014 each layer provides more confidence but is slower to run. In Next.js, Server Components can be tested with server-side rendering utilities, while client interactivity is covered by RTL component tests.",
      code: {
        header: "jsx \u2014 react testing library example",
        html: `<span class="kw">import</span> { render, screen, fireEvent } <span class="kw">from</span> <span class="str">'@testing-library/react'</span>;
<span class="kw">import</span> { Counter } <span class="kw">from</span> <span class="str">'./Counter'</span>;

<span class="fn">test</span>(<span class="str">'increments count on click'</span>, () =&gt; {
  <span class="fn">render</span>(&lt;<span class="tag">Counter</span> /&gt;);
  <span class="fn">fireEvent.click</span>(screen.<span class="fn">getByRole</span>(<span class="str">'button'</span>, { name: /increment/i }));
  <span class="fn">expect</span>(screen.<span class="fn">getByText</span>(<span class="str">'Count: 1'</span>)).<span class="fn">toBeInTheDocument</span>();
});`,
      },
    },
  ],
  footer: {
    left: "Frontend Interview Guide",
    rightLine1: "React \u00b7 Next.js \u00b7 Intermediate Level",
    rightLine2: "30 Questions & Answers",
  },
};

/* ═══════════════════════════════════════════════════════════
   COMPONENT — renders PAGE_DATA using Tailwind CSS
   ═══════════════════════════════════════════════════════════ */
export default function FrontendInterviewGuidePage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="ff-body min-h-screen bg-background text-foreground font-light leading-[1.75] text-[15px]">

        {/* ── COVER (simple, centered) ── */}
        <div className="flex flex-col items-center justify-center text-center py-16 px-6 max-md:py-10 border-b border-(--border-default)">
          <div className="ff-mono text-[11px] tracking-[0.2em] uppercase text-(--accent) mb-4">
            {PAGE_DATA.cover.tag}
          </div>
          <h1 className="ff-display text-[clamp(32px,5vw,56px)] font-black leading-tight tracking-tight text-foreground mb-4">
            {PAGE_DATA.cover.titleLines[0]} {PAGE_DATA.cover.titleLines[1]}{" "}
            <span className="text-(--accent)">{PAGE_DATA.cover.titleAccent}</span>
          </h1>
          <p className="text-base text-(--text-secondary) max-w-xl leading-relaxed mb-8">
            {PAGE_DATA.cover.description}
          </p>
          <div className="flex gap-8 max-sm:gap-4">
            {PAGE_DATA.cover.meta.map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="ff-mono text-[10px] tracking-[0.15em] uppercase text-(--text-muted) mb-1">
                  {item.label}
                </span>
                <span className="ff-display text-lg font-bold text-foreground">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── TABLE OF CONTENTS ── */}
        <div className="py-16 px-10 max-md:px-6 max-md:py-10 border-b border-(--border-default) bg-(--bg-surface)">
          <div className="section-label ff-mono text-[10px] tracking-[0.2em] uppercase text-(--accent) mb-8 flex items-center gap-3">
            Table of Contents
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
            {PAGE_DATA.toc.map((text, i) => (
              <a
                key={i}
                href={`#q${i + 1}`}
                className="flex items-baseline gap-3 py-2.5 border-b border-dotted border-(--border-default) no-underline text-foreground hover:text-(--accent) transition-colors"
              >
                <span className="ff-mono text-[11px] text-(--accent) min-w-7">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[13px] leading-[1.4]">{text}</span>
              </a>
            ))}
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="max-w-225 mx-auto py-16 px-10 max-md:px-6 max-md:py-10">
          {PAGE_DATA.questions.map((q) => {
            const catHeader = PAGE_DATA.categories.find(
              (c) => c.startQ === q.id
            );
            return (
              <div key={q.id}>
                {catHeader && (
                  <div
                    className={`${q.id === 1 ? "mt-0" : "mt-18"} mb-10 pb-4 border-b-[3px] border-foreground flex items-baseline gap-5`}
                  >
                    <span className="ff-mono text-[11px] tracking-widest text-(--text-inverse) bg-(--accent) px-2.5 py-0.75 uppercase">
                      {catHeader.tag}
                    </span>
                    <h2 className="ff-display text-[32px] max-md:text-2xl font-bold text-foreground">
                      {catHeader.title}
                    </h2>
                  </div>
                )}

                <div id={`q${q.id}`} className="q-card mb-14 relative">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="ff-mono text-[11px] text-(--text-inverse) bg-foreground px-2 py-1 min-w-9 text-center shrink-0 mt-0.5">
                      {String(q.id).padStart(2, "0")}
                    </span>
                    <p
                      className="q-text ff-display text-[19px] font-bold text-foreground leading-[1.35]"
                      dangerouslySetInnerHTML={{ __html: q.question }}
                    />
                  </div>
                  <p
                    className="a-text text-(--text-secondary) text-[14.5px] leading-[1.8] pl-13 max-md:pl-0"
                    dangerouslySetInnerHTML={{ __html: q.answer }}
                  />
                  {q.code && (
                    <div className="mt-5 ml-13 max-md:ml-0 overflow-hidden border border-[#2d2d3f] rounded">
                      <div className="code-dot bg-[#13131f] px-4 py-2 ff-mono text-[10px] tracking-widest text-[#6c7086] uppercase flex items-center gap-2">
                        {q.code.header}
                      </div>
                      <pre
                        className="bg-[#1e1e2e] p-5 overflow-x-auto ff-mono text-[12.5px] leading-[1.7] text-[#cdd6f4] m-0"
                        dangerouslySetInnerHTML={{ __html: q.code.html }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── FOOTER ── */}
        <div className="border-t border-(--border-default) py-8 px-10 max-md:px-6 max-md:flex-col max-md:gap-4 flex justify-between items-center bg-(--bg-surface)">
          <div className="ff-display text-lg font-bold text-foreground">
            {PAGE_DATA.footer.left}
          </div>
          <div className="ff-mono text-[11px] text-(--text-muted) text-right leading-[1.8]">
            {PAGE_DATA.footer.rightLine1}
            <br />
            {PAGE_DATA.footer.rightLine2}
          </div>
        </div>
      </div>
    </>
  );
}
