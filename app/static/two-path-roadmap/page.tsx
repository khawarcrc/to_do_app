"use client";

import { useEffect, useState } from "react";

// ═══════════════════════════════════════════════════════════════
// DATA — ALL CONTENT AS JSON
// ═══════════════════════════════════════════════════════════════

const SITE = {
  kicker: "AI & Data Career Roadmap · 2025–2026",
  title: "Two Paths.",
  titleHighlight: "One Decision.",
  subtitle:
    "A structured guide to choosing between the Data Domain and AI Engineering track — built for honest comparison and clear decision-making.",
  pills: [
    { label: "Path A · Data Domain", variant: "a" as const },
    { label: "Path B · AI Engineering", variant: "b" as const },
    { label: "Shared Foundation", variant: "shared" as const },
  ],
  footer: "Two-Path AI & Data Roadmap · Pick Your Lane · Go Deep · 2025–2026",
};

const DECISION = {
  icon: "⑂",
  sides: [
    {
      variant: "a" as const,
      label: "Path A · Data Domain",
      name: "Data Analyst → Scientist → Engineer",
      roles: "SQL · Pandas · Sklearn · Tableau · dbt · Spark",
      desc: 'You work with <strong>structured data</strong>. You answer business questions, build dashboards, run experiments, and create pipelines. The work is clear, measurable, and in very high demand right now. Entry points are more accessible.',
    },
    {
      variant: "b" as const,
      label: "Path B · AI / LLM Engineering",
      name: "ML Engineer → AI Engineer → LLM Engineer",
      roles: "PyTorch · HuggingFace · RAG · LangGraph · FastAPI",
      desc: 'You <strong>build AI systems</strong> — systems that understand language, generate content, retrieve knowledge, and take autonomous actions. Steeper learning curve, higher upside. The cutting edge of the industry right now.',
    },
  ],
};

interface TimelinePhase {
  weeks: string;
  name: string;
}

interface TimelineBlock {
  variant: "a" | "b";
  label: string;
  weekLabels: string[];
  phases: TimelinePhase[];
}

const TIMELINES: TimelineBlock[] = [
  {
    variant: "a",
    label: "Path A · 8-Week Timeline",
    weekLabels: ["Wk 1–2", "Wk 3–4", "Wk 5–6", "Wk 7–8"],
    phases: [
      { weeks: "Wk 1–2", name: "Foundation + SQL + EDA" },
      { weeks: "Wk 3–4", name: "Supervised + Unsupervised ML" },
      { weeks: "Wk 5", name: "Dashboards + Stats + Time Series" },
      { weeks: "Wk 6", name: "Data Engineering (Airflow, dbt, Kafka)" },
      { weeks: "Wk 7–8", name: "Capstone A1 + Capstone A2" },
    ],
  },
  {
    variant: "b",
    label: "Path B · 10-Week Realistic Timeline",
    weekLabels: ["Wk 1–2", "Wk 3–4", "Wk 5–6", "Wk 7–8", "Wk 9–10"],
    phases: [
      { weeks: "Wk 1–2", name: "Foundation + PyTorch + Deep Learning" },
      { weeks: "Wk 3", name: "Unsupervised DL + CV + RL basics" },
      { weeks: "Wk 4–5", name: "NLP → Transformers + LLM APIs + Fine-Tuning" },
      { weeks: "Wk 6", name: "RAG + Agents + MLOps" },
      { weeks: "Wk 7–8", name: "Capstone B1 — Train Your Own AI Model" },
      { weeks: "Wk 9–10", name: "Capstone B2 — Production AI System" },
    ],
  },
];

const FOUNDATION = {
  badge: "Both Paths",
  title: "Shared Foundation — Learn This First, No Matter What",
  week: "Week 1 · Non-Negotiable",
  tags: [
    "Python", "OOP & Type Hints", "asyncio / httpx", "Git & GitHub",
    "Docker basics", "NumPy", "Pandas", "Matplotlib", "SQL",
    "PostgreSQL / MySQL", "Linear Algebra", "Probability & Statistics",
    "Cloud Basics (AWS / GCP)", "Linux / Terminal", "REST APIs", "pytest basics",
  ],
  note: 'Based on real job posting data: <strong>SQL appears in ~50% of data analyst postings and 17% of AI engineer postings</strong> — it belongs here, in the foundation. <strong>Python is in 71% of AI engineer postings and 33% of analyst postings</strong> — non-negotiable everywhere. Cloud basics (AWS/GCP) appear across both paths at the mid-level. Linux/terminal and REST APIs are expected by default in any technical role.<br/><br/><strong>Jupyter Notebook and VS Code are tools, not skills.</strong> Every job posting will show you are using them while building — do not treat them as separate things to "master."',
};

interface StepCard {
  num: string;
  title: string;
  week: string;
  tags: string[];
  desc: string;
}

interface PathData {
  variant: "a" | "b";
  badge: string;
  name: string;
  roles: string;
  stat: string;
  steps: StepCard[];
}

