"use client";

import { useEffect, useState, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// DATA — ALL CONTENT LIVES HERE
// ═══════════════════════════════════════════════════════════════

const SITE = {
  heroLabel: "1-Month Sprint · 7 Phases · Job-Ready",
  heroTitle: "The 6-Layer",
  heroGradient: "AI Engineering Roadmap",
  heroIntro:
    "A structured, ground-up curriculum combining theoretical depth with relentless practical application. Each phase builds directly on the last — from raw Python fundamentals to production-grade AI systems with agents, RAG pipelines, safety layers, and deployment. Complete all seven phases and you will have the skills, vocabulary, and portfolio to land a junior-to-mid AI/ML engineering role.",
  footer:
    "// 6-Layer AI Engineering Roadmap · 7 Phases · 85 Practice Problems · 23 Portfolio Projects · 1 Month to Job Ready",
};

interface Concept {
  name: string;
  why: string;
}
interface Project {
  num: string;
  name: string;
  desc: string;
  tags: string[];
}
interface Resource {
  name: string;
  desc: string;
}
interface SummaryStep {
  num: string;
  text: string;
}
interface Phase {
  id: string;
  num: string;
  badge: string;
  title: string;
  timeline: string;
  tools: string[];
  problem: string;
  conceptsIcon: string;
  concepts: Concept[];
  questions: string[];
  projects: Project[];
  summary: {
    label: string;
    intro: string;
    steps: SummaryStep[];
    resources: Resource[];
    milestone: string;
  };
  color: string;
  glow: string;
  border: string;
}

const PHASES: Phase[] = [
  // ── PHASE 1 ─────────────────────────────────────────────────────────────
  {
    id: "phase1",
    num: "01",
    badge: "Layer 1 — Production Engineering",
    title: "Python Engineering Foundations",
    timeline: "// Week 1 · Target: Write production-grade Python",
    tools: [
      "asyncio",
      "Pydantic v2",
      "httpx",
      "tenacity",
      "loguru",
      "Docker",
      "uv",
      "pytest",
      "ruff",
    ],
    problem:
      "Most AI engineers write fragile scripts that break in production — no retries, no validation, no tests, no containers.\nThis phase solves that: you build the async, typed, tested, Dockerised Python muscle that every real AI system runs on.",
    conceptsIcon: "⚙️",
    concepts: [
      {
        name: "asyncio / await",
        why: "Most AI engineering is I/O-bound (API calls, DB queries). Async Python lets you saturate network bandwidth instead of waiting serially — critical for throughput.",
      },
      {
        name: "Pydantic v2 models",
        why: "Define data schemas with types, validators, and serializers. Pydantic is the backbone of FastAPI and Instructor — mastery here pays dividends in every later phase.",
      },
      {
        name: "Pydantic validators",
        why: "@field_validator and @model_validator allow complex cross-field rules. LLM outputs must be validated — this is how you do it.",
      },
      {
        name: "httpx",
        why: "Modern async HTTP client that replaces requests. Supports HTTP/2, connection pooling, timeouts, and async context managers — the right tool for hitting LLM APIs.",
      },
      {
        name: "tenacity retry patterns",
        why: "Configurable retry strategies (fixed, exponential, jitter) with wait_random_exponential. Correct for OpenAI rate limits and transient cloud failures.",
      },
      {
        name: "loguru structured logging",
        why: "Log levels, contextual fields, file rotation, and JSON sinks. Structured logs are machine-parseable — essential for production monitoring tools like Datadog.",
      },
      {
        name: "uv package manager",
        why: "10–100× faster than pip. Handles virtual envs, lockfiles, and workspaces. Emerging industry standard that replaces pip + poetry + venv.",
      },
      {
        name: "Docker multi-stage builds",
        why: "Separate build and runtime layers to produce lean production images (<100 MB). Reduces attack surface and speeds up CI/CD pipelines.",
      },
      {
        name: "Docker Compose",
        why: "Orchestrate multi-container local environments (app + Postgres + Redis + vector DB). Standard for local development of distributed systems.",
      },
      {
        name: "pytest + fixtures",
        why: "Parameterised tests, mock injection, and conftest patterns. Untested AI code is unmaintainable; testing LLM pipelines requires specific strategies.",
      },
      {
        name: "ruff linting",
        why: "Blazingly fast Python linter and formatter. Enforces consistent code style, catches bugs, and replaces flake8 + isort + black in one tool.",
      },
      {
        name: "Type hints + mypy",
        why: "Static typing catches bugs before runtime. Pydantic and modern Python libraries are fully typed — ignoring types means ignoring half the documentation.",
      },
      {
        name: "Context managers",
        why: "async with for resource management (DB connections, HTTP sessions). Prevents resource leaks in long-running services.",
      },
      {
        name: "Environment variable management",
        why: "python-dotenv, pydantic-settings — never hardcode API keys. 12-factor app compliance is table stakes for any production deployment.",
      },
    ],
    questions: [
      "Rewrite a synchronous script that calls a REST API 50 times into an async version using httpx.AsyncClient and asyncio.gather. Measure the speedup.",
      "Define a Pydantic v2 model for an LLM API response with nested objects, optional fields, and a custom @field_validator that normalises a URL field.",
      "Build a retry decorator using tenacity that retries on httpx.HTTPStatusError (429, 500–503) with exponential backoff, max 5 attempts, and logs each retry event.",
      "Create a Docker multi-stage build: stage 1 installs deps and runs tests; stage 2 is a minimal runtime image. Verify the final image size is under 200 MB.",
      "Write a docker-compose.yml that starts your FastAPI app, a PostgreSQL instance, and a Redis cache — with correct depends_on, healthcheck, and volume configuration.",
      "Configure loguru to emit JSON structured logs to stdout and rotate a plaintext log file daily, retaining 7 days. Parse one JSON log line with Python to verify schema.",
      "Create a pydantic-settings configuration class that loads API keys from environment variables, validates they're non-empty strings, and raises a clear error at startup if missing.",
      "Write a pytest test suite for an async function that calls an external API — mock the HTTP response with pytest-httpx and test both success and 429 rate-limit paths.",
      "Implement a generic async task queue using asyncio.Queue with a configurable number of worker coroutines — process 100 tasks and report throughput.",
      "Set up a Python project with uv: initialise, add dependencies, lock, export a requirements.txt, and run the test suite through a GitHub Actions YAML workflow.",
    ],
    projects: [
      {
        num: "PROJECT 01",
        name: "Production-Grade API Client Library",
        desc: "Build a typed Python client for any public REST API (e.g., GitHub, OpenWeatherMap). Async by default, full retry logic, structured logging, Pydantic response models, 90%+ test coverage, published to PyPI.",
        tags: ["httpx", "Pydantic", "tenacity", "pytest"],
      },
      {
        num: "PROJECT 02",
        name: "Dockerised Microservice with CI/CD",
        desc: "FastAPI microservice with async endpoints, Pydantic request/response models, PostgreSQL via async SQLAlchemy, multi-stage Docker build, Docker Compose for local dev, and full GitHub Actions CI pipeline.",
        tags: ["FastAPI", "Docker", "asyncio", "GitHub Actions"],
      },
      {
        num: "PROJECT 03",
        name: "Rate-Limited Batch Processing Engine",
        desc: "Async engine that processes N tasks concurrently against a rate-limited API (e.g., OpenAI). Implements token bucket or semaphore rate limiting, dead-letter queue for failures, progress reporting, and result persistence.",
        tags: ["asyncio", "Redis", "loguru", "tenacity"],
      },
    ],
    summary: {
      label: "// Phase 1 Workflow — Production Python in 7 Days",
      intro:
        "Phase 1 transforms you from someone who writes Python scripts into someone who writes **production-grade Python services**. Every AI system you build from Phase 3 onward relies on these engineering patterns — async I/O, typed data validation, retry logic, containerisation, and testing.",
      steps: [
        {
          num: "01",
          text: "Master **async/await** with asyncio and httpx — rewrite sync scripts into concurrent versions, measure speedup. All LLM API calls are async in production.",
        },
        {
          num: "02",
          text: "Build **Pydantic v2** models with field validators and model validators. Define response schemas for API data — this becomes your Instructor/LLM output pattern later.",
        },
        {
          num: "03",
          text: "Implement **tenacity retry logic** with exponential backoff — handle 429 rate limits and transient failures. Wire in loguru structured JSON logging.",
        },
        {
          num: "04",
          text: "Set up **Docker multi-stage builds** producing lean images (<200 MB). Write docker-compose.yml orchestrating app + Postgres + Redis.",
        },
        {
          num: "05",
          text: "Write **pytest test suites** with fixtures, mocking (pytest-httpx), and parametrised tests. Achieve 90%+ coverage on async code paths.",
        },
        {
          num: "06",
          text: "Configure **uv + ruff + mypy** for fast dependency management, linting, and static type checking. Set up GitHub Actions CI.",
        },
        {
          num: "07",
          text: "Build and ship a **production API client library** — async, typed, retried, logged, tested, Dockerised, and pushed to GitHub/PyPI.",
        },
      ],
      resources: [
        {
          name: "FastAPI docs",
          desc: "official tutorial covering async endpoints, Pydantic models, dependency injection",
        },
        {
          name: "Pydantic v2 docs",
          desc: "models, validators, serialisation, Settings management",
        },
        {
          name: "Real Python: Async IO",
          desc: "comprehensive asyncio guide with practical examples",
        },
        {
          name: "Docker docs",
          desc: "multi-stage builds, Compose, best practices for Python",
        },
        {
          name: "tenacity docs",
          desc: "retry strategies, exponential backoff, custom callbacks",
        },
        {
          name: "pytest docs",
          desc: "fixtures, parametrize, plugins (pytest-asyncio, pytest-httpx)",
        },
        {
          name: "loguru GitHub",
          desc: "structured logging, sinks, rotation, JSON output",
        },
        {
          name: "uv docs (astral.sh)",
          desc: "modern Python package management replacing pip/poetry",
        },
      ],
      milestone:
        "📦 Phase 1 Milestone — Production API Client Library on GitHub + PyPI",
    },
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.2)",
  },

  // ── PHASE 2 ─────────────────────────────────────────────────────────────
  {
    id: "phase2",
    num: "02",
    badge: "Pre-Foundations + Deep Learning",
    title: "Python · Data Science · ML & Deep Learning",
    timeline:
      "// Week 2 · Target: Solid numerical Python + ML intuition + neural network fundamentals",
    tools: [
      "numpy",
      "pandas",
      "scikit-learn",
      "matplotlib",
      "seaborn",
      "PyTorch",
      "torchvision",
      "CUDA",
      "asyncio",
      "loguru",
      "tenacity",
      "Docker",
    ],
    problem:
      "You can't build intelligent systems if you don't understand data, models, or how machines learn patterns from numbers.\nThis phase gives you numpy fluency, sklearn pipelines, PyTorch neural nets, and the evaluation instincts that power every AI decision downstream.",
    conceptsIcon: "📐",
    concepts: [
      {
        name: "numpy arrays",
        why: "Foundation of all numerical ML work — vectorized operations are 10–100× faster than Python loops. Every tensor library builds on this mental model.",
      },
      {
        name: "pandas DataFrames",
        why: "Industry-standard tabular data manipulation. Real datasets arrive as CSVs or SQL dumps; you must wrangle, clean, and explore them before any modelling.",
      },
      {
        name: "scikit-learn API",
        why: "fit / transform / predict pipeline pattern. Understanding this 'shape' of ML code makes every downstream library (HuggingFace, LlamaIndex) instantly familiar.",
      },
      {
        name: "Model Evaluation Metrics",
        why: "Accuracy, precision, recall, F1, AUC-ROC, MSE/RMSE, R² — choosing the right metric for the business problem is a top interview signal.",
      },
      {
        name: "Train / Val / Test Splits",
        why: "Prevents data leakage. Any model evaluated on its training data is useless in production. Cross-validation is the robust version.",
      },
      {
        name: "Feature Engineering",
        why: "Transforming raw inputs (scaling, encoding, binning) often matters more than model choice. Embedding generation is a modern form of feature engineering.",
      },
      {
        name: "matplotlib / seaborn",
        why: "Visualization for EDA and presenting model results. Data storytelling is essential in team and client environments.",
      },
      {
        name: "asyncio basics",
        why: "Python's native concurrency model. AI APIs are I/O-bound — async allows 50+ simultaneous requests versus 1 sequential, a key production skill.",
      },
      {
        name: "loguru",
        why: "Structured, human-readable logging. Replaces print statements with log levels, rotation, and sinks — mandatory for any production code.",
      },
      {
        name: "tenacity",
        why: "Automatic retry with exponential backoff. LLM APIs rate-limit and occasionally error; tenacity makes your code resilient without writing retry logic manually.",
      },
      {
        name: "Docker basics",
        why: "'Works on my machine' is not deployable. Containerisation ensures your code runs identically in CI/CD, staging, and production.",
      },
      {
        name: "Overfitting vs Underfitting",
        why: "Core ML tradeoff. Regularisation, dropout, early stopping — these concepts appear at every layer from sklearn through fine-tuning LLMs.",
      },
      {
        name: "Gradient Descent intuition",
        why: "You don't need to derive backprop, but understanding loss surfaces, learning rates, and convergence is essential context for fine-tuning later.",
      },
      {
        name: "PyTorch tensors & autograd",
        why: "Tensors are the GPU-accelerated array primitive of all deep learning. torch.Tensor, .requires_grad, and automatic differentiation power every neural network.",
      },
      {
        name: "Neural network fundamentals",
        why: "Layers (Linear, Conv2d, LayerNorm), activation functions (ReLU, GELU, SiLU), loss functions (CrossEntropy, MSE), and nn.Module.",
      },
      {
        name: "Training loop pattern",
        why: "Forward pass → loss → loss.backward() → optimizer.step() → optimizer.zero_grad(). The 5-line loop that trains every deep learning model.",
      },
      {
        name: "CNN & computer vision",
        why: "Convolutional layers, pooling, and feature maps — the architecture behind image classification, object detection, and multimodal AI.",
      },
      {
        name: "Transfer learning",
        why: "Load a pre-trained model, freeze early layers, fine-tune the head on your data. This is how 90% of real-world deep learning works.",
      },
      {
        name: "Modern frontier models",
        why: "GPT-4o, Claude (Anthropic), Gemini (Google), Qwen (Alibaba), Grok (xAI), Llama (Meta), Mistral, DeepSeek. Know their architectures, context windows, strengths, licensing, and pricing.",
      },
      {
        name: "GPU / CUDA awareness",
        why: ".to('cuda'), mixed precision (torch.float16, bfloat16), VRAM budgeting. Essential for loading and fine-tuning models.",
      },
      {
        name: "Chain-of-thought reasoning",
        why: "Prompting models to show step-by-step reasoning dramatically improves accuracy on math, logic, and multi-hop questions.",
      },
    ],
    questions: [
      "Load a CSV with pandas, identify missing values, impute them using column medians, and explain why imputing the median is safer than the mean for skewed data.",
      "Write a numpy function that performs z-score normalisation on a 2D array without using sklearn — then verify it matches StandardScaler.",
      "Build a full sklearn pipeline that includes imputation, one-hot encoding for categoricals, scaling for numericals, and a RandomForest classifier. Evaluate with 5-fold cross-validation.",
      "Given a binary classification problem with 95% class imbalance, explain which metrics you'd choose and why, then demonstrate using class_weight='balanced'.",
      "Write an async function using asyncio.gather that simulates fetching 20 URLs concurrently and compare its wall-clock time to a synchronous version.",
      "Wrap an unreliable function (randomly raises an exception) with tenacity so it retries up to 5 times with exponential backoff and logs each attempt with loguru.",
      "Build a Dockerfile for a Python data science script: install dependencies from requirements.txt, copy source, set entry point, and run the container locally.",
      "Plot a confusion matrix and ROC curve for a trained sklearn model using matplotlib. Interpret the AUC score in one sentence as if explaining to a non-technical stakeholder.",
      "Implement k-Nearest Neighbours from scratch using only numpy (no sklearn). Validate its predictions match sklearn.neighbors.KNeighborsClassifier on the Iris dataset.",
      "Perform a full EDA on a public tabular dataset (e.g., Titanic): distributions, correlations, outlier detection, and at least 3 actionable insights.",
      "Create a PyTorch tensor, move it to GPU with .to('cuda'), perform matrix multiplication, and compute gradients using autograd. Verify the gradient of y = x² + 3x at x=2 equals 7.",
      "Build a simple feedforward neural network in PyTorch (nn.Module) that classifies MNIST digits. Train for 5 epochs, plot the loss curve, and report test accuracy — aim for >97%.",
      "Use torchvision to load a pre-trained ResNet-18. Freeze all layers except the final FC head, fine-tune on a custom image dataset (e.g., CIFAR-10 subset), and compare accuracy to training from scratch.",
      "Compare 3 frontier models (e.g., GPT-4o, Claude Sonnet, Qwen-2.5) on the same 10-question reasoning benchmark. Create a comparison table covering accuracy, latency, cost, and output quality.",
      "Implement chain-of-thought prompting: ask a model a multi-step math problem with and without CoT. Measure the accuracy difference across 20 questions and explain why CoT helps.",
    ],
    projects: [
      {
        num: "PROJECT 01",
        name: "End-to-End Churn Prediction Service",
        desc: "Build a customer churn predictor from raw tabular data: full EDA notebook, sklearn pipeline, model comparison (LR vs RF vs XGBoost), Dockerised FastAPI endpoint serving predictions, and a one-page model card.",
        tags: ["pandas", "sklearn", "Docker", "FastAPI"],
      },
      {
        num: "PROJECT 02",
        name: "Async Data Pipeline with Observability",
        desc: "Design an async Python pipeline that fetches data from a public API, processes it with pandas/numpy, persists results, retries on failure, and emits structured logs — deployable via Docker Compose.",
        tags: ["asyncio", "loguru", "tenacity", "Docker"],
      },
      {
        num: "PROJECT 03",
        name: "ML Experiment Tracker Dashboard",
        desc: "Run 20+ sklearn experiments varying hyperparameters; log all metrics/params to a SQLite or MLflow backend; visualise results with matplotlib/seaborn; produce a ranked leaderboard.",
        tags: ["sklearn", "MLflow", "seaborn", "pandas"],
      },
      {
        num: "PROJECT 04",
        name: "PyTorch Image Classifier with Transfer Learning",
        desc: "Build an image classification app: load a pre-trained ResNet/EfficientNet with torchvision, fine-tune on a custom dataset, deploy as a FastAPI endpoint with Gradio UI. Compare accuracy across 3 architectures.",
        tags: ["PyTorch", "torchvision", "FastAPI", "Gradio"],
      },
      {
        num: "PROJECT 05",
        name: "Frontier Model Benchmark & Selection Guide",
        desc: "Systematically benchmark 5+ frontier models (GPT-4o, Claude, Gemini, Qwen, Grok, Llama) across reasoning, coding, multilingual, and vision tasks. Produce a scored comparison matrix, cost analysis, and decision-tree guide.",
        tags: ["LiteLLM", "DeepEval", "pandas", "matplotlib"],
      },
    ],
    summary: {
      label:
        "// Phase 2 Workflow — Data Science, ML & Deep Learning in 10 Days",
      intro:
        "Phase 2 builds the **numerical and machine learning foundations** that every subsequent phase depends on. numpy arrays become PyTorch tensors. pandas pipelines become RAG ingestion workflows. sklearn's fit/predict/evaluate loop becomes fine-tuning and RAGAS scoring.",
      steps: [
        {
          num: "01",
          text: "Master **numpy array operations** — vectorised math, broadcasting, matrix multiplication with @. Implement cosine similarity from scratch (used daily in embeddings).",
        },
        {
          num: "02",
          text: "Build fluent **pandas pipelines** — load CSVs/JSON, groupby, merge, apply, fillna. Clean a real dataset end-to-end and export structured results.",
        },
        {
          num: "03",
          text: "Master **sklearn's fit/transform/predict** pipeline pattern — Pipeline(), ColumnTransformer, cross_val_score. Train LinearRegression, RandomForest, XGBoost on a real dataset.",
        },
        {
          num: "04",
          text: "Deep-dive into **model evaluation** — precision, recall, F1, AUC-ROC, confusion matrix. Understand which metric fits which business problem. This thinking powers RAGAS later.",
        },
        {
          num: "05",
          text: "Learn **PyTorch tensors and autograd** — create tensors, move to GPU (.to('cuda')), compute gradients. Rebuild sklearn models in raw PyTorch.",
        },
        {
          num: "06",
          text: "Build a **neural network with nn.Module** — training loop (forward → loss → backward → step → zero_grad). Train on MNIST, plot loss curves, hit >97% accuracy.",
        },
        {
          num: "07",
          text: "Practice **transfer learning** — load pre-trained ResNet/EfficientNet, freeze layers, fine-tune the head. Compare to training from scratch. Understand GPU/CUDA basics and mixed precision.",
        },
        {
          num: "08",
          text: "Build **EDA notebooks** with matplotlib/seaborn — distributions, correlations, outliers. Develop data storytelling skills for team environments.",
        },
        {
          num: "09",
          text: "Complete a **Dockerised end-to-end ML pipeline** — raw CSV → clean → feature engineer → train 3 classifiers → evaluate → FastAPI endpoint → Docker container → GitHub.",
        },
      ],
      resources: [
        {
          name: "PyTorch official tutorials",
          desc: "tensors, autograd, nn.Module, training loops, torchvision",
        },
        {
          name: "Andrej Karpathy: Neural Nets Zero to Hero",
          desc: "YouTube series covering backprop, GPT from scratch",
        },
        {
          name: "scikit-learn docs",
          desc: "estimators, pipelines, metrics, cross-validation, preprocessing",
        },
        {
          name: "Kaggle Learn",
          desc: "pandas, data cleaning, feature engineering (free interactive courses)",
        },
        {
          name: "fast.ai Practical Deep Learning",
          desc: "top-down approach to PyTorch, transfer learning, CNNs",
        },
        {
          name: "numpy docs",
          desc: "array operations, broadcasting, linear algebra (numpy.linalg)",
        },
        {
          name: "MLflow docs",
          desc: "experiment tracking, model registry, metric comparison",
        },
        {
          name: "Python Data Science Handbook (Jake VanderPlas)",
          desc: "free online, covers numpy/pandas/sklearn/matplotlib",
        },
      ],
      milestone:
        "📦 Phase 2 Milestone — End-to-End ML Pipeline + PyTorch Classifier on GitHub",
    },
    color: "#10b981",
    glow: "rgba(16,185,129,0.12)",
    border: "rgba(16,185,129,0.2)",
  },

  // ── PHASE 3 ─────────────────────────────────────────────────────────────
  {
    id: "phase3",
    num: "03",
    badge: "Layer 2 — Representation",
    title: "Embeddings, Vectors & Transformers",
    timeline: "// Weeks 3 · Target: Build semantic search systems",
    tools: [
      "sentence-transformers",
      "FAISS",
      "HuggingFace Hub",
      "tiktoken",
      "UMAP",
      "transformers",
      "datasets",
      "numpy",
    ],
    problem:
      "Keyword search fails when users ask questions differently than documents are written — 'how to fix a leaky faucet' won't match 'plumbing repair guide.'\nThis phase teaches you to convert text into meaning-vectors, search by semantics with FAISS, and understand the transformer architecture that makes it all work.",
    conceptsIcon: "🔢",
    concepts: [
      {
        name: "Embeddings",
        why: "Dense vector representations of text/images where semantic similarity maps to geometric proximity. The fundamental primitive of modern AI search, RAG, and classification.",
      },
      {
        name: "Transformer architecture",
        why: "Self-attention mechanism, positional encoding, encoder vs decoder. Knowing why BERT is encoder-only and GPT is decoder-only helps you choose the right model for any task.",
      },
      {
        name: "sentence-transformers",
        why: "SentenceTransformer models fine-tuned for semantic similarity via siamese networks. Produces embeddings optimised for cosine_similarity comparisons.",
      },
      {
        name: "Cosine similarity",
        why: "The standard metric for comparing embeddings. Direction matters, magnitude doesn't — normalised dot product between unit vectors. Faster than Euclidean at scale.",
      },
      {
        name: "FAISS",
        why: "Facebook's battle-tested library for billion-scale nearest-neighbour search. IndexFlatL2, IndexIVFFlat, and HNSW indexes trade accuracy for speed at different scales.",
      },
      {
        name: "ANN algorithms",
        why: "Approximate Nearest Neighbour (HNSW, IVF, PQ) — exact search is O(n) and too slow; ANN sacrifices tiny accuracy for orders-of-magnitude speedup.",
      },
      {
        name: "Tokenisation / tiktoken",
        why: "How text becomes token IDs — BPE, WordPiece. tiktoken lets you count tokens before sending to OpenAI, preventing truncation bugs and managing costs.",
      },
      {
        name: "HuggingFace Hub",
        why: "The GitHub of pre-trained models. Download, share, and deploy 300,000+ models. Understanding model cards and licensing is a professional responsibility.",
      },
      {
        name: "HuggingFace datasets",
        why: "Streaming access to 50,000+ datasets with Arrow-based memory mapping. Load terabyte datasets without fitting them in RAM — essential for fine-tuning.",
      },
      {
        name: "UMAP / t-SNE",
        why: "Dimensionality reduction for visualising high-dimensional embedding spaces. Seeing clusters validates your embeddings and builds intuition for model quality.",
      },
      {
        name: "Embedding chunking strategy",
        why: "Most models have a 512-token context window for embeddings. Fixed-size vs sentence vs semantic chunking affects retrieval quality dramatically.",
      },
      {
        name: "Cross-encoder re-ranking",
        why: "Bi-encoders (fast, approximate) retrieve candidates; cross-encoders (slow, precise) re-rank. Two-stage retrieval is the production-grade pattern.",
      },
      {
        name: "Embedding model evaluation",
        why: "MTEB benchmark. Choosing the right model (speed vs accuracy, multilingual, domain-specific) requires understanding how models are evaluated.",
      },
    ],
    questions: [
      "Embed 1,000 Wikipedia sentences with sentence-transformers, build a FAISS IndexFlatIP index, and query it — measure recall@10 by comparing to brute-force cosine similarity.",
      "Compare three embedding models (e.g., all-MiniLM-L6, bge-large-en, e5-large) on a domain-specific retrieval task. Rank them by accuracy and latency.",
      "Build a FAISS HNSW index vs a flat index on 100k vectors. Plot the query-time vs recall tradeoff and explain when you'd choose one over the other.",
      "Use tiktoken to write a function that splits arbitrary text into chunks of max 400 tokens with 50-token overlap — handling sentence boundaries correctly.",
      "Fine-tune a sentence-transformer model on a custom dataset of (query, positive, negative) triplets using MultipleNegativesRankingLoss. Evaluate before and after on a held-out set.",
      "Use UMAP to reduce 384-dim embeddings of 20 categories of news articles to 2D and plot — colour by category. Interpret what good vs poor separation means for retrieval quality.",
      "Implement semantic deduplication: embed a corpus of 10,000 documents, cluster with k-means, and identify near-duplicate pairs (cosine_similarity > 0.95).",
      "Load a HuggingFace dataset in streaming mode, batch-embed it, and upsert into FAISS in chunks — without loading the full dataset into RAM.",
      "Build a two-stage retriever: bi-encoder (FAISS, top-50) followed by a cross-encoder re-ranker (top-5). Measure the precision improvement from re-ranking.",
      "Implement a simple sentence-level semantic search API with FastAPI: POST /search returns the top-5 most semantically similar passages from a corpus, with scores.",
    ],
    projects: [
      {
        num: "PROJECT 01",
        name: "Semantic Job-Match Engine",
        desc: "Embed 10,000+ job descriptions and résumés. Build a FAISS HNSW index. Expose an API: POST a résumé → receive top-10 matched jobs with explanations. Deploy on Railway or Fly.io.",
        tags: ["sentence-transformers", "FAISS", "FastAPI", "Docker"],
      },
      {
        num: "PROJECT 02",
        name: "Embedding Space Explorer",
        desc: "Interactive Streamlit dashboard: upload any corpus → auto-embed → UMAP 2D visualisation → click a point to retrieve its nearest neighbours. Compare multiple embedding models side-by-side.",
        tags: ["UMAP", "Streamlit", "plotly", "FAISS"],
      },
      {
        num: "PROJECT 03",
        name: "Domain-Adapted Embeddings Evaluator",
        desc: "Fine-tune a sentence-transformer on a domain corpus (medical, legal, code). Run before/after MTEB evaluation. Write a blog post with charts showing improvement. Publish the model to HuggingFace Hub.",
        tags: ["HuggingFace", "MTEB", "fine-tuning", "W&B"],
      },
    ],
    summary: {
      label:
        "// Phase 3 Workflow — Embeddings, Vectors & Transformers in 14 Days",
      intro:
        "Phase 3 is where you transition from classical ML to the **transformer and embedding mental model** that powers all modern AI. Week 1 builds PyTorch fluency and the attention mechanism from first principles. Week 2 moves to the HuggingFace ecosystem, embedding models, and FAISS vector search.",
      steps: [
        {
          num: "01",
          text: "Work through the official **PyTorch tutorials**. Rebuild sklearn models (linear regression, logistic regression, MLP) in raw PyTorch from scratch to solidify tensor operations.",
        },
        {
          num: "02",
          text: "Study the **transformer architecture** — read Jay Alammar's 'Illustrated Transformer', understand self-attention, multi-head attention, and positional encoding deeply.",
        },
        {
          num: "03",
          text: "Code along with Andrej Karpathy's **'Let's build GPT from scratch'** (YouTube, 2 hrs). Type every line yourself. Complete the makemore sequence.",
        },
        {
          num: "04",
          text: "Master **HuggingFace transformers** — load 5+ models (BERT, GPT-2, T5, Llama, a vision model). Learn AutoModelForCausalLM, AutoTokenizer, pipeline().",
        },
        {
          num: "05",
          text: "Deep-dive into **tokenisation** — BPE, WordPiece, tiktoken. Understand cost implications, non-English tokenisation gaps, and how to count tokens before API calls.",
        },
        {
          num: "06",
          text: "Master **sentence-transformers + FAISS** — embed 1,000+ documents, build flat and HNSW indexes, query with cosine similarity. Understand bi-encoder vs cross-encoder re-ranking.",
        },
        {
          num: "07",
          text: "Visualise embeddings with **UMAP** — reduce to 2D, plot clusters by category, build a duplicate question detector. Compare 3+ embedding models on accuracy and latency.",
        },
        {
          num: "08",
          text: "Build the Phase 3 milestone: **Semantic Search Engine** — query → top-5 results with similarity scores. Zero frameworks. sentence-transformers + FAISS.",
        },
      ],
      resources: [
        {
          name: "Jay Alammar: The Illustrated Transformer",
          desc: "essential visual guide to attention mechanism",
        },
        {
          name: "Karpathy: Let's build GPT from scratch",
          desc: "YouTube (2 hrs), build a transformer from zero",
        },
        {
          name: "Karpathy: makemore series",
          desc: "YouTube, character-level language models step by step",
        },
        {
          name: "'Attention Is All You Need' (Vaswani et al.)",
          desc: "the paper. Read abstract + Sections 3.1–3.3",
        },
        {
          name: "HuggingFace Course (huggingface.co/course)",
          desc: "free, covers transformers, tokenizers, fine-tuning",
        },
        {
          name: "sentence-transformers docs",
          desc: "bi-encoders, cross-encoders, training, evaluation",
        },
        {
          name: "FAISS wiki (GitHub)",
          desc: "index types, HNSW, IVF, performance guidelines",
        },
        {
          name: "MTEB Leaderboard (huggingface.co)",
          desc: "benchmark for choosing embedding models",
        },
      ],
      milestone:
        "📦 Phase 3 Milestone — Semantic Search Engine on GitHub (sentence-transformers + FAISS)",
    },
    color: "#3b82f6",
    glow: "rgba(59,130,246,0.12)",
    border: "rgba(59,130,246,0.2)",
  },

  // ── PHASE 4 ─────────────────────────────────────────────────────────────
  {
    id: "phase4",
    num: "04",
    badge: "Layer 3 — Language Model Mastery",
    title: "LLM APIs, Prompting & Fine-Tuning",
    timeline:
      "// Weeks 4 · Target: Reliable, structured LLM outputs + custom models",
    tools: [
      "LiteLLM",
      "Instructor",
      "Pydantic v2",
      "Unsloth",
      "PEFT / LoRA",
      "TRL",
      "W&B",
      "OpenAI SDK",
    ],
    problem:
      "LLMs return unstructured, unpredictable text — you can't build reliable software on string parsing and crossed fingers.\nThis phase teaches you to extract validated Pydantic objects from any LLM, engineer prompts scientifically, and fine-tune small models to beat GPT-4 on your specific task at 1/10th the cost.",
    conceptsIcon: "🧠",
    concepts: [
      {
        name: "Prompt engineering",
        why: "System vs user vs assistant roles, few-shot examples, chain-of-thought (CoT), and XML tags. The difference between a 50% and 95% accurate LLM system often lives in the prompt.",
      },
      {
        name: "LiteLLM",
        why: "Unified interface for 100+ LLM providers (OpenAI, Anthropic, Gemini, local). Swap providers without code changes — essential for cost optimisation and vendor independence.",
      },
      {
        name: "Instructor",
        why: "Extracts structured Pydantic objects from any LLM via function calling or JSON mode. Eliminates brittle regex parsing of LLM outputs — the standard for structured generation.",
      },
      {
        name: "Structured outputs",
        why: "Function calling, tool use, and JSON mode — making LLMs return machine-parseable data. Required for any production pipeline that uses LLM outputs programmatically.",
      },
      {
        name: "LoRA / QLoRA",
        why: "Fine-tune only low-rank adapter matrices (0.1% of parameters). 24 GB of VRAM → fine-tune a 70B model via 4-bit quantisation. The dominant fine-tuning paradigm.",
      },
      {
        name: "Unsloth",
        why: "2× faster, 60% less VRAM for LoRA fine-tuning vs vanilla HuggingFace. Makes fine-tuning feasible on consumer GPUs (RTX 3090/4090).",
      },
      {
        name: "TRL (SFT, DPO)",
        why: "Supervised fine-tuning and Direct Preference Optimisation. SFT teaches format; DPO teaches preferences without a reward model — key for alignment fine-tuning.",
      },
      {
        name: "PEFT",
        why: "HuggingFace library wrapping LoRA, prefix tuning, IA³, and more. Standardises adapter training — any PEFT model can be shared on HuggingFace Hub.",
      },
      {
        name: "W&B experiment tracking",
        why: "Log hyperparameters, loss curves, and model artifacts. Fine-tuning without tracking is like running experiments without a lab notebook.",
      },
      {
        name: "Temperature / sampling params",
        why: "Temperature, top-p, top-k, frequency/presence penalties — controlling output diversity vs determinism for different applications (code vs creative vs factual).",
      },
      {
        name: "Context window management",
        why: "Token budgeting, message truncation, sliding window strategies. Production prompts with 20k+ tokens require deliberate context management.",
      },
      {
        name: "Chat template formats",
        why: "Llama-3, ChatML, Mistral instruction formats. Using the wrong format during inference is a silent bug that degrades quality 20–40%.",
      },
      {
        name: "Quantisation (GGUF/GPTQ)",
        why: "Run 7B models in 4-bit on 8 GB RAM via llama.cpp / Ollama. Enables local inference for privacy-sensitive applications and cost reduction.",
      },
    ],
    questions: [
      "Use LiteLLM to build a provider-agnostic completion function. Call GPT-4o, Claude Sonnet, and Gemini Flash with the same prompt — compare latency, cost, and output quality.",
      "Use Instructor to extract a structured InvoiceData Pydantic model (line items, totals, dates, vendor) from raw invoice text. Handle validation errors with automatic retry.",
      "Design a chain-of-thought prompt that achieves >90% accuracy on a 20-question logical reasoning benchmark. A/B test it against a direct-answer prompt.",
      "Fine-tune a Llama-3.1-8B model on a custom instruction dataset using Unsloth + SFTTrainer. Track loss and eval metrics in W&B. Export to GGUF for Ollama inference.",
      "Implement DPO fine-tuning on a preference dataset (chosen vs rejected responses). Evaluate the aligned model's refusal rate vs helpfulness on a test set.",
      "Build a prompt caching strategy: cache identical system prompts, track cache hit rate, and measure cost savings versus calling the API fresh each time.",
      "Implement a multi-turn conversation manager with token-aware context truncation: when context exceeds 80% of the limit, summarise older messages.",
      "Write a prompt evaluation harness: test 5 prompt variants on 50 examples, score outputs, produce a ranked comparison table with statistical significance.",
      "Use structured outputs (JSON mode + Pydantic) to build a data extraction pipeline that processes 100 unstructured documents and exports a clean CSV — with error handling for invalid outputs.",
      "Deploy a fine-tuned GGUF model locally via Ollama, expose it through an OpenAI-compatible endpoint, and test it with LiteLLM as a drop-in replacement for a cloud model.",
    ],
    projects: [
      {
        num: "PROJECT 01",
        name: "Domain Expert Fine-Tuned Model",
        desc: "Fine-tune Llama/Mistral on a specialised dataset (medical Q&A, legal clauses, code review). Full training run with W&B logging, before/after benchmark comparison, model card on HuggingFace Hub.",
        tags: ["Unsloth", "TRL", "W&B", "HuggingFace"],
      },
      {
        num: "PROJECT 02",
        name: "Structured Data Extraction API",
        desc: "FastAPI service that accepts PDFs/text → extracts structured entities (people, dates, amounts, classifications) as Pydantic models via Instructor → stores to PostgreSQL. Multi-provider via LiteLLM.",
        tags: ["Instructor", "LiteLLM", "Pydantic", "FastAPI"],
      },
      {
        num: "PROJECT 03",
        name: "LLM Prompt Optimisation Framework",
        desc: "Build a DSPy-style or custom prompt optimiser: define a metric, run candidate prompts, score outputs, iterate. Show 30%+ accuracy improvement on a non-trivial task through systematic optimisation.",
        tags: ["LiteLLM", "DSPy", "Pydantic", "W&B"],
      },
    ],
    summary: {
      label:
        "// Phase 4 Workflow — LLM APIs, Prompting & Fine-Tuning in 14 Days",
      intro:
        "Phase 4 covers the **most immediately hireable skills in the 2025–2026 AI market** — 80% of job postings want engineers who can integrate LLM APIs, extract structured outputs, engineer prompts systematically, and fine-tune small models efficiently.",
      steps: [
        {
          num: "01",
          text: "Set up **LiteLLM** as your unified provider interface — one API for OpenAI, Anthropic, Groq, and local models. Learn the messages format deeply. Compare outputs across providers.",
        },
        {
          num: "02",
          text: "Master **temperature, top_p, max_tokens, stop sequences**. Build: same prompt → GPT-4o, Claude Sonnet, Llama 3 simultaneously. Compare quality, cost, and latency.",
        },
        {
          num: "03",
          text: "Run 20+ experiments per prompting technique: **zero-shot → few-shot → chain-of-thought → ReAct**. Build a prompt testing notebook tracking version, technique, pass rate, and cost.",
        },
        {
          num: "04",
          text: "Master the **system prompt architecture**: Role → Context → Constraints → Output Format. Build a YAML-based prompt library with Jinja2 rendering and version tracking.",
        },
        {
          num: "05",
          text: "Implement **streaming + cost estimation** — stream=True with real-time token display. Use tiktoken for pre-send cost estimation. Build token-aware context truncation.",
        },
        {
          num: "06",
          text: "Master **Instructor + Pydantic** for structured outputs — define schemas, extract validated Python objects from LLM text. Build a resume parser: PDF → validated Pydantic model.",
        },
        {
          num: "07",
          text: "Learn **LoRA/QLoRA theory** — low-rank decomposition, 4-bit quantisation with bitsandbytes. Set up Weights & Biases experiment tracking for all training runs.",
        },
        {
          num: "08",
          text: "Fine-tune **Llama 3.1 8B with Unsloth** — load_in_4bit, get_peft_model (r=16, lora_alpha=32), SFTTrainer from TRL. Prove fine-tuning beats few-shot at 1/10th per-call cost via W&B dashboards.",
        },
        {
          num: "09",
          text: "Compare frontier models (GPT-4o, Claude, Qwen, Grok, Gemini) on reasoning benchmarks. Understand when to **fine-tune vs prompt-engineer**. Export to GGUF for Ollama local inference.",
        },
        {
          num: "10",
          text: "Build the milestone: **AI Job Application Assistant** — scrape job URL → Instructor/Pydantic extraction → resume scoring → CoT cover letter → streaming → multi-provider LiteLLM fallback.",
        },
      ],
      resources: [
        {
          name: "LiteLLM docs",
          desc: "unified API, provider support, streaming, fallbacks, cost tracking",
        },
        {
          name: "Instructor docs (useinstructor.com)",
          desc: "Pydantic extraction, retries, validation patterns",
        },
        {
          name: "Anthropic Prompt Engineering Guide",
          desc: "official, covers XML tags, CoT, system prompts",
        },
        {
          name: "OpenAI Cookbook (GitHub)",
          desc: "practical patterns for GPT APIs, function calling, embeddings",
        },
        {
          name: "LoRA Paper (Hu et al. 2021)",
          desc: "read abstract + Section 2. Understand low-rank adaptation",
        },
        {
          name: "Unsloth docs (GitHub)",
          desc: "2× faster QLoRA, GGUF export, Llama/Mistral fine-tuning guides",
        },
        {
          name: "TRL docs (HuggingFace)",
          desc: "SFTTrainer, DPOTrainer, RLHF training loops",
        },
        {
          name: "Weights & Biases (wandb.ai/courses)",
          desc: "free courses on experiment tracking and LLM fine-tuning",
        },
      ],
      milestone:
        "📦 Phase 4 Milestone — AI Job Application Assistant on GitHub (LiteLLM + Instructor + Unsloth)",
    },
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.12)",
    border: "rgba(139,92,246,0.2)",
  },

  // ── PHASE 5 ─────────────────────────────────────────────────────────────
  {
    id: "phase5",
    num: "05",
    badge: "Layer 4 — Retrieval Engineering",
    title: "RAG Engineering (Full Stack)",
    timeline: "// Weeks 5 · Target: Build production-quality retrieval systems",
    tools: [
      "Unstructured",
      "Qdrant",
      "ChromaDB",
      "BM25S",
      "RAGAS",
      "LlamaIndex",
      "LangChain",
      "rerankers",
    ],
    problem:
      "LLMs hallucinate when they don't have the right context — and enterprise data lives in PDFs, databases, and internal docs, not in training data.\nThis phase teaches you to build RAG pipelines that retrieve the right documents, ground every answer in evidence, and measure accuracy with RAGAS metrics.",
    conceptsIcon: "📚",
    concepts: [
      {
        name: "RAG architecture",
        why: "Retrieval-Augmented Generation grounds LLMs in real documents, preventing hallucination and enabling knowledge that exceeds the training cutoff. The dominant enterprise AI pattern.",
      },
      {
        name: "Unstructured.io",
        why: "Parses PDFs, Word docs, HTML, images, tables into clean text elements. Real-world documents are messy — this library handles the chaos before you chunk and embed.",
      },
      {
        name: "Chunking strategies",
        why: "Fixed-size, sentence, semantic, recursive, and document-structure-aware chunking. Wrong chunk size is the #1 cause of poor RAG performance — benchmark across strategies.",
      },
      {
        name: "Vector databases",
        why: "Qdrant (production, filtering, payloads), ChromaDB (local dev), Pinecone (managed). Each offers different tradeoffs — metadata filtering is critical for multi-tenant systems.",
      },
      {
        name: "Qdrant",
        why: "Rust-based vector DB with rich filtering, quantisation, and sparse vector support. The leading open-source choice for production RAG deployments.",
      },
      {
        name: "BM25S / sparse retrieval",
        why: "Keyword-based retrieval still outperforms dense embeddings for exact matches, IDs, and rare terms. Hybrid search (dense + sparse) is the production gold standard.",
      },
      {
        name: "Hybrid search",
        why: "Reciprocal Rank Fusion (RRF) merges dense and sparse results. Consistently outperforms either alone on real-world benchmarks like BEIR.",
      },
      {
        name: "LlamaIndex",
        why: "High-level RAG framework with ingestion pipelines, index abstractions, and query engines. Handles the plumbing so you can focus on optimisation and evaluation.",
      },
      {
        name: "RAGAS evaluation",
        why: "Faithfulness, answer relevance, context recall, context precision — automated RAG metrics. You cannot improve what you don't measure; RAGAS is the industry tool.",
      },
      {
        name: "Query transformation",
        why: "HyDE (hypothetical document embeddings), multi-query, step-back prompting. Bad queries return bad documents — transforming them before retrieval improves recall significantly.",
      },
      {
        name: "Contextual compression",
        why: "Extract only the relevant sentences from retrieved chunks before passing to the LLM. Reduces noise, lowers cost, and improves faithfulness.",
      },
      {
        name: "Metadata filtering",
        why: "Pre-filter by date, source, author, or access permissions before vector search. Critical for enterprise systems where different users see different documents.",
      },
      {
        name: "Ingestion pipelines",
        why: "Incremental indexing, document deduplication, and update handling. A RAG system is only as fresh as its last ingestion — design for continuous or scheduled updates.",
      },
    ],
    questions: [
      "Build an end-to-end RAG pipeline from scratch (no frameworks): parse PDFs with Unstructured, chunk, embed with sentence-transformers, store in Qdrant, retrieve, generate with an LLM.",
      "Compare three chunking strategies (fixed 256, fixed 512, semantic) on the same corpus using RAGAS context recall as the metric. Write up findings in a table.",
      "Implement hybrid search: BM25S sparse retrieval + Qdrant dense retrieval, fused with RRF. Show on 50 queries that hybrid beats either alone by >10% on hit@5.",
      "Implement HyDE query expansion: generate a hypothetical answer, embed it, retrieve using that embedding. Compare to direct query embedding on a factual QA benchmark.",
      "Evaluate a RAG pipeline with RAGAS: faithfulness, answer relevance, context precision, and context recall. Identify the weakest metric and implement one improvement.",
      "Build a multi-tenant RAG system with Qdrant metadata filtering: 3 simulated 'tenants' share the same collection but retrieve only their documents. Verify isolation programmatically.",
      "Design and implement an incremental ingestion pipeline: process only new/changed documents, update existing vectors, and delete removed documents — without re-indexing the whole corpus.",
      "Implement parent-child chunking: store small child chunks for retrieval but return the full parent paragraph as context. Measure the improvement in answer quality vs small chunk retrieval.",
      "Build a LlamaIndex pipeline with a custom node parser, metadata extractor, and sentence-window retrieval. Compare its RAGAS scores to your from-scratch pipeline.",
      "Instrument a RAG pipeline with Langfuse: trace every retrieval call, log retrieved documents and generation, identify the slowest pipeline step, and optimise it.",
    ],
    projects: [
      {
        num: "PROJECT 01",
        name: "Enterprise Document Q&A Platform",
        desc: "Full-stack RAG app: upload PDFs/docs → auto-ingest → hybrid search → cited answers. Streamlit or Next.js UI, Qdrant backend, RAGAS evaluation dashboard, multi-user isolation, Dockerised deployment.",
        tags: ["Qdrant", "LlamaIndex", "RAGAS", "FastAPI"],
      },
      {
        num: "PROJECT 02",
        name: "RAG Benchmark & Optimisation Report",
        desc: "Systematic study: test 5 chunking strategies × 3 embedding models × 2 retrieval methods on a public QA dataset. Produce a Jupyter notebook report with charts, rankings, and recommendations.",
        tags: ["RAGAS", "BEIR", "ChromaDB", "Qdrant"],
      },
      {
        num: "PROJECT 03",
        name: "Real-Time News RAG with Fresh Data",
        desc: "RAG system that ingests live RSS/news feeds hourly, maintains a rolling 30-day Qdrant index, and answers current-events questions with cited sources. Demonstrates production-grade incremental ingestion.",
        tags: ["Qdrant", "Unstructured", "BM25S", "Langfuse"],
      },
    ],
    summary: {
      label: "// Phase 5 Workflow — RAG Engineering (Full Stack) in 10 Days",
      intro:
        "Phase 5 is where everything converges — embeddings from Phase 3, LLM APIs from Phase 4, and engineering patterns from Phase 1 combine into **production-grade Retrieval-Augmented Generation systems**. RAG is the dominant enterprise AI pattern and the most in-demand skill across AI engineering roles.",
      steps: [
        {
          num: "01",
          text: "Build a **RAG pipeline from scratch** (no frameworks) — parse PDFs with Unstructured, chunk text, embed with sentence-transformers, store in Qdrant, retrieve, and generate with an LLM.",
        },
        {
          num: "02",
          text: "Benchmark **3+ chunking strategies** (fixed 256, fixed 512, semantic) on the same corpus. Measure with RAGAS context recall. Understand why wrong chunk size is the #1 RAG failure.",
        },
        {
          num: "03",
          text: "Implement **hybrid search** — BM25S sparse retrieval + Qdrant dense retrieval, fused with Reciprocal Rank Fusion (RRF). Prove hybrid beats either alone by >10% on hit@5.",
        },
        {
          num: "04",
          text: "Add **query transformation** — HyDE (hypothetical document embeddings), multi-query expansion. Implement contextual compression to extract only relevant sentences before LLM generation.",
        },
        {
          num: "05",
          text: "Evaluate with **RAGAS** — faithfulness, answer relevance, context precision, context recall. Identify the weakest metric and improve it. This is the scientific method of RAG.",
        },
        {
          num: "06",
          text: "Build with **LlamaIndex** — ingestion pipelines, custom node parsers, metadata extractors, sentence-window retrieval. Compare RAGAS scores to your from-scratch pipeline.",
        },
        {
          num: "07",
          text: "Implement **metadata filtering** for multi-tenant isolation and **incremental ingestion** — process only new/changed documents without re-indexing the whole corpus.",
        },
        {
          num: "08",
          text: "Add **Langfuse observability** — trace every retrieval call, log documents and generation, identify bottlenecks, optimise the slowest pipeline step.",
        },
        {
          num: "09",
          text: "Build the milestone: **Enterprise Document Q&A Platform** — upload PDFs → auto-ingest → hybrid search → cited answers → RAGAS dashboard → multi-user → Dockerised.",
        },
      ],
      resources: [
        {
          name: "LlamaIndex docs (llamaindex.ai)",
          desc: "ingestion, indexes, query engines, evaluation",
        },
        {
          name: "Qdrant docs",
          desc: "collections, filtering, sparse vectors, hybrid search, quantisation",
        },
        {
          name: "RAGAS docs (ragas.io)",
          desc: "faithfulness, context recall/precision, answer relevancy metrics",
        },
        {
          name: "Unstructured docs",
          desc: "PDF, DOCX, HTML, image parsing pipelines",
        },
        {
          name: "Langfuse docs",
          desc: "tracing, cost tracking, prompt management, evaluation",
        },
        {
          name: "Jerry Liu: Building Production RAG (YouTube)",
          desc: "LlamaIndex creator on real-world patterns",
        },
        {
          name: "BEIR Benchmark",
          desc: "standard retrieval evaluation across 18 datasets",
        },
        {
          name: "Pinecone Learning Center",
          desc: "free guides on chunking, hybrid search, vector DB concepts",
        },
      ],
      milestone:
        "📦 Phase 5 Milestone — Enterprise Document Q&A Platform on GitHub (Qdrant + hybrid search + RAGAS)",
    },
    color: "#ec4899",
    glow: "rgba(236,72,153,0.12)",
    border: "rgba(236,72,153,0.2)",
  },

  // ── PHASE 6 ─────────────────────────────────────────────────────────────
  {
    id: "phase6",
    num: "06",
    badge: "Layer 5 — Autonomous Systems",
    title: "Agents & Multi-Agent Systems",
    timeline: "// Weeks 6 · Target: Build reliable agentic workflows",
    tools: [
      "LangGraph",
      "smolagents",
      "CrewAI",
      "Mem0",
      "Redis",
      "Langfuse",
      "MCP",
      "tool calling",
    ],
    problem:
      "Single-turn LLM calls can't research, plan, execute multi-step tasks, or recover from mistakes — real work requires autonomous reasoning loops.\nThis phase teaches you to build agents that call tools, collaborate in multi-agent crews, persist memory across sessions, and operate under human-in-the-loop supervision.",
    conceptsIcon: "🤖",
    concepts: [
      {
        name: "Agent loops",
        why: "Observe → Think → Act → Observe cycle. Understanding when to stop looping (termination conditions) is what separates working agents from infinite loops.",
      },
      {
        name: "Tool / function calling",
        why: "The mechanism by which LLMs invoke external functions (web search, DB queries, code execution). Well-designed tool schemas are as important as the tools themselves.",
      },
      {
        name: "LangGraph",
        why: "Graph-based agent framework from LangChain. Nodes are actions, edges are transitions, state is shared. Enables cycles, conditionals, and human-in-the-loop — required for complex workflows.",
      },
      {
        name: "smolagents",
        why: "HuggingFace's minimalist agent library. Code-first — agents write and execute Python rather than calling pre-defined tools, enabling emergent capabilities.",
      },
      {
        name: "CrewAI",
        why: "Role-based multi-agent orchestration. Define agents with roles, goals, and tools — they collaborate on shared tasks. Useful for decomposing complex research or writing workflows.",
      },
      {
        name: "Memory systems",
        why: "In-context (conversation history), semantic (vector store), episodic (past events), procedural (tool knowledge). Mem0 abstracts memory management across sessions.",
      },
      {
        name: "Mem0",
        why: "Persistent memory layer for AI agents. Extracts facts from conversations, stores them, and surfaces relevant memories in future sessions — enabling truly personalized agents.",
      },
      {
        name: "Redis for agent state",
        why: "Fast key-value store for caching tool results, sharing state between agents, and persisting conversation context. Sub-millisecond reads are critical for real-time agent UX.",
      },
      {
        name: "Langfuse tracing",
        why: "Full observability for agentic systems: trace LLM calls, tool executions, latency, cost, and errors. Debugging agents without traces is like debugging without print statements.",
      },
      {
        name: "Human-in-the-loop",
        why: "Interrupt agent execution for human review before irreversible actions (sending emails, deleting data). LangGraph's interrupt mechanism is the standard implementation.",
      },
      {
        name: "Model Context Protocol",
        why: "Anthropic's open standard for connecting LLMs to external data sources and tools. Rapidly becoming the 'USB-C for AI' — server/client architecture for tool distribution.",
      },
      {
        name: "Parallelisation patterns",
        why: "Fan-out / fan-in, map-reduce, and subgraph patterns for multi-agent systems. Parallel tool calls reduce latency from minutes to seconds on complex research tasks.",
      },
      {
        name: "Reliability & guardrails",
        why: "Agents can loop, hallucinate tool calls, or take harmful actions. Max iterations, output validation, and sandboxed code execution are production necessities.",
      },
    ],
    questions: [
      "Build a ReAct agent from scratch using only the OpenAI SDK and Python — no frameworks. The agent must use web search and a calculator tool to answer multi-step questions.",
      "Implement a LangGraph workflow with at least one conditional edge (router), a loop, and a human-in-the-loop interrupt before a 'write file' node. Visualise the graph.",
      "Create a CrewAI crew of 3 agents (researcher, writer, editor) that collaborates to produce a 500-word technical blog post on a given topic. Evaluate output quality.",
      "Build an agent with persistent memory using Mem0: each conversation extracts key user facts; the next session opens with a personalised greeting using retrieved memories.",
      "Implement an MCP server that exposes two tools (database query, file read). Connect a Claude agent to it and demonstrate tool use across multiple turns.",
      "Add Langfuse tracing to a LangGraph agent: trace every LLM call and tool execution, log tokens/cost per trace, and build a simple cost dashboard from the data.",
      "Build a parallel research agent: given a topic, spawn 5 sub-agents concurrently to research different aspects, then merge results into a single report. Measure time vs sequential.",
      "Implement agent error recovery: if a tool fails, the agent should retry with modified parameters or fall back to an alternative tool — with maximum 3 retries per task.",
      "Build a code-execution agent using smolagents that writes Python, runs it in a sandboxed environment, observes the output, and iterates until a test suite passes.",
      "Design and implement an agentic customer support system: routes queries to specialised sub-agents (billing, technical, returns), escalates to human if confidence is low, logs all interactions.",
    ],
    projects: [
      {
        num: "PROJECT 01",
        name: "Autonomous Research & Report Agent",
        desc: "Multi-agent system: planner decomposes a research query → parallel researcher agents search the web and retrieve RAG documents → writer compiles a cited report → critic reviews. Full Langfuse tracing.",
        tags: ["LangGraph", "CrewAI", "Langfuse", "Qdrant"],
      },
      {
        num: "PROJECT 02",
        name: "Personal AI Assistant with Memory",
        desc: "Conversational assistant with Mem0 long-term memory, tool use (calendar, email, web), and LangGraph orchestration. Remembers preferences across sessions, handles multi-step tasks, built with a Gradio UI.",
        tags: ["Mem0", "LangGraph", "Redis", "MCP"],
      },
      {
        num: "PROJECT 03",
        name: "Agentic Software Engineering Assistant",
        desc: "smolagents-based coding agent: takes a GitHub issue → reads the codebase → writes a fix → runs tests → opens a PR. Human-in-the-loop before git push. Demonstrates agents operating real dev workflows.",
        tags: ["smolagents", "GitHub API", "Docker", "Langfuse"],
      },
    ],
    summary: {
      label: "// Phase 6 Workflow — Agents & Multi-Agent Systems in 10 Days",
      intro:
        "Phase 6 is the frontier — **autonomous AI systems** that observe, think, act, and iterate. You'll build agents that call tools, maintain memory across sessions, collaborate in multi-agent orchestrations, and operate under human-in-the-loop supervision.",
      steps: [
        {
          num: "01",
          text: "Build a **ReAct agent from scratch** using only the OpenAI SDK — observe → think → act → observe loop with web search and calculator tools. No frameworks. Understand the core pattern.",
        },
        {
          num: "02",
          text: "Master **LangGraph** — graph-based agent workflows with nodes (actions), edges (transitions), conditional routing, loops, and shared state. Implement human-in-the-loop interrupts.",
        },
        {
          num: "03",
          text: "Build a **CrewAI multi-agent crew** — researcher, writer, and editor agents collaborating on a shared task. Define roles, goals, and tool access for each agent.",
        },
        {
          num: "04",
          text: "Implement **persistent memory with Mem0** — extract facts from conversations, store them, and surface relevant memories in future sessions for personalised agent interactions.",
        },
        {
          num: "05",
          text: "Build an **MCP (Model Context Protocol) server** exposing database query and file read tools. Connect a Claude agent and demonstrate tool use across multiple turns.",
        },
        {
          num: "06",
          text: "Add **Langfuse tracing** to every agent — trace LLM calls, tool executions, latency, cost per trace. Build a cost dashboard. Debug agent failures with full trace replay.",
        },
        {
          num: "07",
          text: "Build **parallel research agents** — fan-out 5 sub-agents concurrently, each researching a different aspect, then fan-in and merge results. Measure wall-clock time vs sequential.",
        },
        {
          num: "08",
          text: "Implement **reliability guardrails** — max iterations, output validation, error recovery with modified parameters, fallback tools, sandboxed code execution.",
        },
        {
          num: "09",
          text: "Build the milestone: **Autonomous Research & Report Agent** — planner → parallel researchers → RAG retrieval → writer → critic → cited report. Full Langfuse tracing.",
        },
      ],
      resources: [
        {
          name: "LangGraph docs (langchain-ai.github.io)",
          desc: "state graphs, checkpoints, human-in-the-loop, tutorials",
        },
        {
          name: "CrewAI docs (crewai.com)",
          desc: "agents, tasks, crews, tools, process orchestration",
        },
        {
          name: "Mem0 docs (mem0.ai)",
          desc: "memory extraction, retrieval, cross-session persistence",
        },
        {
          name: "MCP Specification (modelcontextprotocol.io)",
          desc: "Anthropic's open standard for tool distribution",
        },
        {
          name: "smolagents docs (HuggingFace)",
          desc: "code-first agents that write and execute Python",
        },
        {
          name: "Langfuse docs",
          desc: "tracing, sessions, scoring, prompt management for agents",
        },
        {
          name: "Andrew Ng: Agentic AI Design Patterns",
          desc: "DeepLearning.AI course on agent architectures",
        },
        {
          name: "Lilian Weng: LLM Powered Agents (blog)",
          desc: "comprehensive survey of agent patterns and memory",
        },
      ],
      milestone:
        "📦 Phase 6 Milestone — Autonomous Research Agent on GitHub (LangGraph + CrewAI + Langfuse)",
    },
    color: "#f43f5e",
    glow: "rgba(244,63,94,0.12)",
    border: "rgba(244,63,94,0.2)",
  },

  // ── PHASE 7 ─────────────────────────────────────────────────────────────
  {
    id: "phase7",
    num: "07",
    badge: "Layer 6 — Production Mastery",
    title: "Safety, Evals & Production Ops",
    timeline:
      "// Week 7 · Target: Ship AI systems that stay healthy in production",
    tools: [
      "DeepEval",
      "Guardrails AI",
      "vLLM",
      "FastAPI",
      "Langfuse",
      "NeMo Guardrails",
      "Prometheus",
      "Grafana",
    ],
    problem:
      "A demo that works on your laptop is not a product — production AI fails silently, leaks PII, hallucinates without detection, and costs spiral without monitoring.\nThis phase teaches you to evaluate with DeepEval, guard with Guardrails AI, deploy with vLLM, monitor with Langfuse + Grafana, and run data-driven A/B tests on prompts.",
    conceptsIcon: "🛡️",
    concepts: [
      {
        name: "LLM evaluation frameworks",
        why: "DeepEval provides 14+ metrics (G-Eval, hallucination, toxicity, bias) with LLM-as-judge. Automated evals enable CI/CD for AI — run on every prompt change.",
      },
      {
        name: "DeepEval",
        why: "Python-native LLM testing framework with pytest integration. Write assert_test cases for your AI system and run them in CI — the unit testing paradigm for LLMs.",
      },
      {
        name: "Guardrails AI",
        why: "Defines guard rails (validators) that run on LLM input/output. Blocks PII leakage, toxic content, and off-topic responses at the infrastructure layer.",
      },
      {
        name: "NeMo Guardrails",
        why: "NVIDIA's conversation flow control for LLMs. Colang language defines what topics are allowed — appropriate for enterprise applications requiring strict policy compliance.",
      },
      {
        name: "vLLM",
        why: "High-throughput LLM inference server with PagedAttention (7–25× throughput vs HuggingFace). OpenAI-compatible API. The standard for self-hosted model deployment.",
      },
      {
        name: "Prompt injection defences",
        why: "Indirect prompt injection attacks on RAG systems are a real attack vector. Input sanitisation, system prompt hardening, and output validation are security fundamentals.",
      },
      {
        name: "Langfuse production ops",
        why: "Cost tracking, latency p50/p95/p99, user session analysis, and anomaly detection. Langfuse is your observability stack — know your cost per query and failure rate.",
      },
      {
        name: "A/B testing LLMs",
        why: "Shadow deployments, canary releases, and statistical significance testing for prompt/model changes. You need data to prove a new model is better, not just a feeling.",
      },
      {
        name: "Batching & caching",
        why: "Semantic caching (GPTCache, Qdrant): cache LLM responses for similar queries. 30–60% cost reduction on production workloads with repetitive queries.",
      },
      {
        name: "FastAPI production patterns",
        why: "Background tasks, lifespan events, dependency injection, middleware (auth, rate-limiting), and graceful shutdown. Running AI in production requires real web service engineering.",
      },
      {
        name: "Load testing AI endpoints",
        why: "Locust or k6 to find throughput limits before prod traffic does. LLM endpoints have very different performance characteristics from traditional APIs.",
      },
      {
        name: "Monitoring & alerting",
        why: "Prometheus metrics + Grafana dashboards for latency, error rate, token usage, and hallucination rate. Alerts when metrics breach SLAs — you need this on day one of production.",
      },
      {
        name: "Golden dataset evals",
        why: "Curate 100–200 representative test cases with expected outputs. Run on every deployment. This is the ground truth for whether your AI is regressing or improving.",
      },
    ],
    questions: [
      "Write a DeepEval test suite for a RAG pipeline: test hallucination, answer relevance, and context recall on 30 test cases. Integrate it into a GitHub Actions workflow that fails CI on score regression.",
      "Implement a Guardrails AI guard that detects and redacts PII (email, SSN, phone numbers) from both LLM inputs and outputs. Test it with 20 edge cases.",
      "Deploy a 7B model locally using vLLM with tensor parallelism across 2 GPUs. Benchmark throughput (requests/sec) vs a single-GPU deployment using a Locust load test.",
      "Build a semantic cache layer: embed incoming queries, check Qdrant for cosine similarity >0.92 with a cached response, return cached if match, else call LLM and cache. Measure cache hit rate.",
      "Implement prompt injection defences for a RAG system: design and test 10 adversarial inputs (jailbreaks, indirect injections), document which defences block them.",
      "Set up a Langfuse production dashboard: track cost/query, latency p95, error rate, and top 10 most expensive traces. Write an alert rule for when cost/query exceeds $0.05.",
      "Design and execute an A/B test: deploy two prompt variants to 50/50 traffic, collect 200 responses, score them with DeepEval, and calculate statistical significance of the difference.",
      "Add NeMo Guardrails to a customer service chatbot: define rails that prevent discussion of competitors, political topics, and refund policy override attempts. Demonstrate with 10 test conversations.",
      "Implement a golden dataset evaluation harness: 100 test cases, run against 3 model/prompt configurations, produce a ranked leaderboard with confidence intervals.",
      "Build a full production-grade FastAPI AI service: auth middleware (API key), rate limiting (slowapi), background task for async generation, Prometheus metrics endpoint, structured logging, and Docker deployment with health checks.",
    ],
    projects: [
      {
        num: "PROJECT 01",
        name: "Production AI Platform with Full Observability",
        desc: "Deploy a complete AI service: FastAPI + vLLM or cloud LLM, Guardrails AI for safety, semantic cache, Langfuse tracing, Prometheus/Grafana dashboard, DeepEval CI tests, and automated cost alerts. The capstone.",
        tags: ["FastAPI", "vLLM", "Langfuse", "DeepEval"],
      },
      {
        num: "PROJECT 02",
        name: "Automated LLM Regression Testing System",
        desc: "CI/CD system for prompt engineering: golden dataset of 200 test cases, DeepEval scoring pipeline, automatic PR comment with metric deltas, and a historical performance dashboard showing score trends over time.",
        tags: ["DeepEval", "GitHub Actions", "Langfuse", "pandas"],
      },
      {
        num: "PROJECT 03",
        name: "Safe, Compliant Enterprise Chatbot",
        desc: "RAG chatbot with NeMo + Guardrails AI safety layers, topic restrictions, PII redaction, audit logging of every exchange, RBAC for multi-department knowledge bases, and a compliance report generator.",
        tags: ["NeMo", "Guardrails AI", "Qdrant", "FastAPI"],
      },
    ],
    summary: {
      label: "// Phase 7 Workflow — Safety, Evals & Production Ops in 7 Days",
      intro:
        "Phase 7 is the capstone — the difference between a demo and a **production AI system that stays healthy**. You'll build evaluation pipelines that run in CI/CD, guardrails that block unsafe outputs, monitoring dashboards that catch regressions before users do, and deployment infrastructure that handles real traffic.",
      steps: [
        {
          num: "01",
          text: "Build a **DeepEval test suite** for your RAG pipeline — test hallucination, answer relevance, and context recall on 30+ test cases. Integrate into GitHub Actions so CI fails on score regression.",
        },
        {
          num: "02",
          text: "Implement **Guardrails AI** validators — detect and redact PII (email, SSN, phone) from LLM inputs and outputs. Add NeMo Guardrails for topic restrictions and policy compliance.",
        },
        {
          num: "03",
          text: "Deploy a model locally with **vLLM** (PagedAttention, 7–25× throughput). Benchmark requests/sec with Locust. Understand when to self-host vs use cloud APIs.",
        },
        {
          num: "04",
          text: "Build a **semantic cache layer** — embed queries, check Qdrant for cosine similarity >0.92 with cached responses. Measure 30–60% cost reduction on repetitive workloads.",
        },
        {
          num: "05",
          text: "Implement **prompt injection defences** — design 10 adversarial inputs (jailbreaks, indirect injections), build and test input sanitisation, system prompt hardening, and output validation.",
        },
        {
          num: "06",
          text: "Set up **Langfuse production monitoring** — cost/query, latency p50/p95/p99, error rate. Build Prometheus metrics + Grafana dashboards. Configure alerts for SLA breaches.",
        },
        {
          num: "07",
          text: "Design and execute an **A/B test** — two prompt variants on 50/50 traffic, 200+ responses scored with DeepEval, statistical significance calculated. Data-driven prompt decisions.",
        },
        {
          num: "08",
          text: "Curate a **golden dataset** (100–200 test cases with expected outputs). Run against every deployment. This is your ground truth for regression detection.",
        },
        {
          num: "09",
          text: "Build the capstone: **Production AI Platform** — FastAPI + vLLM/cloud LLM + Guardrails AI + semantic cache + Langfuse tracing + Prometheus/Grafana + DeepEval CI + cost alerts.",
        },
      ],
      resources: [
        {
          name: "DeepEval docs (deepeval.com)",
          desc: "LLM testing framework, metrics, pytest integration, CI/CD",
        },
        {
          name: "Guardrails AI docs",
          desc: "validators, guards, PII detection, output validation",
        },
        {
          name: "NeMo Guardrails docs (NVIDIA)",
          desc: "Colang, topical rails, conversation flow control",
        },
        {
          name: "vLLM docs",
          desc: "PagedAttention, OpenAI-compatible serving, tensor parallelism",
        },
        {
          name: "Langfuse docs",
          desc: "production dashboards, cost tracking, session analysis, alerting",
        },
        {
          name: "Prometheus + Grafana docs",
          desc: "metrics collection, dashboards, alerting rules",
        },
        {
          name: "Hamel Husain: Your AI Product Needs Evals (blog)",
          desc: "practical guide to building eval systems",
        },
        {
          name: "OWASP Top 10 for LLMs",
          desc: "security risks, prompt injection, data poisoning, model theft",
        },
      ],
      milestone:
        "📦 Phase 7 Capstone — Production AI Platform with Full Observability on GitHub",
    },
    color: "#00d4aa",
    glow: "rgba(0,212,170,0.12)",
    border: "rgba(0,212,170,0.2)",
  },
];

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

