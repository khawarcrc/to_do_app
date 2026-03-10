"use client";

import { useEffect, useState } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// DATA — SINGLE SOURCE OF TRUTH
// ═══════════════════════════════════════════════════════════════════════════

interface QA {
  id: string;
  category: string;
  question: string;
  answer: string;
  code?: string;
  codeLanguage?: string;
}

interface Scenario {
  id: string;
  title: string;
  problem: string;
  steps: string[];
  code?: string;
  codeLanguage?: string;
}

interface Section {
  id: string;
  label: string;
  icon: string;
  color: string;
  glow: string;
  border: string;
}

const SECTIONS: Section[] = [
  {
    id: "fundamentals",
    label: "Docker Fundamentals",
    icon: "🐳",
    color: "#38bdf8",
    glow: "rgba(56,189,248,0.10)",
    border: "rgba(56,189,248,0.22)",
  },
  {
    id: "images",
    label: "Images & Dockerfiles",
    icon: "📦",
    color: "#818cf8",
    glow: "rgba(129,140,248,0.10)",
    border: "rgba(129,140,248,0.22)",
  },
  {
    id: "lifecycle",
    label: "Container Lifecycle",
    icon: "🔄",
    color: "#34d399",
    glow: "rgba(52,211,153,0.10)",
    border: "rgba(52,211,153,0.22)",
  },
  {
    id: "data",
    label: "Data & Storage",
    icon: "💾",
    color: "#fbbf24",
    glow: "rgba(251,191,36,0.10)",
    border: "rgba(251,191,36,0.22)",
  },
  {
    id: "networking",
    label: "Networking",
    icon: "🌐",
    color: "#f472b6",
    glow: "rgba(244,114,182,0.10)",
    border: "rgba(244,114,182,0.22)",
  },
  {
    id: "compose",
    label: "Docker Compose",
    icon: "🎼",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.10)",
    border: "rgba(167,139,250,0.22)",
  },
  {
    id: "security",
    label: "Security",
    icon: "🛡️",
    color: "#fb923c",
    glow: "rgba(251,146,60,0.10)",
    border: "rgba(251,146,60,0.22)",
  },
  {
    id: "performance",
    label: "Performance & Troubleshooting",
    icon: "📊",
    color: "#2dd4bf",
    glow: "rgba(45,212,191,0.10)",
    border: "rgba(45,212,191,0.22)",
  },
  {
    id: "swarm",
    label: "Swarm & Orchestration",
    icon: "🚢",
    color: "#e879f9",
    glow: "rgba(232,121,249,0.10)",
    border: "rgba(232,121,249,0.22)",
  },
  {
    id: "production",
    label: "Production & Advanced",
    icon: "🚀",
    color: "#4ade80",
    glow: "rgba(74,222,128,0.10)",
    border: "rgba(74,222,128,0.22)",
  },
  {
    id: "scenarios",
    label: "Practical Scenarios",
    icon: "🔧",
    color: "#f87171",
    glow: "rgba(248,113,113,0.10)",
    border: "rgba(248,113,113,0.22)",
  },
];