const PATHS: PathData[] = [
  {
    variant: "a",
    badge: "Path A · Data Domain",
    name: "Data Analyst → Scientist → Engineer",
    roles: "SQL · Dashboards · Statistical Models · Pipelines",
    stat: "SQL in 50% of postings · Tableau 28% · Power BI 25% · Excel 41%",
    steps: [
      {
        num: "01",
        title: "SQL & Databases",
        week: "Week 1–2",
        tags: ["PostgreSQL", "MySQL", "SQLite", "SQLAlchemy", "DBeaver"],
        desc: "SELECT, JOIN, GROUP BY, subqueries, window functions, indexes. This is the core skill every data role requires on day one. Do not rush past this — it appears in every interview.",
      },
      {
        num: "02",
        title: "Data Wrangling & EDA",
        week: "Week 2–3",
        tags: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "Plotly"],
        desc: "Load, clean, explore data. Handle nulls, outliers, distributions. Build visual EDA reports that tell a story from raw data. This is your analyst daily workflow.",
      },
      {
        num: "03",
        title: "Supervised Learning — Regression & Classification",
        week: "Week 3–4",
        tags: ["Scikit-learn", "XGBoost", "LightGBM", "CatBoost", "Optuna", "SHAP", "LIME"],
        desc: "Linear/Logistic Regression, Decision Trees, Random Forest, Gradient Boosting. Sklearn Pipelines, cross-validation, hyperparameter tuning. Evaluation: precision, recall, F1, AUC-ROC. Feature importance and model explainability with SHAP — mandatory in any real business deployment.",
      },
      {
        num: "03b",
        title: "Unsupervised Learning — Clustering & Dimensionality Reduction",
        week: "Week 4",
        tags: ["K-Means", "DBSCAN", "PCA", "t-SNE", "Yellowbrick"],
        desc: "No labels — find hidden structure in data. K-Means for customer segmentation. DBSCAN for anomaly detection. PCA to reduce 100 features to 10. This domain is skipped by most beginners and is frequently tested in data science interviews.",
      },
      {
        num: "04",
        title: "BI & Dashboards",
        week: "Week 5",
        tags: ["Tableau", "Power BI", "Streamlit", "Plotly Dash", "Looker"],
        desc: "Turn analysis into decisions stakeholders can act on. Build interactive dashboards. This is the primary output layer for Data Analyst roles — the thing hiring managers see first.",
      },
      {
        num: "05",
        title: "Data Engineering & Pipelines",
        week: "Week 6",
        tags: ["Apache Spark", "Airflow", "dbt", "Kafka", "Snowflake", "AWS S3"],
        desc: "Build pipelines that move, transform, and serve data at scale. This is the Data Engineer role — higher pay, more engineering, less analysis. Required for the capstone project.",
      },
      {
        num: "06",
        title: "Advanced Stats, NLP Basics & Feature Engineering",
        week: "Week 6–7",
        tags: ["Statsmodels", "SciPy", "A/B Testing", "Bayesian Inference", "Prophet", "NLTK", "TF-IDF", "spaCy"],
        desc: "Hypothesis testing, confidence intervals, causal inference, time series with Prophet. Basic NLP for text handling. Feature engineering: polynomial features, target encoding, interaction terms — often matters more than model choice.",
      },
    ],
  },
  {
    variant: "b",
    badge: "Path B · AI / LLM Engineering",
    name: "ML Engineer → AI Engineer → LLM Engineer",
    roles: "PyTorch · HuggingFace · RAG · Agents · GenAI",
    stat: "Python 71% of postings · PyTorch in most ML roles · Docker + CI/CD standard",
    steps: [
      {
        num: "01",
        title: "PyTorch, Deep Learning & Neural Architecture",
        week: "Week 1–2",
        tags: ["PyTorch", "torchvision", "accelerate", "W&B"],
        desc: 'Tensors, autograd, training loops, loss functions, optimizers (Adam, SGD). Rebuild ML models in raw PyTorch — understand what neural networks actually do. Then CNNs for images, RNNs/LSTMs for sequences, and <strong>why Transformers replaced them.</strong> NumPy and Pandas are solidified here by doing, not by studying separately.',
      },
      {
        num: "01b",
        title: "Unsupervised DL + Computer Vision",
        week: "Week 3",
        tags: ["Autoencoders", "VAE", "GANs", "OpenCV", "YOLO", "torchvision"],
        desc: "Autoencoders (compression, denoising), VAEs (generative models), GANs (image synthesis). Computer Vision: image classification with CNNs, object detection with YOLO. These are the foundations of Stable Diffusion and DALL-E. Skipping this means you cannot understand generative AI at the architecture level.",
      },
      {
        num: "01c",
        title: "Reinforcement Learning",
        week: "Week 3",
        tags: ["OpenAI Gym", "Stable-Baselines3", "PPO", "DQN", "RLHF concepts"],
        desc: 'Agent, environment, reward, policy — the RL mental model. You must understand <strong>RLHF (Reinforcement Learning from Human Feedback)</strong> because it is how GPT, Claude, and Llama are aligned. Every LLM you call was trained with RL. Not knowing this is a gap that shows in interviews.',
      },
      {
        num: "02",
        title: "NLP Fundamentals → Transformers & Embeddings",
        week: "Week 4",
        tags: ["NLTK", "spaCy", "TF-IDF", "HuggingFace Transformers", "sentence-transformers", "FAISS", "UMAP"],
        desc: "NLP fundamentals first — understand how text was handled before Transformers, so you know why Transformers are better. Then: self-attention, BERT vs GPT, encoder vs decoder. Convert text to vectors. Build semantic search with cosine similarity and FAISS. Visualise embedding clusters with UMAP.",
      },
      {
        num: "03",
        title: "LLM APIs & Prompt Engineering",
        week: "Week 4–5",
        tags: ["LiteLLM", "OpenAI SDK", "Anthropic API", "Groq", "Instructor", "Pydantic v2"],
        desc: 'Call any LLM via one unified interface. Zero-shot → few-shot → Chain-of-Thought → ReAct. Extract structured outputs with Instructor. <strong>Never parse free text.</strong> This is the fastest path to building real AI features.',
      },
      {
        num: "04",
        title: "Fine-Tuning — When Prompting Is Not Enough",
        week: "Week 5",
        tags: ["LoRA / QLoRA", "Unsloth", "PEFT", "TRL", "Ollama", "llama.cpp"],
        desc: 'Fine-tune only when prompting fails. QLoRA on a 7B model with Unsloth. SFT then DPO alignment. Export GGUF, run locally with Ollama. The most important skill here is knowing <strong>when not to fine-tune.</strong>',
      },
      {
        num: "05",
        title: "RAG — Retrieval Augmented Generation",
        week: "Week 5–6",
        tags: ["LangChain", "LlamaIndex", "ChromaDB", "Qdrant", "BM25S", "RAGAS"],
        desc: 'Ingest → chunk → embed → store → retrieve → rerank → generate. Hybrid search (dense + BM25). Evaluate with RAGAS. <strong>This covers 70% of AI engineering job requirements.</strong> Master this before moving to agents.',
      },
      {
        num: "06",
        title: "Agents & Agentic AI",
        week: "Week 6",
        tags: ["LangGraph", "CrewAI", "smolagents", "Mem0", "Redis", "Langfuse", "Guardrails AI"],
        desc: "LLMs that use tools, loop, decide, and act autonomously. Stateful graphs with LangGraph. Multi-agent systems with CrewAI. Memory persistence, observability with Langfuse, safety guardrails. This is the frontier of AI engineering.",
      },
      {
        num: "07",
        title: "MLOps — Serving, Monitoring & Production",
        week: "Week 6–7",
        tags: ["MLflow", "vLLM", "FastAPI", "Docker Compose", "GitHub Actions", "Prometheus", "Grafana", "Langfuse"],
        desc: 'Model versioning, experiment tracking with MLflow. High-throughput serving with vLLM. CI/CD with GitHub Actions. Monitoring: Prometheus metrics, Grafana dashboards, p95 latency, token cost/hour. <strong>A model without monitoring is a model you cannot fix when it breaks — and it will break.</strong>',
      },
    ],
  },
];

interface JobItem {
  title: string;
  skills: string;
}

interface JobsCard {
  variant: "a" | "b";
  title: string;
  jobs: JobItem[];
}

const JOBS: JobsCard[] = [
  {
    variant: "a",
    title: "Path A — Target Job Roles",
    jobs: [
      { title: "Data Analyst", skills: "SQL · Pandas · Tableau · Excel · Storytelling" },
      { title: "Data Scientist", skills: "Sklearn · XGBoost · Statistics · A/B Testing · Python" },
      { title: "Data Engineer", skills: "Spark · Airflow · dbt · Kafka · Snowflake · Cloud" },
      { title: "Analytics Engineer", skills: "dbt · SQL · Warehouse design · BI tools" },
      { title: "ML Scientist (Applied Stats)", skills: "Bayesian methods · Causal ML · Sklearn · Experimentation" },
    ],
  },
  {
    variant: "b",
    title: "Path B — Target Job Roles",
    jobs: [
      { title: "ML Engineer", skills: "PyTorch · HuggingFace · FastAPI · Docker · Cloud" },
      { title: "AI Engineer / LLM Engineer", skills: "LLM APIs · RAG · LangChain · Pydantic · Prompt Eng." },
      { title: "Agentic AI Engineer", skills: "LangGraph · CrewAI · Tool use · Memory · Orchestration" },
      { title: "MLOps Engineer", skills: "Docker · K8s · CI/CD · vLLM · W&B · Monitoring" },
      { title: "AI Research Engineer", skills: "PyTorch deep · Fine-tuning · PEFT · Papers → Code" },
    ],
  },
];

interface CompareRow {
  dimension: string;
  pathA: string;
  pathB: string;
}