/** Render text with **bold** markers as <strong> spans */
function RichText({ text, color }: { text: string; color: string }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <strong
            key={i}
            className="font-medium"
            style={{ color: "var(--ai-text)" }}
          >
            {p}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function AIRoadmapPage() {
  const [activePhase, setActivePhase] = useState("phase1");
  const [scrollPct, setScrollPct] = useState(0);
  const [navOpen, setNavOpen] = useState(false);

  // The root layout sets h-full + overflow-hidden on <body> for the task manager.
  // We must clear both height AND overflow so scroll happens at the window level
  // (window.scrollY works) instead of on the body element (where window.scrollY = 0).
  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyHeight = document.body.style.height;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevHtmlHeight = document.documentElement.style.height;

    document.body.style.overflow = "visible";
    document.body.style.height = "auto";
    document.documentElement.style.overflow = "visible";
    document.documentElement.style.height = "auto";

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.height = prevBodyHeight;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.documentElement.style.height = prevHtmlHeight;
    };
  }, []);

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(docH > 0 ? Math.round((scrollTop / docH) * 100) : 0);
      let active = "phase1";
      PHASES.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) active = id;
      });
      setActivePhase(active);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
      .ai-roadmap {
        --ai-page-bg: #f8fafc;
        --ai-card-bg: #ffffff;
        --ai-card-inner: #f1f5f9;
        --ai-section-bg: #f3f4f6;
        --ai-text: #0f172a;
        --ai-text-sec: #475569;
        --ai-text-muted: #94a3b8;
        --ai-divider: rgba(0,0,0,0.08);
        --ai-grid: rgba(0,150,120,0.04);
        --ai-overlay: rgba(0,0,0,0.3);
      }
      :is(.dark) .ai-roadmap {
        --ai-page-bg: #080b10;
        --ai-card-bg: #0d1117;
        --ai-card-inner: #131920;
        --ai-section-bg: #161d27;
        --ai-text: #e8edf3;
        --ai-text-sec: #8b98a8;
        --ai-text-muted: #4a5568;
        --ai-divider: var(--ai-divider);
        --ai-grid: var(--ai-grid);
        --ai-overlay: var(--ai-overlay);
      }
    `}</style>
      <div
        className="ai-roadmap min-h-screen"
        style={{
          background: "var(--ai-page-bg)",
          color: "var(--ai-text)",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
          lineHeight: 1.7,
          overflow: "clip",
        }}
      >
        {/* Grid background */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage:
              "linear-gradient(var(--ai-grid) 1px, transparent 1px), linear-gradient(90deg, var(--ai-grid) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Mobile nav toggle */}
        {!navOpen && (
          <button
            onClick={() => setNavOpen(true)}
            className="fixed bottom-6 right-6 z-[100] lg:hidden w-11 h-11 rounded-full flex items-center justify-center text-lg shadow-xl"
            style={{
              background: "var(--ai-card-inner)",
              border: "1px solid var(--ai-divider)",
              color: "var(--ai-text-sec)",
            }}
            aria-label="Open navigation"
          >
            ☰
          </button>
        )}
        {navOpen && (
          <div
            className="fixed inset-0 z-[98] lg:hidden"
            style={{ background: "var(--ai-overlay)" }}
            onClick={() => setNavOpen(false)}
          />
        )}

        <div className="flex items-start max-w-[1280px] mx-auto relative z-[1]">
          {/* ── SIDE NAV ── */}
          <nav
            className={`fixed lg:sticky top-0 lg:top-6 z-[99] lg:z-auto shrink-0 overflow-y-auto max-h-screen lg:max-h-[calc(100vh-48px)] w-[220px] lg:w-[220px] px-4 py-5 transition-transform duration-200 ${navOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            style={{
              background: navOpen ? "var(--ai-card-bg)" : "transparent",
              borderRight: navOpen ? "1px solid var(--ai-divider)" : "none",
              scrollbarWidth: "none",
            }}
          >
            <div
              className="mb-4 pb-2.5 text-[9px] tracking-[0.2em] uppercase font-mono"
              style={{
                color: "var(--ai-text-muted)",
                borderBottom: "1px solid var(--ai-divider)",
              }}
            >
              // Phases
            </div>
            <ul className="list-none space-y-0.5">
              {PHASES.map((phase) => {
                const isActive = activePhase === phase.id;
                return (
                  <li key={phase.id}>
                    <a
                      href={`#${phase.id}`}
                      onClick={() => setNavOpen(false)}
                      className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs transition-all duration-200 no-underline"
                      style={{
                        color: isActive
                          ? "var(--ai-text)"
                          : "var(--ai-text-muted)",
                        background: isActive
                          ? "var(--ai-card-inner)"
                          : "transparent",
                        border: isActive
                          ? "1px solid var(--ai-divider)"
                          : "1px solid transparent",
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0 transition-all"
                        style={{
                          background: phase.color,
                          opacity: isActive ? 1 : 0.4,
                          transform: isActive ? "scale(1.3)" : "scale(1)",
                        }}
                      />
                      <span className="flex-1 leading-tight">
                        {phase.title
                          .replace(
                            "Python Engineering Foundations",
                            "Python Engineering",
                          )
                          .replace(
                            "Python · Data Science · ML & Deep Learning",
                            "Data Science & ML",
                          )
                          .replace(
                            "Embeddings, Vectors & Transformers",
                            "Embeddings & Vectors",
                          )
                          .replace(
                            "LLM APIs, Prompting & Fine-Tuning",
                            "LLM APIs & Fine-Tuning",
                          )
                          .replace(
                            "RAG Engineering (Full Stack)",
                            "RAG Engineering",
                          )
                          .replace(
                            "Agents & Multi-Agent Systems",
                            "Agents & Multi-Agent",
                          )
                          .replace(
                            "Safety, Evals & Production Ops",
                            "Safety & Prod Ops",
                          )
                          .split("·")[0]
                          .trim()}
                      </span>
                      <span
                        className="font-mono text-[9px] shrink-0"
                        style={{
                          color: isActive
                            ? "var(--ai-text-sec)"
                            : "var(--ai-text-muted)",
                        }}
                      >
                        {phase.num}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
            {/* Progress */}
            <div
              className="mt-4 pt-3.5"
              style={{ borderTop: "1px solid var(--ai-divider)" }}
            >
              <div
                className="font-mono text-[9px] tracking-[0.15em] uppercase mb-2"
                style={{ color: "var(--ai-text-muted)" }}
              >
                // Scroll progress
              </div>
              <div
                className="h-[3px] rounded-sm overflow-hidden"
                style={{ background: "var(--ai-card-inner)" }}
              >
                <div
                  className="h-full rounded-sm transition-all"
                  style={{
                    width: `${scrollPct}%`,
                    background: "linear-gradient(90deg, #00d4aa, #3b82f6)",
                  }}
                />
              </div>
              <div
                className="font-mono text-[10px] mt-1.5 text-right"
                style={{ color: "#00d4aa" }}
              >
                {scrollPct}%
              </div>
            </div>
          </nav>

          {/* ── MAIN CONTENT ── */}
          <main className="flex-1 min-w-0 px-4 lg:px-4">
            <div className="max-w-[960px] mx-auto px-6">
              {/* ── HERO ── */}
              <header className="pt-20 pb-16 relative overflow-hidden">
                <div
                  className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(0,212,170,0.08) 0%, transparent 70%)",
                  }}
                />
                <p
                  className="font-mono text-[11px] font-normal tracking-[0.2em] uppercase mb-5 flex items-center gap-2.5"
                  style={{ color: "#00d4aa" }}
                >
                  <span
                    className="inline-block w-6 h-px"
                    style={{ background: "#00d4aa" }}
                  />
                  {SITE.heroLabel}
                </p>
                <h1
                  className="text-4xl lg:text-5xl font-extrabold leading-[1.15] tracking-tight mb-6"
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    color: "var(--ai-text)",
                  }}
                >
                  {SITE.heroTitle}
                  <br />
                  <span
                    style={{
                      background:
                        "linear-gradient(135deg, #00d4aa 0%, #3b82f6 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {SITE.heroGradient}
                  </span>
                </h1>
                <p
                  className="text-base max-w-[640px] leading-[1.8] mb-10 pl-5"
                  style={{
                    color: "var(--ai-text-sec)",
                    borderLeft: "2px solid #00d4aa",
                  }}
                >
                  {SITE.heroIntro}
                </p>
                {/* Stack bar */}
                <div className="flex gap-0.5 rounded-lg overflow-hidden mb-16">
                  {PHASES.map((p) => (
                    <div
                      key={p.id}
                      className="flex-1 py-2.5 px-1 text-center font-mono text-[9px] font-medium tracking-[0.05em] uppercase cursor-default transition-all duration-300 hover:flex-[2]"
                      style={{
                        background: p.glow,
                        color: p.color,
                        borderTop: `2px solid ${p.color}`,
                      }}
                    >
                      P{p.num.replace("0", "")}
                      <br />
                      {p.title.split(" ")[0]}
                    </div>
                  ))}
                </div>
              </header>

              {/* ── TOC ── */}
              <nav
                className="rounded-xl p-6 mb-16"
                style={{
                  background: "var(--ai-card-bg)",
                  border: "1px solid var(--ai-divider)",
                }}
              >
                <div
                  className="font-mono text-[10px] tracking-[0.18em] uppercase mb-4"
                  style={{ color: "var(--ai-text-muted)" }}
                >
                  // Quick Navigation
                </div>
                <div
                  className="grid gap-2"
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
                  }}
                >
                  {PHASES.map((phase) => (
                    <a
                      key={phase.id}
                      href={`#${phase.id}`}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] no-underline transition-all duration-200 hover:border-white/10"
                      style={{
                        color: "var(--ai-text-sec)",
                        border: "1px solid transparent",
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLAnchorElement
                        ).style.background = "var(--ai-card-inner)";
                        (e.currentTarget as HTMLAnchorElement).style.color =
                          "var(--ai-text)";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLAnchorElement
                        ).style.background = "transparent";
                        (e.currentTarget as HTMLAnchorElement).style.color =
                          "var(--ai-text-sec)";
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: phase.color }}
                      />
                      Phase {phase.num} — {phase.title}
                    </a>
                  ))}
                </div>
              </nav>

              {/* ── PHASES ── */}
              {PHASES.map((phase, pIdx) => (
                <div key={phase.id}>
                  <section id={phase.id} className="mb-20">
                    {/* Phase header */}
                    <div
                      className="flex items-start gap-5 mb-8 pb-6"
                      style={{ borderBottom: "1px solid var(--ai-divider)" }}
                    >
                      <div
                        className="font-extrabold leading-none text-right shrink-0 w-[72px]"
                        style={{
                          fontFamily: "'Syne', sans-serif",
                          fontSize: 64,
                          opacity: 0.12,
                          color: phase.color,
                        }}
                      >
                        {phase.num}
                      </div>
                      <div className="flex-1">
                        <div
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded mb-2 font-mono text-[10px] font-medium tracking-[0.12em] uppercase"
                          style={{
                            background: phase.glow,
                            color: phase.color,
                            border: `1px solid ${phase.border}`,
                          }}
                        >
                          {phase.badge}
                        </div>
                        <h2
                          className="text-2xl lg:text-[28px] font-bold tracking-tight mb-1.5"
                          style={{
                            fontFamily: "'Syne', sans-serif",
                            color: "var(--ai-text)",
                          }}
                        >
                          {phase.title}
                        </h2>
                        <div
                          className="font-mono text-[11px] tracking-[0.08em]"
                          style={{ color: "var(--ai-text)" }}
                        >
                          {phase.timeline}
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {phase.tools.map((t) => (
                            <span
                              key={t}
                              className="font-mono text-[10px] px-2 py-0.5 rounded"
                              style={{
                                background: "var(--ai-card-inner)",
                                border: "1px solid var(--ai-divider)",
                                color: "var(--ai-text)",
                              }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Problem statement */}
                    <div
                      className="mb-5 pl-5 text-[13px] leading-[1.75] italic"
                      style={{
                        borderLeft: `2px solid ${phase.color}`,
                        color: "var(--ai-text-sec)",
                      }}
                    >
                      {phase.problem.split("\n").map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>

                    {/* Section A — Concepts */}
                    <div
                      className="rounded-xl overflow-hidden mb-4"
                      style={{
                        background: "var(--ai-section-bg)",
                        border: "1px solid var(--ai-divider)",
                      }}
                    >
                      <div
                        className="flex items-center gap-3.5 px-6 py-4"
                        style={{
                          background: "var(--ai-card-inner)",
                          borderBottom: "1px solid var(--ai-divider)",
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[15px] shrink-0"
                          style={{ background: phase.glow }}
                        >
                          {phase.conceptsIcon}
                        </div>
                        <div>
                          <span
                            className="block font-mono text-[10px] tracking-[0.15em] uppercase mb-0.5"
                            style={{ color: "var(--ai-text-muted)" }}
                          >
                            Section A
                          </span>
                          <span
                            className="font-semibold text-[15px]"
                            style={{
                              fontFamily: "'Syne', sans-serif",
                              color: "var(--ai-text)",
                            }}
                          >
                            Core Concepts — The &quot;What&quot;
                          </span>
                        </div>
                      </div>
                      <div className="px-6 py-5">
                        <ul className="list-none">
                          {phase.concepts.map((c, i) => (
                            <li
                              key={i}
                              className="flex gap-3.5 py-2.5 text-sm"
                              style={{
                                borderBottom:
                                  i < phase.concepts.length - 1
                                    ? "1px solid var(--ai-divider)"
                                    : "none",
                              }}
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                                style={{ background: phase.color }}
                              />
                              <span
                                className="font-mono text-[12px] font-medium min-w-[140px] shrink-0"
                                style={{ color: "var(--ai-text)" }}
                              >
                                {c.name}
                              </span>
                              <span
                                className="leading-[1.6]"
                                style={{ color: "var(--ai-text-sec)" }}
                              >
                                {c.why}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Section B — Questions */}
                    <div
                      className="rounded-xl overflow-hidden mb-4"
                      style={{
                        background: "var(--ai-section-bg)",
                        border: "1px solid var(--ai-divider)",
                      }}
                    >
                      <div
                        className="flex items-center gap-3.5 px-6 py-4"
                        style={{
                          background: "var(--ai-card-inner)",
                          borderBottom: "1px solid var(--ai-divider)",
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[15px] shrink-0"
                          style={{ background: phase.glow }}
                        >
                          💻
                        </div>
                        <div>
                          <span
                            className="block font-mono text-[10px] tracking-[0.15em] uppercase mb-0.5"
                            style={{ color: "var(--ai-text-muted)" }}
                          >
                            Section B
                          </span>
                          <span
                            className="font-semibold text-[15px]"
                            style={{
                              fontFamily: "'Syne', sans-serif",
                              color: "var(--ai-text)",
                            }}
                          >
                            Practical Proficiency — {phase.questions.length} Key
                            Problems
                          </span>
                        </div>
                      </div>
                      <div className="px-6 py-5">
                        <ol className="list-none" style={{ counterReset: "q" }}>
                          {phase.questions.map((q, i) => (
                            <li
                              key={i}
                              className="flex gap-3.5 py-2.5 text-sm leading-[1.6]"
                              style={{
                                counterIncrement: "q",
                                borderBottom:
                                  i < phase.questions.length - 1
                                    ? "1px solid var(--ai-divider)"
                                    : "none",
                                color: "var(--ai-text-sec)",
                              }}
                            >
                              <span
                                className="font-mono text-[10px] font-medium shrink-0 mt-0.5 min-w-6"
                                style={{ color: "var(--ai-text-muted)" }}
                              >
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <span>{q}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    {/* Section C — Projects */}
                    <div
                      className="rounded-xl overflow-hidden mb-4"
                      style={{
                        background: "var(--ai-section-bg)",
                        border: "1px solid var(--ai-divider)",
                      }}
                    >
                      <div
                        className="flex items-center gap-3.5 px-6 py-4"
                        style={{
                          background: "var(--ai-card-inner)",
                          borderBottom: "1px solid var(--ai-divider)",
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[15px] shrink-0"
                          style={{ background: phase.glow }}
                        >
                          🏗️
                        </div>
                        <div>
                          <span
                            className="block font-mono text-[10px] tracking-[0.15em] uppercase mb-0.5"
                            style={{ color: "var(--ai-text-muted)" }}
                          >
                            Section C
                          </span>
                          <span
                            className="font-semibold text-[15px]"
                            style={{
                              fontFamily: "'Syne', sans-serif",
                              color: "var(--ai-text)",
                            }}
                          >
                            Portfolio-Ready Projects — Prove It
                          </span>
                        </div>
                      </div>
                      <div className="px-6 py-5">
                        <div
                          className="grid gap-3"
                          style={{
                            gridTemplateColumns:
                              "repeat(auto-fill, minmax(240px, 1fr))",
                          }}
                        >
                          {phase.projects.map((proj) => (
                            <div
                              key={proj.num}
                              className="rounded-[10px] p-[18px] relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
                              style={{
                                background: "var(--ai-card-inner)",
                                border: "1px solid var(--ai-divider)",
                              }}
                              onMouseEnter={(e) => {
                                (
                                  e.currentTarget as HTMLDivElement
                                ).style.borderColor = phase.border;
                              }}
                              onMouseLeave={(e) => {
                                (
                                  e.currentTarget as HTMLDivElement
                                ).style.borderColor = "var(--ai-divider)";
                              }}
                            >
                              <div
                                className="absolute top-0 left-0 right-0 h-0.5"
                                style={{ background: phase.color }}
                              />
                              <div
                                className="font-mono text-[10px] mb-2.5 tracking-[0.1em]"
                                style={{ color: "var(--ai-text-muted)" }}
                              >
                                {proj.num}
                              </div>
                              <div
                                className="text-[14px] font-bold mb-2 leading-tight"
                                style={{
                                  fontFamily: "'Syne', sans-serif",
                                  color: "var(--ai-text)",
                                }}
                              >
                                {proj.name}
                              </div>
                              <p
                                className="text-[12.5px] leading-[1.6] mb-2.5"
                                style={{ color: "var(--ai-text-sec)" }}
                              >
                                {proj.desc}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {proj.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="font-mono text-[9px] px-1.5 py-0.5 rounded tracking-[0.04em]"
                                    style={{
                                      background: phase.glow,
                                      color: phase.color,
                                    }}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Phase summary */}
                    <div
                      className="rounded-xl p-6 relative overflow-hidden"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--ai-card-inner) 0%, var(--ai-section-bg) 100%)",
                        border: "1px solid var(--ai-divider)",
                      }}
                    >
                      <div
                        className="absolute top-0 left-0 right-0 h-0.5"
                        style={{ background: phase.color }}
                      />
                      <div
                        className="font-mono text-[10px] tracking-[0.18em] uppercase mb-3.5 flex items-center gap-2"
                        style={{ color: phase.color }}
                      >
                        <span
                          className="inline-block w-4 h-0.5"
                          style={{ background: phase.color }}
                        />
                        {phase.summary.label}
                      </div>
                      <p
                        className="text-sm leading-[1.85] mb-3.5"
                        style={{ color: "var(--ai-text-sec)" }}
                      >
                        <RichText
                          text={phase.summary.intro}
                          color={phase.color}
                        />
                      </p>
                      <ul className="list-none mt-3 mb-4">
                        {phase.summary.steps.map((step) => (
                          <li
                            key={step.num}
                            className="flex gap-3 py-1.5 text-[13px] leading-[1.6]"
                            style={{
                              color: "var(--ai-text-sec)",
                              borderBottom: "1px solid var(--ai-divider)",
                            }}
                          >
                            <span
                              className="font-mono text-[10px] font-semibold shrink-0 mt-0.5 min-w-[22px]"
                              style={{ color: phase.color }}
                            >
                              {step.num}
                            </span>
                            <span>
                              <RichText text={step.text} color={phase.color} />
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div
                        className="font-mono text-[10px] tracking-[0.15em] uppercase mt-4 mb-2"
                        style={{ color: phase.color }}
                      >
                        // Learning Resources
                      </div>
                      <ul
                        className="list-none grid gap-1.5"
                        style={{
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(260px, 1fr))",
                        }}
                      >
                        {phase.summary.resources.map((r) => (
                          <li
                            key={r.name}
                            className="text-[12px] px-2.5 py-1.5 rounded-md leading-[1.5]"
                            style={{
                              color: "var(--ai-text-sec)",
                              background: "var(--ai-card-inner)",
                              border: "1px solid var(--ai-divider)",
                            }}
                          >
                            <span
                              className="font-mono text-[11px] font-medium"
                              style={{ color: phase.color }}
                            >
                              {r.name}
                            </span>
                            {" — "}
                            {r.desc}
                          </li>
                        ))}
                      </ul>
                      <span
                        className="inline-flex items-center gap-1.5 mt-4 px-3.5 py-1.5 rounded-md font-mono text-[11px] font-medium tracking-[0.06em]"
                        style={{
                          background: phase.glow,
                          color: phase.color,
                          border: `1px solid ${phase.border}`,
                        }}
                      >
                        {phase.summary.milestone}
                      </span>
                    </div>
                  </section>

                  {/* Divider */}
                  {pIdx < PHASES.length - 1 && (
                    <div
                      className="flex items-center gap-4 my-16 font-mono text-[10px] tracking-[0.15em]"
                      style={{ color: "var(--ai-text-muted)" }}
                    >
                      <span
                        className="flex-1 h-px"
                        style={{ background: "var(--ai-divider)" }}
                      />
                      // PHASE {PHASES[pIdx + 1].num}
                      <span
                        className="flex-1 h-px"
                        style={{ background: "var(--ai-divider)" }}
                      />
                    </div>
                  )}
                </div>
              ))}

              {/* ── FOOTER ── */}
              <footer
                className="py-10 mt-16 text-center"
                style={{ borderTop: "1px solid var(--ai-divider)" }}
              >
                <p
                  className="font-mono text-[11px] tracking-[0.1em]"
                  style={{ color: "var(--ai-text-muted)" }}
                >
                  {SITE.footer}
                </p>
              </footer>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