const QA_DATA: QA[] = [
  // ── FUNDAMENTALS (1–5) ────────────────────────────────────────────────
  {
    id: "q1",
    category: "fundamentals",
    question:
      "What is Docker, and how does it differ architecturally from a traditional Virtual Machine?",
    answer:
      "Docker is an open-source platform that packages an application and its dependencies into a portable, isolated unit called a container. Unlike VMs, containers share the host OS kernel rather than each running a full guest OS, making them start in milliseconds and consume far less memory and disk. A VM requires a full hypervisor (Type-1 like VMware ESXi or Type-2 like VirtualBox) and a complete OS image per VM—typically 1–4 GB minimum. A Docker container image might be 50–200 MB because it contains only the application binaries and their library dependencies stacked as layers. This architectural difference means you can run dozens of containers on hardware that would support only a handful of VMs. The trade-off is weaker isolation: a kernel-level vulnerability can theoretically escape a container, whereas VMs benefit from hypervisor-enforced hardware isolation.",
  },
  {
    id: "q2",
    category: "fundamentals",
    question:
      "Describe the Docker architecture: what are the client, daemon, containerd, and runc? How do they interact?",
    answer:
      "The Docker CLI (client) is the tool you interact with; it sends REST API calls to the Docker Daemon (dockerd) over a Unix socket (/var/run/docker.sock) or TCP. The daemon orchestrates high-level operations—building images, managing networks, volumes, and image distribution. Below the daemon lives containerd, a Cloud Native (CNCF-graduated) container runtime that manages the full container lifecycle: image pull, storage, execution, and supervision. It replaced the monolithic daemon's runtime responsibilities starting with Docker 1.11. Finally, runc is the OCI-compliant low-level runtime that actually calls Linux kernel primitives (namespaces, cgroups) to spawn and run the container process. The flow is: docker run → dockerd → containerd → runc → kernel. This layered, pluggable architecture allows Kubernetes to replace dockerd with containerd directly without touching runc.",
    code: `# Inspect the daemon and runtime
docker info | grep -E 'Runtimes|Containerd|dockerd'
# Direct containerd CLI (bypasses Docker daemon)
ctr images ls
# Inspect running containers via containerd
crictl ps`,
    codeLanguage: "bash",
  },
  {
    id: "q3",
    category: "fundamentals",
    question:
      "How does Docker's overlay filesystem (UnionFS) work, and what is the copy-on-write (CoW) strategy?",
    answer:
      "Docker images are built as a stack of read-only layers using a Union Filesystem (the default on modern Linux is OverlayFS). Each Dockerfile instruction (RUN, COPY, ADD) that modifies the filesystem creates a new immutable layer; layers from a common base image are shared across all containers using that base, saving enormous disk space. When a container starts, Docker adds a thin, writable 'container layer' on top of the read-only image layers. Copy-on-write means that when a process inside the container reads a file, it reads directly from the layer it lives in—no copy occurs. Only when the process writes to an existing file is that file first copied up from its underlying layer into the writable container layer, and then modified. This makes container startup nearly instant and means 50 containers sharing the same nginx image consume far less disk than 50 separate copies. The container layer is ephemeral: it is lost when the container is removed unless you use volumes.",
  },
  {
    id: "q4",
    category: "fundamentals",
    question:
      "What is a Docker Registry, and what is the difference between Docker Hub, a private registry, and a pull-through cache?",
    answer:
      "A Docker Registry is an HTTP server that stores and distributes Docker images using the OCI Distribution Specification. Docker Hub (hub.docker.com) is the default public registry—when you run `docker pull nginx`, Docker contacts Docker Hub's index to resolve the tag and downloads the image manifests and layer blobs. A private registry (hosted with `registry:2`, Harbor, AWS ECR, Google Artifact Registry, or GitLab Container Registry) lets teams store proprietary images behind authentication and network access controls, ensuring images never leave your infrastructure. A pull-through cache (configured via `--registry-mirror`) sits between your hosts and Docker Hub: the first pull fetches from Hub and caches locally; subsequent pulls are served from the cache, reducing egress costs and protecting against Docker Hub rate limits (currently 100 pulls/6h for anonymous users and 200/6h for free authenticated users). Organizations with many hosts commonly deploy a pull-through cache to avoid that limit in CI/CD pipelines.",
  },
  {
    id: "q5",
    category: "fundamentals",
    question:
      "Explain Linux namespaces and cgroups. How do they enable container isolation?",
    answer:
      "Linux namespaces provide process-level isolation by giving each container its own virtualized view of system resources. Docker uses six namespaces: PID (process IDs—PID 1 in a container is not the host init), NET (network interfaces, routing tables, ports), MNT (mount points—the container sees its own filesystem tree), UTS (hostname and domain name), IPC (inter-process communication), and User (UID/GID mapping—rootless Docker maps container root to an unprivileged host UID). Control Groups (cgroups) enforce resource accounting and limits: CPU shares, CPU pinning, memory limits, memory+swap, block I/O weight, and network bandwidth. Without a memory cgroup limit, a runaway container process can exhaust host memory and trigger the OOM killer on unrelated processes. In production, every container should have `--memory`, `--cpus`, and `--pids-limit` set. Together, namespaces isolate *what* a container sees, while cgroups limit *how much* resource it can consume.",
  },

  // ── IMAGES & DOCKERFILES (6–12) ───────────────────────────────────────
  {
    id: "q6",
    category: "images",
    question:
      "How does Dockerfile layer caching work, and what build patterns maximize cache reuse?",
    answer:
      "Docker evaluates each instruction against a cache key derived from the instruction and the contents of any files it references. If the cache key matches a previous build, Docker reuses the cached layer and skips execution—this is a cache hit. If any layer is invalidated (e.g., a file has changed), all subsequent layers must be rebuilt because each layer depends on the one before it. The golden rule is: order instructions from least-to-most frequently changing. Copy dependency manifests first (package.json, requirements.txt, go.mod), run the install step to produce a cached dependency layer, then copy source code. This way, changing one source file only invalidates layers after the COPY step, not the expensive npm install or pip install. Avoid COPY . . early in the Dockerfile—it invalidates on every change. Use .dockerignore to exclude files (node_modules, .git, *.md) from build context, which reduces both transfer time and spurious cache misses.",
    code: `# ✅ Cache-optimized Dockerfile
FROM node:20-alpine
WORKDIR /app
# Copy manifests first — cached until package.json changes
COPY package.json package-lock.json ./
RUN npm ci --only=production
# Copy source last — invalidates only this layer on code changes
COPY . .
RUN npm run build
CMD ["node", "dist/server.js"]`,
    codeLanguage: "dockerfile",
  },
  {
    id: "q7",
    category: "images",
    question:
      "What are multi-stage builds, and why are they essential for production images?",
    answer:
      "A multi-stage build uses multiple FROM instructions in a single Dockerfile, where each stage can have a different base image. You use an early, heavyweight 'builder' stage that installs compilers, build tools, and test runners, then copy only the resulting binary or compiled artifacts into a final minimal 'runtime' stage. The final image contains none of the build tooling, source code, or dev dependencies—dramatically reducing image size and attack surface. A Node.js application compiled in a node:20 builder might shrink from 800 MB to 120 MB in a node:20-alpine runtime stage. A Go binary might go from a golang:1.22 builder (~800 MB) to a scratch or distroless image (~8 MB) because Go compiles to a single static binary. Smaller production images mean faster pulls, less network traffic, and fewer vulnerabilities to scan. You can also run tests in an intermediate stage failing the build if tests fail, enforcing CI quality gates without a separate CI step.",
    code: `# Multi-stage Go build — 800MB builder → ~8MB final image
FROM golang:1.22 AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/server .

# Test stage — build fails if tests fail
FROM builder AS tester
RUN go test ./...

# Final minimal image — no Go toolchain
FROM gcr.io/distroless/static-debian12
COPY --from=builder /app/server /server
EXPOSE 8080
ENTRYPOINT ["/server"]`,
    codeLanguage: "dockerfile",
  },
  {
    id: "q8",
    category: "images",
    question:
      "When should you choose Alpine Linux as a base image vs. a Debian/Ubuntu base, and what are the trade-offs?",
    answer:
      "Alpine Linux is a minimal image (~5 MB) built on musl libc and BusyBox. Its tiny size makes it popular for production: fewer packages means fewer CVEs. However, Alpine uses musl libc instead of glibc, which means dynamically-linked binaries compiled for glibc (the default on Debian/Ubuntu) will crash at runtime. Python wheels containing native C extensions (numpy, scipy, lxml) must be recompiled for musl—this dramatically slows down builds and sometimes isn't possible for proprietary extensions. Alpine also lacks many debugging tools (strace, lsof) and diagnostic packages by default. Debian-slim (~70 MB) offers a middle ground: glibc compatibility, a richer package ecosystem, familiar tooling, and much smaller than full Debian. Distroless images (from Google) contain only the application runtime and its dependencies with no shell, no package manager, and no extraneous files—ideal for production security. Use Alpine for simple, statically-linked services; Debian-slim for Python/Java/Ruby apps; Distroless for maximum security posture.",
  },
  {
    id: "q9",
    category: "images",
    question:
      "What is Docker BuildKit, and what key features does it add over the classic builder?",
    answer:
      "BuildKit is Docker's next-generation build subsystem (enabled by default since Docker 23.0). It introduces concurrent layer building: independent stages in a multi-stage build are built in parallel rather than serially. BuildKit supports mounted caches with the `--mount=type=cache` syntax, allowing package manager caches (pip, npm, apt) to persist between builds without being committed to the image—dramatically speeding up iterative development. It also supports `--mount=type=secret` for injecting secrets (API keys, SSH keys) that are available during the build but never written to any image layer, preventing secret leakage. BuildKit introduced `--mount=type=ssh` for securely forwarding the host SSH agent into builds for cloning private repos. The new `BUILDX` CLI (`docker buildx`) supports multi-platform builds (`--platform linux/amd64,linux/arm64`) using QEMU emulation or native build nodes, producing a single manifest list usable on both x86 and ARM hardware.",
    code: `# BuildKit secret mount — secret never ends up in image layer
# syntax=docker/dockerfile:1
FROM python:3.12-slim
RUN --mount=type=secret,id=pypi_token \\
    pip install --index-url https://\$(cat /run/secrets/pypi_token)@pypi.org/simple/ mypackage

# BuildKit cache mount — pip cache persists across builds
RUN --mount=type=cache,target=/root/.cache/pip \\
    pip install -r requirements.txt

# Build with secret
docker buildx build --secret id=pypi_token,src=.pypi_token -t myapp .`,
    codeLanguage: "dockerfile",
  },
  {
    id: "q10",
    category: "images",
    question:
      "How do you scan Docker images for vulnerabilities, and what should production pipelines do with scan results?",
    answer:
      "Docker Scout (integrated into Docker Desktop and `docker scout cves`), Trivy (Aqua Security), Grype (Anchore), and Snyk are the leading image scanning tools. They compare image layers against CVE databases (NVD, GitHub Advisory, Alpine SecDB, Debian Security Tracker) and report known vulnerabilities in OS packages and language-level dependencies. A well-designed CI/CD pipeline should fail the build on any Critical or High CVE with a known fix—forcing engineers to update base images or vulnerable packages rather than shipping known exploits. Use `--exit-code 1 --severity CRITICAL,HIGH` with Trivy to enforce this. For packages without fixes, document accepted risks in an audit record. Regularly rebuild production images (weekly at minimum) using the `--no-cache` flag to pull the latest patched base layers—most CVEs in container images are in OS packages that get patched by the distribution, not by your code. Store scan results as SBOM (Software Bill of Materials) artifacts alongside each release for compliance requirements.",
    code: `# Trivy scan in CI — fail on HIGH/CRITICAL with fix available
trivy image --exit-code 1 --severity HIGH,CRITICAL --ignore-unfixed myapp:latest

# Docker Scout
docker scout cves myapp:latest

# Generate SBOM
docker sbom myapp:latest --format spdx-json > sbom.json`,
    codeLanguage: "bash",
  },
  {
    id: "q11",
    category: "images",
    question: "What strategies can reduce Docker image size in production?",
    answer:
      "Start with a minimal base image—Alpine, Distroless, or scratch for compiled binaries. Use multi-stage builds to exclude build tools from the final image. Chain RUN commands with && and clean up in the same layer (rm -rf /var/lib/apt/lists/*, pip cache purge, apk del build-deps) because separate RUN/COPY/ADD each creates a new layer, and files deleted in a later layer are hidden but still present in earlier layers counting toward image size. Use .dockerignore to exclude local state (node_modules, .git, test fixtures, docs) from the build context—anything that ends up in COPY . . should not include unnecessary files. Critically, Docker squash merges all layers into one (--squash flag, experimental), and `docker image prune` removes dangling images. For language runtimes, avoid installing documentation and tests: apt-get install --no-install-recommends, npm ci --only=production, pip install --no-cache-dir --compile.",
    code: `# Debian apt — no docs, clean cache in same layer
RUN apt-get update && \\
    apt-get install -y --no-install-recommends curl ca-certificates && \\
    rm -rf /var/lib/apt/lists/*

# Python — no cache, no compile pyc
RUN pip install --no-cache-dir --no-compile -r requirements.txt

# Check layers and sizes
docker history myapp:latest
docker image ls --format "table {{.Repository}}\\t{{.Tag}}\\t{{.Size}}"`,
    codeLanguage: "dockerfile",
  },
  {
    id: "q12",
    category: "images",
    question:
      "Explain Docker image tagging best practices. What is the difference between :latest and a digest pin?",
    answer:
      "The :latest tag is a mutable pointer that moves to whichever image was most recently pushed—it is the source of endless 'works on my machine' bugs in production because pulling :latest today may give a different image than pulling it tomorrow. In production CI/CD pipelines, always tag images with an immutable identifier: a Git commit SHA (myapp:a1b2c3d), a semantic version (myapp:1.4.2), or a build number (myapp:build-491). A digest pin (myapp@sha256:abc123...) is even stronger—it references the exact layer bytes regardless of tag reassignment, making it impossible to silently swap the underlying image. For base images in Dockerfiles, pin to a specific minor version (FROM python:3.12.4-slim) rather than :latest or even :3.12 to prevent automatic base image bumps breaking your build. Combine digest pins for production Dockerfiles with Dependabot or Renovate to automatically propose version bumps as PRs with scan results.",
  },

  // ── LIFECYCLE (13–17) ─────────────────────────────────────────────────
  {
    id: "q13",
    category: "lifecycle",
    question:
      "What are the container states in Docker's lifecycle, and how do they transition?",
    answer:
      "Docker containers move through well-defined states. Created: the container exists (docker create ran) but the process has not started—no runtime resources are consumed. Running: the main process is executing. Paused: all processes in the container are frozen via SIGSTOP/cgroup freezer—useful for snapshotting without stopping. Exited: the main process terminated; exit code 0 means success, non-zero means error. The container's writable layer is preserved until `docker rm`. Dead: the container could not be fully removed (usually a device busy error). Restarting: a restart policy is in effect and Docker is restarting the container after it exited. Use `docker inspect --format='{{.State.Status}}'` to query current state programmatically. The `docker events` command streams all state transition events in real time, useful for scripting wait conditions and monitoring hooks.",
    code: `# Follow state transitions in real time
docker events --filter 'container=myapp' --filter 'event=start' --filter 'event=die'

# Check exit code after container exits
docker inspect --format='{{.State.ExitCode}}' myapp

# Pause / unpause without killing
docker pause myapp && docker unpause myapp`,
    codeLanguage: "bash",
  },
  {
    id: "q14",
    category: "lifecycle",
    question:
      "How do Docker restart policies work, and when should you use each one?",
    answer:
      "Restart policies tell the Docker daemon what to do when a container's main process exits. `no` (default) means the container is never restarted—use for one-shot jobs. `on-failure[:max-retries]` restarts only on non-zero exit codes; the optional max-retries cap prevents infinite crash loops consuming resources. `always` restarts no matter what, including after a daemon restart, even if you manually stopped the container which can be surprising—suitable for infrastructure singletons. `unless-stopped` behaves like always except it does not restart a container you manually stopped, giving operators an escape hatch. In production, `unless-stopped` is preferred over `always` for long-running services because it respects operator intent. For critical services in a non-orchestrated environment, pair `unless-stopped` with a monitoring alert on rapid successive restarts to catch crash loops. In Kubernetes or Swarm, the orchestrator manages restarts, so restart policies on individual containers are less relevant.",
    code: `# Production recommendation for long-running service
docker run -d --restart=unless-stopped --name api myapp:1.4.2

# One-shot job — no restart
docker run --restart=no busybox echo "done"

# Limit crash-loop retries
docker run --restart=on-failure:5 flaky-service`,
    codeLanguage: "bash",
  },
  {
    id: "q15",
    category: "lifecycle",
    question:
      "Explain the difference between SIGTERM and SIGKILL in container shutdown. How do you implement graceful shutdown?",
    answer: `When you run \`docker stop\`, Docker sends SIGTERM to PID 1 inside the container, giving the process time to finish in-flight requests, flush buffers, close database connections, and clean up. After a configurable timeout (default 10 seconds, set with \`--time\`), Docker sends SIGKILL—an uncatchable kernel-level forced termination. Processes that ignore SIGTERM (common in shell scripts because shells do not forward signals to child processes) will be SIGKILL'd after the timeout, causing abrupt shutdowns with potential data corruption or connection-dropping. For graceful shutdown: (1) PID 1 must be your application binary, not a shell wrapper (use exec form CMD/ENTRYPOINT: \`CMD ["node","server.js"]\` not CMD node server.js); (2) the application must install a SIGTERM handler that stops accepting new connections and waits for in-flight requests to complete; (3) increase \`--stop-timeout\` if your app legitimately needs more than 10 seconds to drain. Use \`docker stop --time=30 myapp\` for a 30-second grace period.`,
    code: `# Node.js graceful shutdown handler
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, draining connections...');
  server.close(async () => {
    await db.end();          // close DB pool
    process.exit(0);
  });
  // Force exit after 29s if drain stalls
  setTimeout(() => process.exit(1), 29_000);
});

# Dockerfile — exec form so Node is PID 1, not sh
CMD ["node", "server.js"]`,
    codeLanguage: "javascript",
  },
  {
    id: "q16",
    category: "lifecycle",
    question:
      "What is the difference between CMD and ENTRYPOINT in a Dockerfile?",
    answer: `ENTRYPOINT defines the fixed executable that always runs as PID 1—it cannot be overridden without the \`--entrypoint\` flag. CMD provides default arguments to ENTRYPOINT (or the default command if ENTRYPOINT is not set) and is easily overridden by appending arguments to \`docker run\`. A common production pattern is ENTRYPOINT for the binary and CMD for default flags: \`ENTRYPOINT ["nginx"]\` + \`CMD ["-g", "daemon off;"]\`. You can then override only the flags with \`docker run myimage -c /etc/nginx/custom.conf\`. Shell form (\`CMD node server.js\`) invokes /bin/sh -c, making sh PID 1 which does not forward signals to the child process—this prevents graceful shutdown. Always use exec form (JSON array notation) in production: \`CMD ["node", "server.js"]\`. If you use a shell entrypoint script (entrypoint.sh), end it with \`exec "$@"\` to hand off PID 1 to the application.`,
    code: `# entrypoint.sh — hand off PID 1 with exec
#!/bin/sh
set -e
# Run migrations before app starts
python manage.py migrate --noinput
exec "$@"   # ← becomes the CMD, inheriting PID 1

# Dockerfile
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["gunicorn", "myapp.wsgi:application", "--bind", "0.0.0.0:8000"]`,
    codeLanguage: "bash",
  },
  {
    id: "q17",
    category: "lifecycle",
    question:
      "When would you use `docker exec` vs `docker attach`? What are the risks of each?",
    answer:
      "docker exec spawns a new process inside a running container's namespaces—it is the standard way to interactively debug: `docker exec -it myapp sh`. The new process runs independently; exiting it does not affect the main application process. docker attach connects your terminal's stdin/stdout/stderr to the container's PID 1 I/O stream. If PID 1 is a server, you are now attached to its output. The critical risk: pressing Ctrl+C sends SIGINT to PID 1, which may stop the entire service. The safer key sequence when using attach is Ctrl+P then Ctrl+Q (the detach sequence) to detach without signaling the process. Use exec for debugging, running ad-hoc commands, or opening a shell. Never attach to a production container unless you are certain PID 1 handles SIGINT gracefully. For read-only log tailing prefer `docker logs -f`—it doesn't connect to the process at all.",
    code: `# ✅ exec — safe debug shell (new process)
docker exec -it myapp sh

# Read-only log tail — safest option
docker logs -f --tail 100 myapp

# Attach — dangerous, detach with Ctrl+P Ctrl+Q
docker attach myapp

# Copy files out without exec
docker cp myapp:/var/log/app.log ./app.log`,
    codeLanguage: "bash",
  },

  // ── DATA & STORAGE (18–21) ──────────────────────────────────────────────
  {
    id: "q18",
    category: "data",
    question:
      "What is the difference between Docker volumes, bind mounts, and tmpfs mounts?",
    answer:
      "Volumes are managed entirely by Docker: data lives in /var/lib/docker/volumes on the host and is independent of any container. They are the correct choice for persistent application data (databases, uploads) because they work on Linux, Mac, and Windows, survive container deletion, and can be backed up, restored, and migrated. Volume drivers (local, NFS, AWS EBS via rexray, etc.) allow volumes to be backed by remote or cloud storage. Bind mounts map an exact host path into a container—ideal for development where you want the container to see live code changes (mount your src/ directory) but problematic in production due to hardcoded paths and permission complications. tmpfs mounts are in-memory filesystems stored in host RAM—never written to disk. They are perfect for sensitive ephemeral data (JWT signing keys in memory, temporary decryption buffers) where you explicitly don't want data persisted to disk or visible in the container layer. tmpfs data is lost on container stop.",
    code: `# Named volume — Docker manages location
docker run -v postgres_data:/var/lib/postgresql/data postgres:16

# Bind mount — host path mounted into container
docker run -v $(pwd)/src:/app/src:ro mydev

# tmpfs — in-memory, never written to disk
docker run --tmpfs /tmp:size=128m,noexec myapp

# Inspect volume
docker volume inspect postgres_data`,
    codeLanguage: "bash",
  },
  {
    id: "q19",
    category: "data",
    question: "How do you back up and restore data in a Docker volume?",
    answer:
      "The standard technique uses a temporary busybox or alpine container that mounts both the target volume and a bind-mounted host directory. For backup: spin up a container that tars the volume's directory tree and writes the archive to the bind-mounted backup path. For restore: spin up a container that extracts the archive into the volume. This is host-OS-agnostic because you are running standard shell commands inside a container rather than relying on host filesystem tools. For database volumes, it is always safer to use the database's native backup tool (pg_dump for Postgres, mysqldump for MySQL) inside an exec session or a dedicated backup sidecar container, rather than copying raw data files which might be in a mid-write inconsistent state. For production systems, consider tools like Velero (for Kubernetes) or Restic/Barman as a proper backup strategy rather than one-off shell scripts.",
    code: `# Backup volume to host
docker run --rm \\
  -v postgres_data:/data:ro \\
  -v $(pwd)/backups:/backups \\
  alpine tar czf /backups/postgres_data_$(date +%F).tar.gz -C /data .

# Restore volume from backup
docker run --rm \\
  -v postgres_data:/data \\
  -v $(pwd)/backups:/backups \\
  alpine tar xzf /backups/postgres_data_2025-01-15.tar.gz -C /data

# PostgreSQL logical backup (preferred over raw file copy)
docker exec postgres pg_dump -U postgres mydb | gzip > backup.sql.gz`,
    codeLanguage: "bash",
  },
  {
    id: "q20",
    category: "data",
    question:
      "How do you share a volume between multiple containers, and what concurrency issues arise?",
    answer:
      "You mount the same named volume into multiple containers in their respective `docker run -v` or Compose volumes configuration—Docker allows this and the containers see a shared filesystem namespace at the mount point. The critical risk is filesystem-level race conditions: two containers writing to the same file simultaneously without coordination will corrupt the file. Shared volumes work well for read-heavy multi-consumer patterns (many containers reading a shared config or static asset directory) or producer-consumer patterns where one container writes and one reads with no overlap. For writable shared state between containers, use a proper data store (Redis, PostgreSQL, S3) rather than a shared volume. Also beware of UID/GID mismatches: two containers using different user IDs may have conflicting read/write permissions on the same files. Volume drivers like NFS or GlusterFS extend sharing across multiple hosts but introduce network latency and must support the appropriate locking semantics for your workload.",
  },
  {
    id: "q21",
    category: "data",
    question:
      "What is a volume driver, and name three examples used in production?",
    answer:
      "A volume driver (also called a volume plugin) extends Docker's volume system to use remote or cloud-native storage backends instead of the local host filesystem. The driver is specified at volume creation time with `docker volume create --driver <driver-name>`. The built-in `local` driver supports basic NFS/CIFS mounts via options. The `local-persist` driver allows data to survive on a specified host path even after `docker volume rm`. In AWS deployments the `rexray/ebs` or the AWS EBS CSI driver (in ECS/EKS contexts) mounts EBS volumes directly to containers allowing persistent block storage that can be re-attached after instance replacement. The `vieux/sshfs` driver mounts a remote filesystem over SSH, useful for development scenarios. In enterprise environments, `NetApp Trident` and `Portworx` provide enterprise-grade volume management with snapshots, replication, and encryption. Volume drivers are critical for stateful services like databases running in containers where data outlasting the container host is a requirement.",
  },

  // ── NETWORKING (22–25) ────────────────────────────────────────────────
  {
    id: "q22",
    category: "networking",
    question:
      "Explain Docker's network drivers: bridge, host, overlay, macvlan, and none.",
    answer:
      "The default `bridge` driver creates a private virtual switch (docker0) on the host; containers attach to it via virtual Ethernet pairs, communicate by IP, and reach the internet via NAT through the host. User-defined bridge networks additionally support automatic DNS resolution by container name. The `host` driver removes network isolation: the container shares the host's network stack directly, giving it the host IP and all ports. This eliminates NAT overhead (useful for extreme performance requirements) but means a port conflict with any host service. The `overlay` driver creates a distributed virtual network spanning multiple Docker Swarm or custom hosts, enabling container-to-container communication across machines with name-based DNS—it uses VXLAN encapsulation over the host network. The `macvlan` driver assigns the container its own MAC address and makes it appear as a physical device on the LAN, useful for legacy apps expecting direct Layer-2 network access. The `none` driver disables all networking, giving the container only a loopback interface—suitable for batch jobs with no network requirements.",
    code: `# User-defined bridge with DNS
docker network create --driver bridge mynet
docker run --network mynet --name db postgres:16
docker run --network mynet --name api myapi
# 'api' can now reach 'db' via hostname 'db'

# Host network — no NAT
docker run --network host nginx

# Overlay (Swarm initialized required)
docker network create --driver overlay --attachable myoverlay`,
    codeLanguage: "bash",
  },
  {
    id: "q23",
    category: "networking",
    question:
      "What is the difference between EXPOSE and published ports (-p), and how does Docker DNS work?",
    answer:
      "EXPOSE in a Dockerfile is documentation only—it declares which port the application listens on inside the container but does not actually publish it to the host. It exists for human readers and tooling that inspect the image. The `-p` (or `--publish`) flag in `docker run -p <host_port>:<container_port>` actually creates a iptables/nftables NAT rule on the host that forwards traffic from `<host_port>` on all host interfaces to `<container_port>` inside the container. Without `-p`, services are only reachable within the Docker network. On user-defined bridge networks, Docker runs an embedded DNS server at 127.0.0.11 inside each container. Any container on the same user-defined network can resolve other containers by their name or alias via this embedded DNS—so `curl http://redis:6379` works in a Compose stack. The default bridge (docker0) does not have this automatic DNS; you must use `--link` (deprecated) or IP addresses.",
    code: `# -p publishes to all host interfaces
docker run -p 8080:80 nginx           # host:8080 → container:80

# Restrict to localhost only (security best practice)
docker run -p 127.0.0.1:8080:80 nginx

# Verify DNS from inside a container
docker exec myapp nslookup redis
# Returns: 172.20.0.3 (internal Compose network IP)`,
    codeLanguage: "bash",
  },
  {
    id: "q24",
    category: "networking",
    question:
      "How do containers on different Docker networks communicate, and how do you connect a container to multiple networks?",
    answer:
      "Containers on different Docker networks are isolated from each other—there is no automatic routing between them. This is desirable: you can place a web container on both a 'frontend' network (shared with a reverse proxy) and a 'backend' network (shared with a database), while the database has no route to the frontend network. A container can be attached to multiple networks simultaneously using `docker network connect`, or in Compose by listing multiple networks under the service. The reverse proxy (nginx, Traefik) is a classic multi-network container: it sits on the public network receiving inbound traffic and the app network to forward requests to backend services, while backends are isolated from the internet. Cross-host communication requires overlay networks in Swarm or a third-party SDN plugin. For direct host-to-container routing without NAT, macvlan provides a path. Inspect network topology with `docker network inspect <network>` to see all connected containers and their IPs.",
    code: `# Compose multi-network isolation
services:
  proxy:
    image: nginx
    networks: [frontend, backend]   # can see both
  api:
    image: myapi
    networks: [backend]             # isolated from frontend
  db:
    image: postgres
    networks: [backend]             # isolated from frontend

networks:
  frontend:
  backend:`,
    codeLanguage: "yaml",
  },
  {
    id: "q25",
    category: "networking",
    question:
      "How does container-to-container networking work in Docker Compose, and what are common DNS pitfalls?",
    answer:
      "Docker Compose creates a dedicated user-defined bridge network per project (named <project>_default) and attaches all services to it. Each service is resolvable by its service name as a DNS hostname via Docker's embedded DNS resolver (127.0.0.11). Critically, the DNS name is the service name in docker-compose.yml, not the container name or image name. Common pitfall #1: using container names or image names in connection strings instead of service names (use `redis` not `redis_container_1`). Pitfall #2: services have DNS entries only on their own project's network; if you start containers with plain `docker run` they land on the default bridge which lacks DNS, and they cannot resolve Compose service names. Pitfall #3: the embedded DNS round-robins among all container replicas sharing a service name when you scale (`docker compose up --scale api=3`), providing primitive load balancing. Use `extra_hosts` to inject custom /etc/hosts entries for external services that need stable name mappings.",
  },

  // ── DOCKER COMPOSE (26–28) ───────────────────────────────────────────
  {
    id: "q26",
    category: "compose",
    question:
      "What does `depends_on` do in Docker Compose, and why is it insufficient for true service readiness?",
    answer:
      "depends_on controls container start order—Docker will start the dependency container before the dependent one. However, 'started' means the container process launched, not that the service inside is ready to accept connections. PostgreSQL, for example, takes several seconds to complete initialization after the container starts. An application container starting immediately after the postgres container may try to connect before Postgres has finished loading, causing a fatal connection error and container crash. The correct solution is `depends_on` with a `condition: service_healthy` paired with a `healthcheck` on the dependency service. When a healthcheck is defined, Docker will wait until the dependency reports 'healthy' before starting the dependent container. This replaces fragile retry loops and sleep commands in entrypoints. The condition options are: `service_started` (default, just launched), `service_healthy` (healthcheck passed), and `service_completed_successfully` (for one-shot initialization containers).",
    code: `services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 10
      start_period: 10s

  api:
    image: myapi
    depends_on:
      db:
        condition: service_healthy   # waits for pg_isready to pass`,
    codeLanguage: "yaml",
  },
  {
    id: "q27",
    category: "compose",
    question:
      "How do environment variables work in Docker Compose, and what are the best practices for secrets management?",
    answer:
      "Compose resolves environment variables in docker-compose.yml using shell environment variables, .env files, and the `environment:` block. The precedence order (highest to lowest) is: shell environment > Compose file `environment:` block > .env file. The `.env` file in the project directory is automatically loaded for variable substitution in the Compose file itself (e.g., `${POSTGRES_VERSION:-16}`). The `env_file:` key passes environment variables from a file directly into the container without exposing them in the Compose file. For development, .env files are convenient. For production, never commit .env files to source control—use a secrets manager (HashiCorp Vault, AWS Secrets Manager, Docker Swarm Secrets, Kubernetes Secrets) and inject values at runtime. In Compose v2+, `secrets:` top-level keys mount secret values as files in /run/secrets/<name> inside the container rather than as environment variables, which avoids secrets appearing in `docker inspect` output.",
    code: `# docker-compose.yml
services:
  api:
    image: myapi
    env_file:
      - .env.production     # file-based, not in compose file
    environment:
      - DEBUG=false         # non-sensitive config inline
    secrets:
      - db_password

secrets:
  db_password:
    external: true          # pre-created with 'docker secret create'

# App reads secret from file, not env var
# /run/secrets/db_password`,
    codeLanguage: "yaml",
  },
  {
    id: "q28",
    category: "compose",
    question:
      "How do Compose profiles work, and how do you scale services with Docker Compose?",
    answer:
      "Compose profiles allow you to define optional service groups activated by name with `--profile <name>` or the COMPOSE_PROFILES environment variable. This lets a single docker-compose.yml define a full-stack (app + database + Redis), development extras (pgAdmin, Mailhog, Swagger UI), and testing infrastructure (test database, mock servers) without starting everything by default. Services with no `profiles:` key are always started; services with profiles are only started when that profile is activated. For scaling, `docker compose up --scale api=3` starts three replicas of the api service. Since multiple replicas share the same `container_name` definition (which becomes a conflict), don't set container_name on scalable services. Published ports also conflict when scaled; instead use a load balancer (Traefik, nginx) as the entry point on a fixed port, and let it round-robin across the backend containers which have dynamic container ports but the same internal service name resolvable via Docker DNS.",
    code: `services:
  api:
    image: myapi
    # no profiles: always started

  pgadmin:
    image: dpage/pgadmin4
    profiles: [dev]         # only with --profile dev

  mailhog:
    image: mailhog/mailhog
    profiles: [dev, test]

# Start full dev environment
docker compose --profile dev up

# Scale API replicas (no container_name set)
docker compose up --scale api=5`,
    codeLanguage: "yaml",
  },

  // ── SECURITY (29–31) ─────────────────────────────────────────────────
  {
    id: "q29",
    category: "security",
    question:
      "What are the key techniques for hardening a Docker container's security posture?",
    answer:
      "Run containers as non-root users—add a USER instruction in the Dockerfile or use `--user 1000:1000` at runtime. Root in a container can become root on the host if kernel vulnerabilities or misconfigured volume mounts are exploited. Use `--read-only` to mount the root filesystem read-only, and explicitly whitelist writable paths with `--tmpfs` or volume mounts to only the directories the app legitimately needs to write. Drop all Linux capabilities and add back only those explicitly required: `--cap-drop ALL --cap-add NET_BIND_SERVICE`. Capabilities like CAP_SYS_ADMIN, CAP_NET_RAW, and CAP_CHOWN are almost never needed by application containers. Apply seccomp profiles to restrict which syscalls the container can invoke—Docker's default seccomp profile blocks ~44 dangerous syscalls. Enable AppArmor or SELinux profiles for MAC enforcement. Scan images for CVEs in CI. Use Docker Content Trust (DCT) to enforce signature verification on pulled images. Never mount the Docker socket (/var/run/docker.sock) into a container—it grants root-equivalent access to the host.",
    code: `# Hardened Dockerfile
FROM node:20-alpine
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY --chown=appuser:appgroup . .
RUN npm ci --only=production
USER appuser                  # never run as root

# Hardened docker run
docker run \\
  --read-only \\
  --tmpfs /tmp:size=64m,noexec,nosuid \\
  --cap-drop ALL \\
  --cap-add NET_BIND_SERVICE \\
  --security-opt no-new-privileges \\
  --security-opt seccomp=/etc/docker/seccomp-strict.json \\
  --user 1001:1001 \\
  myapp:latest`,
    codeLanguage: "dockerfile",
  },
  {
    id: "q30",
    category: "security",
    question:
      "What is Docker Content Trust (DCT), and how does it protect against supply chain attacks?",
    answer:
      "Docker Content Trust uses The Update Framework (TUF) and Notary to cryptographically sign and verify image digests. When DCT is enabled (`export DOCKER_CONTENT_TRUST=1`), `docker push` automatically signs images with the publisher's private key, and `docker pull` refuses to pull any image that either lacks a signature or whose signature cannot be verified against the trusted keys in the local trust store. This prevents pulling tampered or counterfeit images even if an attacker compromises a tag on the registry—a mis-tagged :latest pointing to malicious layers will fail signature verification. DCT is one layer of a supply chain security strategy; complement it with SBOM generation, provenance attestation (SLSA/Sigstore Cosign), and image scanning. Sigstore's Cosign has largely superseded Notary v1 for modern supply chain security because it uses keyless signing via OIDC identity tokens (GitHub Actions, GCP Workload Identity) rather than managing long-lived private keys.",
    code: `# Enable DCT globally
export DOCKER_CONTENT_TRUST=1
docker pull nginx:latest   # fails if unsigned

# Modern alternative: Cosign (Sigstore)
cosign sign --key cosign.key myregistry/myapp:1.4.2
cosign verify --key cosign.pub myregistry/myapp:1.4.2`,
    codeLanguage: "bash",
  },
  {
    id: "q31",
    category: "security",
    question:
      "How do you manage secrets in Docker Swarm, and how does it differ from using environment variables?",
    answer:
      "Docker Swarm Secrets stores encrypted secret values in the cluster's Raft consensus store, encrypted at rest and in transit using TLS. Secrets are only ever decrypted and mounted in memory (tmpfs) at /run/secrets/<name> inside containers that explicitly request them—they are never written to disk and never visible in docker inspect output. Environment variables, in contrast, are plaintext in the docker-compose.yml, visible in `docker inspect`, potentially logged by applications that dump their environment on startup, and stored in container metadata. To use a secret, create it (`docker secret create db_pass ./db_pass.txt`), grant the service access in the Compose/stack file (`secrets: [db_pass]`), and application code reads the file from /run/secrets/db_pass. Application code must be adapted to read secrets from files rather than environment variables—a one-line change, but architecturally important. Rotate secrets by creating a new version, updating the service to reference it, and removing the old one with zero downtime.",
    code: `# Create secret
echo "s3cur3-p4ssw0rd" | docker secret create postgres_password -

# Stack file (swarm mode)
services:
  db:
    image: postgres:16
    secrets:
      - postgres_password
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/postgres_password

secrets:
  postgres_password:
    external: true      # already created via CLI`,
    codeLanguage: "yaml",
  },

  // ── PERFORMANCE & TROUBLESHOOTING (32–33) ─────────────────────────────
  {
    id: "q32",
    category: "performance",
    question:
      "How do you set resource limits on containers, and what happens when a container exceeds them?",
    answer:
      "Docker exposes cgroup resource constraints via run-time flags. `--memory=512m` sets a hard memory limit; exceeding it triggers the Linux OOM killer inside the container (the process is killed with SIGKILL, not a graceful signal). `--memory-swap=512m` with the same value as --memory disables swap usage entirely. `--cpus=0.5` limits the container to half a CPU core using the CFS bandwidth scheduler. `--cpu-shares` is a relative weight for CPU scheduling under contention (not a hard limit). `--pids-limit=200` caps the number of processes to prevent fork bombs. Without these limits, a single misbehaving container can starve the host of resources, impacting co-located services—a classic 'noisy neighbor' problem. Monitor resource usage in real time with `docker stats` (streams cgroup data) and integrate container CPU/memory metrics into your observability stack (Prometheus Node Exporter, cAdvisor). Always set memory limits in production; the default is unlimited.",
    code: `# Production resource limits
docker run -d \\
  --name api \\
  --memory=512m \\
  --memory-swap=512m \\
  --cpus=1.0 \\
  --pids-limit=256 \\
  myapi:latest

# Real-time stats (all containers)
docker stats --format "table {{.Name}}\\t{{.CPUPerc}}\\t{{.MemUsage}}"`,
    codeLanguage: "bash",
  },
  {
    id: "q33",
    category: "performance",
    question:
      "What are Docker logging drivers, and how do you prevent containers from filling disk with logs?",
    answer:
      "Docker captures stdout/stderr from container processes and routes them through pluggable logging drivers. The default `json-file` driver writes logs to JSON files in /var/lib/docker/containers/<id>/ on the host. Without limits, long-running containers can write gigabytes of logs and exhaust host disk. Configure size and rotation limits on the json-file driver with `--log-opt max-size=10m --log-opt max-file=3` (keep three 10 MB files—30 MB max per container). For production deployments, switch to a centralized logging driver: `syslog` sends to syslog, `journald` integrates with systemd, `fluentd` ships logs to Fluentd/Fluentbit collectors, `awslogs` streams to CloudWatch, and `gelf` sends to Graylog/ELK. Centralized logging provides retention policies, search, alerting, and multi-host aggregation outside the container filesystem. Configure logging driver globally in /etc/docker/daemon.json to apply to all containers without per-run flags.",
    code: `# Per-container log rotation
docker run --log-opt max-size=10m --log-opt max-file=3 myapp

# daemon.json — global default for all containers
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3",
    "labels": "service,version"
  }
}

# Ship to Fluentd
docker run --log-driver=fluentd \\
  --log-opt fluentd-address=localhost:24224 \\
  --log-opt tag="docker.{{.Name}}" myapp`,
    codeLanguage: "json",
  },

  // ── SWARM & ORCHESTRATION (34) ───────────────────────────────────────
  {
    id: "q34",
    category: "swarm",
    question:
      "Explain Docker Swarm's architecture: managers, workers, services, tasks, and ingress routing.",
    answer:
      "Docker Swarm is Docker's native clustering and orchestration system. Manager nodes store the cluster state in a Raft consensus store, schedule services to worker nodes, and expose the Swarm API. Worker nodes execute container tasks and report health back to managers. A Service is the desired-state declaration (image, replicas, resource limits, ports)—equivalent to a Kubernetes Deployment. Docker reconciles actual state to desired state continuously. A Task is a single container running a specific service replica; if a task crashes, the manager schedules a replacement. Swarm provides a built-in routing mesh (ingress network) using IPVS: any traffic arriving on a published port of any Swarm node is load-balanced across healthy tasks running that service, regardless of which node the task is on. Rolling updates (`--update-parallelism`, `--update-delay`) replace tasks incrementally, pausing if failure thresholds are exceeded. Rollback restores the previous service definition. While Kubernetes dominates large-scale production, Swarm is operationally simpler and excellent for teams with fewer than 100 containers.",
    code: `# Initialize Swarm on manager node
docker swarm init --advertise-addr 192.168.1.10

# Join worker nodes (use token from init output)
docker swarm join --token SWMTKN-1-xxx 192.168.1.10:2377

# Deploy a stack (Compose file in Swarm mode)
docker stack deploy -c docker-compose.yml mystack

# Rolling update with health verification
docker service update \\
  --image myapp:1.5.0 \\
  --update-parallelism 1 \\
  --update-delay 15s \\
  --update-failure-action rollback \\
  mystack_api`,
    codeLanguage: "bash",
  },

  // ── PRODUCTION & ADVANCED (35) ───────────────────────────────────────
  {
    id: "q35",
    category: "production",
    question:
      "What is rootless Docker, how does it differ from standard Docker, and when should you use it?",
    answer:
      "Rootless Docker runs the Docker daemon (dockerd) and all containers as a non-privileged user rather than as root, using user namespaces to map the user's UID/GID range. This dramatically reduces a container escape's blast radius: a successful container breakout gives the attacker only the privileges of the unprivileged user running dockerd, not root on the host. Rootless Docker is enabled on a per-user basis (`dockerd-rootless-setuptool.sh install`) and uses rootlesskit and slirp4netns for network namespacing. The trade-offs: port binding below 1024 requires sysctl tuning, overlay filesystems have performance caveats on kernels before 5.11, and some advanced networking features are limited. For CI/CD pipelines, rootless Docker is ideal because CI agents often run in containers themselves, and standard Docker-in-Docker requires dangerous privileged mode or socket mounting. Podman (Red Hat's daemonless, rootless container tool with Docker-compatible CLI) is the main alternative and is rootless by default—making it preferred in security-sensitive enterprise environments.",
    code: `# Install rootless Docker (per-user)
dockerd-rootless-setuptool.sh install

# Run containers in rootless mode
export DOCKER_HOST=unix:///run/user/1000/docker.sock
docker run hello-world

# Podman — rootless by default, drop-in Docker replacement
podman run --rm hello-world
podman-compose up -d`,
    codeLanguage: "bash",
  },
];

