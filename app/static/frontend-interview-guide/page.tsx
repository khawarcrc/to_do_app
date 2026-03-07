import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frontend Developer Interview Guide',
  description:
    '30 essential questions covering the full spectrum of modern frontend development — from core web fundamentals to React and Next.js at an intermediate level.',
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=IBM+Plex+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

  /* Override root layout body constraints */
  body {
    overflow: auto !important;
    height: auto !important;
  }

  :root {
    --ink: #0d0d0d;
    --paper: #f5f0e8;
    --accent: #c8410a;
    --accent2: #1a4a8a;
    --muted: #6b6560;
    --rule: #d5cfc4;
    --code-bg: #1e1e2e;
    --code-fg: #cdd6f4;
    --code-key: #89b4fa;
    --code-str: #a6e3a1;
    --code-cmt: #6c7086;
    --code-fn: #cba6f7;
    --code-num: #fab387;
  }

  .fig-wrap * { margin: 0; padding: 0; box-sizing: border-box; }

  .fig-wrap {
    background: var(--paper);
    color: var(--ink);
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    line-height: 1.75;
    font-size: 15px;
    min-height: 100vh;
  }

  /* COVER PAGE */
  .fig-cover {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 80px 100px;
    position: relative;
    border-bottom: 3px solid var(--ink);
    overflow: hidden;
  }

  .fig-cover::before {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 40%;
    height: 100%;
    background: var(--ink);
    z-index: 0;
  }

  .fig-cover-inner {
    position: relative;
    z-index: 1;
    max-width: 700px;
  }

  .fig-cover-tag {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 24px;
  }

  .fig-cover h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(52px, 7vw, 88px);
    font-weight: 900;
    line-height: 1.0;
    letter-spacing: -2px;
    color: var(--ink);
    margin-bottom: 32px;
  }

  .fig-cover h1 span { color: var(--accent); }

  .fig-cover-desc {
    font-size: 16px;
    color: var(--muted);
    max-width: 500px;
    line-height: 1.7;
    border-left: 3px solid var(--accent);
    padding-left: 20px;
    margin-bottom: 56px;
  }

  .fig-cover-meta { display: flex; gap: 48px; }

  .fig-cover-meta-item { display: flex; flex-direction: column; }

  .fig-cover-meta-item .label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 4px;
  }

  .fig-cover-meta-item .value {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--ink);
  }

  .fig-cover-deco {
    position: absolute;
    top: 60px;
    right: 80px;
    z-index: 2;
    color: var(--paper);
    font-family: 'Playfair Display', serif;
    font-size: 160px;
    font-weight: 900;
    opacity: 0.08;
    line-height: 1;
    user-select: none;
  }

  /* TOC */
  .fig-toc {
    padding: 80px 100px;
    border-bottom: 1px solid var(--rule);
    background: #fff;
  }

  .fig-section-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 32px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .fig-section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--rule);
  }

  .fig-toc-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 0;
  }

  .fig-toc-item {
    display: flex;
    align-items: baseline;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px dotted var(--rule);
    text-decoration: none;
    color: var(--ink);
    transition: color 0.2s;
  }

  .fig-toc-item:hover { color: var(--accent); }

  .fig-toc-num {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    color: var(--accent);
    min-width: 28px;
  }

  .fig-toc-text { font-size: 13px; line-height: 1.4; }

  /* MAIN CONTENT */
  .fig-content {
    max-width: 900px;
    margin: 0 auto;
    padding: 80px 60px;
  }

  /* CATEGORY HEADERS */
  .fig-cat-header {
    margin: 72px 0 40px;
    padding-bottom: 16px;
    border-bottom: 3px solid var(--ink);
    display: flex;
    align-items: baseline;
    gap: 20px;
  }

  .fig-cat-header h2 {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 700;
    color: var(--ink);
  }

  .fig-cat-header .cat-tag {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: var(--paper);
    background: var(--accent);
    padding: 3px 10px;
    text-transform: uppercase;
  }

  /* QUESTION CARDS */
  .fig-q-card {
    margin-bottom: 56px;
    position: relative;
  }

  .fig-q-card::before {
    content: '';
    position: absolute;
    left: -24px;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--rule);
    transition: background 0.3s;
  }

  .fig-q-card:hover::before { background: var(--accent); }

  .fig-q-header {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 16px;
  }

  .fig-q-number {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    color: var(--paper);
    background: var(--ink);
    padding: 4px 8px;
    min-width: 36px;
    text-align: center;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .fig-q-text {
    font-family: 'Playfair Display', serif;
    font-size: 19px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1.35;
  }

  .fig-a-text {
    color: #2a2520;
    font-size: 14.5px;
    line-height: 1.8;
    padding-left: 52px;
  }

  .fig-a-text code {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12.5px;
    background: rgba(0,0,0,0.06);
    padding: 1px 5px;
    border-radius: 3px;
  }

  /* CODE BLOCKS */
  .fig-code-block {
    margin: 20px 0 20px 52px;
    border-radius: 0;
    overflow: hidden;
    border: 1px solid #2d2d3f;
  }

  .fig-code-header {
    background: #13131f;
    padding: 8px 16px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.1em;
    color: #6c7086;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .fig-code-header::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent);
  }

  .fig-wrap pre {
    background: var(--code-bg);
    padding: 20px;
    overflow-x: auto;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12.5px;
    line-height: 1.7;
    color: var(--code-fg);
    margin: 0;
  }

  .fig-wrap .kw { color: var(--code-key); }
  .fig-wrap .str { color: var(--code-str); }
  .fig-wrap .cmt { color: var(--code-cmt); font-style: italic; }
  .fig-wrap .fn { color: var(--code-fn); }
  .fig-wrap .num { color: var(--code-num); }
  .fig-wrap .tag { color: #f38ba8; }
  .fig-wrap .attr { color: var(--code-key); }
  .fig-wrap .val { color: var(--code-str); }

  /* FOOTER */
  .fig-footer {
    border-top: 3px solid var(--ink);
    padding: 40px 100px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--ink);
    color: var(--paper);
  }

  .fig-footer .footer-left {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 700;
  }

  .fig-footer .footer-right {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    color: #888;
    text-align: right;
    line-height: 1.8;
  }

  /* Back link */
  .fig-back {
    position: fixed;
    top: 16px;
    left: 16px;
    z-index: 999;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: var(--ink);
    color: var(--paper);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    text-decoration: none;
    text-transform: uppercase;
    transition: opacity 0.2s;
  }
  .fig-back:hover { opacity: 0.8; }

  @media (max-width: 768px) {
    .fig-cover { padding: 60px 32px; }
    .fig-cover::before { display: none; }
    .fig-toc { padding: 60px 32px; }
    .fig-content { padding: 60px 32px; }
    .fig-footer { padding: 40px 32px; flex-direction: column; gap: 20px; }
    .fig-code-block, .fig-a-text { padding-left: 0; margin-left: 0; }
  }

  @media print {
    .fig-back { display: none; }
    .fig-cover::before { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .fig-q-number { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .fig-wrap pre { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .fig-q-card { page-break-inside: avoid; }
    .fig-cat-header { page-break-after: avoid; }
  }
`;

export default function FrontendInterviewGuidePage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="fig-wrap">
        {/* Back to app */}
        <a href="/app" className="fig-back">← Back to App</a>

        {/* COVER */}
        <div className="fig-cover">
          <div className="fig-cover-deco">30</div>
          <div className="fig-cover-inner">
            <div className="fig-cover-tag">// Interview Preparation Guide</div>
            <h1>Frontend<br />Dev<br /><span>Interview</span></h1>
            <p className="fig-cover-desc">
              30 essential questions covering the full spectrum of modern frontend development —
              from core web fundamentals to React and Next.js at an intermediate level.
            </p>
            <div className="fig-cover-meta">
              <div className="fig-cover-meta-item">
                <span className="label">Questions</span>
                <span className="value">30</span>
              </div>
              <div className="fig-cover-meta-item">
                <span className="label">Level</span>
                <span className="value">Intermediate</span>
              </div>
              <div className="fig-cover-meta-item">
                <span className="label">Stack</span>
                <span className="value">React · Next.js</span>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE OF CONTENTS */}
        <div className="fig-toc">
          <div className="fig-section-label">Table of Contents</div>
          <div className="fig-toc-grid">
            {[
              [1,'HTML Semantic Structure'],[2,'CSS Box Model'],[3,'CSS Flexbox vs Grid'],
              [4,'Responsive Design'],[5,'CSS Variables & Custom Properties'],
              [6,'JavaScript Event Loop'],[7,'Promises & Async/Await'],[8,'ES6+ Features'],
              [9,'DOM Manipulation'],[10,'Fetch API & HTTP'],[11,'React Component Lifecycle'],
              [12,'useState & useEffect'],[13,'useRef & useMemo'],[14,'useContext & useReducer'],
              [15,'Custom Hooks'],[16,'React Performance Optimization'],[17,'Props & State'],
              [18,'Conditional Rendering & Lists'],[19,'React Forms & Controlled Components'],
              [20,'Error Boundaries'],[21,'Next.js Rendering Strategies'],[22,'Next.js App Router'],
              [23,'Server vs Client Components'],[24,'Next.js Data Fetching'],
              [25,'Next.js Image & Font Optimization'],[26,'Web Accessibility (a11y)'],
              [27,'Web Performance Metrics'],[28,'Browser Storage'],
              [29,'TypeScript with React'],[30,'Testing Frontend Code'],
            ].map(([num, text]) => (
              <a key={num} href={`#q${num}`} className="fig-toc-item">
                <span className="fig-toc-num">{String(num).padStart(2, '0')}</span>
                <span className="fig-toc-text">{text as string}</span>
              </a>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="fig-content">

          {/* HTML & CSS */}
          <div className="fig-cat-header">
            <span className="cat-tag">01–05</span>
            <h2>HTML &amp; CSS Fundamentals</h2>
          </div>

          <div className="fig-q-card" id="q1">
            <div className="fig-q-header">
              <span className="fig-q-number">01</span>
              <p className="fig-q-text">What is semantic HTML, and why does it matter for web development?</p>
            </div>
            <p className="fig-a-text">
              Semantic HTML refers to using elements that carry inherent meaning about the content they wrap — such as <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;article&gt;</code>, <code>&lt;section&gt;</code>, and <code>&lt;footer&gt;</code> — rather than relying on generic <code>&lt;div&gt;</code> and <code>&lt;span&gt;</code> tags for everything. Using semantic elements improves accessibility because screen readers use the document structure to help users navigate; a <code>&lt;nav&gt;</code> landmark lets a screen reader user jump directly to navigation. Search engines also benefit because they can better understand the hierarchy and purpose of content on the page. From a maintainability standpoint, semantic HTML makes code more readable and self-documenting for other developers. Finally, semantic structure often reduces the need for extra CSS classes and JavaScript hooks, keeping code leaner.
            </p>
          </div>

          <div className="fig-q-card" id="q2">
            <div className="fig-q-header">
              <span className="fig-q-number">02</span>
              <p className="fig-q-text">Explain the CSS Box Model and how <code>box-sizing</code> affects layout.</p>
            </div>
            <p className="fig-a-text">
              Every HTML element is rendered as a rectangular box composed of four areas: content, padding, border, and margin — from inside out. By default, <code>box-sizing: content-box</code> means that <code>width</code> and <code>height</code> only measure the content area; padding and border are added on top of that, making elements larger than you declared. Switching to <code>box-sizing: border-box</code> makes <code>width</code> and <code>height</code> include padding and border, so a <code>width: 300px</code> element stays 300px regardless of padding. Most modern codebases apply <code>*, *::before, *::after {"{ box-sizing: border-box }"}</code> globally to avoid sizing surprises. Understanding this distinction is essential for building predictable, pixel-accurate layouts without constant trial-and-error adjustments.
            </p>
            <div className="fig-code-block">
              <div className="fig-code-header">css — box-sizing example</div>
              <pre dangerouslySetInnerHTML={{ __html: `<span class="cmt">/* Apply border-box globally (recommended) */</span>\n<span class="fn">*</span>, <span class="fn">*::before</span>, <span class="fn">*::after</span> {\n  <span class="kw">box-sizing</span>: border-box;\n}\n\n<span class="fn">.card</span> {\n  <span class="kw">width</span>: <span class="num">300px</span>;\n  <span class="kw">padding</span>: <span class="num">24px</span>;\n  <span class="kw">border</span>: <span class="num">2px</span> solid #ccc;\n  <span class="cmt">/* Total rendered width: 300px (not 350px) */</span>\n}` }} />
            </div>
          </div>

          <div className="fig-q-card" id="q3">
            <div className="fig-q-header">
              <span className="fig-q-number">03</span>
              <p className="fig-q-text">What are the key differences between CSS Flexbox and CSS Grid, and when should you use each?</p>
            </div>
            <p className="fig-a-text">
              Flexbox is a one-dimensional layout system that arranges items along a single axis — either row or column — making it ideal for components like navigation bars, button groups, and cards where items flow in a line with alignment control. CSS Grid is two-dimensional, managing both rows and columns simultaneously, which makes it perfect for macro page layouts, image galleries, and any design that requires precise placement across both axes. A practical rule of thumb: use Flexbox when content dictates size and flow, and use Grid when the layout dictates where content goes. They are also complementary — a common pattern is to use Grid for the overall page structure and Flexbox inside individual components. Both are widely supported and should be preferred over older techniques like floats and inline-block.
            </p>
            <div className="fig-code-block">
              <div className="fig-code-header">css — flexbox vs grid</div>
              <pre dangerouslySetInnerHTML={{ __html: `<span class="cmt">/* Flexbox: row of items */</span>\n<span class="fn">.nav</span> {\n  <span class="kw">display</span>: flex;\n  <span class="kw">gap</span>: <span class="num">16px</span>;\n  <span class="kw">align-items</span>: center;\n}\n\n<span class="cmt">/* Grid: 3-column page layout */</span>\n<span class="fn">.page</span> {\n  <span class="kw">display</span>: grid;\n  <span class="kw">grid-template-columns</span>: <span class="num">240px</span> <span class="num">1fr</span> <span class="num">320px</span>;\n  <span class="kw">gap</span>: <span class="num">24px</span>;\n}` }} />
            </div>
          </div>

          <div className="fig-q-card" id="q4">
            <div className="fig-q-header">
              <span className="fig-q-number">04</span>
              <p className="fig-q-text">How do you approach responsive design, and what are CSS media queries?</p>
            </div>
            <p className="fig-a-text">
              Responsive design ensures a website looks and works well across a wide range of screen sizes, from mobile phones to large desktop monitors. The foundation is a mobile-first approach: you write base styles for small screens and use media queries to add complexity as the viewport grows, which keeps CSS manageable and prioritizes performance on mobile networks. CSS media queries use the <code>@media</code> rule to apply styles only when certain conditions — like <code>min-width</code> or <code>max-width</code> — are met. Beyond media queries, responsive design also involves using relative units like <code>%</code>, <code>em</code>, <code>rem</code>, <code>vw</code>, and <code>vh</code>, and leveraging fluid techniques like <code>clamp()</code> for typography that scales smoothly. Flexible Grid and Flexbox layouts with <code>auto-fill</code> and <code>minmax()</code> can often eliminate the need for many breakpoints altogether.
            </p>
            <div className="fig-code-block">
              <div className="fig-code-header">css — mobile-first media query</div>
              <pre dangerouslySetInnerHTML={{ __html: `<span class="cmt">/* Base (mobile) */</span>\n<span class="fn">.grid</span> { <span class="kw">grid-template-columns</span>: <span class="num">1fr</span>; }\n\n<span class="cmt">/* Tablet and up */</span>\n<span class="kw">@media</span> (min-width: <span class="num">768px</span>) {\n  <span class="fn">.grid</span> { <span class="kw">grid-template-columns</span>: repeat(<span class="num">2</span>, <span class="num">1fr</span>); }\n}\n\n<span class="cmt">/* Fluid typography */</span>\n<span class="fn">h1</span> { <span class="kw">font-size</span>: clamp(<span class="num">28px</span>, <span class="num">5vw</span>, <span class="num">56px</span>); }` }} />
            </div>
          </div>

          <div className="fig-q-card" id="q5">
            <div className="fig-q-header">
              <span className="fig-q-number">05</span>
              <p className="fig-q-text">What are CSS Custom Properties (variables), and how do they improve styling workflows?</p>
            </div>
            <p className="fig-a-text">
              CSS Custom Properties, declared with a double-dash prefix (e.g., <code>--primary-color</code>) and accessed via <code>var()</code>, are native CSS variables that cascade and can be updated at runtime with JavaScript. Unlike preprocessor variables (Sass/Less), they are dynamic — changing a custom property on a parent element instantly updates all children that reference it, making runtime theming (like dark mode) straightforward without recompiling. They can be scoped to any selector, which enables component-level design tokens while maintaining a global token system on <code>:root</code>. They also work natively in all modern browsers without a build step. Using custom properties for colors, spacing, and typography creates a single source of truth that makes global style changes and theming dramatically easier to maintain.
            </p>
            <div className="fig-code-block">
              <div className="fig-code-header">css — custom properties for theming</div>
              <pre dangerouslySetInnerHTML={{ __html: `<span class="fn">:root</span> {\n  <span class="kw">--color-bg</span>: #ffffff;\n  <span class="kw">--color-text</span>: #0d0d0d;\n  <span class="kw">--radius</span>: <span class="num">8px</span>;\n}\n\n<span class="fn">[data-theme="dark"]</span> {\n  <span class="kw">--color-bg</span>: #0d0d0d;\n  <span class="kw">--color-text</span>: #f5f5f5;\n}\n\n<span class="fn">.card</span> {\n  <span class="kw">background</span>: var(<span class="kw">--color-bg</span>);\n  <span class="kw">color</span>: var(<span class="kw">--color-text</span>);\n  <span class="kw">border-radius</span>: var(<span class="kw">--radius</span>);\n}` }} />
            </div>
          </div>

          {/* JavaScript */}
          <div className="fig-cat-header">
            <span className="cat-tag">06–10</span>
            <h2>JavaScript Core</h2>
          </div>

          <div className="fig-q-card" id="q6">
            <div className="fig-q-header">
              <span className="fig-q-number">06</span>
              <p className="fig-q-text">What is the JavaScript Event Loop, and how does it handle asynchronous code?</p>
            </div>
            <p className="fig-a-text">
              JavaScript is single-threaded, meaning it executes one piece of code at a time on the call stack. The event loop is the mechanism that allows JavaScript to handle asynchronous operations (like timers, network requests, and user events) without blocking. When an async operation completes, its callback is placed in the task queue (or microtask queue for Promises); the event loop continuously checks whether the call stack is empty and, if so, pushes the next queued task onto it. Microtasks (Promises, <code>queueMicrotask</code>) are prioritized and run before the next macrotask (setTimeout, setInterval). Understanding this explains why <code>console.log</code> after a resolved Promise runs before a <code>setTimeout(fn, 0)</code> callback — microtasks always drain first.
            </p>
          </div>

          <div className="fig-q-card" id="q7">
            <div className="fig-q-header">
              <span className="fig-q-number">07</span>
              <p className="fig-q-text">What are Promises, and how does <code>async/await</code> improve working with them?</p>
            </div>
            <p className="fig-a-text">
              A Promise is an object representing the eventual completion or failure of an asynchronous operation, with three states: pending, fulfilled, or rejected. You can chain async operations using <code>.then()</code> and handle errors with <code>.catch()</code>, but deeply nested chains become hard to read. <code>async/await</code>, introduced in ES2017, is syntactic sugar over Promises that lets you write asynchronous code that reads like synchronous code. An <code>async</code> function always returns a Promise, and <code>await</code> pauses execution inside that function until the awaited Promise settles. Wrapping <code>await</code> in a <code>try/catch</code> block provides clean, readable error handling, and <code>Promise.all()</code> lets you run multiple awaited calls in parallel rather than sequentially.
            </p>
            <div className="fig-code-block">
              <div className="fig-code-header">javascript — async/await</div>
              <pre dangerouslySetInnerHTML={{ __html: `<span class="kw">async function</span> <span class="fn">fetchUser</span>(id) {\n  <span class="kw">try</span> {\n    <span class="kw">const</span> res = <span class="kw">await</span> fetch(<span class="str">\`/api/users/\${id}\`</span>);\n    <span class="kw">if</span> (!res.ok) <span class="kw">throw new</span> <span class="fn">Error</span>(<span class="str">"Not found"</span>);\n    <span class="kw">const</span> data = <span class="kw">await</span> res.<span class="fn">json</span>();\n    <span class="kw">return</span> data;\n  } <span class="kw">catch</span> (err) {\n    console.<span class="fn">error</span>(err);\n  }\n}` }} />
            </div>
          </div>

          <div className="fig-q-card" id="q8">
            <div className="fig-q-header">
              <span className="fig-q-number">08</span>
              <p className="fig-q-text">What are the most important ES6+ features every frontend developer should know?</p>
            </div>
            <p className="fig-a-text">
              ES6 and later editions introduced a substantial set of features that are now standard in modern frontend codebases. The most essential include <code>let</code>/<code>const</code> for block-scoped variables, arrow functions for concise syntax and lexical <code>this</code> binding, template literals for readable string interpolation, destructuring assignment for cleanly extracting values from objects and arrays, and the spread/rest operators (<code>...</code>) for immutable data manipulation. Modules (<code>import</code>/<code>export</code>) enable code splitting and a proper module system. Optional chaining (<code>?.</code>) and nullish coalescing (<code>??</code>) from ES2020 are daily-use features that prevent verbose null checks. Array methods like <code>.map()</code>, <code>.filter()</code>, <code>.reduce()</code>, and <code>.find()</code> are fundamental to the functional, declarative style used throughout React.
            </p>
          </div>

          <div className="fig-q-card" id="q9">
            <div className="fig-q-header">
              <span className="fig-q-number">09</span>
              <p className="fig-q-text">What is the difference between event bubbling and event capturing in the DOM?</p>
            </div>
            <p className="fig-a-text">
              When a user interaction (like a click) occurs, the browser dispatches the event in two phases. In the capturing phase, the event travels from the document root down through the DOM tree to the target element. In the bubbling phase, the event travels back up from the target through its ancestors to the root. By default, most event listeners fire during bubbling, which is why clicking a child element also triggers click handlers on its parents. You can stop an event from bubbling using <code>event.stopPropagation()</code>. Event delegation leverages this behavior intentionally — instead of attaching a listener to every list item, you attach one listener to the parent and check <code>event.target</code> to determine which child was clicked, which is far more memory-efficient for dynamic lists.
            </p>
          </div>

          <div className="fig-q-card" id="q10">
            <div className="fig-q-header">
              <span className="fig-q-number">10</span>
              <p className="fig-q-text">How does the Fetch API work, and what&apos;s the difference between <code>GET</code> and <code>POST</code> requests?</p>
            </div>
            <p className="fig-a-text">
              The Fetch API is the modern, Promise-based standard for making HTTP requests in the browser, replacing the older <code>XMLHttpRequest</code>. A <code>GET</code> request is used to retrieve data from a server and sends all parameters as URL query strings; it should have no side effects and be idempotent. A <code>POST</code> request sends data in the request body, typically as JSON, and is used to create or submit new data — it is not idempotent. One important Fetch gotcha: a failed HTTP status (like 404 or 500) does not cause the Promise to reject; you must manually check <code>response.ok</code> or <code>response.status</code>. In Next.js, the native <code>fetch</code> is extended with caching options, making it the primary data-fetching primitive in Server Components.
            </p>
            <div className="fig-code-block">
              <div className="fig-code-header">javascript — fetch post request</div>
              <pre dangerouslySetInnerHTML={{ __html: `<span class="kw">const</span> res = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">'/api/posts'</span>, {\n  method: <span class="str">'POST'</span>,\n  headers: { <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span> },\n  body: <span class="fn">JSON.stringify</span>({ title: <span class="str">'Hello World'</span> }),\n});\n\n<span class="kw">if</span> (!res.ok) <span class="kw">throw new</span> <span class="fn">Error</span>(<span class="str">\`HTTP error: \${res.status}\`</span>);\n<span class="kw">const</span> post = <span class="kw">await</span> res.<span class="fn">json</span>();` }} />
            </div>
          </div>

          {/* React */}
          <div className="fig-cat-header">
            <span className="cat-tag">11–20</span>
            <h2>React</h2>
          </div>

          <div className="fig-q-card" id="q11">
            <div className="fig-q-header">
              <span className="fig-q-number">11</span>
              <p className="fig-q-text">How does the React component lifecycle work in functional components?</p>
            </div>
            <p className="fig-a-text">
              In functional components, the lifecycle is managed through the <code>useEffect</code> hook rather than class-based methods like <code>componentDidMount</code>. When a component first renders, all effects with an empty dependency array <code>[]</code> run once — equivalent to <code>componentDidMount</code>. Effects with values in the dependency array run whenever those values change — equivalent to <code>componentDidUpdate</code>. A cleanup function returned from <code>useEffect</code> runs before the component unmounts or before the effect re-runs — equivalent to <code>componentWillUnmount</code>. React 18&apos;s Strict Mode intentionally mounts, unmounts, and remounts components in development to expose side effects that don&apos;t clean up properly. Understanding this order is critical for managing subscriptions, timers, and API calls correctly.
            </p>
          </div>

          <div className="fig-q-card" id="q12">
            <div className="fig-q-header">
              <span className="fig-q-number">12</span>
              <p className="fig-q-text">Explain <code>useState</code> and <code>useEffect</code> with a practical example.</p>
            </div>
            <p className="fig-a-text">
              <code>useState</code> is React&apos;s hook for declaring state variables in functional components; it returns the current value and a setter function, and calling the setter triggers a re-render. <code>useEffect</code> lets you perform side effects — like fetching data, subscribing to events, or manipulating the DOM — after a render. The dependency array controls when the effect re-runs: omitting it runs on every render, an empty array runs only on mount, and listing values runs whenever any of them change. It&apos;s important to declare every value used inside an effect in the dependency array to avoid stale closures. The cleanup function prevents memory leaks by canceling subscriptions or aborting fetch requests when the component unmounts.
            </p>
            <div className="fig-code-block">
              <div className="fig-code-header">jsx — useState + useEffect</div>
              <pre dangerouslySetInnerHTML={{ __html: `<span class="kw">import</span> { useState, useEffect } <span class="kw">from</span> <span class="str">'react'</span>;\n\n<span class="kw">export default function</span> <span class="fn">UserProfile</span>({ userId }) {\n  <span class="kw">const</span> [user, setUser] = <span class="fn">useState</span>(<span class="kw">null</span>);\n\n  <span class="fn">useEffect</span>(() => {\n    <span class="kw">const</span> controller = <span class="kw">new</span> <span class="fn">AbortController</span>();\n    <span class="fn">fetch</span>(<span class="str">\`/api/users/\${userId}\`</span>, { signal: controller.signal })\n      .<span class="fn">then</span>(r => r.<span class="fn">json</span>())\n      .<span class="fn">then</span>(setUser);\n    <span class="kw">return</span> () => controller.<span class="fn">abort</span>(); <span class="cmt">// cleanup</span>\n  }, [userId]);\n\n  <span class="kw">if</span> (!user) <span class="kw">return</span> &lt;<span class="tag">p</span>&gt;Loading...&lt;/<span class="tag">p</span>&gt;;\n  <span class="kw">return</span> &lt;<span class="tag">h1</span>&gt;{user.name}&lt;/<span class="tag">h1</span>&gt;;\n}` }} />
            </div>
          </div>

          <div className="fig-q-card" id="q13">
            <div className="fig-q-header">
              <span className="fig-q-number">13</span>
              <p className="fig-q-text">What are <code>useRef</code> and <code>useMemo</code>, and when would you use them?</p>
            </div>
            <p className="fig-a-text">
              <code>useRef</code> returns a mutable object whose <code>.current</code> property persists across renders without triggering a re-render when changed. Its two main uses are holding a reference to a DOM element (e.g., to focus an input or measure its size) and storing a mutable value that shouldn&apos;t cause re-renders, like a timer ID or a previous state snapshot. <code>useMemo</code> memoizes the result of an expensive computation, recomputing it only when its dependencies change; this prevents a costly calculation from running on every render. However, both hooks come with overhead, so they should be used purposefully rather than by default. The most common misuse of <code>useMemo</code> is wrapping cheap computations, which actually makes code slightly slower due to the memoization bookkeeping.
            </p>
            <div className="fig-code-block">
              <div className="fig-code-header">jsx — useRef &amp; useMemo</div>
              <pre dangerouslySetInnerHTML={{ __html: `<span class="kw">const</span> inputRef = <span class="fn">useRef</span>(<span class="kw">null</span>);\n<span class="kw">const</span> <span class="fn">focusInput</span> = () => inputRef.current.<span class="fn">focus</span>();\n\n<span class="cmt">// Expensive computation only reruns when list changes</span>\n<span class="kw">const</span> sorted = <span class="fn">useMemo</span>(\n  () => [...list].<span class="fn">sort</span>((a, b) => a.score - b.score),\n  [list]\n);` }} />
            </div>
          </div>

          <div className="fig-q-card" id="q14">
            <div className="fig-q-header">
              <span className="fig-q-number">14</span>
              <p className="fig-q-text">What is the React Context API, and how does <code>useReducer</code> complement it for state management?</p>
            </div>
            <p className="fig-a-text">
              The Context API lets you share state across the component tree without manually passing props through intermediate components — a problem known as &quot;prop drilling.&quot; You create a context with <code>React.createContext()</code>, wrap a subtree in a Provider with a <code>value</code>, and consume it anywhere inside that tree with <code>useContext()</code>. <code>useReducer</code> is a state hook that manages more complex state through a pure reducer function, similar to Redux but built into React. Pairing them is a powerful pattern: <code>useReducer</code> holds the state and dispatch function, which are then passed down via Context, giving you a lightweight global state solution. This approach is ideal for medium-complexity apps that don&apos;t yet need a full external state management library.
            </p>
            <div className="fig-code-block">
              <div className="fig-code-header">jsx — context + useReducer</div>
              <pre dangerouslySetInnerHTML={{ __html: `<span class="kw">const</span> StoreCtx = <span class="fn">createContext</span>(<span class="kw">null</span>);\n\n<span class="kw">function</span> <span class="fn">reducer</span>(state, action) {\n  <span class="kw">switch</span> (action.type) {\n    <span class="kw">case</span> <span class="str">'INCREMENT'</span>: <span class="kw">return</span> { count: state.count + <span class="num">1</span> };\n    <span class="kw">default</span>: <span class="kw">return</span> state;\n  }\n}\n\n<span class="kw">export function</span> <span class="fn">StoreProvider</span>({ children }) {\n  <span class="kw">const</span> [state, dispatch] = <span class="fn">useReducer</span>(reducer, { count: <span class="num">0</span> });\n  <span class="kw">return</span> (\n    &lt;<span class="tag">StoreCtx.Provider</span> <span class="attr">value</span>=<span class="val">{{ state, dispatch }}</span>&gt;\n      {children}\n    &lt;/<span class="tag">StoreCtx.Provider</span>&gt;\n  );\n}` }} />
            </div>
          </div>

          <div className="fig-q-card" id="q15">
            <div className="fig-q-header">
              <span className="fig-q-number">15</span>
              <p className="fig-q-text">What are custom hooks in React, and why are they useful?</p>
            </div>
            <p className="fig-a-text">
              A custom hook is a plain JavaScript function whose name starts with <code>use</code> and that calls one or more built-in React hooks. They exist to extract and reuse stateful logic across multiple components without changing the component tree — unlike higher-order components or render props. For example, a <code>useFetch</code> hook encapsulates loading, data, and error state for API calls so that any component can use it with a single line. Custom hooks keep components thin and focused on rendering rather than logic, making them easier to test in isolation. They are also composable — one custom hook can call another, allowing complex behaviors to be assembled from smaller, well-tested pieces.
            </p>
            <div className="fig-code-block">
              <div className="fig-code-header">jsx — custom hook: useLocalStorage</div>
              <pre dangerouslySetInnerHTML={{ __html: `<span class="kw">function</span> <span class="fn">useLocalStorage</span>(key, initial) {\n  <span class="kw">const</span> [value, setValue] = <span class="fn">useState</span>(() => {\n    <span class="kw">const</span> stored = localStorage.<span class="fn">getItem</span>(key);\n    <span class="kw">return</span> stored ? <span class="fn">JSON.parse</span>(stored) : initial;\n  });\n\n  <span class="kw">const</span> setStored = (v) => {\n    setValue(v);\n    localStorage.<span class="fn">setItem</span>(key, <span class="fn">JSON.stringify</span>(v));\n  };\n\n  <span class="kw">return</span> [value, setStored];\n}` }} />
            </div>
          </div>

          <div className="fig-q-card" id="q16">
            <div className="fig-q-header">
              <span className="fig-q-number">16</span>
              <p className="fig-q-text">How do you optimize React performance, and what is <code>React.memo</code>?</p>
            </div>
            <p className="fig-a-text">
              React re-renders a component whenever its state or props change, and by default also re-renders all child components. <code>React.memo</code> is a higher-order component that wraps a functional component and shallowly compares its props; if they haven&apos;t changed, React skips the re-render entirely. <code>useCallback</code> memoizes a function reference so that passing it as a prop to a memoized child doesn&apos;t break memoization on every render. Code splitting with <code>React.lazy</code> and <code>Suspense</code> defers loading components until they&apos;re needed, shrinking the initial bundle. Virtualization libraries (like TanStack Virtual) are essential for rendering long lists efficiently. Finally, avoiding unnecessary state lifts and keeping state as close to where it&apos;s used as possible naturally reduces the scope of re-renders.
            </p>
          </div>

          <div className="fig-q-card" id="q17">
            <div className="fig-q-header">
              <span className="fig-q-number">17</span>
              <p className="fig-q-text">What is the difference between props and state in React?</p>
            </div>
            <p className="fig-a-text">
              Props (short for properties) are read-only values passed from a parent component to a child, used to configure how the child renders; a component cannot modify its own props. State is data owned and managed by the component itself, and it can change over time in response to user actions or other events — triggering a re-render when updated via the setter from <code>useState</code>. A good mental model: props are like function arguments (external input), while state is like local variables (internal memory). When multiple components need to share the same piece of state, you &quot;lift it up&quot; to their nearest common ancestor and pass it down as props. This unidirectional data flow — props flowing down, events flowing up — is a core architectural principle in React.
            </p>
          </div>

          <div className="fig-q-card" id="q18">
            <div className="fig-q-header">
              <span className="fig-q-number">18</span>
              <p className="fig-q-text">How does conditional rendering work in React, and what are the patterns for rendering lists?</p>
            </div>
            <p className="fig-a-text">
              React uses standard JavaScript logic for conditional rendering — you can use <code>if</code> statements, ternary expressions (<code>condition ? A : B</code>), or short-circuit evaluation (<code>condition &amp;&amp; &lt;Component /&gt;</code>) directly in JSX. The short-circuit pattern is convenient but has a pitfall: if the condition is a falsy number like <code>0</code>, React will render the number <code>0</code> instead of nothing, so prefer a boolean check. For rendering lists, you use <code>Array.map()</code> to transform an array of data into an array of JSX elements. Each list item must have a stable, unique <code>key</code> prop so React can identify which items changed during reconciliation. Keys should come from your data (like a database ID), not from the array index, as index-based keys break reconciliation when items are reordered or removed.
            </p>
            <div className="fig-code-block">
              <div className="fig-code-header">jsx — list rendering</div>
              <pre dangerouslySetInnerHTML={{ __html: `<span class="kw">const</span> <span class="fn">List</span> = ({ items, loading }) => (\n  &lt;<span class="tag">div</span>&gt;\n    {loading &amp;&amp; &lt;<span class="tag">Spinner</span> /&gt;}\n    {!loading &amp;&amp; items.<span class="fn">map</span>(item => (\n      &lt;<span class="tag">li</span> <span class="attr">key</span>=<span class="val">{item.id}</span>&gt;{item.name}&lt;/<span class="tag">li</span>&gt;\n    ))}\n  &lt;/<span class="tag">div</span>&gt;\n);` }} />
            </div>
          </div>

          <div className="fig-q-card" id="q19">
            <div className="fig-q-header">
              <span className="fig-q-number">19</span>
              <p className="fig-q-text">What are controlled components in React forms, and how do you handle form submissions?</p>
            </div>
            <p className="fig-a-text">
              A controlled component is one where React state is the single source of truth for the input&apos;s value — the input&apos;s <code>value</code> is bound to a state variable, and an <code>onChange</code> handler updates that state on every keystroke. This gives you full programmatic control over the form data: you can validate, transform, or conditionally disable fields at any point. The alternative, uncontrolled components, use a <code>ref</code> to read the DOM directly on submit, which is simpler for trivial forms but harder to validate dynamically. For form handling at scale, libraries like React Hook Form offer better performance by minimizing re-renders and provide built-in validation integration with schema libraries like Zod. Form submissions are handled via an <code>onSubmit</code> handler where you call <code>event.preventDefault()</code> to stop the browser&apos;s default page reload.
            </p>
          </div>

          <div className="fig-q-card" id="q20">
            <div className="fig-q-header">
              <span className="fig-q-number">20</span>
              <p className="fig-q-text">What are React Error Boundaries, and when should you use them?</p>
            </div>
            <p className="fig-a-text">
              Error boundaries are React components that catch JavaScript errors thrown anywhere in their child component tree during rendering, in lifecycle methods, or in constructors, and display a fallback UI instead of crashing the entire page. They must be class components implementing <code>static getDerivedStateFromError()</code> and/or <code>componentDidCatch()</code>, since there is no hook equivalent yet. You should wrap distinct sections of your UI (like a sidebar, a chart, or a widget) in separate error boundaries so that one failing component doesn&apos;t break unrelated parts of the page. They are not suited for catching errors inside event handlers (use try/catch there) or in async code. In Next.js, the <code>error.js</code> file convention creates an error boundary automatically for a route segment, providing route-level error recovery.
            </p>
          </div>

          {/* Next.js */}
          <div className="fig-cat-header">
            <span className="cat-tag">21–25</span>
            <h2>Next.js</h2>
          </div>

          <div className="fig-q-card" id="q21">
            <div className="fig-q-header">
              <span className="fig-q-number">21</span>
              <p className="fig-q-text">What are the different rendering strategies in Next.js, and when do you use each?</p>
            </div>
            <p className="fig-a-text">
              Next.js supports four rendering strategies. Static Site Generation (SSG) pre-renders HTML at build time, making it the fastest for content that doesn&apos;t change often, like marketing pages or documentation. Server-Side Rendering (SSR) generates fresh HTML on every request, suitable for pages that need real-time data or user-specific content. Incremental Static Regeneration (ISR) combines both — pages are statically generated but can be revalidated in the background after a specified interval, ideal for frequently-updated but not real-time content. Client-Side Rendering (CSR) defers rendering to the browser, used for highly interactive dashboards where SEO is not a priority. In the App Router, the default is now static rendering; you opt into dynamic rendering by using functions like <code>cookies()</code>, <code>headers()</code>, or setting <code>dynamic = &apos;force-dynamic&apos;</code>.
            </p>
          </div>

          <div className="fig-q-card" id="q22">
            <div className="fig-q-header">
              <span className="fig-q-number">22</span>
              <p className="fig-q-text">What is the Next.js App Router, and how does it differ from the Pages Router?</p>
            </div>
            <p className="fig-a-text">
              The App Router, introduced in Next.js 13 and stabilized in 14, uses the <code>app/</code> directory and is built on React Server Components. Routes are created through folder structure with a <code>page.js</code> file, and special files like <code>layout.js</code>, <code>loading.js</code>, <code>error.js</code>, and <code>not-found.js</code> handle different UI states automatically per route segment. The Pages Router (<code>pages/</code>) uses file-based routing but relies entirely on Client Components and uses <code>getServerSideProps</code>/<code>getStaticProps</code> for data fetching at the page level. The App Router co-locates data fetching directly inside any server component, enabling more granular, component-level data loading without waterfall prop-drilling. The two routers can coexist in the same project, enabling gradual migration.
            </p>
          </div>

          <div className="fig-q-card" id="q23">
            <div className="fig-q-header">
              <span className="fig-q-number">23</span>
              <p className="fig-q-text">What is the difference between Server Components and Client Components in Next.js?</p>
            </div>
            <p className="fig-a-text">
              Server Components (the default in the App Router) render exclusively on the server — they can directly access databases, file systems, and environment secrets, and their code is never sent to the browser, which reduces the JavaScript bundle. They cannot use browser APIs, React state, or event handlers. Client Components are marked with the <code>&quot;use client&quot;</code> directive at the top of the file and run in the browser; they support interactivity, hooks, and browser APIs. A key architectural insight is that you should push interactivity to leaf components — keep as much of your tree as server components and only switch to client at the boundary where you need state or events. Server Components can pass serializable props down to Client Components, but cannot import Client Components directly without wrapping them.
            </p>
            <div className="fig-code-block">
              <div className="fig-code-header">jsx — server vs client component</div>
              <pre dangerouslySetInnerHTML={{ __html: `<span class="cmt">// app/page.js — Server Component (default)</span>\n<span class="kw">export default async function</span> <span class="fn">Page</span>() {\n  <span class="kw">const</span> data = <span class="kw">await</span> <span class="fn">fetchFromDB</span>(); <span class="cmt">// direct DB access</span>\n  <span class="kw">return</span> &lt;<span class="tag">ProductList</span> <span class="attr">items</span>=<span class="val">{data}</span> /&gt;;\n}\n\n<span class="cmt">// components/AddToCart.jsx — Client Component</span>\n<span class="str">"use client"</span>;\n<span class="kw">export default function</span> <span class="fn">AddToCart</span>({ id }) {\n  <span class="kw">const</span> [added, setAdded] = <span class="fn">useState</span>(<span class="kw">false</span>);\n  <span class="kw">return</span> &lt;<span class="tag">button</span> <span class="attr">onClick</span>=<span class="val">{() => setAdded(true)}</span>&gt;Add&lt;/<span class="tag">button</span>&gt;;\n}` }} />
            </div>
          </div>

          <div className="fig-q-card" id="q24">
            <div className="fig-q-header">
              <span className="fig-q-number">24</span>
              <p className="fig-q-text">How does data fetching work in the Next.js App Router?</p>
            </div>
            <p className="fig-a-text">
              In the App Router, you fetch data directly inside async Server Components using the native <code>fetch</code> API extended by Next.js with caching and revalidation options. By default, <code>fetch</code> results are cached; you control the caching behavior with <code>{"{ cache: 'no-store' }"}</code> for always-fresh data or <code>{"{ next: { revalidate: 60 } }"}</code> for time-based ISR. Multiple <code>fetch</code> calls in the same render pass are automatically deduplicated if they request the same URL, preventing redundant network requests. For mutations (creating/updating data), Server Actions allow you to write server-side functions that can be called directly from forms or event handlers without building a separate API route. Parallel data fetching can be achieved by initiating multiple promises before awaiting them together with <code>Promise.all()</code>.
            </p>
            <div className="fig-code-block">
              <div className="fig-code-header">jsx — app router data fetching</div>
              <pre dangerouslySetInnerHTML={{ __html: `<span class="cmt">// Server Component — fetch with revalidation</span>\n<span class="kw">async function</span> <span class="fn">getPosts</span>() {\n  <span class="kw">const</span> res = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">'https://api.example.com/posts'</span>, {\n    next: { revalidate: <span class="num">3600</span> }, <span class="cmt">// ISR: 1 hour</span>\n  });\n  <span class="kw">return</span> res.<span class="fn">json</span>();\n}\n\n<span class="kw">export default async function</span> <span class="fn">Blog</span>() {\n  <span class="kw">const</span> posts = <span class="kw">await</span> <span class="fn">getPosts</span>();\n  <span class="kw">return</span> posts.<span class="fn">map</span>(p => &lt;<span class="tag">PostCard</span> <span class="attr">key</span>=<span class="val">{p.id}</span> {...<span class="val">p</span>} /&gt;);\n}` }} />
            </div>
          </div>

          <div className="fig-q-card" id="q25">
            <div className="fig-q-header">
              <span className="fig-q-number">25</span>
              <p className="fig-q-text">How does Next.js optimize images and fonts, and why does it matter?</p>
            </div>
            <p className="fig-a-text">
              Next.js provides a built-in <code>&lt;Image&gt;</code> component that automatically serves images in modern formats like WebP/AVIF, resizes them to the exact dimensions needed, lazy-loads them by default, and prevents Cumulative Layout Shift (CLS) by reserving space with explicit <code>width</code> and <code>height</code> props. This can dramatically reduce image payload — the single largest contributor to page weight on most sites. For fonts, <code>next/font</code> downloads Google Fonts or local fonts at build time and self-hosts them, eliminating the external network request to Google&apos;s servers that typically blocks rendering and introduces latency. Both optimizations directly improve Core Web Vitals scores (LCP, CLS) which affect both user experience and Google search ranking. The <code>priority</code> prop on the above-the-fold <code>&lt;Image&gt;</code> prevents lazy loading on hero images, further improving LCP.
            </p>
          </div>

          {/* Quality */}
          <div className="fig-cat-header">
            <span className="cat-tag">26–30</span>
            <h2>Quality, Performance &amp; Tooling</h2>
          </div>

          <div className="fig-q-card" id="q26">
            <div className="fig-q-header">
              <span className="fig-q-number">26</span>
              <p className="fig-q-text">What is web accessibility (a11y), and what are the most important practices?</p>
            </div>
            <p className="fig-a-text">
              Web accessibility means building interfaces that can be used by people with disabilities — including those using screen readers, keyboard navigation, voice control, or high-contrast display modes. The Web Content Accessibility Guidelines (WCAG) provide the widely-accepted standard, with Level AA being the target for most production applications. The most impactful practices are: using semantic HTML so assistive technologies understand structure, providing meaningful <code>alt</code> text on images, ensuring sufficient color contrast ratios (4.5:1 for normal text), making all interactive elements keyboard-focusable with visible focus indicators, and using ARIA attributes (<code>aria-label</code>, <code>aria-expanded</code>, <code>role</code>) only when semantic HTML is insufficient. In React, <code>eslint-plugin-jsx-a11y</code> catches common issues during development, and browser extensions like Axe provide automated audits.
            </p>
          </div>

          <div className="fig-q-card" id="q27">
            <div className="fig-q-header">
              <span className="fig-q-number">27</span>
              <p className="fig-q-text">What are Core Web Vitals, and how do you measure and improve them?</p>
            </div>
            <p className="fig-a-text">
              Core Web Vitals are Google&apos;s set of real-world performance metrics that measure user experience: Largest Contentful Paint (LCP) measures loading speed of the main content (target under 2.5s), Interaction to Next Paint (INP) measures responsiveness to user interactions (target under 200ms), and Cumulative Layout Shift (CLS) measures visual stability by tracking unexpected layout shifts (target under 0.1). You can measure them in production using Chrome User Experience Report data, in the lab using Lighthouse in Chrome DevTools or the PageSpeed Insights tool, and in code using the <code>web-vitals</code> npm package. Improving LCP typically means optimizing images, preloading critical resources, and using server-side rendering. Improving CLS means always specifying dimensions for images and embeds and avoiding injecting content above existing content.
            </p>
          </div>

          <div className="fig-q-card" id="q28">
            <div className="fig-q-header">
              <span className="fig-q-number">28</span>
              <p className="fig-q-text">What are the different browser storage options, and when should you use each?</p>
            </div>
            <p className="fig-a-text">
              <code>localStorage</code> provides persistent key-value string storage (up to ~5MB) that survives tab closes and browser restarts, making it suitable for user preferences and non-sensitive settings; it is synchronous and thus blocks the main thread if overused. <code>sessionStorage</code> works identically but is cleared when the browser tab closes, useful for single-session form state. Cookies are sent with every HTTP request to the server, making them the correct choice for authentication tokens and session IDs; they can be made <code>HttpOnly</code> (inaccessible to JavaScript) and <code>Secure</code> for protection. <code>IndexedDB</code> is an asynchronous, transactional database suitable for storing large amounts of structured data like offline-capable app content. In Next.js, authentication state is commonly managed with HTTP-only cookies via libraries like Auth.js, keeping tokens out of JavaScript entirely.
            </p>
          </div>

          <div className="fig-q-card" id="q29">
            <div className="fig-q-header">
              <span className="fig-q-number">29</span>
              <p className="fig-q-text">How does TypeScript improve React and Next.js development?</p>
            </div>
            <p className="fig-a-text">
              TypeScript adds static type checking to JavaScript, catching type errors at compile time (in your editor) rather than at runtime in the browser. In React, you type component props with interfaces or type aliases, which makes component APIs self-documenting and prevents incorrect usage across your codebase. Generic types allow you to build flexible, reusable hooks and utilities without sacrificing safety. Next.js has first-class TypeScript support — running <code>next dev</code> with a <code>.tsx</code> file automatically configures TypeScript, and types for <code>page.tsx</code> props like <code>params</code> and <code>searchParams</code> are provided by <code>next</code>. TypeScript also enables significantly better IDE autocomplete and refactoring, which pays off quickly in larger codebases; most modern React projects default to TypeScript from the start.
            </p>
            <div className="fig-code-block">
              <div className="fig-code-header">tsx — typed react component</div>
              <pre dangerouslySetInnerHTML={{ __html: `<span class="kw">interface</span> <span class="fn">ButtonProps</span> {\n  label: string;\n  variant?: <span class="str">'primary'</span> | <span class="str">'ghost'</span>;\n  onClick: () => <span class="kw">void</span>;\n}\n\n<span class="kw">export function</span> <span class="fn">Button</span>({ label, variant = <span class="str">'primary'</span>, onClick }: <span class="fn">ButtonProps</span>) {\n  <span class="kw">return</span> (\n    &lt;<span class="tag">button</span> <span class="attr">className</span>=<span class="val">{\`btn btn--\${variant}\`}</span> <span class="attr">onClick</span>=<span class="val">{onClick}</span>&gt;\n      {label}\n    &lt;/<span class="tag">button</span>&gt;\n  );\n}` }} />
            </div>
          </div>

          <div className="fig-q-card" id="q30">
            <div className="fig-q-header">
              <span className="fig-q-number">30</span>
              <p className="fig-q-text">What are the fundamentals of testing frontend code in a React application?</p>
            </div>
            <p className="fig-a-text">
              Frontend testing is typically organized in three layers. Unit tests verify isolated functions or hooks in pure JavaScript using a test runner like Vitest or Jest. Component tests use React Testing Library (RTL) to render components and assert on what the user sees and can interact with — RTL intentionally queries elements by accessible roles and text rather than by class names, encouraging accessible markup and testing behavior rather than implementation details. End-to-end (E2E) tests with Playwright or Cypress simulate complete user flows in a real browser. A practical guiding principle is the testing pyramid: many unit tests, a moderate number of component tests, and a few critical E2E tests — each layer provides more confidence but is slower to run. In Next.js, Server Components can be tested with server-side rendering utilities, while client interactivity is covered by RTL component tests.
            </p>
            <div className="fig-code-block">
              <div className="fig-code-header">jsx — react testing library example</div>
              <pre dangerouslySetInnerHTML={{ __html: `<span class="kw">import</span> { render, screen, fireEvent } <span class="kw">from</span> <span class="str">'@testing-library/react'</span>;\n<span class="kw">import</span> { Counter } <span class="kw">from</span> <span class="str">'./Counter'</span>;\n\n<span class="fn">test</span>(<span class="str">'increments count on click'</span>, () => {\n  <span class="fn">render</span>(&lt;<span class="tag">Counter</span> /&gt;);\n  <span class="fn">fireEvent.click</span>(screen.<span class="fn">getByRole</span>(<span class="str">'button'</span>, { name: /increment/i }));\n  <span class="fn">expect</span>(screen.<span class="fn">getByText</span>(<span class="str">'Count: 1'</span>)).<span class="fn">toBeInTheDocument</span>();\n});` }} />
            </div>
          </div>

        </div>{/* /fig-content */}

        {/* FOOTER */}
        <div className="fig-footer">
          <div className="footer-left">Frontend Interview Guide</div>
          <div className="footer-right">
            React · Next.js · Intermediate Level<br />
            30 Questions &amp; Answers
          </div>
        </div>

      </div>{/* /fig-wrap */}
    </>
  );
}