const COMPARE: CompareRow[] = [
  { dimension: "Primary Role", pathA: "Analyse data, answer business questions, build pipelines", pathB: "Build AI systems that understand, generate, and act" },
  { dimension: "Core Tools", pathA: "SQL, Pandas, Sklearn, Tableau, dbt, Airflow, Spark", pathB: "PyTorch, HuggingFace, LangChain, LangGraph, FastAPI" },
  { dimension: "Learning Curve", pathA: "Moderate — concepts are familiar, stack is broad", pathB: "Steep — new abstractions every week, fast-moving ecosystem" },
  { dimension: "Realistic Timeline", pathA: "8 weeks to job-viable with strong Python/SQL base", pathB: "10–12 weeks minimum to job-viable; 8 weeks is very aggressive" },
  { dimension: "Entry-Level Market", pathA: "More open, clearer hiring funnel, well-understood roles", pathB: "Competitive, often requires demonstrable projects or open-source" },
  { dimension: "Coding Intensity", pathA: "Medium — SQL heavy, Python for EDA and ML pipelines", pathB: "High — system design, async code, custom training loops" },
  { dimension: "Maths Required", pathA: "Statistics, probability, linear algebra basics", pathB: "Linear algebra, calculus intuition, backprop understanding" },
  { dimension: "Capstone Complexity", pathA: "Full data platform — SQL, dbt, Airflow, Kafka, Tableau, ML", pathB: "Fine-tuned model + production RAG + agents + monitoring" },
  { dimension: "Industry Demand", pathA: "Stable and broad — every company has data needs", pathB: "Rapidly growing — AI teams being built everywhere right now" },
  { dimension: "Salary Ceiling", pathA: "Strong — senior data engineers command top market rates", pathB: "Higher upside — AI engineers are among the most sought-after" },
  { dimension: "Best Fit For", pathA: "Analytical thinkers who like structured data and business insight", pathB: "Engineers who want to build AI products and ship AI features" },
];

interface ProjectCard {
  num: string;
  name: string;
  tags: string[];
  learns: string;
}

interface ProjectCol {
  variant: "a" | "b";
  badge: string;
  title: string;
  projects: ProjectCard[];
}

const PROJECTS: ProjectCol[] = [
  {
    variant: "a",
    badge: "Path A · Data Domain",
    title: "10 Projects — Data, Analytics & Engineering",
    projects: [
      { num: "01", name: "Football Match Outcome Predictor", tags: ["Pandas", "Sklearn", "XGBoost", "SHAP", "FastAPI", "Docker"], learns: '<span class="font-medium text-[var(--text-secondary)]">Supervised — Classification.</span> Feature engineering on real sports data. Compare Logistic Regression vs XGBoost. Use SHAP to explain which features drive predictions. Deployed as FastAPI endpoint with Docker.' },
      { num: "02", name: "Stock Market Dashboard & Trend Analyzer", tags: ["Pandas", "yfinance", "Plotly", "Streamlit", "Prophet"], learns: '<span class="font-medium text-[var(--text-secondary)]">Time Series Forecasting.</span> Rolling averages, Bollinger bands, trend decomposition. Forecast 30-day price trend with Prophet. Interactive Streamlit dashboard with live data. Teaches temporal feature engineering.' },
      { num: "03", name: "Weather Pattern Analysis & Rain Predictor", tags: ["Pandas", "Seaborn", "Sklearn", "Statsmodels", "PostgreSQL"], learns: '<span class="font-medium text-[var(--text-secondary)]">Binary Classification + Statistical Analysis.</span> Geographic/temporal data, logistic regression, class imbalance handling, residual analysis. Full EDA report stored in PostgreSQL. The full analyst workflow.' },
      { num: "04", name: "E-Commerce Sales Intelligence Platform", tags: ["SQL", "dbt", "Pandas", "Tableau", "Snowflake"], learns: '<span class="font-medium text-[var(--text-secondary)]">Analytics Engineering.</span> Complex SQL window functions, CTEs for cohort analysis, dbt models for staging/mart layers, Snowflake warehouse design. Tableau KPI dashboard. Full Data Analyst → Analytics Engineer workflow.' },
      { num: "05", name: "Customer Churn Prediction Service", tags: ["Sklearn", "XGBoost", "Imbalanced-learn", "FastAPI", "Docker", "MLflow"], learns: '<span class="font-medium text-[var(--text-secondary)]">Classification with 95:5 Class Imbalance.</span> SMOTE oversampling, SHAP waterfall plots per customer, MLflow experiment tracking, containerised FastAPI deployment. A complete production ML project.' },
      { num: "06", name: "Real-Time Sentiment Streaming Dashboard", tags: ["Kafka", "Spark Streaming", "NLTK", "Plotly Dash", "Redis"], learns: '<span class="font-medium text-[var(--text-secondary)]">Streaming + NLP.</span> Kafka producer simulating live tweets. Spark consumer running sentiment classification in real time. Redis for aggregated counters. Live updating Plotly Dash dashboard.' },
      { num: "07", name: "Customer Segmentation Engine", tags: ["K-Means", "DBSCAN", "PCA", "Plotly", "Streamlit"], learns: '<span class="font-medium text-[var(--text-secondary)]">Unsupervised — Clustering.</span> Segment customers by behaviour. Elbow method to select K. PCA for visualisation. Detailed cluster profiles. Business-ready report explaining each segment\'s value.' },
      { num: "08", name: "Automated ETL Pipeline with Airflow", tags: ["Apache Airflow", "dbt", "PostgreSQL", "AWS S3", "Docker"], learns: '<span class="font-medium text-[var(--text-secondary)]">Data Engineering.</span> DAG-based pipeline from raw API ingestion → dbt transformation → data quality checks → mart tables. Idempotent design. Slack/email alerts on failure. Full data engineer daily workflow.' },
      { num: "09", name: "A/B Testing Framework & Analysis Tool", tags: ["SciPy", "Statsmodels", "Pandas", "Streamlit", "Bayesian"], learns: '<span class="font-medium text-[var(--text-secondary)]">Statistical Experimentation.</span> Both frequentist (t-test, chi-squared) and Bayesian A/B testing. Minimum detectable effect, sample size calculator, sequential testing to prevent early stopping bias.' },
      { num: "10", name: "Demand Forecasting System", tags: ["Prophet", "ARIMA", "XGBoost", "Airflow", "Streamlit"], learns: '<span class="font-medium text-[var(--text-secondary)]">Multi-Model Time Series.</span> Compare Prophet vs ARIMA vs XGBoost for inventory demand forecasting. Automated retraining pipeline. Business dashboard showing actual vs forecast with confidence intervals.' },
    ],
  },
  {
    variant: "b",
    badge: "Path B · AI Engineering",
    title: "10 Projects — Models, RAG, Agents & MLOps",
    projects: [
      { num: "01", name: "Build a Mini GPT from Scratch", tags: ["PyTorch", "Transformers", "W&B", "tokenizers"], learns: '<span class="font-medium text-[var(--text-secondary)]">Deep Learning Foundation.</span> Implement Transformer from scratch: tokenizer, embedding, positional encoding, multi-head attention, MLP. Train on a domain corpus. Understand every parameter. Not skippable.' },
      { num: "02", name: "AI Code Review Assistant", tags: ["OpenAI API", "Instructor", "Pydantic", "FastAPI", "GitHub Actions"], learns: '<span class="font-medium text-[var(--text-secondary)]">LLM APIs + Structured Outputs.</span> CI tool that automatically reviews PRs. Structured output extraction with Instructor. Webhook integration. Comments posted directly to GitHub. Real-world API chaining.' },
      { num: "03", name: "Document Q&A with RAG", tags: ["LangChain", "ChromaDB", "sentence-transformers", "RAGAS", "Streamlit"], learns: '<span class="font-medium text-[var(--text-secondary)]">RAG Pipeline.</span> Ingest PDFs, semantic chunking, embed with sentence-transformers, store in ChromaDB. Hybrid retrieval + reranking. Evaluate with RAGAS until faithfulness > 0.85. This is the core pattern used in 70% of AI products.' },
      { num: "04", name: "Natural Language App Builder", tags: ["LiteLLM", "LangGraph", "Pydantic", "FastAPI", "Docker"], learns: '<span class="font-medium text-[var(--text-secondary)]">Structured LLM Outputs + Routing.</span> Natural language → structured JSON → action. Intent classification routing. Multi-model fallback with LiteLLM. Shows how to make LLMs reliable in production workflows.' },
      { num: "05", name: "Autonomous Research Agent", tags: ["LangGraph", "Tavily", "RAG", "Mem0", "Langfuse"], learns: '<span class="font-medium text-[var(--text-secondary)]">Agentic Loop + Memory.</span> Agent that searches the web, reads documents, synthesises findings, and writes reports autonomously. Memory persists across sessions with Mem0. Full observability via Langfuse.' },
      { num: "06", name: "Domain Expert Fine-Tuned Model", tags: ["Unsloth", "QLoRA", "TRL", "DPO", "Ollama", "W&B"], learns: '<span class="font-medium text-[var(--text-secondary)]">Fine-Tuning + RLHF.</span> SFT on Llama 3.1 8B using QLoRA. DPO alignment on preference pairs. W&B sweep comparing LoRA ranks and learning rates. Export GGUF. Serve with Ollama. Benchmark: base vs SFT vs SFT+DPO.' },
      { num: "07", name: "AI Workflow Automation (n8n + LLM)", tags: ["n8n", "OpenAI API", "Webhooks", "Slack", "Airtable"], learns: '<span class="font-medium text-[var(--text-secondary)]">Automation + LLM Integration.</span> Multi-step automated workflow: trigger → classify → enrich with LLM → route → notify. No-code + code hybrid approach used in most startup AI teams today.' },
      { num: "08", name: "Drone Navigation RL Agent", tags: ["OpenAI Gym", "Stable-Baselines3", "PPO", "W&B", "PyTorch"], learns: '<span class="font-medium text-[var(--text-secondary)]">Reinforcement Learning.</span> Custom Gym environment. PPO agent trained to navigate obstacles. Reward shaping experiments showing how reward design changes behaviour. 1M step training run logged to W&B.' },
      { num: "09", name: "Smart City Safety CV System", tags: ["YOLOv8", "OpenCV", "FastAPI", "Streamlit", "Docker"], learns: '<span class="font-medium text-[var(--text-secondary)]">Computer Vision — Object Detection.</span> YOLOv8 fine-tuned on custom detection task. OpenCV preprocessing pipeline. FastAPI serving with base64 image input → JSON bounding box output. Compare YOLO vs manual CNN classifier.' },
      { num: "10", name: "Personal Claude-Powered Assistant", tags: ["Anthropic API", "LangGraph", "Mem0", "Streamlit", "PostgreSQL"], learns: '<span class="font-medium text-[var(--text-secondary)]">Full-Stack AI App.</span> Multi-turn assistant with persistent memory. Tool use: calendar, web search, document retrieval. JWT auth, conversation history stored in PostgreSQL. A deployable product, not a demo.' },
    ],
  },
];

