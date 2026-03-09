import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Backend Development — Interview Preparation Guide',
  description:
    '30 essential questions spanning APIs, databases, authentication, server architecture, and performance optimization — written for developers preparing for their first backend engineering interview.',
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Barlow:wght@300;400;500;600&family=Barlow+Condensed:wght@500;600;700&family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap');

  body { overflow: auto !important; height: auto !important; }

  :root {
    --cream:    #f7f3ec;
    --cream2:   #ede8df;
    --ink:      #1c1917;
    --slate:    #334155;
    --rust:     #b45309;
    --rust-lt:  #fef3c7;
    --teal:     #0f766e;
    --teal-lt:  #ccfbf1;
    --rose:     #9f1239;
    --muted:    #78716c;
    --rule:     #d6d0c6;
    --code-bg:  #1e2736;
    --code-fg:  #e2e8f0;
    --kw:       #93c5fd;
    --fn:       #c4b5fd;
    --str:      #86efac;
    --cmt:      #64748b;
    --num:      #fcd34d;
    --tp:       #fdba74;
    --tag:      #6ee7b7;
  }

  .be-wrap *, .be-wrap *::before, .be-wrap *::after { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior:smooth; }

  .be-wrap {
    background:var(--cream);
    color:var(--ink);
    font-family:'Barlow',sans-serif;
    font-weight:300;
    font-size:15px;
    line-height:1.75;
    min-height:100vh;
  }

  /* COVER */
  .be-cover {
    min-height:100vh;
    display:grid;
    grid-template-rows:auto 1fr auto;
    background:var(--ink);
    color:var(--cream);
    position:relative;
    overflow:hidden;
  }
  .be-cover::before {
    content:'';
    position:absolute;
    inset:0;
    background:
      repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,0.04) 39px,rgba(255,255,255,0.04) 40px),
      repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,0.04) 39px,rgba(255,255,255,0.04) 40px);
  }
  .be-cover-top {
    position:relative; z-index:1; padding:40px 72px;
    display:flex; justify-content:space-between; align-items:center;
    border-bottom:1px solid rgba(255,255,255,0.1);
  }
  .be-cover-top-left {
    font-family:'Barlow Condensed',sans-serif; font-size:12px; font-weight:500;
    letter-spacing:0.15em; text-transform:uppercase; color:rgba(255,255,255,0.4);
  }
  .be-cover-top-right {
    font-family:'Courier Prime',monospace; font-size:11px; color:rgba(255,255,255,0.3);
  }
  .be-cover-body {
    position:relative; z-index:1;
    display:grid; grid-template-columns:1fr 1fr; align-items:end;
    padding:80px 72px 72px; gap:64px;
  }
  .be-cover-left h1 {
    font-family:'Libre Baskerville',serif;
    font-size:clamp(52px,7vw,96px); font-weight:700; line-height:1.0;
    letter-spacing:-3px; color:var(--cream); margin-bottom:32px;
  }
  .be-cover-left h1 span { color:var(--rust); font-style:italic; }
  .be-cover-kicker {
    font-family:'Barlow Condensed',sans-serif; font-size:13px; font-weight:500;
    letter-spacing:0.2em; text-transform:uppercase; color:var(--rust); margin-bottom:20px;
  }
  .be-cover-right { padding-bottom:8px; }
  .be-cover-right p {
    font-size:16px; line-height:1.7; color:rgba(247,243,236,0.65);
    border-left:3px solid var(--rust); padding-left:24px; margin-bottom:48px;
  }
  .be-pills { display:flex; flex-wrap:wrap; gap:10px; }
  .be-pill {
    font-family:'Barlow Condensed',sans-serif; font-size:11px; font-weight:600;
    letter-spacing:0.1em; text-transform:uppercase; padding:6px 14px;
    border:1px solid rgba(255,255,255,0.15); color:rgba(255,255,255,0.5);
  }
  .be-cover-bottom {
    position:relative; z-index:1; padding:28px 72px;
    border-top:1px solid rgba(255,255,255,0.1); display:flex; gap:64px;
  }
  .be-cover-stat { display:flex; flex-direction:column; gap:2px; }
  .be-cover-stat-n {
    font-family:'Libre Baskerville',serif; font-size:32px; font-weight:700;
    color:var(--cream); line-height:1;
  }
  .be-cover-stat-l {
    font-family:'Barlow Condensed',sans-serif; font-size:10px; font-weight:500;
    letter-spacing:0.12em; text-transform:uppercase; color:rgba(255,255,255,0.3);
  }

  /* TOC */
  .be-toc {
    background:var(--cream2); border-bottom:3px solid var(--ink); padding:64px 72px;
  }
  .be-toc-head {
    display:flex; align-items:baseline; gap:20px;
    margin-bottom:40px; padding-bottom:16px; border-bottom:1px solid var(--rule);
  }
  .be-toc-head h2 {
    font-family:'Libre Baskerville',serif; font-size:22px; font-style:italic; color:var(--ink);
  }
  .be-toc-head span {
    font-family:'Barlow Condensed',sans-serif; font-size:11px; font-weight:500;
    letter-spacing:0.12em; text-transform:uppercase; color:var(--muted);
  }
  .be-toc-cols {
    display:grid; grid-template-columns:repeat(3,1fr); gap:0 48px;
  }
  .be-toc-item {
    display:flex; align-items:baseline; gap:10px; padding:8px 0;
    border-bottom:1px dotted var(--rule); text-decoration:none; color:var(--ink);
    font-size:13px; transition:color .2s;
  }
  .be-toc-item:hover { color:var(--rust); }
  .be-toc-item:hover .be-toc-n { color:var(--rust); }
  .be-toc-n {
    font-family:'Courier Prime',monospace; font-size:11px; color:var(--muted);
    min-width:22px; flex-shrink:0;
  }
  .be-toc-cat {
    font-family:'Barlow Condensed',sans-serif; font-size:9px; font-weight:600;
    letter-spacing:0.1em; text-transform:uppercase; margin-left:auto;
    padding:2px 6px; flex-shrink:0;
  }
  .be-cat-api   { background:#dbeafe; color:#1d4ed8; }
  .be-cat-db    { background:#dcfce7; color:#15803d; }
  .be-cat-auth  { background:#fef9c3; color:#92400e; }
  .be-cat-arch  { background:#fce7f3; color:#9d174d; }
  .be-cat-perf  { background:#f3e8ff; color:#6b21a8; }
  .be-cat-sec   { background:#fee2e2; color:#991b1b; }

  /* MAIN */
  .be-main { max-width:1060px; margin:0 auto; padding:0 72px 100px; }

  /* section header */
  .be-sec-header {
    margin:80px 0 40px; display:grid; grid-template-columns:auto 1fr;
    align-items:center; gap:24px;
  }
  .be-sec-header::after { content:''; height:1px; background:var(--ink); }
  .be-sec-label { display:flex; align-items:center; gap:14px; white-space:nowrap; }
  .be-sec-num {
    font-family:'Barlow Condensed',sans-serif; font-size:11px; font-weight:600;
    letter-spacing:0.15em; text-transform:uppercase; color:var(--muted);
  }
  .be-sec-title {
    font-family:'Libre Baskerville',serif; font-size:26px; font-weight:700;
    font-style:italic; color:var(--ink);
  }
  .be-sec-badge {
    font-family:'Barlow Condensed',sans-serif; font-size:10px; font-weight:600;
    letter-spacing:0.1em; text-transform:uppercase; padding:4px 10px;
    color:var(--cream); background:var(--ink);
  }

  /* question card */
  .be-qwrap {
    margin-bottom:52px; display:grid; grid-template-columns:48px 1fr; gap:0 24px;
  }
  .be-q-sidebar { display:flex; flex-direction:column; align-items:center; padding-top:4px; }
  .be-q-num {
    font-family:'Libre Baskerville',serif; font-size:22px; font-weight:700;
    color:var(--cream2); background:var(--ink); width:44px; height:44px;
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
  }
  .be-q-line { width:1px; flex:1; background:var(--rule); margin-top:8px; }
  .be-q-question {
    font-family:'Libre Baskerville',serif; font-size:17.5px; font-weight:700;
    line-height:1.4; color:var(--ink); margin-bottom:14px;
  }
  .be-q-answer {
    font-size:14.5px; line-height:1.85; color:#3c3836; margin-bottom:0;
  }
  .be-q-answer code {
    font-family:'Courier Prime',monospace; font-size:13px;
    background:var(--cream2); border:1px solid var(--rule);
    padding:1px 6px; color:var(--teal);
  }

  /* code block */
  .be-cb { margin:18px 0 4px; border-radius:2px; overflow:hidden; border:1px solid #2d3748; }
  .be-cb-bar {
    background:#141c2b; padding:8px 18px; display:flex;
    justify-content:space-between; align-items:center; border-bottom:1px solid #2d3748;
  }
  .be-cb-name {
    font-family:'Courier Prime',monospace; font-size:11px; color:#64748b;
    display:flex; align-items:center; gap:8px;
  }
  .be-cb-name::before {
    content:''; display:inline-block; width:7px; height:7px;
    border-radius:50%; background:var(--rust);
  }
  .be-cb-lang {
    font-family:'Barlow Condensed',sans-serif; font-size:9px; font-weight:600;
    letter-spacing:0.12em; text-transform:uppercase; color:#475569;
  }
  .be-cb pre {
    background:var(--code-bg); padding:18px 22px; overflow-x:auto;
    font-family:'Courier Prime',monospace; font-size:13px; line-height:1.7;
    color:var(--code-fg); tab-size:2;
  }
  .kw { color:var(--kw); }
  .fn { color:var(--fn); }
  .str { color:var(--str); }
  .cmt { color:var(--cmt); font-style:italic; }
  .num { color:var(--num); }
  .tp { color:var(--tp); }
  .tg { color:var(--tag); }

  /* note box */
  .be-note {
    margin:14px 0 4px; padding:12px 18px; border-left:3px solid var(--teal);
    background:var(--teal-lt); font-size:13px; line-height:1.65; color:#134e4a;
  }
  .be-note strong { color:var(--teal); font-weight:600; }
  .be-note.be-warn { border-color:var(--rust); background:var(--rust-lt); color:#78350f; }
  .be-note.be-warn strong { color:var(--rust); }

  /* footer */
  .be-footer {
    background:var(--ink); color:var(--cream); padding:40px 72px;
    display:flex; justify-content:space-between; align-items:center;
  }
  .be-footer-left {
    font-family:'Libre Baskerville',serif; font-size:19px; font-style:italic; color:var(--cream);
  }
  .be-footer-left span { color:var(--rust); }
  .be-footer-right {
    font-family:'Barlow Condensed',sans-serif; font-size:11px; font-weight:500;
    letter-spacing:0.1em; text-transform:uppercase; color:rgba(255,255,255,0.3);
    text-align:right; line-height:1.9;
  }

  @media(max-width:900px) {
    .be-cover-body, .be-toc-cols { grid-template-columns:1fr; }
    .be-cover-top, .be-cover-body, .be-cover-bottom, .be-toc, .be-footer, .be-main {
      padding-left:28px; padding-right:28px;
    }
    .be-toc-cols { grid-template-columns:1fr 1fr; }
    .be-sec-header { grid-template-columns:1fr; }
    .be-sec-header::after { display:none; }
    .be-qwrap { grid-template-columns:1fr; }
    .be-q-sidebar { display:none; }
  }
  @media print {
    .be-cover, .be-qwrap, .be-cb, .be-note { page-break-inside:avoid; }
    pre { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    .be-q-num, .be-sec-badge, .be-pill { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  }
`;

export default function BackendInterviewGuidePage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="be-wrap">

        {/* ════════ COVER ════════ */}
        <div className="be-cover">
          <div className="be-cover-top">
            <span className="be-cover-top-left">Interview Preparation Series</span>
            <span className="be-cover-top-right">// backend-interview-guide</span>
          </div>
          <div className="be-cover-body">
            <div className="be-cover-left">
              <p className="be-cover-kicker">Complete Preparation Guide</p>
              <h1>Back<span>end</span><br />Devel&shy;op&shy;ment</h1>
            </div>
            <div className="be-cover-right">
              <p>30 essential questions spanning APIs, databases, authentication, server architecture, and performance optimization — written for developers preparing for their first backend engineering interview.</p>
              <div className="be-pills">
                <span className="be-pill">REST APIs</span>
                <span className="be-pill">SQL &amp; NoSQL</span>
                <span className="be-pill">Auth &amp; JWT</span>
                <span className="be-pill">Caching</span>
                <span className="be-pill">Queues</span>
                <span className="be-pill">Scalability</span>
                <span className="be-pill">Security</span>
                <span className="be-pill">Node.js</span>
              </div>
            </div>
          </div>
          <div className="be-cover-bottom">
            <div className="be-cover-stat"><span className="be-cover-stat-n">30</span><span className="be-cover-stat-l">Questions</span></div>
            <div className="be-cover-stat"><span className="be-cover-stat-n">6</span><span className="be-cover-stat-l">Topics</span></div>
            <div className="be-cover-stat"><span className="be-cover-stat-n">Mid</span><span className="be-cover-stat-l">Level</span></div>
          </div>
        </div>

        {/* ════════ TOC ════════ */}
        <div className="be-toc">
          <div className="be-toc-head">
            <h2>Contents</h2>
            <span>30 questions across 6 domains</span>
          </div>
          <div className="be-toc-cols">
            <a href="#q1" className="be-toc-item"><span className="be-toc-n">01</span>HTTP Methods &amp; Status Codes<span className="be-toc-cat be-cat-api">API</span></a>
            <a href="#q11" className="be-toc-item"><span className="be-toc-n">11</span>SQL Joins &amp; Aggregations<span className="be-toc-cat be-cat-db">DB</span></a>
            <a href="#q21" className="be-toc-item"><span className="be-toc-n">21</span>Vertical vs Horizontal Scaling<span className="be-toc-cat be-cat-arch">Arch</span></a>
            <a href="#q2" className="be-toc-item"><span className="be-toc-n">02</span>REST API Design Principles<span className="be-toc-cat be-cat-api">API</span></a>
            <a href="#q12" className="be-toc-item"><span className="be-toc-n">12</span>Database Indexing<span className="be-toc-cat be-cat-db">DB</span></a>
            <a href="#q22" className="be-toc-item"><span className="be-toc-n">22</span>Message Queues &amp; Async Processing<span className="be-toc-cat be-cat-arch">Arch</span></a>
            <a href="#q3" className="be-toc-item"><span className="be-toc-n">03</span>REST vs GraphQL vs gRPC<span className="be-toc-cat be-cat-api">API</span></a>
            <a href="#q13" className="be-toc-item"><span className="be-toc-n">13</span>SQL vs NoSQL<span className="be-toc-cat be-cat-db">DB</span></a>
            <a href="#q23" className="be-toc-item"><span className="be-toc-n">23</span>Load Balancing<span className="be-toc-cat be-cat-arch">Arch</span></a>
            <a href="#q4" className="be-toc-item"><span className="be-toc-n">04</span>API Versioning<span className="be-toc-cat be-cat-api">API</span></a>
            <a href="#q14" className="be-toc-item"><span className="be-toc-n">14</span>Database Transactions &amp; ACID<span className="be-toc-cat be-cat-db">DB</span></a>
            <a href="#q24" className="be-toc-item"><span className="be-toc-n">24</span>Caching Strategies<span className="be-toc-cat be-cat-perf">Perf</span></a>
            <a href="#q5" className="be-toc-item"><span className="be-toc-n">05</span>Request Validation &amp; Error Handling<span className="be-toc-cat be-cat-api">API</span></a>
            <a href="#q15" className="be-toc-item"><span className="be-toc-n">15</span>ORMs vs Raw SQL<span className="be-toc-cat be-cat-db">DB</span></a>
            <a href="#q25" className="be-toc-item"><span className="be-toc-n">25</span>Rate Limiting<span className="be-toc-cat be-cat-perf">Perf</span></a>
            <a href="#q6" className="be-toc-item"><span className="be-toc-n">06</span>Password Hashing<span className="be-toc-cat be-cat-auth">Auth</span></a>
            <a href="#q16" className="be-toc-item"><span className="be-toc-n">16</span>N+1 Query Problem<span className="be-toc-cat be-cat-db">DB</span></a>
            <a href="#q26" className="be-toc-item"><span className="be-toc-n">26</span>CDN &amp; Static Asset Optimization<span className="be-toc-cat be-cat-perf">Perf</span></a>
            <a href="#q7" className="be-toc-item"><span className="be-toc-n">07</span>JWT Authentication<span className="be-toc-cat be-cat-auth">Auth</span></a>
            <a href="#q17" className="be-toc-item"><span className="be-toc-n">17</span>Microservices vs Monolith<span className="be-toc-cat be-cat-arch">Arch</span></a>
            <a href="#q27" className="be-toc-item"><span className="be-toc-n">27</span>SQL Injection &amp; Prevention<span className="be-toc-cat be-cat-sec">Sec</span></a>
            <a href="#q8" className="be-toc-item"><span className="be-toc-n">08</span>OAuth 2.0 &amp; OpenID Connect<span className="be-toc-cat be-cat-auth">Auth</span></a>
            <a href="#q18" className="be-toc-item"><span className="be-toc-n">18</span>REST API Design: Pagination<span className="be-toc-cat be-cat-api">API</span></a>
            <a href="#q28" className="be-toc-item"><span className="be-toc-n">28</span>CORS<span className="be-toc-cat be-cat-sec">Sec</span></a>
            <a href="#q9" className="be-toc-item"><span className="be-toc-n">09</span>Session vs Token Authentication<span className="be-toc-cat be-cat-auth">Auth</span></a>
            <a href="#q19" className="be-toc-item"><span className="be-toc-n">19</span>Middleware Pattern<span className="be-toc-cat be-cat-arch">Arch</span></a>
            <a href="#q29" className="be-toc-item"><span className="be-toc-n">29</span>Environment Variables &amp; Secrets<span className="be-toc-cat be-cat-sec">Sec</span></a>
            <a href="#q10" className="be-toc-item"><span className="be-toc-n">10</span>Role-Based Access Control<span className="be-toc-cat be-cat-auth">Auth</span></a>
            <a href="#q20" className="be-toc-item"><span className="be-toc-n">20</span>Event-Driven Architecture<span className="be-toc-cat be-cat-arch">Arch</span></a>
            <a href="#q30" className="be-toc-item"><span className="be-toc-n">30</span>Logging &amp; Monitoring<span className="be-toc-cat be-cat-sec">Sec</span></a>
          </div>
        </div>

        {/* ════════ CONTENT ════════ */}
        <div className="be-main">

          {/* ── SECTION 1: APIs ── */}
          <div className="be-sec-header">
            <div className="be-sec-label">
              <span className="be-sec-num">01 – 05</span>
              <span className="be-sec-title">APIs &amp; HTTP</span>
              <span className="be-sec-badge">api design</span>
            </div>
          </div>

          {/* Q1 */}
          <div className="be-qwrap" id="q1">
            <div className="be-q-sidebar"><div className="be-q-num">1</div><div className="be-q-line"></div></div>
            <div className="be-q-content">
              <p className="be-q-question">What are the main HTTP methods, and what is the difference between PUT and PATCH?</p>
              <p className="be-q-answer">HTTP defines a set of request methods that indicate the desired action: <code>GET</code> retrieves data without side effects, <code>POST</code> creates a new resource, <code>PUT</code> replaces an entire resource with the request payload, <code>DELETE</code> removes a resource, and <code>PATCH</code> applies a partial update to a resource. The key distinction between <code>PUT</code> and <code>PATCH</code> is completeness — a <code>PUT</code> request must include the full representation of the resource, so any field omitted from the body will be cleared or reset to its default; this makes <code>PUT</code> idempotent, meaning calling it multiple times produces the same result. <code>PATCH</code>, by contrast, only sends the fields that need to change, leaving unmentioned fields untouched, which is more bandwidth-efficient for large resources. In practice, most public APIs use <code>PATCH</code> for updates since clients rarely want to replace entire objects. Understanding idempotency is also important for safe retry logic: <code>GET</code>, <code>PUT</code>, and <code>DELETE</code> are all idempotent; <code>POST</code> and <code>PATCH</code> are not guaranteed to be.</p>
              <div className="be-cb">
                <div className="be-cb-bar"><span className="be-cb-name">http-methods.http</span><span className="be-cb-lang">HTTP</span></div>
                <pre dangerouslySetInnerHTML={{ __html: `<span class="cmt"># PUT — replace entire user object</span>\n<span class="kw">PUT</span> /users/42\nContent-Type: application/json\n{ <span class="str">"name"</span>: <span class="str">"Alice"</span>, <span class="str">"email"</span>: <span class="str">"alice@example.com"</span>, <span class="str">"role"</span>: <span class="str">"admin"</span> }\n\n<span class="cmt"># PATCH — update only the email field</span>\n<span class="kw">PATCH</span> /users/42\nContent-Type: application/json\n{ <span class="str">"email"</span>: <span class="str">"newalice@example.com"</span> }` }} />
              </div>
            </div>
          </div>

          {/* Q2 */}
          <div className="be-qwrap" id="q2">
            <div className="be-q-sidebar"><div className="be-q-num">2</div><div className="be-q-line"></div></div>
            <div className="be-q-content">
              <p className="be-q-question">What are the core principles of RESTful API design?</p>
              <p className="be-q-answer">REST (Representational State Transfer) is an architectural style defined by six constraints: client-server separation, statelessness (the server holds no session state between requests — each request must carry all the information needed to process it), cacheability, a uniform interface, a layered system, and optionally code-on-demand. In practice, the most important principles for everyday API design are statelessness, using nouns not verbs for resource URLs (e.g., <code>/articles</code>, not <code>/getArticles</code>), mapping CRUD operations to the correct HTTP methods, returning appropriate status codes (201 for creation, 404 for not found, 422 for validation errors), and using consistent, predictable URL naming with plural nouns and nested resources for relationships (<code>/users/42/posts</code>). Resources should be designed around the consumer&apos;s needs rather than mirroring your database tables one-to-one. Versioning the API in the URL or via a header ensures you can evolve the API without breaking existing clients.</p>
            </div>
          </div>

          {/* Q3 */}
          <div className="be-qwrap" id="q3">
            <div className="be-q-sidebar"><div className="be-q-num">3</div><div className="be-q-line"></div></div>
            <div className="be-q-content">
              <p className="be-q-question">What are the differences between REST, GraphQL, and gRPC — and when would you choose each?</p>
              <p className="be-q-answer">REST uses standard HTTP with resource-based URLs and is the simplest, most universally understood approach — ideal for public APIs, simple CRUD services, and teams that benefit from familiar tooling and HTTP caching. GraphQL allows clients to specify exactly what data they need in a single request, eliminating the over-fetching and under-fetching problems that plague REST (where you often get too much data or must make multiple round-trips); it is ideal for complex frontends with varying data requirements, like mobile apps where bandwidth matters. gRPC uses Protocol Buffers (a binary serialization format) over HTTP/2, giving it exceptional performance and strict, schema-first typing — it is the right choice for internal service-to-service communication in microservices where low latency, bidirectional streaming, and strong contracts are priorities. The tradeoff is that gRPC is harder to debug (binary protocol), not directly accessible from browsers without a proxy, and requires schema tooling. GraphQL adds complexity around caching and authorization that REST handles trivially.</p>
            </div>
          </div>

          {/* Q4 */}
          <div className="be-qwrap" id="q4">
            <div className="be-q-sidebar"><div className="be-q-num">4</div><div className="be-q-line"></div></div>
            <div className="be-q-content">
              <p className="be-q-question">What are common API versioning strategies, and what are the tradeoffs of each?</p>
              <p className="be-q-answer">API versioning ensures you can evolve your API without breaking existing clients. The three main strategies are URL path versioning (<code>/v1/users</code>), query parameter versioning (<code>/users?version=1</code>), and header-based versioning (<code>Accept: application/vnd.myapi.v1+json</code>). URL path versioning is the most explicit and easiest to test and cache — you can navigate directly to a versioned URL in a browser — and it is the most widely adopted approach for public APIs. Header-based versioning is considered more RESTfully pure (the URL identifies the resource, headers describe representation) but is less visible and harder to test without tooling. The key operational tradeoff is how long you maintain old versions — deprecation policies, sunset headers, and migration guides are as important as the technical mechanism. A practical strategy is to version only when making breaking changes (removing fields, changing types, altering semantics) and use non-breaking additions like new optional fields freely without bumping the version.</p>
              <div className="be-cb">
                <div className="be-cb-bar"><span className="be-cb-name">versioning.js</span><span className="be-cb-lang">Node.js</span></div>
                <pre dangerouslySetInnerHTML={{ __html: `<span class="cmt">// Express — URL path versioning</span>\n<span class="kw">const</span> v1 = require(<span class="str">'express'</span>).<span class="fn">Router</span>();\n<span class="kw">const</span> v2 = require(<span class="str">'express'</span>).<span class="fn">Router</span>();\n\nv1.<span class="fn">get</span>(<span class="str">'/users'</span>, userController.listV1);\nv2.<span class="fn">get</span>(<span class="str">'/users'</span>, userController.listV2);\n\napp.<span class="fn">use</span>(<span class="str">'/api/v1'</span>, v1);\napp.<span class="fn">use</span>(<span class="str">'/api/v2'</span>, v2);` }} />
              </div>
            </div>
          </div>

          {/* Q5 */}
          <div className="be-qwrap" id="q5">
            <div className="be-q-sidebar"><div className="be-q-num">5</div><div className="be-q-line"></div></div>
            <div className="be-q-content">
              <p className="be-q-question">How do you handle request validation and error responses in a backend API?</p>
              <p className="be-q-answer">Input validation should happen as early as possible in the request lifecycle — before any database access or business logic — to fail fast and return clear error messages. Use a schema validation library (Zod in Node.js, Pydantic in Python, Joi, etc.) to define the expected shape of every request body, path parameter, and query string; these libraries produce structured, actionable error messages automatically. Error responses should always follow a consistent envelope structure: an HTTP status code that accurately reflects the error category (400 for bad input, 401 for unauthenticated, 403 for forbidden, 404 for not found, 422 for semantically invalid data, 500 for server errors), and a JSON body with at minimum a machine-readable error code and a human-readable message. Never leak internal error details, stack traces, or database messages in production responses — log them server-side instead. A global error-handling middleware (in Express, a 4-argument middleware at the end of the chain) is the clean way to centralize error formatting and logging.</p>
              <div className="be-cb">
                <div className="be-cb-bar"><span className="be-cb-name">validation.js</span><span className="be-cb-lang">Node.js / Zod</span></div>
                <pre dangerouslySetInnerHTML={{ __html: `<span class="kw">const</span> { z } = require(<span class="str">'zod'</span>);\n\n<span class="kw">const</span> CreateUserSchema = z.<span class="fn">object</span>({\n  name:  z.<span class="fn">string</span>().<span class="fn">min</span>(<span class="num">2</span>).<span class="fn">max</span>(<span class="num">80</span>),\n  email: z.<span class="fn">string</span>().<span class="fn">email</span>(),\n  age:   z.<span class="fn">number</span>().<span class="fn">int</span>().<span class="fn">min</span>(<span class="num">0</span>).<span class="fn">optional</span>(),\n});\n\n<span class="kw">async function</span> <span class="fn">createUser</span>(req, res, next) {\n  <span class="kw">const</span> result = CreateUserSchema.<span class="fn">safeParse</span>(req.body);\n  <span class="kw">if</span> (!result.success)\n    <span class="kw">return</span> res.<span class="fn">status</span>(<span class="num">422</span>).<span class="fn">json</span>({\n      error: <span class="str">'VALIDATION_ERROR'</span>,\n      issues: result.error.issues,\n    });\n  <span class="cmt">// result.data is now safe to use</span>\n}` }} />
              </div>
            </div>
          </div>

          {/* ── SECTION 2: AUTH ── */}
          <div className="be-sec-header">
            <div className="be-sec-label">
              <span className="be-sec-num">06 – 10</span>
              <span className="be-sec-title">Authentication &amp; Authorization</span>
              <span className="be-sec-badge">auth</span>
            </div>
          </div>

          {/* Q6 */}
          <div className="be-qwrap" id="q6">
            <div className="be-q-sidebar"><div className="be-q-num">6</div><div className="be-q-line"></div></div>
            <div className="be-q-content">
              <p className="be-q-question">How should passwords be stored securely, and what makes bcrypt the right choice?</p>
              <p className="be-q-answer">Passwords must never be stored in plaintext or using general-purpose hashing algorithms like MD5 or SHA-256, which are designed to be fast and are therefore trivially brute-forced via GPU-accelerated dictionary attacks. The correct approach is to use a purpose-built, slow hashing algorithm: bcrypt, scrypt, or Argon2 (the current winner of the Password Hashing Competition). Bcrypt&apos;s key feature is its configurable &quot;cost factor&quot; (or work factor) — increasing it by 1 doubles the computation time, allowing you to keep pace with improving hardware by adjusting the cost without rehashing existing passwords. It also automatically generates and embeds a unique random salt in each hash, meaning two users with the same password produce entirely different hashes, defeating rainbow table attacks. The recommended minimum cost factor for bcrypt today is 12; you verify a login attempt by hashing the submitted password with the stored salt and comparing the result to the stored hash, never decrypting it.</p>
              <div className="be-cb">
                <div className="be-cb-bar"><span className="be-cb-name">password.js</span><span className="be-cb-lang">Node.js / bcrypt</span></div>
                <pre dangerouslySetInnerHTML={{ __html: `<span class="kw">const</span> bcrypt = require(<span class="str">'bcrypt'</span>);\n<span class="kw">const</span> ROUNDS = <span class="num">12</span>;\n\n<span class="cmt">// Hash on registration</span>\n<span class="kw">async function</span> <span class="fn">hashPassword</span>(plain) {\n  <span class="kw">return</span> bcrypt.<span class="fn">hash</span>(plain, ROUNDS);\n}\n\n<span class="cmt">// Verify on login</span>\n<span class="kw">async function</span> <span class="fn">verifyPassword</span>(plain, hash) {\n  <span class="kw">return</span> bcrypt.<span class="fn">compare</span>(plain, hash); <span class="cmt">// returns boolean</span>\n}` }} />
              </div>
            </div>
          </div>

          {/* Q7 */}
          <div className="be-qwrap" id="q7">
            <div className="be-q-sidebar"><div className="be-q-num">7</div><div className="be-q-line"></div></div>
            <div className="be-q-content">
              <p className="be-q-question">How do JSON Web Tokens (JWTs) work, and what are their security considerations?</p>
              <p className="be-q-answer">A JWT is a compact, self-contained token with three base64url-encoded parts separated by dots: a header (algorithm and token type), a payload (claims — user ID, roles, expiry), and a signature computed by the server using a secret key. Because the payload is only encoded not encrypted, anyone can read the claims — you should never put sensitive data like passwords in a JWT. The server validates a token by recomputing the signature and comparing; if it matches, the claims are trusted. The main security considerations are: always set a short expiry (<code>exp</code> claim, typically 15 minutes for access tokens); use asymmetric keys (RS256) if multiple services need to verify tokens without sharing a secret; and never store JWTs in <code>localStorage</code> — store access tokens in memory and refresh tokens in <code>HttpOnly</code> cookies to protect against XSS. The biggest weakness of JWTs is that they cannot be invalidated before expiry without a server-side denylist, which partially negates their stateless advantage.</p>
              <div className="be-cb">
                <div className="be-cb-bar"><span className="be-cb-name">jwt.js</span><span className="be-cb-lang">Node.js</span></div>
                <pre dangerouslySetInnerHTML={{ __html: `<span class="kw">const</span> jwt = require(<span class="str">'jsonwebtoken'</span>);\n\n<span class="kw">const</span> <span class="fn">signToken</span> = (userId, role) =>\n  jwt.<span class="fn">sign</span>({ sub: userId, role }, process.env.JWT_SECRET, {\n    algorithm: <span class="str">'HS256'</span>,\n    expiresIn:  <span class="str">'15m'</span>,\n  });\n\n<span class="kw">const</span> <span class="fn">verifyToken</span> = (token) =>\n  jwt.<span class="fn">verify</span>(token, process.env.JWT_SECRET); <span class="cmt">// throws on invalid</span>` }} />
              </div>
            </div>
          </div>

          {/* Q8 */}
          <div className="be-qwrap" id="q8">
            <div className="be-q-sidebar"><div className="be-q-num">8</div><div className="be-q-line"></div></div>
            <div className="be-q-content">
              <p className="be-q-question">What is OAuth 2.0, and how does it differ from OpenID Connect?</p>
              <p className="be-q-answer">OAuth 2.0 is an authorization framework — it defines how a third-party application can obtain limited access to a user&apos;s resources on another service (e.g., a fitness app reading your Google Calendar) without ever handling the user&apos;s credentials. It works by issuing access tokens through defined &quot;grant flows,&quot; the most common being the Authorization Code Flow, where the user authenticates with the provider, the provider redirects back with a code, and the app exchanges that code for an access token. OAuth 2.0 answers &quot;what can this app do on your behalf?&quot; but says nothing about who the user is — it is purely about authorization. OpenID Connect (OIDC) is an identity layer built on top of OAuth 2.0 that adds an ID token (a JWT containing the user&apos;s identity claims: name, email, profile picture) and a <code>/userinfo</code> endpoint, answering &quot;who is this user?&quot; This is why modern &quot;Sign in with Google&quot; buttons use OIDC, not raw OAuth 2.0. When building backends that delegate authentication to an identity provider, you implement OIDC; when building a third-party integration that accesses another service&apos;s API, you use OAuth 2.0.</p>
            </div>
          </div>

          {/* Q9 */}
          <div className="be-qwrap" id="q9">
            <div className="be-q-sidebar"><div className="be-q-num">9</div><div className="be-q-line"></div></div>
            <div className="be-q-content">
              <p className="be-q-question">What is the difference between session-based and token-based authentication, and when would you use each?</p>
              <p className="be-q-answer">In session-based authentication, the server creates a session record (stored in memory or a database like Redis) after login, sends a session ID to the client in a cookie, and looks up that session on every subsequent request — the server holds state. In token-based authentication (typically JWT), the server issues a signed token containing all necessary claims and stores nothing; every request presents the token, and the server validates the signature. Session-based auth is simpler to implement instant revocation (delete the session record), works well for traditional server-rendered web apps, and is naturally scope-limited to a single domain&apos;s cookies. Token-based auth is stateless and scales horizontally without a shared session store, making it well-suited for microservices and mobile/SPA clients — but revocation requires an additional mechanism like a denylist or short expiry with refresh tokens. For a traditional web application with a single backend, sessions are often the simpler, more secure choice; for APIs consumed by multiple clients across domains, or distributed systems, tokens are more practical.</p>
            </div>
          </div>

          {/* Q10 */}
          <div className="be-qwrap" id="q10">
            <div className="be-q-sidebar"><div className="be-q-num">10</div><div className="be-q-line"></div></div>
            <div className="be-q-content">
              <p className="be-q-question">How do you implement role-based access control (RBAC) in a backend API?</p>
              <p className="be-q-answer">RBAC restricts system access based on a user&apos;s assigned role (e.g., admin, editor, viewer), where each role is granted a set of permissions. The implementation has two parts: attaching the user&apos;s role to the authentication context (typically in the JWT payload or session data) and enforcing permissions in middleware or route handlers before executing business logic. A middleware-based approach in Node.js is clean and reusable — you create a higher-order function that takes allowed roles and returns a middleware function that checks the request&apos;s user role, either passing through or responding with 403 Forbidden. For finer-grained control beyond roles, attribute-based access control (ABAC) checks both user attributes and resource attributes (e.g., a user can edit a post only if they are its author). Crucially, authorization checks must happen server-side on every request — the frontend may hide UI elements, but any API endpoint that isn&apos;t protected at the HTTP layer can be accessed directly by a malicious client.</p>
              <div className="be-cb">
                <div className="be-cb-bar"><span className="be-cb-name">rbac.js</span><span className="be-cb-lang">Node.js / Express</span></div>
                <pre dangerouslySetInnerHTML={{ __html: `<span class="kw">const</span> <span class="fn">requireRole</span> = (...allowedRoles) => (req, res, next) => {\n  <span class="kw">const</span> role = req.user?.role;\n  <span class="kw">if</span> (!role || !allowedRoles.<span class="fn">includes</span>(role))\n    <span class="kw">return</span> res.<span class="fn">status</span>(<span class="num">403</span>).<span class="fn">json</span>({ error: <span class="str">'FORBIDDEN'</span> });\n  <span class="fn">next</span>();\n};\n\n<span class="cmt">// Usage</span>\nrouter.<span class="fn">delete</span>(<span class="str">'/users/:id'</span>, <span class="fn">requireRole</span>(<span class="str">'admin'</span>), deleteUser);\nrouter.<span class="fn">put</span>(<span class="str">'/posts/:id'</span>,  <span class="fn">requireRole</span>(<span class="str">'admin'</span>, <span class="str">'editor'</span>), updatePost);` }} />
              </div>
            </div>
          </div>

          {/* ── SECTION 3: DATABASES ── */}
          <div className="be-sec-header">
            <div className="be-sec-label">
              <span className="be-sec-num">11 – 16</span>
              <span className="be-sec-title">Databases</span>
              <span className="be-sec-badge">data layer</span>
            </div>
          </div>

          {/* Q11 */}
          <div className="be-qwrap" id="q11">
            <div className="be-q-sidebar"><div className="be-q-num">11</div><div className="be-q-line"></div></div>
            <div className="be-q-content">
              <p className="be-q-question">What are the different types of SQL JOINs, and when would you use each?</p>
              <p className="be-q-answer">A JOIN combines rows from two or more tables based on a related column. An <code>INNER JOIN</code> returns only rows where there is a match in both tables — the most common type for retrieving related data that must exist on both sides. A <code>LEFT JOIN</code> (also LEFT OUTER JOIN) returns all rows from the left table and matching rows from the right; non-matching right-side columns are <code>NULL</code> — useful when the right-side relationship is optional, such as fetching all users and their orders, including users who have placed no orders. A <code>RIGHT JOIN</code> is the mirror of a LEFT JOIN and is rarely necessary since you can always rewrite it as a LEFT JOIN by swapping table order. A <code>FULL OUTER JOIN</code> returns all rows from both tables, with NULLs filling gaps where there is no match, useful for finding mismatches or doing reconciliation between two datasets. A <code>CROSS JOIN</code> produces a Cartesian product — every combination of rows — which is rarely intentional but has legitimate uses like generating permutations or calendar grids.</p>
              <div className="be-cb">
                <div className="be-cb-bar"><span className="be-cb-name">joins.sql</span><span className="be-cb-lang">SQL</span></div>
                <pre dangerouslySetInnerHTML={{ __html: `<span class="cmt">-- All users with their orders (users with no orders included)</span>\n<span class="kw">SELECT</span> u.name, o.total, o.created_at\n<span class="kw">FROM</span>  users u\n<span class="kw">LEFT JOIN</span> orders o <span class="kw">ON</span> o.user_id = u.id\n<span class="kw">ORDER BY</span> u.name;\n\n<span class="cmt">-- Users who have placed at least one order</span>\n<span class="kw">SELECT</span> u.name, <span class="fn">COUNT</span>(o.id) AS order_count\n<span class="kw">FROM</span>  users u\n<span class="kw">INNER JOIN</span> orders o <span class="kw">ON</span> o.user_id = u.id\n<span class="kw">GROUP BY</span> u.id, u.name;` }} />
              </div>
            </div>
          </div>

          {/* Q12 */}
          <div className="be-qwrap" id="q12">
            <div className="be-q-sidebar"><div className="be-q-num">12</div><div className="be-q-line"></div></div>
            <div className="be-q-content">
              <p className="be-q-question">What is database indexing, and when can an index hurt performance?</p>
              <p className="be-q-answer">An index is a data structure (typically a B-tree) that the database maintains alongside a table to allow it to find rows matching a condition without scanning every row — similar to an index at the back of a book. Without an index on a <code>WHERE</code> column, the database performs a full table scan (O(n)), which becomes unacceptable at scale. You should create indexes on columns frequently used in <code>WHERE</code>, <code>JOIN ON</code>, and <code>ORDER BY</code> clauses, as well as foreign key columns. Composite indexes on multiple columns can serve queries that filter on all those columns in order — but only from left to right, so column order in the index matters. Indexes hurt performance in two scenarios: first, write operations (<code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code>) become slower because the index must be updated on every write; a table with ten indexes takes ten times more write overhead than one with none. Second, an index with low selectivity (e.g., a boolean column with 50% true/false) provides little benefit and the query planner may ignore it entirely. Use <code>EXPLAIN ANALYZE</code> to verify that your indexes are actually being used.</p>
            </div>
          </div>

          {/* Q13 */}
          <div className="be-qwrap" id="q13">
            <div className="be-q-sidebar"><div className="be-q-num">13</div><div className="be-q-line"></div></div>
            <div className="be-q-content">
              <p className="be-q-question">What is the difference between SQL and NoSQL databases, and how do you choose between them?</p>
              <p className="be-q-answer">SQL (relational) databases like PostgreSQL and MySQL store data in tables with a predefined schema, enforce relationships via foreign keys, and guarantee ACID transactions — they are ideal for structured data with complex relationships and queries that benefit from JOINs, such as financial systems, user accounts, and e-commerce. NoSQL databases trade schema flexibility and often some consistency for scale, speed, or specialized data models: document stores (MongoDB) store JSON-like documents and are great for hierarchical, variable-schema data; key-value stores (Redis) excel at caching and session storage with microsecond lookups; wide-column stores (Cassandra) handle massive write throughput across distributed nodes; and graph databases (Neo4j) model highly connected data like social networks or recommendation engines. The choice depends primarily on data shape, query patterns, and consistency requirements — not just on scale. Most modern applications use a hybrid approach: PostgreSQL as the primary database and Redis for caching. A common mistake is choosing MongoDB out of familiarity when the data is clearly relational, leading to painful manual relationship management later.</p>
            </div>
          </div>

          {/* Q14 */}
          <div className="be-qwrap" id="q14">
            <div className="be-q-sidebar"><div className="be-q-num">14</div><div className="be-q-line"></div></div>
            <div className="be-q-content">
              <p className="be-q-question">What are database transactions and ACID properties?</p>
              <p className="be-q-answer">A database transaction is a sequence of operations that must execute as a single, all-or-nothing unit — if any step fails, the entire transaction is rolled back and the database is left unchanged. ACID is the set of properties that guarantee this reliability: Atomicity means every operation in the transaction succeeds or all are rolled back; Consistency means the transaction brings the database from one valid state to another, never leaving it in a corrupt intermediate state; Isolation means concurrent transactions execute as if they were sequential — changes made in an uncommitted transaction are not visible to others (with configurable isolation levels); and Durability means committed transactions persist even through a server crash, thanks to write-ahead logs. Transactions are essential whenever you have multi-step operations that must succeed together — for example, transferring money requires debiting one account and crediting another atomically; if the credit fails after the debit, you&apos;ve lost money. In Node.js with an ORM like Prisma, you wrap related operations in a <code>prisma.$transaction([...])</code> call.</p>
              <div className="be-cb">
                <div className="be-cb-bar"><span className="be-cb-name">transaction.js</span><span className="be-cb-lang">Node.js / Prisma</span></div>
                <pre dangerouslySetInnerHTML={{ __html: `<span class="cmt">// Atomic money transfer</span>\n<span class="kw">await</span> prisma.<span class="fn">$transaction</span>([\n  prisma.account.<span class="fn">update</span>({\n    where: { id: fromId },\n    data:  { balance: { decrement: amount } },\n  }),\n  prisma.account.<span class="fn">update</span>({\n    where: { id: toId },\n    data:  { balance: { increment: amount } },\n  }),\n]); <span class="cmt">// Both succeed or both roll back</span>` }} />
              </div>
            </div>
          </div>

          {/* Q15 */}
          <div className="be-qwrap" id="q15">
            <div className="be-q-sidebar"><div className="be-q-num">15</div><div className="be-q-line"></div></div>
            <div className="be-q-content">
              <p className="be-q-question">What is an ORM, and what are the tradeoffs of using one versus writing raw SQL?</p>
              <p className="be-q-answer">An ORM (Object-Relational Mapper) is a library that maps database tables to objects in your programming language, letting you write database queries in code rather than SQL strings — examples include Prisma, TypeORM, Sequelize (Node.js), SQLAlchemy (Python), and ActiveRecord (Ruby). The key benefits are developer productivity (schema migrations, type-safe queries, no SQL string concatenation), built-in protection against SQL injection, and portability across databases. The tradeoffs are that ORMs can generate inefficient queries — especially for complex joins or aggregations — and the abstraction can hide what&apos;s actually happening at the database level, making performance debugging harder. Raw SQL gives you complete control and is more efficient for complex analytical queries, but requires more boilerplate and discipline to avoid injection vulnerabilities. A pragmatic approach for most applications is to use an ORM for standard CRUD operations and use raw SQL (or the ORM&apos;s raw query escape hatch) for performance-critical or complex queries that the ORM cannot express cleanly.</p>
            </div>
          </div>

          {/* Q16 */}
          <div className="be-qwrap" id="q16">
            <div className="be-q-sidebar"><div className="be-q-num">16</div><div className="be-q-line"></div></div>
            <div className="be-q-content">
              <p className="be-q-question">What is the N+1 query problem, and how do you fix it?</p>
              <p className="be-q-answer">The N+1 problem occurs when you execute one query to fetch a list of N items, then execute one additional query per item to fetch related data — resulting in N+1 total queries instead of the 2 that would be needed with proper joining. For example, fetching 100 posts and then looping to fetch each post&apos;s author with a separate query generates 101 database round-trips. This pattern is easy to accidentally write with ORMs that lazy-load associations by default, and it becomes catastrophic at scale — 100 items means 100 extra queries, 10,000 items means 10,000 extra queries. The fix is eager loading: instruct the ORM to JOIN or batch-load the related data in a single additional query. In Prisma, this is done with the <code>include</code> option; in SQL, it&apos;s a JOIN; in some frameworks a DataLoader pattern batches N individual lookups into one <code>WHERE id IN (...)</code> query. Always profile your queries during development using query logging to catch this before it reaches production.</p>
              <div className="be-cb">
                <div className="be-cb-bar"><span className="be-cb-name">n-plus-one.js</span><span className="be-cb-lang">Prisma</span></div>
                <pre dangerouslySetInnerHTML={{ __html: `<span class="cmt">// ❌ N+1: 1 query for posts + 1 per post for author</span>\n<span class="kw">const</span> posts = <span class="kw">await</span> prisma.post.<span class="fn">findMany</span>();\n<span class="kw">for</span> (<span class="kw">const</span> post <span class="kw">of</span> posts) {\n  post.author = <span class="kw">await</span> prisma.user.<span class="fn">findUnique</span>({ where: { id: post.authorId } });\n}\n\n<span class="cmt">// ✅ Eager load: 2 queries total</span>\n<span class="kw">const</span> posts = <span class="kw">await</span> prisma.post.<span class="fn">findMany</span>({\n  include: { author: <span class="kw">true</span> },\n});` }} />
              </div>
            </div>
          </div>

          {/* ── SECTION 4: ARCHITECTURE ── */}
          <div className="be-sec-header">
            <div className="be-sec-label">
              <span className="be-sec-num">17 – 23</span>
              <span className="be-sec-title">Server Architecture</span>
              <span className="be-sec-badge">systems</span>
            </div>
          </div>

          {/* Q17 */}
          <div className="be-qwrap" id="q17">
            <div className="be-q-sidebar"><div className="be-q-num">17</div><div className="be-q-line"></div></div>
            <div className="be-q-content">
              <p className="be-q-question">What are the key differences between a monolithic and a microservices architecture?</p>
              <p className="be-q-answer">A monolith packages all application functionality — authentication, billing, notifications, user management — into a single deployable unit with a shared codebase and database. This is simpler to develop, debug, test, and deploy initially, and is the right starting point for most applications — you don&apos;t pay the distributed systems tax until you actually need to. Microservices decompose the application into small, independently deployable services that each own their own data store and communicate over a network (HTTP or a message queue). The benefits — independent scaling, independent deployment, technology heterogeneity per service, fault isolation — only become practical benefits at organizational and technical scale; a team of 5 engineers does not benefit from microservices. The costs are significant: network latency, distributed tracing, eventual consistency, the complexity of coordinating deployments, and service discovery overhead. A practical path is to start as a well-structured monolith, identify bounded contexts where services naturally emerge under real load or team growth, and extract microservices surgically rather than from the start.</p>
            </div>
          </div>

          {/* Q18 */}
          <div className="be-qwrap" id="q18">
            <div className="be-q-sidebar"><div className="be-q-num">18</div><div className="be-q-line"></div></div>
            <div className="be-q-content">
              <p className="be-q-question">How do you implement pagination in a REST API, and what are the tradeoffs between offset and cursor pagination?</p>
              <p className="be-q-answer">Pagination limits how many records are returned per request to prevent overloading the client and database. Offset pagination uses <code>?page=2&amp;limit=20</code> (or <code>?offset=20&amp;limit=20</code>) and is easy to implement with SQL&apos;s <code>LIMIT</code> and <code>OFFSET</code> clauses. However, offset pagination has a serious flaw with live data: if items are inserted or deleted between page requests, items can be skipped or duplicated — you fetch page 1 (rows 1–20), a new item is inserted at the top, then page 2 (rows 21–40) returns what was actually row 20 before, causing a duplicate. It is also slow on large offsets because the database must scan and discard the skipped rows. Cursor-based pagination uses a stable pointer (typically the last record&apos;s ID or timestamp) as the cursor: <code>?after=cursor_value&amp;limit=20</code>. It queries <code>WHERE id &gt; cursor ORDER BY id LIMIT 20</code>, which uses the index directly and is immune to insertion/deletion drift. Cursor pagination is the correct choice for infinite scroll feeds and any large dataset with live data; offset pagination is acceptable for small, stable datasets or when the user needs to jump to a specific page number.</p>
              <div className="be-cb">
                <div className="be-cb-bar"><span className="be-cb-name">cursor-pagination.sql</span><span className="be-cb-lang">SQL</span></div>
                <pre dangerouslySetInnerHTML={{ __html: `<span class="cmt">-- Cursor pagination: stable and index-efficient</span>\n<span class="kw">SELECT</span> id, title, created_at\n<span class="kw">FROM</span>   posts\n<span class="kw">WHERE</span>  created_at &lt; :cursor   <span class="cmt">-- cursor from last item</span>\n<span class="kw">ORDER BY</span> created_at <span class="kw">DESC</span>\n<span class="kw">LIMIT</span>  20;` }} />
              </div>
            </div>
          </div>

          {/* Q19 */}
          <div className="be-qwrap" id="q19">
            <div className="be-q-sidebar"><div className="be-q-num">19</div><div className="be-q-line"></div></div>
            <div className="be-q-content">
              <p className="be-q-question">What is the middleware pattern in backend frameworks, and how does the request-response cycle work in Express?</p>
              <p className="be-q-answer">Middleware is a function that sits in the middle of the request-response pipeline and has access to the request object, the response object, and the next middleware function in the chain. In Express, a middleware function has the signature <code>(req, res, next)</code> — it either calls <code>next()</code> to pass control to the subsequent middleware, sends a response to terminate the chain, or calls <code>next(err)</code> to skip to the error-handling middleware. This pattern enables clean separation of cross-cutting concerns: authentication, logging, request parsing, rate limiting, and input validation all run as independent, composable middleware before the route handler executes. The order of <code>app.use()</code> calls matters — middleware is executed in the sequence it is registered. A 4-argument middleware <code>(err, req, res, next)</code> is the error handler and should be placed last. This pipeline architecture makes it easy to add, remove, or reorder behaviors globally or per-route without touching business logic.</p>
              <div className="be-cb">
                <div className="be-cb-bar"><span className="be-cb-name">middleware.js</span><span className="be-cb-lang">Node.js / Express</span></div>
                <pre dangerouslySetInnerHTML={{ __html: `app.<span class="fn">use</span>(express.<span class="fn">json</span>());         <span class="cmt">// 1. parse body</span>\napp.<span class="fn">use</span>(logger);                   <span class="cmt">// 2. log every request</span>\napp.<span class="fn">use</span>(authenticate);             <span class="cmt">// 3. verify JWT → req.user</span>\napp.<span class="fn">use</span>(<span class="str">'/api'</span>, router);           <span class="cmt">// 4. route handlers</span>\napp.<span class="fn">use</span>((err, req, res, next) => { <span class="cmt">// 5. error handler (last)</span>\n  res.<span class="fn">status</span>(err.status || <span class="num">500</span>).<span class="fn">json</span>({ error: err.message });\n});` }} />
              </div>
            </div>
          </div>

          {/* Q20 */}
          <div className="be-qwrap" id="q20">
            <div className="be-q-sidebar"><div className="be-q-num">20</div><div className="be-q-line"></div></div>
            <div className="be-q-content">
              <p className="be-q-question">What is event-driven architecture, and how do events differ from direct service calls?</p>
              <p className="be-q-answer">In event-driven architecture (EDA), components communicate by emitting events — records of something that happened (e.g., <code>order.placed</code>, <code>user.registered</code>) — and other components subscribe to and react to those events asynchronously. This is in contrast to direct (synchronous) service calls where service A explicitly calls service B and waits for a response. The key advantage of EDA is temporal and spatial decoupling: the event producer doesn&apos;t know who consumes its events, doesn&apos;t wait for them to finish, and continues running even if a consumer is unavailable — making the system more resilient and scalable. This pattern is ideal for workflows that span multiple services (placing an order triggers inventory updates, email confirmations, and analytics events simultaneously without chaining synchronous calls). The tradeoffs are increased complexity: debugging is harder because there&apos;s no linear call stack, you must handle duplicate event delivery and out-of-order events, and eventual consistency means consumers may lag behind producers. Tools like Kafka, RabbitMQ, AWS SNS/SQS, and Redis Streams are common implementations.</p>
            </div>
          </div>

          {/* Q21 */}
          <div className="be-qwrap" id="q21">
            <div className="be-q-sidebar"><div className="be-q-num">21</div><div className="be-q-line"></div></div>
            <div className="be-q-content">
              <p className="be-q-question">What is the difference between vertical and horizontal scaling, and what constraints govern each?</p>
              <p className="be-q-answer">Vertical scaling (scaling up) means adding more resources to a single machine — more CPU, RAM, or faster storage. It is the simplest approach, requires no application changes, and works well up to a point, but it has a hard ceiling (you can&apos;t add infinite CPU to one machine) and a single point of failure. Horizontal scaling (scaling out) means adding more machines (instances) running the same application behind a load balancer to distribute traffic. Horizontal scaling is theoretically limitless and provides fault tolerance — if one instance fails, others continue serving traffic — but it requires the application to be stateless: session state, in-memory caches, and local file uploads must be moved to external shared stores (Redis, S3) because any request might hit any instance. Most modern cloud deployments combine both: run moderately sized instances (vertical) and auto-scale their count based on load (horizontal). The rule of thumb is: scale vertically first until it becomes impractical or uneconomical, then design for horizontal scaling as a necessity rather than prematurely.</p>
            </div>
          </div>

          {/* Q22 */}
          <div className="be-qwrap" id="q22">
            <div className="be-q-sidebar"><div className="be-q-num">22</div><div className="be-q-line"></div></div>
            <div className="be-q-content">
              <p className="be-q-question">What is a message queue, and what problems does it solve in backend systems?</p>
              <p className="be-q-answer">A message queue is a durable, asynchronous communication buffer where producers write messages and consumers read and process them independently. It decouples the rate of production from the rate of consumption — if an email service can only process 100 emails per second but a flash sale generates 5,000 orders per second, a queue absorbs the burst and processes emails at a sustainable pace rather than crashing the service. Message queues also improve reliability: if the email service crashes, unprocessed messages remain in the queue and are retried when it recovers, with no data loss. They enable work distribution across multiple consumers (competing consumers pattern) for horizontal throughput. Common tasks for queues include sending emails/SMS, processing images and videos, generating reports, and any operation that doesn&apos;t need to complete synchronously within the HTTP request. Technologies differ by tradeoff: RabbitMQ is excellent for complex routing with acknowledgments; Kafka is a distributed log built for high-throughput, ordered, replayable streams; Redis (BullMQ) is a practical choice for job queues in smaller systems that already use Redis.</p>
            </div>
          </div>

          {/* Q23 */}
          <div className="be-qwrap" id="q23">
            <div className="be-q-sidebar"><div className="be-q-num">23</div><div className="be-q-line"></div></div>
            <div className="be-q-content">
              <p className="be-q-question">How does a load balancer work, and what are the most common load-balancing algorithms?</p>
              <p className="be-q-answer">A load balancer sits in front of a pool of backend servers and distributes incoming requests across them, acting as the single entry point for all traffic. It continuously monitors server health using health checks, removing unhealthy instances from rotation automatically, which provides both scalability and high availability. Round Robin distributes requests sequentially across all instances in order and works well when all servers have similar capacity and request cost. Least Connections routes each new request to the instance with the fewest active connections, which is better when requests vary significantly in processing time — long-running requests won&apos;t keep piling onto one server. IP Hash routes requests from the same client IP to the same server, which creates &quot;sticky sessions&quot; useful when session state is stored locally on the server (though externalizing session state is a better architectural choice). Weighted Round Robin assigns different traffic percentages to instances by capacity, useful during canary deployments where you want to send 5% of traffic to a new version initially. Layer 7 load balancers (like AWS ALB, Nginx) inspect HTTP headers and routes, enabling URL-based and content-based routing, whereas Layer 4 balancers operate purely at the TCP level.</p>
            </div>
          </div>

          {/* ── SECTION 5: PERFORMANCE ── */}
          <div className="be-sec-header">
            <div className="be-sec-label">
              <span className="be-sec-num">24 – 26</span>
              <span className="be-sec-title">Performance Optimization</span>
              <span className="be-sec-badge">perf</span>
            </div>
          </div>

          {/* Q24 */}
          <div className="be-qwrap" id="q24">
            <div className="be-q-sidebar"><div className="be-q-num">24</div><div className="be-q-line"></div></div>
            <div className="be-q-content">
              <p className="be-q-question">What are the main caching strategies used in backend systems, and when would you use each?</p>
              <p className="be-q-answer">Caching stores computed or fetched data closer to where it will be consumed so future requests can be served faster. Cache-aside (lazy loading) is the most common pattern: the application checks the cache first, and on a miss, fetches from the database, stores the result in the cache, then returns it — the cache is populated on demand. Write-through updates the cache synchronously whenever the database is written, keeping the cache always warm but adding write latency. Write-back (write-behind) writes to the cache first and asynchronously persists to the database, giving fastest write performance at the risk of data loss if the cache fails. Cache-aside with a TTL (time-to-live) is the default recommendation for most use cases because it is simple, resilient to cache failures (the app falls back to the database), and the TTL provides automatic staleness management. Redis is the dominant in-memory cache store for backend systems. The most common mistake is not defining an invalidation strategy — cache invalidation is notoriously one of the hardest problems in computer science, and stale cache data causing incorrect behavior is a class of bugs that is difficult to reproduce.</p>
              <div className="be-cb">
                <div className="be-cb-bar"><span className="be-cb-name">cache-aside.js</span><span className="be-cb-lang">Node.js / Redis</span></div>
                <pre dangerouslySetInnerHTML={{ __html: `<span class="kw">async function</span> <span class="fn">getUser</span>(id) {\n  <span class="kw">const</span> key = <span class="str">\`user:\${id}\`</span>;\n  <span class="kw">const</span> cached = <span class="kw">await</span> redis.<span class="fn">get</span>(key);\n  <span class="kw">if</span> (cached) <span class="kw">return</span> <span class="fn">JSON.parse</span>(cached);\n\n  <span class="kw">const</span> user = <span class="kw">await</span> db.user.<span class="fn">findById</span>(id);\n  <span class="kw">await</span> redis.<span class="fn">setex</span>(key, <span class="num">300</span>, <span class="fn">JSON.stringify</span>(user)); <span class="cmt">// 5-min TTL</span>\n  <span class="kw">return</span> user;\n}` }} />
              </div>
            </div>
          </div>

          {/* Q25 */}
          <div className="be-qwrap" id="q25">
            <div className="be-q-sidebar"><div className="be-q-num">25</div><div className="be-q-line"></div></div>
            <div className="be-q-content">
              <p className="be-q-question">What is rate limiting, and how do you implement a token bucket or sliding window algorithm?</p>
              <p className="be-q-answer">Rate limiting restricts how many requests a client can make to an API within a time window to protect backend resources from abuse, denial-of-service attacks, and runaway clients. The fixed window algorithm (e.g., 100 requests per minute) is simplest but allows bursting at window boundaries — a client can use 100 requests at 0:59 and another 100 at 1:00. The sliding window algorithm tracks the request timestamps in a rolling window, providing a smoother limit with no boundary burst. The token bucket algorithm gives each client a bucket of tokens that refills at a fixed rate; each request consumes one token, and requests are rejected when the bucket is empty — this naturally allows short bursts while enforcing a long-term average rate. In distributed systems, rate limit state must live in a shared store like Redis (not in process memory, which would give each server instance its own counter). The response to a rate-limited request should be HTTP 429 with a <code>Retry-After</code> header indicating when the client may try again, and <code>X-RateLimit-Limit</code>/<code>X-RateLimit-Remaining</code> headers to inform clients proactively.</p>
              <div className="be-cb">
                <div className="be-cb-bar"><span className="be-cb-name">rate-limit.js</span><span className="be-cb-lang">Node.js / Redis</span></div>
                <pre dangerouslySetInnerHTML={{ __html: `<span class="cmt">// Sliding window with Redis sorted sets</span>\n<span class="kw">async function</span> <span class="fn">isRateLimited</span>(ip, limit = <span class="num">100</span>, windowMs = <span class="num">60000</span>) {\n  <span class="kw">const</span> now  = Date.<span class="fn">now</span>();\n  <span class="kw">const</span> key  = <span class="str">\`rl:\${ip}\`</span>;\n  <span class="kw">const</span> pipe = redis.<span class="fn">pipeline</span>();\n  pipe.<span class="fn">zremrangebyscore</span>(key, <span class="num">0</span>, now - windowMs); <span class="cmt">// evict old</span>\n  pipe.<span class="fn">zadd</span>(key, now, now.<span class="fn">toString</span>());            <span class="cmt">// add current</span>\n  pipe.<span class="fn">zcard</span>(key);                                <span class="cmt">// count window</span>\n  pipe.<span class="fn">expire</span>(key, <span class="num">60</span>);\n  <span class="kw">const</span> results = <span class="kw">await</span> pipe.<span class="fn">exec</span>();\n  <span class="kw">return</span> results[<span class="num">2</span>][<span class="num">1</span>] > limit;\n}` }} />
              </div>
            </div>
          </div>

          {/* Q26 */}
          <div className="be-qwrap" id="q26">
            <div className="be-q-sidebar"><div className="be-q-num">26</div><div className="be-q-line"></div></div>
            <div className="be-q-content">
              <p className="be-q-question">What is a CDN, and how does it improve backend API and asset performance?</p>
              <p className="be-q-answer">A Content Delivery Network (CDN) is a geographically distributed network of edge servers that cache and serve content from the location physically closest to the end user, reducing latency caused by geographic distance from the origin server. For static assets (images, JavaScript, CSS, fonts), a CDN is transformative — a user in Singapore fetching an image from an origin server in Virginia would experience 200–300ms of network latency; a CDN edge node in Singapore reduces that to single-digit milliseconds. For APIs, CDNs like Cloudflare can cache responses at the edge using Cache-Control headers, which is highly effective for publicly accessible, non-personalized data like product catalogs or public posts. Setting <code>Cache-Control: public, max-age=3600, s-maxage=86400</code> tells browsers to cache for 1 hour and CDN edges for 24 hours. The challenge is cache invalidation — CDNs require explicit purging when cached content changes. For personalized or authenticated content, CDN caching is inappropriate without careful configuration (use <code>private</code> or <code>no-store</code>) to avoid serving one user&apos;s data to another.</p>
            </div>
          </div>

          {/* ── SECTION 6: SECURITY ── */}
          <div className="be-sec-header">
            <div className="be-sec-label">
              <span className="be-sec-num">27 – 30</span>
              <span className="be-sec-title">Security &amp; Production Readiness</span>
              <span className="be-sec-badge">security</span>
            </div>
          </div>

          {/* Q27 */}
          <div className="be-qwrap" id="q27">
            <div className="be-q-sidebar"><div className="be-q-num">27</div><div className="be-q-line"></div></div>
            <div className="be-q-content">
              <p className="be-q-question">What is SQL injection, how does it work, and how do you prevent it?</p>
              <p className="be-q-answer">SQL injection occurs when user-supplied input is interpolated directly into a SQL query string, allowing an attacker to alter the query&apos;s structure. For example, if a login query is built as <code>{`SELECT * FROM users WHERE email = '\${email}'`}</code> and the attacker inputs <code>{`' OR '1'='1`}</code> as the email, the query becomes <code>{`WHERE email = '' OR '1'='1'`}</code> — which is always true — returning all users and bypassing authentication. In severe cases, attackers can exfiltrate entire databases, modify data, or execute operating system commands. Prevention is simple and absolute: always use parameterized queries (prepared statements) which pass user input as separate, typed parameters that the database driver handles safely without ever interpreting them as SQL syntax. Modern ORMs use parameterized queries by default, which is one of their important security benefits. Never build SQL strings by concatenating user input, and validate/sanitize input as a defense-in-depth measure (not a replacement for parameterized queries). Run your database user with the least privileges necessary — no <code>DROP TABLE</code> or admin rights for the application account.</p>
              <div className="be-cb">
                <div className="be-cb-bar"><span className="be-cb-name">sql-injection.js</span><span className="be-cb-lang">Node.js / pg</span></div>
                <pre dangerouslySetInnerHTML={{ __html: `<span class="cmt">// ❌ VULNERABLE — never do this</span>\n<span class="kw">const</span> q = <span class="str">\`SELECT * FROM users WHERE email = '\${email}'\`</span>;\n\n<span class="cmt">// ✅ SAFE — parameterized query</span>\n<span class="kw">const</span> { rows } = <span class="kw">await</span> pool.<span class="fn">query</span>(\n  <span class="str">'SELECT * FROM users WHERE email = $1'</span>,\n  [email]  <span class="cmt">// driver handles escaping</span>\n);` }} />
              </div>
            </div>
          </div>

          {/* Q28 */}
          <div className="be-qwrap" id="q28">
            <div className="be-q-sidebar"><div className="be-q-num">28</div><div className="be-q-line"></div></div>
            <div className="be-q-content">
              <p className="be-q-question">What is CORS, and how do you configure it correctly on a backend server?</p>
              <p className="be-q-answer">CORS (Cross-Origin Resource Sharing) is a browser security mechanism that restricts web pages from making requests to a different origin (domain, port, or protocol) than the one that served the page. By default, browsers block cross-origin responses unless the server explicitly permits it via CORS headers. When a React app on <code>https://app.example.com</code> calls an API at <code>https://api.example.com</code>, the browser sends a preflight <code>OPTIONS</code> request asking whether the cross-origin request is allowed; the server must respond with <code>Access-Control-Allow-Origin</code>, <code>Access-Control-Allow-Methods</code>, and <code>Access-Control-Allow-Headers</code>. Configuring CORS correctly means specifying an explicit allowlist of origins (never use <code>*</code> with <code>credentials: true</code>, as browsers reject this combination), allowing only the HTTP methods and headers your API actually uses, and being aware that credentials (cookies, Authorization headers) require both <code>Access-Control-Allow-Credentials: true</code> on the server and <code>credentials: &apos;include&apos;</code> on the client fetch call. CORS is purely a browser enforcement mechanism — it does not protect your API from non-browser clients like Postman or curl, and it is not a substitute for authentication.</p>
              <div className="be-cb">
                <div className="be-cb-bar"><span className="be-cb-name">cors.js</span><span className="be-cb-lang">Node.js / Express</span></div>
                <pre dangerouslySetInnerHTML={{ __html: `<span class="kw">const</span> cors = require(<span class="str">'cors'</span>);\n\napp.<span class="fn">use</span>(<span class="fn">cors</span>({\n  origin:      [<span class="str">'https://app.example.com'</span>],\n  methods:     [<span class="str">'GET'</span>, <span class="str">'POST'</span>, <span class="str">'PUT'</span>, <span class="str">'PATCH'</span>, <span class="str">'DELETE'</span>],\n  allowedHeaders: [<span class="str">'Content-Type'</span>, <span class="str">'Authorization'</span>],\n  credentials: <span class="kw">true</span>,\n}));` }} />
              </div>
            </div>
          </div>

          {/* Q29 */}
          <div className="be-qwrap" id="q29">
            <div className="be-q-sidebar"><div className="be-q-num">29</div><div className="be-q-line"></div></div>
            <div className="be-q-content">
              <p className="be-q-question">How should environment variables and secrets be managed in a backend application?</p>
              <p className="be-q-answer">Environment variables are the standard mechanism for injecting configuration (database URLs, API keys, JWT secrets) into a backend application without hardcoding them in source code — following the Twelve-Factor App&apos;s &quot;store config in the environment&quot; principle. A <code>.env</code> file is used locally with a library like <code>dotenv</code> to load variables into <code>process.env</code>, but this file must never be committed to source control — add it to <code>.gitignore</code> immediately and provide a <code>.env.example</code> with placeholder values for documentation. In production, environment variables should be injected by the deployment platform (Vercel, Railway, Heroku, AWS ECS/Lambda environment config) or a dedicated secrets manager like AWS Secrets Manager, HashiCorp Vault, or GCP Secret Manager, which provide audit trails, rotation, and fine-grained access control. The most critical rule is to never log environment variables — an application that prints its configuration at startup might leak database credentials into logs. Rotate secrets regularly, use different values per environment (development, staging, production), and validate that all required environment variables are present at startup so the app fails loudly rather than silently using undefined values.</p>
              <div className="be-cb">
                <div className="be-cb-bar"><span className="be-cb-name">env-validate.js</span><span className="be-cb-lang">Node.js</span></div>
                <pre dangerouslySetInnerHTML={{ __html: `<span class="cmt">// Validate required env vars at startup</span>\n<span class="kw">const</span> required = [<span class="str">'DATABASE_URL'</span>, <span class="str">'JWT_SECRET'</span>, <span class="str">'REDIS_URL'</span>];\n<span class="kw">for</span> (<span class="kw">const</span> key <span class="kw">of</span> required) {\n  <span class="kw">if</span> (!process.env[key])\n    <span class="kw">throw new</span> <span class="fn">Error</span>(<span class="str">\`Missing required env var: \${key}\`</span>);\n}\nconsole.<span class="fn">log</span>(<span class="str">'✓ Environment validated'</span>);` }} />
              </div>
              <div className="be-note be-warn">
                <strong>Security rule:</strong> a <code>.env</code> file must always be in <code>.gitignore</code> before the first commit. Leaked secrets in git history persist forever — even after deletion — and must be rotated immediately.
              </div>
            </div>
          </div>

          {/* Q30 */}
          <div className="be-qwrap" id="q30">
            <div className="be-q-sidebar"><div className="be-q-num">30</div><div className="be-q-line"></div></div>
            <div className="be-q-content">
              <p className="be-q-question">What is the difference between logging and monitoring, and what constitutes a production-ready observability setup?</p>
              <p className="be-q-answer">Logging records discrete events as they occur — a request was received, a query was executed, an error was thrown — and is most useful for debugging a specific incident after the fact. Monitoring observes the system&apos;s aggregate health over time through metrics: request rate, error rate, latency percentiles (P50, P95, P99), CPU/memory utilization, and database connection pool saturation. A production-ready observability setup has three pillars: structured logs (JSON format, not plain text, so they are machine-queryable), metrics (exported to a time-series database like Prometheus or Datadog for alerting and dashboards), and distributed traces (correlation IDs that follow a request across service boundaries, using OpenTelemetry). Alerts should fire on symptoms, not causes — alert on &quot;error rate above 1%&quot; or &quot;P99 latency above 2 seconds&quot; rather than &quot;CPU above 80%&quot;, since the metric that matters to users is service quality, not resource usage. Every HTTP response should include a correlation ID header so a user reporting a problem can give you a single ID to trace the exact request through your logs. Use a log aggregation service (Datadog, Grafana Loki, AWS CloudWatch Logs) in production — tailing raw server logs does not scale.</p>
              <div className="be-cb">
                <div className="be-cb-bar"><span className="be-cb-name">structured-logging.js</span><span className="be-cb-lang">Node.js / pino</span></div>
                <pre dangerouslySetInnerHTML={{ __html: `<span class="kw">const</span> pino = require(<span class="str">'pino'</span>);\n<span class="kw">const</span> log  = <span class="fn">pino</span>({ level: <span class="str">'info'</span> });\n\n<span class="cmt">// Structured log entry — machine-queryable JSON</span>\nlog.<span class="fn">info</span>({\n  msg:        <span class="str">'request completed'</span>,\n  method:     req.method,\n  path:       req.path,\n  statusCode: res.statusCode,\n  durationMs: Date.<span class="fn">now</span>() - req.startTime,\n  userId:     req.user?.id,\n  requestId:  req.id,\n});` }} />
              </div>
            </div>
          </div>

        </div>{/* /be-main */}

        {/* ════════ FOOTER ════════ */}
        <div className="be-footer">
          <div className="be-footer-left">Backend Development <span>Interview Guide</span></div>
          <div className="be-footer-right">
            30 Questions · Intermediate Level<br />
            APIs · Databases · Auth · Architecture · Security
          </div>
        </div>

      </div>{/* /be-wrap */}
    </>
  );
}