// ── SCENARIOS ─────────────────────────────────────────────────────────────

const SCENARIOS: Scenario[] = [
  {
    id: "s1",
    title: "Slow docker build due to cache invalidation on every run",
    problem:
      "A Node.js Dockerfile starts with `COPY . .` followed by `RUN npm install`. Every single code change—even fixing a typo—causes npm install to re-run and download hundreds of packages from the registry. The build takes 4–5 minutes on every CI push.",
    steps: [
      "Identify the root cause: `COPY . .` copies all source files before `npm install`. Any file change in the project invalidates this layer and all subsequent ones.",
      "Restructure the Dockerfile to copy only dependency manifests first: `COPY package.json package-lock.json ./`",
      "Run `RUN npm ci --only=production` immediately after—this layer is now cached until package.json or package-lock.json changes.",
      "Add `COPY . .` afterwards so source code changes only invalidate layers from this point on, not the install step.",
      "Add a comprehensive `.dockerignore` file excluding `node_modules/`, `.git/`, `*.md`, `coverage/`, and `.env*` to reduce build context size and prevent spurious cache busts.",
      "Enable BuildKit (`DOCKER_BUILDKIT=1`) and use `--mount=type=cache,target=/root/.npm` to persist the npm cache across builds even when package.json changes.",
      "Measure the result: subsequent builds with only code changes should skip npm install and complete in under 30 seconds.",
    ],
    code: `# Before (broken cache)
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install

# After (optimized cache)
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \\
    npm ci --only=production
COPY . .
CMD ["node", "dist/server.js"]

# .dockerignore
node_modules/
.git/
*.md
coverage/
.env*`,
    codeLanguage: "dockerfile",
  },
  {
    id: "s2",
    title: "Container exits immediately with exit code 1 and no visible logs",
    problem:
      "After deploying an updated image, the container starts and immediately exits. `docker ps -a` shows it in Exited state. `docker logs` returns nothing. The OOM killer is suspected but unconfirmed.",
    steps: [
      "Run `docker inspect --format='{{.State.ExitCode}} {{.State.OOMKilled}}' <container>` to get the exit code and check if OOM-killed.",
      "Exit code 1 with OOMKilled=false indicates the application process crashed during startup. Exit code 137 with OOMKilled=true confirms OOM.",
      "Run the image interactively to capture output: `docker run --rm -it myapp:latest sh` and manually run the startup command to see error messages printed before the process exits.",
      "If the app crashes before writing to stdout, check if it writes logs to a file inside the container instead—use `docker run` with a volume to inspect post-crash container contents.",
      'Check the entrypoint: if CMD uses shell form (`CMD node server.js`), sh might not forward the error to stdout. Switch to exec form: `CMD ["node", "server.js"]`.',
      "Run with `--log-driver=journald` or increase log verbosity temporarily—some apps suppress startup errors at default log levels.",
      "Check for missing environment variables: `docker run --rm myapp:latest env` and compare required env vars against what is actually set.",
      "After identifying the root cause (missing SECRET_KEY in this case), set the env var via `--env` flag or secrets, redeploy, and verify the container stays running with `docker ps` after 30 seconds.",
    ],
    code: `# Diagnose exit
docker inspect --format='ExitCode={{.State.ExitCode}} OOM={{.State.OOMKilled}}' myapp

# Interactive debug shell
docker run --rm -it --entrypoint sh myapp:latest
# Inside: node server.js   ← observe error output

# Check missing env vars
docker run --rm myapp:latest env | sort

# Compare to required vars in source
grep process.env src/*.js`,
    codeLanguage: "bash",
  },
  {
    id: "s3",
    title:
      "Two containers on the same host cannot communicate via service name",
    problem:
      "An API container tries to connect to `http://redis:6379` but gets `getaddrinfo ENOTFOUND redis`. Both containers are running on the same Docker host but were started with separate `docker run` commands.",
    steps: [
      "Verify both containers were started without `--network` flags—they land on the default bridge network, which does not support DNS resolution by service name.",
      "Confirm with `docker network inspect bridge`—you'll see both container IPs listed, but no DNS hostnames.",
      "Create a user-defined bridge network: `docker network create mynet`",
      "Stop both containers and restart them with `--network mynet --name <service-name>`: the `--name` flag becomes the DNS hostname on user-defined networks.",
      "Test DNS resolution from inside the API container: `docker exec api nslookup redis` should now return an IP address.",
      "If the containers are managed by Docker Compose, this is handled automatically—all services in a Compose stack share a default project network with automatic DNS.",
      "For production, migrate to Docker Compose or Swarm where network configuration is declarative and DNS is automatic.",
    ],
    code: `# Create user-defined bridge (has DNS)
docker network create mynet

# Start Redis on the network with a service name
docker run -d \\
  --network mynet \\
  --name redis \\
  redis:7-alpine

# Start API connected to same network
docker run -d \\
  --network mynet \\
  --name api \\
  -e REDIS_URL=redis://redis:6379 \\
  myapi:latest

# Verify DNS from API container
docker exec api nslookup redis`,
    codeLanguage: "bash",
  },
  {
    id: "s4",
    title: "Database container loses all data after `docker-compose down`",
    problem:
      "The team runs `docker-compose down` at the end of each day and finds the PostgreSQL database is empty the next morning. User accounts and application data are gone. The Compose file does not define any volumes.",
    steps: [
      "Understand the cause: `docker-compose down` removes containers, and without a named volume, the container's writable layer (which held /var/lib/postgresql/data) is destroyed along with it.",
      "Note: `docker-compose stop` pauses containers without deleting them, preserving data—but this is fragile. The correct fix is named volumes.",
      "Add a named volume for the Postgres data directory in docker-compose.yml.",
      "Add the top-level `volumes:` key declaring the volume name so Compose manages it.",
      "Run `docker-compose down && docker-compose up -d`—data now persists across down/up cycles because the named volume (stored in /var/lib/docker/volumes/) survives container deletion.",
      "Verify the volume exists after `down`: `docker volume ls | grep postgres_data`.",
      "Additionally, implement pg_dump-based backups on a cron schedule as a defense-in-depth measure against accidental `docker volume rm`.",
      "Caution: `docker-compose down -v` deletes named volumes—never run this in production environments.",
    ],
    code: `# docker-compose.yml — add named volume
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data  # named volume
    ports:
      - "5432:5432"

volumes:
  postgres_data:   # Docker manages this — survives 'down'

# Verify persistence
docker compose down
docker volume ls | grep postgres_data   # should still exist
docker compose up -d`,
    codeLanguage: "yaml",
  },
  {
    id: "s5",
    title: "Node.js app runs as root inside the container",
    problem:
      "A security audit flags that the Node.js application container runs as UID 0 (root). A security researcher demonstrates that a path traversal vulnerability in the app would allow reading arbitrary host files via a misconfigured volume mount. The team needs to harden the Dockerfile.",
    steps: [
      "Verify the current user: `docker exec myapp whoami` returns `root`.",
      "Add a system group and user in the Dockerfile using `addgroup` and `adduser` (Alpine) or `groupadd`/`useradd` (Debian).",
      "Change file ownership during the build with `COPY --chown=appuser:appgroup` so the non-root user can read app files.",
      "Add `USER appuser` before CMD/ENTRYPOINT to switch to the non-root user for all subsequent instructions and at runtime.",
      "Test that the application still starts correctly—if it binds to port 80 or 443, it will now fail (ports < 1024 require CAP_NET_BIND_SERVICE). Either switch to port 3000 and expose 3000, or add `--cap-add NET_BIND_SERVICE`.",
      "Add `--read-only --tmpfs /tmp --security-opt no-new-privileges` to the docker run command/Compose file for defense-in-depth.",
      "Re-run the security audit: `docker exec myapp whoami` should now return `appuser`, and `id` should show a non-zero UID.",
    ],
    code: `# Hardened Dockerfile
FROM node:20-alpine

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy deps as root, install
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy app files with correct ownership
COPY --chown=appuser:appgroup . .

# Switch to non-root
USER appuser

EXPOSE 3000
CMD ["node", "server.js"]`,
    codeLanguage: "dockerfile",
  },
  {
    id: "s6",
    title: "Container disk fills up due to excessive logs",
    problem:
      "A production container running for 3 weeks has written 15 GB of JSON log files to /var/lib/docker/containers/<id>. The host disk is at 97% capacity. The monitoring alert fires at midnight. The team needs an immediate fix and a permanent prevention strategy.",
    steps: [
      "Immediate relief: identify the largest log file with `du -sh /var/lib/docker/containers/*/*.log | sort -rh | head -5`.",
      "Truncate the current log file without stopping the container: `truncate -s 0 /var/lib/docker/containers/<id>/<id>-json.log`. This is safe because the file descriptor is still open but the file content is cleared.",
      "For permanent prevention, add log rotation options to the Compose file or daemon.json. Set `max-size` to limit individual log file size and `max-file` to limit the number of rotated files retained.",
      "Apply the change for the running container via `docker update` if supported by the driver, or by restarting the container with the new log options.",
      "Update /etc/docker/daemon.json to set these limits globally for all new containers on the host, then `systemctl reload docker`.",
      "Consider switching to a centralized log driver (Fluentd, CloudWatch) for long-term production observability—this removes logs from the container host entirely.",
      "Add disk usage to your monitoring dashboard with an alert at 75% capacity to prevent future midnight incidents.",
    ],
    code: `# Immediate: truncate live log file (safe, container keeps running)
truncate -s 0 /var/lib/docker/containers/<CONTAINER_ID>/*-json.log

# Permanent: Compose service log limits
services:
  api:
    image: myapi
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "5"

# Global: /etc/docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}`,
    codeLanguage: "yaml",
  },
  {
    id: "s7",
    title: "Secret token accidentally committed into a Docker image layer",
    problem:
      "A developer added `RUN pip install --index-url https://SECRET_TOKEN@private.pypi.company.com/simple/ mypackage` directly into the Dockerfile and pushed the image to the registry. The SECRET_TOKEN is now baked into an image layer and cannot be removed by adding a new RUN layer to delete it.",
    steps: [
      "Immediately invalidate/rotate the leaked token in the package registry or secrets management system—treat it as fully compromised.",
      "Never attempt to 'fix' this by adding a new command to delete the secret—old layers are permanently accessible via `docker history` and `docker save`.",
      "Delete the image from all registries that hold it and remove from any developer machines: `docker rmi`, registry API delete on all tagged versions containing the bad layer.",
      "Rebuild the image using BuildKit's `--mount=type=secret` mechanism which provides the secret to the RUN command without writing it to any layer.",
      "In the Dockerfile, reference the secret via the mounted file path rather than hardcoding it in the command string.",
      "Add a pre-commit hook (git-secrets, detect-secrets, truffleHog) and a CI scan step to catch any future secret commits before they reach the registry.",
      "Add the private PyPI URL pattern to .dockerignore-equivalent guards and team coding standards. Document this as a security incident and share learnings in a blameless postmortem.",
    ],
    code: `# syntax=docker/dockerfile:1
FROM python:3.12-slim

# ✅ Secret never written to image layer
RUN --mount=type=secret,id=pypi_token \\
    pip install \\
      --index-url https://$(cat /run/secrets/pypi_token)@private.pypi.company.com/simple/ \\
      mypackage

# Build — secret supplied at build time only
docker buildx build \\
  --secret id=pypi_token,env=PYPI_TOKEN \\
  -t myapp:latest .

# Verify secret is not in image history
docker history myapp:latest   # should show no token`,
    codeLanguage: "dockerfile",
  },
  {
    id: "s8",
    title: "Services in Compose start out of order even with `depends_on`",
    problem:
      "A Django application starts before PostgreSQL has finished initializing. The app container fails with `django.db.OperationalError: could not connect to server: Connection refused`. Engineers added `depends_on: [db]` but the error persists on cold starts.",
    steps: [
      "Explain the gap: `depends_on` without a condition only waits for the container to be in the 'started' state (process launched), not the 'healthy' state (service ready to accept connections). PostgreSQL takes several seconds to complete initialization after the process starts.",
      "Add a `healthcheck` to the database service using `pg_isready` which tests actual TCP connectivity and authentication readiness.",
      "Change `depends_on` in the app service to use `condition: service_healthy`—Compose will poll the healthcheck and only start the app once it passes.",
      "Set appropriate `start_period` (time before healthcheck failures count) to accommodate PostgreSQL's initial data directory initialization which can take 10–15 seconds on first boot.",
      "Test: `docker compose down -v && docker compose up` (fresh start with volumes deleted)—the api container should not start until `pg_isready` succeeds.",
      "As an additional defense-in-depth measure, implement retry logic in the application's database connection code with exponential backoff—orchestrators and pod restarts can also cause transient connectivity gaps.",
    ],
    code: `services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: secret
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U appuser -d myapp"]
      interval: 5s
      timeout: 3s
      retries: 15
      start_period: 15s   # allow for initial db init

  app:
    image: mydjango
    depends_on:
      db:
        condition: service_healthy  # waits for pg_isready ✅
    environment:
      DATABASE_URL: postgres://appuser:secret@db:5432/myapp`,
    codeLanguage: "yaml",
  },
  {
    id: "s9",
    title: "Multi-stage build produces identical image size as single-stage",
    problem:
      "A developer added a second `FROM node:20-alpine AS runtime` stage but forgot to actually copy artifacts from the builder. `docker images` shows the final image is still 800 MB because it defaults to using the entire builder context.",
    steps: [
      "Run `docker history myapp:latest` to inspect layers—if you see npm install layers and source code layers in the 'final' stage, the COPY --from is missing.",
      "Identify what the build stage produces: for a TypeScript project, it produces a `dist/` directory and `node_modules/` (production deps only).",
      "Add the explicit `COPY --from=builder /app/dist ./dist` and `COPY --from=builder /app/node_modules ./node_modules` to the runtime stage.",
      "Alternatively, re-run npm install with --only=production in the runtime stage for a clean install rather than copying potentially large node_modules.",
      "Rebuild and compare sizes: `docker images | grep myapp`. The correct multi-stage build should reduce from ~800 MB to ~120 MB for a typical Node.js app on Alpine.",
      "Ensure the `CMD` in the runtime stage references the correct path in the new working directory.",
    ],
    code: `# Broken — runtime stage has no COPY --from
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime    # ← this stage is active
# ❌ Missing COPY --from=builder !
CMD ["node", "server.js"]         # ← references non-existent file

# Fixed — explicit copy of artifacts only
FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
RUN npm ci --only=production      # install production deps fresh
EXPOSE 3000
CMD ["node", "dist/server.js"]`,
    codeLanguage: "dockerfile",
  },
  {
    id: "s10",
    title: "Overlay network containers cannot communicate across Swarm nodes",
    problem:
      "In a two-node Docker Swarm, services on an overlay network can communicate on the same node but fail when tasks are on different nodes. `curl http://api` times out when the api and frontend tasks are scheduled to different hosts.",
    steps: [
      "Check that the overlay network exists and is not in a bad state: `docker network ls --filter driver=overlay`.",
      "Verify all required ports are open on the firewall between nodes: TCP 2377 (Swarm management), TCP/UDP 7946 (gossip protocol), UDP 4789 (VXLAN data plane).",
      "Test firewall rules: `nc -zv <worker-node-ip> 4789` from the manager—blocked UDP 4789 is the most common cause of overlay network failures.",
      "Check that all nodes are using the same network interface for VXLAN. If nodes have multiple interfaces, specify `--advertise-addr` on swarm join to ensure nodes advertise the correct IP.",
      "Inspect the overlay network on both nodes: `docker network inspect myoverlay`—both nodes should appear under 'Peers'.",
      "If peers are missing, the issue is gossip (7946). If peers are present but packets are dropped, the issue is VXLAN (4789).",
      "Redeploy the service and verify with `docker exec -it <container> ping <other-container-ip>` to confirm connectivity after firewall rules are updated.",
    ],
    code: `# Required firewall ports for Docker Swarm overlay
# TCP 2377: Swarm management
# TCP/UDP 7946: Container network discovery (gossip)
# UDP 4789: Overlay network traffic (VXLAN)

# Example UFW rules
ufw allow 2377/tcp
ufw allow 7946/tcp
ufw allow 7946/udp
ufw allow 4789/udp

# Validate node peers in overlay
docker network inspect --format='{{json .Peers}}' myoverlay | python3 -m json.tool

# Initialize Swarm with explicit advertise address
docker swarm init --advertise-addr 10.0.1.5`,
    codeLanguage: "bash",
  },
  {
    id: "s11",
    title:
      "Container health check always reports unhealthy despite app working",
    problem:
      "A Compose service is marked `unhealthy` and Swarm repeatedly restarts it even though the API responds correctly. Engineers can `curl http://localhost:8080/health` from the host and get a 200 OK.",
    steps: [
      "Run the health check manually inside the container: `docker exec myapp curl -f http://localhost:8080/health`. If this fails, the issue is inside the container context—different from the host.",
      "Check if `curl` is installed in the image. Alpine images often don't include it. Use `wget -qO- http://localhost:8080/health` or a native check like `CMD-SHELL python3 -c \"import urllib.request; urllib.request.urlopen('http://localhost:8080/health')\"`.",
      "Verify the port in the health check matches the port the app actually binds to inside the container—the host's published port is irrelevant for container-level health checks.",
      "Check timing parameters: if `start_period` is too short, the health check might fail during normal application startup before it's ready. Increase `start_period` to accommodate startup time.",
      "Use `docker inspect --format='{{json .State.Health}}' myapp` to see the last health check output, exit code, and timestamp for all previous checks.",
      "The fix here: the Alpine image lacked curl. Replace `CMD curl -f http://localhost:8080/health` with `CMD wget --spider -q http://localhost:8080/health || exit 1`.",
    ],
    code: `# Broken: curl not available in alpine image
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8080/health"]

# Fixed: use wget (available in alpine busybox)
healthcheck:
  test: ["CMD-SHELL", "wget --spider -q http://localhost:8080/health || exit 1"]
  interval: 10s
  timeout: 5s
  retries: 3
  start_period: 30s

# Debug last N health check results
docker inspect --format='{{json .State.Health.Log}}' myapp | python3 -m json.tool`,
    codeLanguage: "yaml",
  },
  {
    id: "s12",
    title: "Docker Compose environment variable not being picked up by service",
    problem:
      "A developer sets `DATABASE_URL=postgres://prod-server/db` in their shell, runs `docker compose up`, and the app still connects to localhost. The Compose file uses `${DATABASE_URL}` for variable substitution.",
    steps: [
      "Distinguish between two different usages: `${DATABASE_URL}` in the Compose YAML is used for Compose-level variable substitution (populating the Compose file itself), while `environment: DATABASE_URL` passes the variable into the container.",
      "If the intention is to forward the shell variable into the container, use `environment: - DATABASE_URL` (without a value—this inherits from the shell) or `environment: DATABASE_URL: ${DATABASE_URL}`.",
      "Check for a `.env` file in the project directory overriding the shell variable—the .env file is loaded for Compose substitution with lower priority than shell env, but developers often forget it exists.",
      "Use `docker compose config` to print the fully-resolved Compose file after variable substitution—this shows exactly what values Compose will actually use.",
      "Inside the running container, verify what the container sees: `docker exec myapp env | grep DATABASE_URL`.",
      "Apply the fix: update the Compose file to explicitly pass through the variable, or use an env_file directive for environment-specific configuration.",
    ],
    code: `# docker-compose.yml
services:
  app:
    image: myapp
    environment:
      # ✅ This passes existing shell variable into container
      - DATABASE_URL
      # ✅ Explicit with substitution
      - REDIS_URL=\${REDIS_URL:-redis://localhost:6379}

# Debug: print fully resolved compose file
docker compose config

# Debug: check container env vars
docker exec myapp env | sort

# Priority order (highest to lowest):
# 1. Shell environment variables
# 2. .env file
# 3. default value in Compose file (:-fallback)`,
    codeLanguage: "yaml",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// THEME TOKENS
// ═══════════════════════════════════════════════════════════════════════════

function getTheme(isDark: boolean) {
  return isDark
    ? {
        // ── Dark "Obsidian" palette ───────────────────────────────────────
        pageBg: "#0e1118",
        gridLine: "rgba(56,189,248,0.028)",
        text: "#e2e8f0",
        textActive: "#f8fafc",
        textSecondary: "#cbd5e1",
        textMuted: "#94a3b8",
        textFaint: "#64748b",
        textVeryFaint: "#475569",
        cardBgOpen: "#131621",
        cardBgIdle: "rgba(255,255,255,0.025)",
        borderIdle: "rgba(255,255,255,0.06)",
        borderActive: "rgba(255,255,255,0.1)",
        divider: "rgba(255,255,255,0.06)",
        dividerThin: "rgba(255,255,255,0.05)",
        navBg: "#0b0e16",
        navBorderR: "1px solid rgba(255,255,255,0.07)",
        tocBg: "#111520",
        sectionCountBg: "rgba(255,255,255,0.05)",
        statBg: "rgba(255,255,255,0.04)",
        statBorder: "rgba(255,255,255,0.08)",
        heroBorderLeft: "#38bdf8",
        heroDesc: "#94a3b8",
        mobileNavBg: "#111520",
        mobileNavBorder: "rgba(255,255,255,0.09)",
        mobileNavIcon: "#94a3b8",
        scenarioAlertBg: "rgba(248,113,113,0.07)",
        scenarioAlertBorder: "rgba(248,113,113,0.22)",
        problemBoxBg: "rgba(251,191,36,0.06)",
        problemBoxBorder: "rgba(251,191,36,0.18)",
        stepNumBg: "rgba(52,211,153,0.12)",
        stepNumColor: "#34d399",
        stepNumBorder: "rgba(52,211,153,0.22)",
        stepText: "#cbd5e1",
        footerBorder: "rgba(255,255,255,0.07)",
        progressTrack: "#1e293b",
        codeBlockBg: "#0a0e14",
        codeBlockBorder: "rgba(255,255,255,0.07)",
        codeBlockHeaderBg: "#0d1117",
        codeBlockHeaderBorder: "rgba(255,255,255,0.07)",
        codeBlockLang: "#64748b",
        codeBlockCopyIdle: "rgba(255,255,255,0.06)",
        codeBlockCopyIdleColor: "#64748b",
        codeBlockCopyIdleBorder: "rgba(255,255,255,0.09)",
        codeText: "#a8d8b0",
        toggleBg: "rgba(255,255,255,0.06)",
        toggleBorder: "rgba(255,255,255,0.1)",
        toggleColor: "#94a3b8",
      }
    : {
        // ── Light "Paper" palette ─────────────────────────────────────────
        pageBg: "#f8fafc",
        gridLine: "rgba(56,130,184,0.06)",
        text: "#0f172a",
        textActive: "#020617",
        textSecondary: "#1e293b",
        textMuted: "#475569",
        textFaint: "#64748b",
        textVeryFaint: "#94a3b8",
        cardBgOpen: "#ffffff",
        cardBgIdle: "rgba(0,0,0,0.015)",
        borderIdle: "rgba(0,0,0,0.08)",
        borderActive: "rgba(0,0,0,0.13)",
        divider: "rgba(0,0,0,0.08)",
        dividerThin: "rgba(0,0,0,0.07)",
        navBg: "#f1f5f9",
        navBorderR: "1px solid rgba(0,0,0,0.08)",
        tocBg: "#ffffff",
        sectionCountBg: "rgba(0,0,0,0.06)",
        statBg: "#ffffff",
        statBorder: "rgba(0,0,0,0.1)",
        heroBorderLeft: "#0284c7",
        heroDesc: "#475569",
        mobileNavBg: "#f1f5f9",
        mobileNavBorder: "rgba(0,0,0,0.1)",
        mobileNavIcon: "#475569",
        scenarioAlertBg: "rgba(220,38,38,0.05)",
        scenarioAlertBorder: "rgba(220,38,38,0.15)",
        problemBoxBg: "rgba(217,119,6,0.06)",
        problemBoxBorder: "rgba(217,119,6,0.2)",
        stepNumBg: "rgba(5,150,105,0.1)",
        stepNumColor: "#059669",
        stepNumBorder: "rgba(5,150,105,0.2)",
        stepText: "#334155",
        footerBorder: "rgba(0,0,0,0.08)",
        progressTrack: "#e2e8f0",
        codeBlockBg: "#1e293b",
        codeBlockBorder: "rgba(255,255,255,0.07)",
        codeBlockHeaderBg: "#0f172a",
        codeBlockHeaderBorder: "rgba(255,255,255,0.08)",
        codeBlockLang: "#94a3b8",
        codeBlockCopyIdle: "rgba(255,255,255,0.08)",
        codeBlockCopyIdleColor: "#94a3b8",
        codeBlockCopyIdleBorder: "rgba(255,255,255,0.12)",
        codeText: "#a8d8b0",
        toggleBg: "rgba(0,0,0,0.06)",
        toggleBorder: "rgba(0,0,0,0.12)",
        toggleColor: "#475569",
      };
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function CodeBlock({
  code,
  language,
  isDark,
}: {
  code: string;
  language: string;
  isDark: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const T = getTheme(isDark);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      className="relative rounded-xl overflow-hidden mt-4"
      style={{
        background: T.codeBlockBg,
        border: `1px solid ${T.codeBlockBorder}`,
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{
          background: T.codeBlockHeaderBg,
          borderBottom: `1px solid ${T.codeBlockHeaderBorder}`,
        }}
      >
        <span
          className="font-mono text-[10px] tracking-[0.12em] uppercase"
          style={{ color: T.codeBlockLang }}
        >
          {language}
        </span>
        <button
          onClick={copy}
          className="font-mono text-[10px] px-2.5 py-1 rounded transition-all"
          style={{
            background: copied ? "rgba(74,222,128,0.15)" : T.codeBlockCopyIdle,
            color: copied ? "#4ade80" : T.codeBlockCopyIdleColor,
            border: `1px solid ${copied ? "rgba(74,222,128,0.3)" : T.codeBlockCopyIdleBorder}`,
          }}
        >
          {copied ? "✓ copied" : "copy"}
        </button>
      </div>
      <pre
        className="p-4 text-[12.5px] leading-[1.7] overflow-x-auto"
        style={{
          color: T.codeText,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          margin: 0,
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function DockerGuide() {
  const [activeSection, setActiveSection] = useState("fundamentals");
  const [scrollPct, setScrollPct] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  const [openQA, setOpenQA] = useState<Set<string>>(new Set());
  const [openScenario, setOpenScenario] = useState<Set<string>>(new Set());
  const [isDark, setIsDark] = useState(true);

  const T = getTheme(isDark);

  // Allow page to scroll normally (parent layout may restrict overflow)
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
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(docH > 0 ? Math.round((scrollTop / docH) * 100) : 0);
      let active = "fundamentals";
      SECTIONS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 130) active = id;
      });
      setActiveSection(active);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleQA = (id: string) => {
    setOpenQA((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleScenario = (id: string) => {
    setOpenScenario((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const qaBySection = (id: string) => QA_DATA.filter((q) => q.category === id);

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        background: T.pageBg,
        color: T.text,
        fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif",
        fontWeight: 400,
        lineHeight: 1.75,
        overflow: "clip",
      }}
    >
      {/* Subtle grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(${T.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${T.gridLine} 1px, transparent 1px)`,
          backgroundSize: "52px 52px",
        }}
      />

      {/* Theme toggle — fixed top-right */}
      <button
        onClick={() => setIsDark((d) => !d)}
        className="fixed top-4 right-5 z-[110] flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 shadow-sm"
        style={{
          background: T.toggleBg,
          border: `1px solid ${T.toggleBorder}`,
          color: T.toggleColor,
          backdropFilter: "blur(8px)",
        }}
        aria-label="Toggle theme"
      >
        <span className="text-sm leading-none">{isDark ? "☀️" : "🌙"}</span>
        <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
      </button>

      {/* Mobile nav button */}
      {!navOpen && (
        <button
          onClick={() => setNavOpen(true)}
          className="fixed bottom-6 right-6 z-[100] lg:hidden w-12 h-12 rounded-full flex items-center justify-center text-base shadow-2xl"
          style={{
            background: T.mobileNavBg,
            border: `1px solid ${T.mobileNavBorder}`,
            color: T.mobileNavIcon,
          }}
          aria-label="Open navigation"
        >
          ☰
        </button>
      )}
      {navOpen && (
        <div
          className="fixed inset-0 z-[98] lg:hidden"
          style={{ background: "rgba(0,0,0,0.55)" }}
          onClick={() => setNavOpen(false)}
        />
      )}

      <div className="flex items-start max-w-[1300px] mx-auto relative z-[1]">
        {/* ── SIDE NAV ─────────────────────────────────────────────────── */}
        <nav
          className={`fixed lg:sticky top-0 lg:top-6 z-[99] lg:z-auto shrink-0 overflow-y-auto max-h-screen lg:max-h-[calc(100vh-48px)] w-[232px] px-4 py-5 transition-transform duration-200 ${
            navOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
          style={{
            background: navOpen ? T.navBg : "transparent",
            borderRight: navOpen ? T.navBorderR : "none",
            scrollbarWidth: "none",
          }}
        >
          <div
            className="mb-4 pb-2.5 font-mono text-[9px] tracking-[0.22em] uppercase"
            style={{
              color: T.textVeryFaint,
              borderBottom: `1px solid ${T.divider}`,
            }}
          >
            // Sections
          </div>
          <ul className="list-none space-y-0.5">
            {SECTIONS.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <li key={sec.id}>
                  <a
                    href={`#${sec.id}`}
                    onClick={() => setNavOpen(false)}
                    className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[12px] transition-all duration-200 no-underline"
                    style={{
                      color: isActive ? T.textActive : T.textFaint,
                      background: isActive
                        ? isDark
                          ? "rgba(255,255,255,0.06)"
                          : "rgba(0,0,0,0.05)"
                        : "transparent",
                      border: `1px solid ${
                        isActive ? T.borderActive : "transparent"
                      }`,
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0 transition-all"
                      style={{
                        background: sec.color,
                        opacity: isActive ? 1 : 0.35,
                        transform: isActive ? "scale(1.4)" : "scale(1)",
                      }}
                    />
                    <span className="flex-1 leading-tight">{sec.label}</span>
                    {sec.id !== "scenarios" && (
                      <span
                        className="font-mono text-[9px] shrink-0 tabular-nums"
                        style={{ color: isActive ? T.textMuted : T.textVeryFaint }}
                      >
                        {qaBySection(sec.id).length}q
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Scroll progress */}
          <div
            className="mt-5 pt-4"
            style={{ borderTop: `1px solid ${T.divider}` }}
          >
            <div
              className="font-mono text-[9px] tracking-[0.15em] uppercase mb-2"
              style={{ color: T.textVeryFaint }}
            >
              // Progress
            </div>
            <div
              className="h-[3px] rounded-full overflow-hidden"
              style={{ background: T.progressTrack }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${scrollPct}%`,
                  background: "linear-gradient(90deg, #38bdf8, #818cf8)",
                }}
              />
            </div>
            <div
              className="font-mono text-[11px] mt-1.5 text-right"
              style={{ color: "#38bdf8" }}
            >
              {scrollPct}%
            </div>
          </div>
        </nav>

        {/* ── MAIN CONTENT ────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0 px-4 lg:px-6">
          <div className="max-w-[900px] mx-auto">
            {/* ── HERO ──────────────────────────────────────────────── */}
            <header className="pt-20 pb-14 relative overflow-hidden">
              <div
                className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[450px] pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(56,189,248,0.07) 0%, transparent 70%)",
                }}
              />
              <div className="relative">
                <p
                  className="font-mono text-[11px] tracking-[0.25em] uppercase mb-5 flex items-center gap-3"
                  style={{ color: "#38bdf8" }}
                >
                  <span
                    className="inline-block w-8 h-px"
                    style={{
                      background:
                        "linear-gradient(90deg, #38bdf8, transparent)",
                    }}
                  />
                  Source of Truth · 35 Questions · 12 Real Scenarios
                </p>
                <h1
                  className="text-4xl lg:text-5xl font-black tracking-tight mb-2"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    color: T.textActive,
                    lineHeight: 1.1,
                  }}
                >
                  The Ultimate
                </h1>
                <h1
                  className="text-4xl lg:text-5xl font-black tracking-tight mb-6"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: 1.1,
                    background:
                      "linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #34d399 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Docker & Containerization Guide
                </h1>
                <p
                  className="text-[15px] max-w-[640px] leading-[1.85] mb-10 pl-5"
                  style={{
                    color: T.heroDesc,
                    borderLeft: `2px solid ${T.heroBorderLeft}`,
                  }}
                >
                  A comprehensive technical reference for DevOps engineers and
                  senior developers. Covers Docker architecture, image
                  optimization, networking, data management, security hardening,
                  Swarm orchestration, and 12 high-friction production
                  troubleshooting scenarios with step-by-step resolutions.
                </p>

                {/* Stats bar */}
                <div className="flex flex-wrap gap-3 mb-14">
                  {[
                    { label: "Q&A Items", value: "35", color: "#38bdf8" },
                    { label: "Scenarios", value: "12", color: "#818cf8" },
                    { label: "Topic Areas", value: "10", color: "#34d399" },
                    { label: "Code Examples", value: "30+", color: "#fbbf24" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="px-4 py-2.5 rounded-xl"
                      style={{
                        background: T.statBg,
                        border: `1px solid ${T.statBorder}`,
                      }}
                    >
                      <div
                        className="text-2xl font-black tabular-nums leading-none mb-0.5"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </div>
                      <div
                        className="font-mono text-[9px] tracking-[0.12em] uppercase"
                        style={{ color: T.textFaint }}
                      >
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </header>

            {/* ── TABLE OF CONTENTS ───────────────────────────────────── */}
            <nav
              id="toc"
              className="rounded-2xl p-6 mb-16"
              style={{
                background: T.tocBg,
                border: `1px solid ${T.borderIdle}`,
              }}
            >
              <div
                className="font-mono text-[10px] tracking-[0.2em] uppercase mb-5 flex items-center gap-2"
                style={{ color: T.textVeryFaint }}
              >
                <span
                  className="inline-block w-4 h-px"
                  style={{ background: T.textVeryFaint }}
                />
                Table of Contents
              </div>
              <div
                className="grid gap-2"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
                }}
              >
                {SECTIONS.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] no-underline transition-all duration-200"
                    style={{
                      color: T.textMuted,
                      border: `1px solid ${T.borderIdle}`,
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = isDark
                        ? "rgba(255,255,255,0.04)"
                        : "rgba(0,0,0,0.04)";
                      el.style.color = T.textActive;
                      el.style.borderColor = sec.color + "55";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = "transparent";
                      el.style.color = T.textMuted;
                      el.style.borderColor = T.borderIdle;
                    }}
                  >
                    <span className="text-base">{sec.icon}</span>
                    <span className="flex-1">{sec.label}</span>
                    {sec.id !== "scenarios" && (
                      <span
                        className="font-mono text-[10px] tabular-nums px-1.5 py-0.5 rounded"
                        style={{
                          background: T.sectionCountBg,
                          color: sec.color,
                        }}
                      >
                        {qaBySection(sec.id).length}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </nav>

            {/* ── Q&A SECTIONS ────────────────────────────────────────── */}
            {SECTIONS.filter((s) => s.id !== "scenarios").map((sec) => {
              const questions = qaBySection(sec.id);
              if (questions.length === 0) return null;
              return (
                <section key={sec.id} id={sec.id} className="mb-20">
                  {/* Section header */}
                  <div
                    className="flex items-center gap-4 mb-8 pb-5"
                    style={{ borderBottom: `1px solid ${T.divider}` }}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{
                        background: sec.glow,
                        border: `1px solid ${sec.border}`,
                      }}
                    >
                      {sec.icon}
                    </div>
                    <div className="flex-1">
                      <h2
                        className="text-xl font-bold tracking-tight"
                        style={{
                          color: T.textActive,
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {sec.label}
                      </h2>
                      <div
                        className="font-mono text-[10px] tracking-[0.12em] uppercase mt-0.5"
                        style={{ color: T.textVeryFaint }}
                      >
                        {questions.length} question
                        {questions.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                    <div
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-[10px] tracking-[0.1em] uppercase"
                      style={{
                        background: sec.glow,
                        color: sec.color,
                        border: `1px solid ${sec.border}`,
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: sec.color }}
                      />
                      Interview Prep
                    </div>
                  </div>

                  {/* Q&A Accordion */}
                  <div className="space-y-3">
                    {questions.map((qa) => {
                      const isOpen = openQA.has(qa.id);
                      return (
                        <div
                          key={qa.id}
                          className="rounded-xl overflow-hidden transition-all duration-200"
                          style={{
                            background: isOpen
                              ? T.cardBgOpen
                              : T.cardBgIdle,
                            border: `1px solid ${isOpen ? sec.border : T.borderIdle}`,
                          }}
                        >
                          <button
                            onClick={() => toggleQA(qa.id)}
                            className="w-full text-left flex items-start gap-4 px-5 py-4 transition-all duration-150"
                            style={{
                              background: "transparent",
                              cursor: "pointer",
                              border: "none",
                            }}
                          >
                            <span
                              className="inline-flex items-center justify-center shrink-0 w-6 h-6 rounded-md font-mono text-[10px] font-bold mt-0.5"
                              style={{
                                background: sec.glow,
                                color: sec.color,
                                border: `1px solid ${sec.border}`,
                                minWidth: "1.5rem",
                              }}
                            >
                              Q
                            </span>
                            <span
                              className="flex-1 text-[14px] font-semibold leading-snug text-left"
                              style={{ color: isOpen ? T.textActive : T.text }}
                            >
                              {qa.question}
                            </span>
                            <span
                              className="shrink-0 transition-transform duration-200 text-lg leading-none mt-0.5"
                              style={{
                                color: sec.color,
                                transform: isOpen
                                  ? "rotate(45deg)"
                                  : "rotate(0deg)",
                              }}
                            >
                              +
                            </span>
                          </button>

                          {isOpen && (
                            <div className="px-5 pb-5">
                              <div
                                className="h-px mb-5"
                                style={{ background: T.dividerThin }}
                              />
                              <p
                                className="text-[14px] leading-[1.9]"
                                style={{ color: T.textSecondary }}
                              >
                                {qa.answer}
                              </p>
                              {qa.code && (
                                <CodeBlock
                                  code={qa.code}
                                  language={qa.codeLanguage ?? "bash"}
                                  isDark={isDark}
                                />
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}

            {/* ── SCENARIOS SECTION ───────────────────────────────────── */}
            <section id="scenarios" className="mb-24">
              {/* Divider */}
              <div
                className="flex items-center gap-4 mb-10"
                style={{ borderBottom: "1px solid rgba(248,113,113,0.25)" }}
              >
                <div
                  className="px-4 py-1.5 rounded-t-xl font-mono text-[10px] tracking-[0.15em] uppercase font-bold"
                  style={{
                    background: "rgba(248,113,113,0.12)",
                    color: "#f87171",
                    border: "1px solid rgba(248,113,113,0.25)",
                    borderBottom: "none",
                  }}
                >
                  🔧 Practical Real-World Scenarios
                </div>
              </div>

              <div
                className="flex items-start gap-4 p-5 rounded-2xl mb-10"
                style={{
                  background: T.scenarioAlertBg,
                  border: `1px solid ${T.scenarioAlertBorder}`,
                }}
              >
                <span className="text-2xl">⚠️</span>
                <div>
                  <div
                    className="font-semibold text-[14px] mb-1"
                    style={{ color: isDark ? "#f87171" : "#dc2626" }}
                  >
                    High-Friction Production Troubleshooting
                  </div>
                  <p
                    className="text-[13px] leading-[1.8]"
                    style={{ color: T.textMuted }}
                  >
                    These 12 scenarios represent the most common, most painful
                    problems engineers face with Docker in production
                    environments. Each includes a realistic problem statement, a
                    root-cause diagnosis, and a complete step-by-step resolution
                    path.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {SCENARIOS.map((scenario, idx) => {
                  const isOpen = openScenario.has(scenario.id);
                  return (
                    <div
                      key={scenario.id}
                      className="rounded-2xl overflow-hidden transition-all duration-200"
                      style={{
                        background: isOpen ? T.cardBgOpen : T.cardBgIdle,
                        border: `1px solid ${
                          isOpen
                            ? "rgba(248,113,113,0.3)"
                            : T.borderIdle
                        }`,
                      }}
                    >
                      <button
                        onClick={() => toggleScenario(scenario.id)}
                        className="w-full text-left flex items-start gap-4 px-5 py-4"
                        style={{
                          background: "transparent",
                          cursor: "pointer",
                          border: "none",
                        }}
                      >
                        <span
                          className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center font-mono text-[11px] font-bold mt-0.5"
                          style={{
                            background: "rgba(248,113,113,0.12)",
                            color: isDark ? "#f87171" : "#dc2626",
                            border: "1px solid rgba(248,113,113,0.25)",
                          }}
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <div className="flex-1">
                          <div
                            className="text-[14px] font-semibold leading-snug text-left mb-1"
                            style={{ color: isOpen ? T.textActive : T.text }}
                          >
                            {scenario.title}
                          </div>
                          {!isOpen && (
                            <div
                              className="text-[12px] leading-relaxed"
                              style={{ color: T.textFaint }}
                            >
                              {scenario.problem.slice(0, 120)}…
                            </div>
                          )}
                        </div>
                        <span
                          className="shrink-0 transition-transform duration-200 text-lg leading-none mt-0.5"
                          style={{
                            color: isDark ? "#f87171" : "#dc2626",
                            transform: isOpen
                              ? "rotate(45deg)"
                              : "rotate(0deg)",
                          }}
                        >
                          +
                        </span>
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-6">
                          <div
                            className="h-px mb-5"
                            style={{ background: T.dividerThin }}
                          />

                          {/* Problem */}
                          <div
                            className="rounded-xl p-4 mb-5"
                            style={{
                              background: T.problemBoxBg,
                              border: `1px solid ${T.problemBoxBorder}`,
                            }}
                          >
                            <div
                              className="font-mono text-[10px] tracking-[0.15em] uppercase mb-2"
                              style={{ color: isDark ? "#fbbf24" : "#d97706" }}
                            >
                              // Problem
                            </div>
                            <p
                              className="text-[13.5px] leading-[1.85]"
                              style={{ color: T.textSecondary }}
                            >
                              {scenario.problem}
                            </p>
                          </div>

                          {/* Steps */}
                          <div
                            className="font-mono text-[10px] tracking-[0.15em] uppercase mb-3"
                            style={{ color: T.stepNumColor }}
                          >
                            // Step-by-Step Resolution
                          </div>
                          <ol className="space-y-2.5 mb-4">
                            {scenario.steps.map((step, si) => (
                              <li key={si} className="flex gap-3.5 items-start">
                                <span
                                  className="shrink-0 w-5 h-5 rounded flex items-center justify-center font-mono text-[10px] font-bold mt-0.5"
                                  style={{
                                    background: T.stepNumBg,
                                    color: T.stepNumColor,
                                    border: `1px solid ${T.stepNumBorder}`,
                                  }}
                                >
                                  {si + 1}
                                </span>
                                <span
                                  className="text-[13.5px] leading-[1.85]"
                                  style={{ color: T.stepText }}
                                >
                                  {step}
                                </span>
                              </li>
                            ))}
                          </ol>

                          {scenario.code && (
                            <CodeBlock
                              code={scenario.code}
                              language={scenario.codeLanguage ?? "bash"}
                              isDark={isDark}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ── FOOTER ──────────────────────────────────────────────── */}
            <footer
              className="py-10 text-center border-t"
              style={{ borderColor: T.footerBorder }}
            >
              <p
                className="font-mono text-[11px] tracking-[0.15em] uppercase"
                style={{ color: T.textVeryFaint }}
              >
                // Docker &amp; Containerization Guide · 35 Q&amp;A · 12
                Scenarios · Source of Truth
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