interface CapstoneBreakdownItem {
  title: string;
  desc: string;
}

interface CapstoneCard {
  tag: string;
  domain: string;
  name: string;
  why: string;
  weekLabels: string[];
  stackLabel: string;
  techStack: string[];
  breakdownTitle: string;
  breakdown: CapstoneBreakdownItem[];
  coversLabel: string;
  coversText: string;
}

interface CapstoneCol {
  variant: "a" | "b";
  label: string;
  capstones: CapstoneCard[];
}

const CAPSTONES: CapstoneCol[] = [
  {
    variant: "a",
    label: "Path A · Data Domain — Build These Two",
    capstones: [
      {
        tag: "Capstone A1",
        domain: "Sklearn · MLflow · FastAPI · Docker · CI/CD",
        name: "End-to-End ML Deployment Pipeline",
        why: "Projects 01 + 03 + 05 + 07 collapsed into one production ML system. Training, evaluation, versioning, serving, and monitoring — all connected. This is what a real Data Scientist ships.",
        weekLabels: ["Week 7 — Build", "Week 7 — Deploy", "Week 7 — Monitor"],
        stackLabel: "Full Tech Stack",
        techStack: ["Sklearn", "XGBoost", "LightGBM", "Optuna", "SHAP", "MLflow", "FastAPI", "Docker", "GitHub Actions", "Prometheus", "Grafana", "Great Expectations"],
        breakdownTitle: "What's Built — Layer by Layer",
        breakdown: [
          { title: "Layer 1 — Model Training Registry", desc: "Multiple models trained (Logistic Regression, XGBoost, LightGBM) on a real tabular dataset. Optuna hyperparameter optimisation. All experiments logged to MLflow with parameters, metrics, and artefacts." },
          { title: "Layer 2 — Evaluation & Explainability", desc: "Full evaluation suite: precision, recall, AUC-ROC, confusion matrix. SHAP waterfall plots for per-prediction explanations. Model card documentation. Great Expectations for data quality validation." },
          { title: "Layer 3 — Production API", desc: "FastAPI serving with model loading from MLflow registry. Input validation with Pydantic. Health check and versioned endpoint. Containerised with Docker, tested with pytest." },
          { title: "Layer 4 — CI/CD + Monitoring", desc: "GitHub Actions pipeline: lint → test → build → deploy on merge. Prometheus metrics: prediction counts, latency, error rate. Grafana dashboard. Drift detection alerting when input distribution shifts." },
        ],
        coversLabel: "Covers projects from the 10:",
        coversText: "P01 (Football Predictor) · P03 (Weather) · P05 (Churn) · P07 (Segmentation) — 4 of 10 directly. Complete ML lifecycle from training to production monitoring.",
      },
      {
        tag: "Capstone A2",
        domain: "Kafka · Airflow · dbt · Snowflake · Tableau · Spark",
        name: "Full-Stack E-Commerce Data Platform",
        why: "Projects 02 + 04 + 06 + 08 + 09 collapsed into one full data engineering and analytics stack. Real-time ingestion, batch pipelines, SQL modelling, forecasting, and executive dashboarding — all in production.",
        weekLabels: ["Week 8 — Ingest", "Week 8 — Model", "Week 8 — Dashboard"],
        stackLabel: "Full Tech Stack",
        techStack: ["Kafka", "Apache Spark", "Airflow", "dbt", "Snowflake", "AWS S3", "PostgreSQL", "Great Expectations", "Prophet", "Statsmodels", "Tableau", "Plotly Dash", "Docker Compose", "GitHub Actions"],
        breakdownTitle: "What's Built — Layer by Layer",
        breakdown: [
          { title: "Layer 1 — Real-Time Ingestion", desc: "Kafka producer ingesting e-commerce events (orders, clicks, returns) in real time. Consumer writing to PostgreSQL raw schema. Parallel batch ingestion from S3 via Airflow DAGs. Idempotent design — re-run any DAG safely." },
          { title: "Layer 2 — Data Modelling with dbt", desc: "Raw → Staging (clean, rename, type-cast) → Mart (business entities: customers, orders, products, revenue). Window functions: running revenue, 30-day rolling retention, cohort tables. dbt tests for data quality. Snowflake as the warehouse." },
          { title: "Layer 3 — SQL Mastery", desc: "Complex analytical queries: customer lifetime value, product affinity, inventory turnover, NPS cohort analysis. Written as dbt models so they are reusable and tested. Every KPI in the dashboard powered by SQL you wrote." },
          { title: "Layer 4 — Forecasting + Alerting", desc: "Prophet forecast on 90-day revenue trend. ARIMA on inventory demand. Anomaly detection on order volume. Airflow email/Slack alerts on pipeline failure. Great Expectations data quality checks fail the DAG if schema breaks." },
          { title: "Layer 5 — Dashboard", desc: "Tableau for executive KPI dashboard. Plotly Dash for operational real-time view. Full system deployed via Docker Compose, CI/CD on GitHub Actions." },
        ],
        coversLabel: "Covers projects from the 10:",
        coversText: "P02 (Stock Dashboard) · P04 (E-Commerce SQL) · P06 (Sentiment Streaming) · P08 (Airflow ETL) · P09 (A/B Stats) — 5 of 10 directly. Full data engineering + analytics stack.",
      },
    ],
  },
  {
    variant: "b",
    label: "Path B · AI Engineering — Build These Two",
    capstones: [
      {
        tag: "Capstone B1",
        domain: "PyTorch · Fine-Tuning · RLHF · CV · RL · Unsupervised DL",
        name: "Train Your Own AI Model: Domain Expert + Vision System",
        why: "Projects 01 + 01b + 01c + 06 + 09 collapsed into one training pipeline. Every model-building domain — supervised DL, unsupervised DL, CV, RL, and fine-tuning — implemented and compared in one W&B project.",
        weekLabels: ["Week 7 — PyTorch + Fine-tune", "Week 8 — CV + RL"],
        stackLabel: "Full Tech Stack",
        techStack: ["PyTorch", "torchvision", "accelerate", "HuggingFace Transformers", "Unsloth", "PEFT / LoRA / QLoRA", "TRL (SFT + DPO)", "Stable-Baselines3", "OpenAI Gym", "OpenCV", "YOLO", "Autoencoders / VAE", "W&B", "MLflow", "Ollama", "FastAPI", "Docker", "GitHub Actions"],
        breakdownTitle: "What's Built — Layer by Layer",
        breakdown: [
          { title: "Layer 1 — Build GPT from Scratch", desc: "Implement Transformer from zero in PyTorch: tokenizer, embedding, positional encoding, multi-head attention, MLP, softmax. Train on domain corpus. Understand every parameter. This is the foundation — not skippable." },
          { title: "Layer 2 — Fine-Tune a Real Model (SFT + RLHF)", desc: "Take Llama 3.1 8B. SFT with Unsloth+QLoRA on curated domain dataset. DPO alignment on preference pairs. W&B sweep comparing LoRA ranks, learning rates. 18 runs total. Export GGUF. Serve with Ollama. Benchmark: base vs few-shot vs SFT vs SFT+DPO." },
          { title: "Layer 3 — Unsupervised DL: Autoencoder + VAE", desc: "Train Autoencoder on domain data for compressed representations. Upgrade to VAE — sample new examples from latent space. Visualise latent space with UMAP. Use encoder as feature extractor. This is what BERT and sentence-transformers do under the hood." },
          { title: "Layer 4 — Computer Vision: Object Detection", desc: "YOLOv8 fine-tuned on custom detection task. OpenCV preprocessing. Confidence calibration. FastAPI serving with base64 image input → JSON bounding box output. Compare YOLO vs CNN classifier — understand the tradeoff." },
          { title: "Layer 5 — Reinforcement Learning: Policy Training", desc: "OpenAI Gym custom environment. PPO agent with Stable-Baselines3. Reward shaping experiments. 1M step training logged to W&B. One-page analysis: what worked, what reward function won, and why. This builds the RLHF intuition every senior AI engineer needs." },
        ],
        coversLabel: "Covers projects from the 10:",
        coversText: "P01 (Mini GPT) · P06 (Fine-Tuned Expert) · P08 (Drone RL) · P09 (Safe City CV) — and introduces VAE/Autoencoder not covered in any single project alone.",
      },
      {
        tag: "Capstone B2",
        domain: "RAG · Agents · LLM APIs · Multi-Agent · Memory · MLOps · Production",
        name: "Production AI System: Autonomous Knowledge Assistant",
        why: "Projects 02 + 03 + 04 + 05 + 07 + 10 collapsed into one deployed product. Every application-building concept — RAG, agents, fine-tuned model integration, multi-agent, memory, observability — working together in one system that real users can hit.",
        weekLabels: ["Week 9 — RAG + Agents", "Week 10 — MLOps + Ship"],
        stackLabel: "Full Tech Stack",
        techStack: ["LiteLLM", "OpenAI API", "Anthropic API", "Instructor", "Pydantic v2", "LangChain", "LlamaIndex", "LangGraph", "ChromaDB", "Qdrant", "FAISS", "sentence-transformers", "BM25S", "RAGAS", "CrewAI", "smolagents", "Mem0", "Redis", "Celery", "Langfuse", "Guardrails AI", "FastAPI", "Streamlit", "Prometheus", "Grafana", "vLLM", "Docker Compose", "GitHub Actions"],
        breakdownTitle: "What's Built — Layer by Layer",
        breakdown: [
          { title: "Layer 1 — RAG Pipeline (the knowledge brain)", desc: "Ingest documents (PDFs, URLs, databases). Semantic chunking. Embed with sentence-transformers. Store in Qdrant. Hybrid retrieval: dense (FAISS) + sparse (BM25S). Cross-encoder reranking. Evaluate with RAGAS — iterate until faithfulness > 0.85. Plug in the fine-tuned model from Capstone B1 as the generator." },
          { title: "Layer 2 — Agentic Layer (the reasoning brain)", desc: "LangGraph stateful graph: user query → classify intent → route to correct node → execute → reflect → respond. Tools: web search (Tavily), code execution (sandboxed), calculator, RAG retrieval. Human-in-the-loop interrupt for irreversible actions. Persistent memory with Mem0+Redis across sessions." },
          { title: "Layer 3 — Multi-Agent Coordinator", desc: "For complex tasks: spawn CrewAI crew — Researcher (web search + RAG), Analyst (code + data), Writer (structured output), Critic (fact-checks before output). Async via Celery so long-running tasks don't block. Redis pub/sub between agents." },
          { title: "Layer 4 — Production API + Security", desc: "FastAPI backend: JWT auth, per-user rate limiting, background tasks for slow agent jobs, structured Pydantic request/response throughout. Guardrails AI: block prompt injection, PII leakage. PostgreSQL for user data and conversation history. Streamlit frontend with chat UI and source citations." },
          { title: "Layer 5 — Full Observability + MLOps", desc: "Langfuse traces every LLM call: input, output, latency, cost, user ID. Prometheus custom metrics from FastAPI. Grafana: requests/sec, p95 latency, token spend/hour, RAG quality, error rate. vLLM serving your fine-tuned model. GitHub Actions: test → build → push → deploy on merge. This is a production system — not a demo." },
        ],
        coversLabel: "Covers projects from the 10:",
        coversText: "P02 (Code Review) · P03 (RAG Q&A) · P04 (App Builder) · P05 (Research Agent) · P07 (n8n Automator) · P10 (Claude Assistant) — 6 of 10 directly. Integrates fine-tuned model from B1. Nothing left out.",
      },
    ],
  },
];

const VERDICT = {
  title: "Which Path Is Right For You?",
  sides: [
    {
      variant: "a" as const,
      label: "Choose Path A if you…",
      items: [
        "Like working with structured data and databases",
        "Want to answer business questions with data",
        "Enjoy SQL, dashboards, and statistical thinking",
        "Want a clearer entry-level job market right now",
        "Are comfortable with less coding, more analysis",
        "Want to be job-ready in 8 weeks with a strong base",
      ],
    },
    {
      variant: "b" as const,
      label: "Choose Path B if you…",
      items: [
        "Want to build AI products, not analyse existing data",
        "Are excited by LLMs, RAG, agents, and GenAI",
        "Prefer engineering systems over dashboards",
        "Want to work at the cutting edge of the industry",
        "Can handle a steeper learning curve for higher upside",
        "Can commit 10–12 weeks of intensive focused work",
      ],
    },
  ],
  note: '<strong>Both paths share Python, NumPy, Pandas, and basic math.</strong> You do not need to master Sklearn deeply for Path B — two weeks to understand fit/predict/evaluate is enough, then move to PyTorch. Sklearn mastery is a Path A investment. Do not confuse the two or you will go wide and get good at nothing.<br/><br/><strong>On the question of 2 months:</strong> Path A is achievable in 8 weeks if you already have Python and SQL basics. Path B is more honestly 10–12 weeks done right. Both will make you interview-viable for entry-level roles — but you must fully build the capstones, not just understand them. Interviewers will ask you to explain every line.',
};

// ═══════════════════════════════════════════════════════════════
// THEME-AWARE COLOR HELPERS
// ═══════════════════════════════════════════════════════════════

const V = {
  a: {
    color: "text-emerald-400",
    colorDark: "dark:text-emerald-400",
    colorLight: "text-emerald-600",
    bg: "bg-emerald-400/5 dark:bg-emerald-400/7",
    border: "border-emerald-400/15 dark:border-emerald-400/18",
    badge: "bg-emerald-400/5 dark:bg-emerald-400/7 border border-emerald-400/15 dark:border-emerald-400/18 text-emerald-600 dark:text-emerald-400",
    weekBadge: "text-emerald-500/60 dark:text-emerald-400/60 bg-emerald-500/5 dark:bg-emerald-400/6 border border-emerald-500/10 dark:border-emerald-400/12",
    dot: "bg-emerald-500 dark:bg-emerald-400",
    pill: "bg-emerald-500/8 dark:bg-emerald-400/7 border border-emerald-500/20 dark:border-emerald-400/18 text-emerald-600 dark:text-emerald-400",
    topBar: "bg-emerald-500 dark:bg-emerald-400",
  },
  b: {
    color: "text-purple-400",
    colorDark: "dark:text-purple-400",
    colorLight: "text-purple-600",
    bg: "bg-purple-400/5 dark:bg-purple-400/7",
    border: "border-purple-400/15 dark:border-purple-400/18",
    badge: "bg-purple-400/5 dark:bg-purple-400/7 border border-purple-400/15 dark:border-purple-400/18 text-purple-600 dark:text-purple-400",
    weekBadge: "text-purple-500/60 dark:text-purple-400/60 bg-purple-500/5 dark:bg-purple-400/6 border border-purple-500/10 dark:border-purple-400/12",
    dot: "bg-purple-500 dark:bg-purple-400",
    pill: "bg-purple-500/8 dark:bg-purple-400/7 border border-purple-500/20 dark:border-purple-400/18 text-purple-600 dark:text-purple-400",
    topBar: "bg-purple-500 dark:bg-purple-400",
  },
  shared: {
    pill: "bg-orange-500/8 dark:bg-orange-400/7 border border-orange-500/20 dark:border-orange-400/18 text-orange-600 dark:text-orange-400",
  },
};

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function TwoPathRoadmapPage() {
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    // The scrollable container is the parent from the static layout
    const el = document.querySelector('[data-static-scroll]') as HTMLElement
      || (document.querySelector('.flex-1.overflow-y-auto') as HTMLElement);
    if (!el) return;
    const onScroll = () => {
      const pct = el.scrollTop / (el.scrollHeight - el.clientHeight);
      setScrollPct(Math.min(1, pct));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-full bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-300">
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(217,170,56,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(217,170,56,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Progress bar */}
      <div className="fixed top-0 left-0 h-0.5 bg-amber-500/80 z-50 transition-all" style={{ width: `${scrollPct * 100}%` }} />

      <div className="max-w-[1020px] mx-auto px-6 pt-16 pb-32">

        {/* ══════════════════ HEADER ══════════════════ */}
        <header className="text-center mb-18 pb-12 border-b border-[var(--border-default)] relative">
          <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--text-muted)] mb-5 flex items-center justify-center gap-3">
            <span className="w-10 h-px bg-[var(--border-default)]" />
            {SITE.kicker}
            <span className="w-10 h-px bg-[var(--border-default)]" />
          </div>
          <h1 className="font-serif text-[clamp(32px,5vw,52px)] font-normal text-[var(--text-primary)] leading-[1.1] mb-2 tracking-tight">
            {SITE.title}
            <br />
            <em className="italic text-amber-500">{SITE.titleHighlight}</em>
          </h1>
          <p className="text-sm text-[var(--text-muted)] max-w-[480px] mx-auto mt-4 mb-8 leading-7">
            {SITE.subtitle}
          </p>
          <div className="flex justify-center gap-2.5 flex-wrap">
            {SITE.pills.map((p) => (
              <span key={p.label} className={`font-mono text-[10px] px-3.5 py-1.5 rounded-full tracking-wide uppercase ${p.variant === "a" ? V.a.pill : p.variant === "b" ? V.b.pill : V.shared.pill}`}>
                {p.label}
              </span>
            ))}
          </div>
        </header>

        {/* ══════════════════ THE FORK ══════════════════ */}
        <div className="bg-[var(--bg-subtle)] border border-[var(--border-default)] rounded-[14px] p-7 mb-5 grid grid-cols-1 md:grid-cols-[auto_1fr_1fr] items-stretch">
          <div className="text-[26px] md:pr-7 flex items-center justify-center md:border-r border-[var(--border-default)] md:mr-7 pb-4 md:pb-0 mb-4 md:mb-0 border-b md:border-b-0">
            {DECISION.icon}
          </div>
          {DECISION.sides.map((s, i) => (
            <div key={s.variant} className={`py-1 ${i === 1 ? "md:pl-7 md:border-l border-[var(--border-default)] pt-4 md:pt-1 border-t md:border-t-0 mt-4 md:mt-0" : ""}`}>
              <div className={`font-mono text-[9px] tracking-[0.16em] uppercase mb-2 ${s.variant === "a" ? "text-emerald-600 dark:text-emerald-400" : "text-purple-600 dark:text-purple-400"}`}>
                {s.label}
              </div>
              <div className="text-sm font-semibold text-[var(--text-primary)] mb-1">{s.name}</div>
              <div className="font-mono text-[10px] text-[var(--text-muted)] mb-2">{s.roles}</div>
              <div className="text-[12.5px] text-[var(--text-muted)] leading-relaxed" dangerouslySetInnerHTML={{ __html: s.desc.replace(/<strong>/g, '<strong class="text-[var(--text-secondary)] font-medium">') }} />
            </div>
          ))}
        </div>

        {/* ══════════════════ TIMELINES ══════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-12">
          {TIMELINES.map((tl) => {
            const v = V[tl.variant];
            return (
              <div key={tl.variant} className={`rounded-[10px] p-5 border relative overflow-hidden ${v.bg} ${v.border}`}>
                <div className={`absolute top-0 left-0 right-0 h-0.5 ${v.topBar}`} />
                <div className={`font-mono text-[9px] tracking-[0.14em] uppercase mb-2.5 ${tl.variant === "a" ? "text-emerald-600 dark:text-emerald-400" : "text-purple-600 dark:text-purple-400"}`}>
                  {tl.label}
                </div>
                <div className="flex gap-1.5 mb-2.5 flex-wrap">
                  {tl.weekLabels.map((w) => (
                    <span key={w} className={`font-mono text-[9px] px-2 py-0.5 rounded ${v.weekBadge}`}>{w}</span>
                  ))}
                </div>
                <div className="flex flex-col gap-1.5">
                  {tl.phases.map((p) => (
                    <div key={p.name} className="flex items-center gap-2.5 text-[11px]">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${v.dot}`} />
                      <div className="font-mono text-[9px] min-w-[52px] text-[var(--text-muted)]">{p.weeks}</div>
                      <div className="text-[var(--text-secondary)]">{p.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ══════════════════ SHARED FOUNDATION ══════════════════ */}
        <div className="bg-orange-500/5 dark:bg-orange-400/7 border border-orange-500/15 dark:border-orange-400/18 rounded-xl p-7 mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="font-mono text-[9px] px-2.5 py-0.5 rounded bg-orange-500/8 dark:bg-orange-400/10 border border-orange-500/20 dark:border-orange-400/18 text-orange-600 dark:text-orange-400 tracking-[0.1em] uppercase">
              {FOUNDATION.badge}
            </span>
            <span className="text-[15px] font-semibold text-[var(--text-primary)]">{FOUNDATION.title}</span>
            <span className="font-mono text-[10px] text-orange-600 dark:text-orange-400 bg-orange-500/8 dark:bg-orange-400/10 border border-orange-500/20 dark:border-orange-400/18 px-2.5 py-0.5 rounded ml-auto">
              {FOUNDATION.week}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {FOUNDATION.tags.map((t) => (
              <span key={t} className="font-mono text-[10px] px-2 py-0.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-muted)]">{t}</span>
            ))}
          </div>
          <div className="text-[12.5px] text-[var(--text-muted)] leading-relaxed border-t border-orange-400/10 pt-3.5" dangerouslySetInnerHTML={{ __html: FOUNDATION.note.replace(/<strong>/g, '<strong class="text-[var(--text-secondary)] font-medium">') }} />
        </div>

        {/* ══════════════════ TWO PATHS ══════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {PATHS.map((path) => {
            const v = V[path.variant];
            return (
              <div key={path.variant} className="flex flex-col gap-3.5">
                {/* Path Header */}
                <div className={`p-5 rounded-t-[10px] border border-b-0 ${v.bg} ${v.border}`}>
                  <div className={`font-mono text-[9px] tracking-[0.16em] uppercase mb-1 ${path.variant === "a" ? "text-emerald-600 dark:text-emerald-400" : "text-purple-600 dark:text-purple-400"}`}>
                    {path.badge}
                  </div>
                  <div className="text-base font-semibold text-[var(--text-primary)] mb-1">{path.name}</div>
                  <div className="text-[11px] text-[var(--text-muted)] font-mono mb-1">{path.roles}</div>
                  <div className={`font-mono text-[9.5px] opacity-45 ${path.variant === "a" ? "text-emerald-600 dark:text-emerald-400" : "text-purple-600 dark:text-purple-400"}`}>
                    {path.stat}
                  </div>
                </div>

                {/* Step Cards */}
                {path.steps.map((step, idx) => (
                  <div key={step.num}>
                    <div className="border border-[var(--border-default)] rounded-lg overflow-hidden bg-[var(--bg-surface)]">
                      <div className="px-4 py-3 border-b border-[var(--border-default)] flex items-center gap-2.5">
                        <span className={`font-mono text-[9px] font-medium px-2 py-0.5 rounded ${v.badge}`}>{step.num}</span>
                        <div className="flex items-center justify-between flex-1 gap-2">
                          <span className="text-[12.5px] font-semibold text-[var(--text-primary)]">{step.title}</span>
                          <span className={`font-mono text-[9px] px-2 py-0.5 rounded whitespace-nowrap shrink-0 ${v.weekBadge}`}>{step.week}</span>
                        </div>
                      </div>
                      <div className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {step.tags.map((t) => (
                            <span key={t} className="font-mono text-[9.5px] px-2 py-0.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-muted)]">{t}</span>
                          ))}
                        </div>
                        <div className="text-[11.5px] text-[var(--text-muted)] leading-relaxed" dangerouslySetInnerHTML={{ __html: step.desc.replace(/<strong>/g, '<strong class="text-[var(--text-secondary)] font-medium">') }} />
                      </div>
                    </div>
                    {idx < path.steps.length - 1 && (
                      <div className="text-center text-white/[0.08] dark:text-white/[0.08] text-sm py-0 leading-none">↓</div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* ══════════════════ JOB ROLES ══════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {JOBS.map((jc) => {
            const v = V[jc.variant];
            return (
              <div key={jc.variant} className="border border-[var(--border-default)] rounded-xl p-5 bg-[var(--bg-surface)]">
                <div className={`text-[11px] font-semibold font-mono tracking-[0.1em] uppercase pb-2.5 mb-3.5 border-b border-[var(--border-default)] ${jc.variant === "a" ? "text-emerald-600 dark:text-emerald-400" : "text-purple-600 dark:text-purple-400"}`}>
                  {jc.title}
                </div>
                {jc.jobs.map((j, i) => (
                  <div key={j.title} className={`py-2 flex flex-col gap-0.5 ${i < jc.jobs.length - 1 ? "border-b border-[var(--border-subtle)]" : ""}`}>
                    <div className="text-[13px] font-medium text-[var(--text-primary)]">{j.title}</div>
                    <div className="text-[10.5px] text-[var(--text-muted)] font-mono">{j.skills}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* ══════════════════ COMPARISON TABLE ══════════════════ */}
        <div className="mt-14 pt-12 border-t border-[var(--border-default)] mb-14">
          <div className="text-center mb-9 pb-7 border-b border-[var(--border-default)]">
            <h2 className="font-serif text-[clamp(22px,3vw,32px)] font-normal text-[var(--text-primary)] mb-2 tracking-tight">Side-by-Side Comparison</h2>
            <p className="text-[13px] text-[var(--text-muted)] max-w-[500px] mx-auto leading-relaxed">Use this table to make your decision and anchor your discussion with seniors.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-[var(--border-default)] rounded-[10px] overflow-hidden text-left">
              <thead>
                <tr>
                  <th className="px-4 py-3 font-mono text-[10px] tracking-[0.1em] uppercase font-medium text-[var(--text-muted)] bg-[var(--bg-subtle)] border-r border-[var(--border-default)]">Dimension</th>
                  <th className="px-4 py-3 font-mono text-[10px] tracking-[0.1em] uppercase font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-400/5 dark:bg-emerald-400/7 border-r border-[var(--border-default)]">Path A · Data Domain</th>
                  <th className="px-4 py-3 font-mono text-[10px] tracking-[0.1em] uppercase font-medium text-purple-600 dark:text-purple-400 bg-purple-400/5 dark:bg-purple-400/7">Path B · AI Engineering</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row, i) => (
                  <tr key={row.dimension} className={i % 2 === 1 ? "bg-white/[0.01] dark:bg-white/[0.01]" : ""}>
                    <td className="px-4 py-3 text-[12px] border-t border-[var(--border-default)] border-r border-[var(--border-default)] font-mono text-[10px] text-[var(--text-muted)] tracking-wide whitespace-nowrap align-top">{row.dimension}</td>
                    <td className="px-4 py-3 text-[12px] border-t border-[var(--border-default)] border-r border-[var(--border-default)] text-emerald-800/70 dark:text-emerald-300/50 leading-snug align-top">{row.pathA}</td>
                    <td className="px-4 py-3 text-[12px] border-t border-[var(--border-default)] text-purple-800/60 dark:text-purple-300/50 leading-snug align-top">{row.pathB}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ══════════════════ PROJECTS ══════════════════ */}
        <div className="mt-14 mb-12">
          <div className="text-center mb-9 pb-7 border-b border-[var(--border-default)]">
            <h2 className="font-serif text-[clamp(22px,3vw,32px)] font-normal text-[var(--text-primary)] mb-2 tracking-tight">Industry-Level Projects</h2>
            <p className="text-[13px] text-[var(--text-muted)] max-w-[500px] mx-auto leading-relaxed">10 projects per path — each maps directly to skills above. These form the foundation your capstones are built on. Do not skip them.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {PROJECTS.map((col) => {
              const v = V[col.variant];
              return (
                <div key={col.variant} className="flex flex-col gap-2.5">
                  <div className={`p-4 rounded-t-lg border border-b-0 ${v.bg} ${v.border}`}>
                    <div className={`font-mono text-[9px] tracking-[0.14em] uppercase mb-1 ${col.variant === "a" ? "text-emerald-600 dark:text-emerald-400" : "text-purple-600 dark:text-purple-400"}`}>{col.badge}</div>
                    <div className="text-[13px] font-semibold text-[var(--text-primary)]">{col.title}</div>
                  </div>

                  {col.projects.map((proj) => (
                    <div key={proj.num} className="border border-[var(--border-default)] rounded-lg bg-[var(--bg-surface)] overflow-hidden">
                      <div className="px-4 py-2.5 border-b border-[var(--border-default)] flex items-start gap-2">
                        <span className={`font-mono text-[9px] font-semibold px-2 py-0.5 rounded mt-0.5 shrink-0 ${v.badge}`}>{proj.num}</span>
                        <div className="text-[12px] font-semibold text-[var(--text-primary)] leading-tight flex-1">{proj.name}</div>
                      </div>
                      <div className="px-4 py-2.5">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {proj.tags.map((t) => (
                            <span key={t} className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-muted)]">{t}</span>
                          ))}
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)] leading-relaxed" dangerouslySetInnerHTML={{ __html: proj.learns }} />
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* ══════════════════ CAPSTONES ══════════════════ */}
        <div className="mt-16 pt-14 border-t border-[var(--border-default)] mb-12">
          <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-[var(--text-muted)] text-center mb-2.5 flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-[var(--border-default)]" />
            Final Two Projects Per Path
            <span className="w-8 h-px bg-[var(--border-default)]" />
          </div>
          <h2 className="font-serif text-[clamp(22px,3vw,32px)] font-normal text-[var(--text-primary)] text-center mb-2 tracking-tight">
            The <em className="italic text-amber-500">Capstone</em> Projects
          </h2>
          <p className="text-[13px] text-[var(--text-muted)] max-w-[560px] mx-auto text-center leading-relaxed mb-10">
            Each capstone consolidates multiple smaller projects into one production-grade system. These are what you bring to interviews. They must be fully built — not just understood.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {CAPSTONES.map((col) => {
              const v = V[col.variant];
              return (
                <div key={col.variant} className="flex flex-col gap-5">
                  <div className={`font-mono text-[9px] tracking-[0.14em] uppercase p-2.5 rounded-md text-center ${v.badge}`}>
                    {col.label}
                  </div>

                  {col.capstones.map((cap) => (
                    <div key={cap.tag} className={`rounded-xl overflow-hidden border ${v.border} ${v.bg}`}>
                      {/* Capstone top */}
                      <div className="p-5 border-b border-[var(--border-default)]">
                        <div className="flex items-center gap-2 flex-wrap mb-2.5">
                          <span className={`font-mono text-[9px] font-semibold px-2 py-0.5 rounded tracking-wide ${v.badge}`}>{cap.tag}</span>
                          <span className="font-mono text-[9px] text-[var(--text-muted)] tracking-wide">{cap.domain}</span>
                        </div>
                        <div className="text-[15px] font-semibold text-[var(--text-primary)] leading-tight mb-2">{cap.name}</div>
                        <div className="text-[12px] text-[var(--text-muted)] leading-relaxed">{cap.why}</div>
                      </div>

                      {/* Capstone body */}
                      <div className="p-5">
                        {/* Week badges */}
                        <div className="flex gap-1.5 flex-wrap mb-3.5">
                          {cap.weekLabels.map((w) => (
                            <span key={w} className={`font-mono text-[9px] px-2 py-0.5 rounded ${v.weekBadge}`}>{w}</span>
                          ))}
                        </div>

                        {/* Tech stack */}
                        <div className="font-mono text-[9px] tracking-[0.12em] uppercase text-[var(--text-muted)] mb-2">{cap.stackLabel}</div>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {cap.techStack.map((t) => (
                            <span key={t} className="font-mono text-[9.5px] px-2 py-0.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-muted)]">{t}</span>
                          ))}
                        </div>

                        {/* Breakdown */}
                        <div className="mb-4">
                          <div className="font-mono text-[9px] tracking-[0.12em] uppercase text-[var(--text-muted)] mb-2.5">{cap.breakdownTitle}</div>
                          {cap.breakdown.map((b, i) => (
                            <div key={b.title} className={`text-[11.5px] text-[var(--text-muted)] leading-relaxed py-2 ${i > 0 ? "border-t border-[var(--border-subtle)]" : ""}`}>
                              <span className="text-[var(--text-secondary)] font-semibold block mb-0.5 text-[11px]">{b.title}</span>
                              {b.desc}
                            </div>
                          ))}
                        </div>

                        {/* Covers */}
                        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-md p-3">
                          <div className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-[0.1em] mb-1">{cap.coversLabel}</div>
                          <div className="text-[11px] text-[var(--text-muted)] leading-relaxed">{cap.coversText}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* ══════════════════ VERDICT ══════════════════ */}
        <div className="bg-[var(--bg-subtle)] border border-[var(--border-default)] rounded-[14px] p-8">
          <div className="font-serif text-[22px] font-normal text-[var(--text-primary)] mb-5 text-center">{VERDICT.title}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-5">
            {VERDICT.sides.map((side) => {
              const v = V[side.variant];
              return (
                <div key={side.variant} className={`p-5 rounded-[10px] ${v.bg} border ${v.border}`}>
                  <div className={`font-mono text-[9px] tracking-[0.14em] uppercase mb-2.5 pb-2 border-b border-white/5 ${side.variant === "a" ? "text-emerald-600 dark:text-emerald-400" : "text-purple-600 dark:text-purple-400"}`}>
                    {side.label}
                  </div>
                  <ul className="list-none p-0 m-0">
                    {side.items.map((item) => (
                      <li key={item} className="text-[12.5px] text-[var(--text-muted)] py-1 pl-4 relative leading-snug before:content-['→'] before:absolute before:left-0 before:text-[10px] before:top-1.5">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="text-[12.5px] text-[var(--text-muted)] leading-relaxed border-t border-[var(--border-default)] pt-4" dangerouslySetInnerHTML={{ __html: VERDICT.note.replace(/<strong>/g, '<strong class="text-[var(--text-secondary)] font-medium">') }} />
        </div>

        {/* ══════════════════ FOOTER ══════════════════ */}
        <footer className="text-center font-mono text-[10px] text-[var(--text-muted)] tracking-[0.12em] pt-10 uppercase border-t border-[var(--border-default)] mt-16 opacity-40">
          {SITE.footer}
        </footer>
      </div>
    </div>
  );
}
