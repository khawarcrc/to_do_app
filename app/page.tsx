"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import ThemeToggle from "@/components/ThemeToggle";

/* ── Helper: get first part of email before @ ── */
function getDisplayName(email: string) {
  return email.split("@")[0];
}

/* ── Feature card data ── */
const FEATURES = [
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
        />
      </svg>
    ),
    color: "#0c66e4",
    bg: "rgba(12,102,228,0.08)",
    label: "Kanban + List + Calendar",
    text: "Three powerful views to manage your workflow. Drag, sort, and filter with ease.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    label: "Priority & Due Dates",
    text: "Four priority levels, due date tracking, time estimates and actual time logging.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
        />
      </svg>
    ),
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    label: "Tags & Subtasks",
    text: "Organize with custom tags and break work into manageable subtasks.",
  },
];

// ── Nav dropdown data ─────────────────────────────────────────────────────────
const STATIC_LINKS: { label: string; href: string; description: string }[] = [
  {
    label: "Frontend Interview Guide",
    href: "/static/frontend-interview-guide",
    description: "30 Q&A — React, Next.js & Web Fundamentals",
  },
  {
    label: "Advanced React & Next.js",
    href: "/static/advanced-react-nextjs-interview",
    description: "20 Advanced Q&A — Internals, Architecture & System Design",
  },
  {
    label: "Backend Interview Guide",
    href: "/static/backend-interview-guide",
    description: "30 Q&A — APIs, Databases, Auth, Architecture & Security",
  },
];

const DYNAMIC_LINKS = [
  {
    label: "Task Manager",
    href: "/app",
    description: "Kanban, list & calendar views",
    color: "#0c66e4",
    bg: "rgba(12,102,228,0.08)",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
  },
  {
    label: "Quotes & Insights",
    href: "/quotes",
    description: "Daily wisdom, life lessons",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    ),
  },
  {
    label: "BackLog",
    href: "/backlog",
    description: "Quick tasks, drag to reorder",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 10h16M4 14h16M4 18h16"
        />
      </svg>
    ),
  },
];

// ── Dropdown component ────────────────────────────────────────────────────────
interface DropdownProps {
  label: string;
  badge?: string;
  children: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}
function NavDropdown({
  label,
  badge,
  children,
  open,
  onToggle,
  onClose,
}: DropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      // Only close if the click is genuinely outside this dropdown
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    // Use 'mousedown' but guard with contains() so inside-clicks are never intercepted
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open, onClose]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={onToggle}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          padding: "6px 12px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: open ? "var(--bg-hover)" : "transparent",
          color: open ? "var(--text-primary)" : "var(--text-secondary)",
          fontSize: "13.5px",
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 0.15s",
          whiteSpace: "nowrap",
        }}
      >
        {label}
        {badge && (
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              padding: "1px 6px",
              borderRadius: "100px",
              backgroundColor: "var(--accent-subtle)",
              color: "var(--accent)",
            }}
          >
            {badge}
          </span>
        )}
        <svg
          style={{
            width: "12px",
            height: "12px",
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            minWidth: "220px",
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            borderRadius: "12px",
            boxShadow: "var(--shadow-lg)",
            overflow: "hidden",
            zIndex: 100,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default function LandingPage() {
  const { user, logout, setUser, setInitialising } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [staticOpen, setStaticOpen] = useState(false);
  const [dynamicOpen, setDynamicOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* ── Auth init ──────────────────────────────────────────── */
  useEffect(() => {
    setMounted(true);
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.email)
          setUser({
            email: data.email,
            sid: data.sid ?? "",
            createdAt: data.createdAt,
          });
      })
      .finally(() => setInitialising(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayName = user?.email ? getDisplayName(user.email) : "";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflowY: "auto",
        backgroundColor: "var(--bg-base)",
        color: "var(--text-primary)",
      }}
    >
      {/* ── Subtle grid background ───────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          opacity: 0.4,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Radial glow ─────────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80vw",
          height: "60vh",
          background:
            "radial-gradient(ellipse at center, rgba(12,102,228,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Content wrapper ─────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ── NAV ─────────────────────────────────────────────── */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 clamp(1rem, 4vw, 3rem)",
            height: "64px",
            borderBottom: "1px solid var(--border-subtle)",
            backdropFilter: "blur(12px)",
            backgroundColor: "var(--bg-base)",
            position: "sticky",
            top: 0,
            zIndex: 50,
            gap: "16px",
          }}
        >
          {/* ── Logo ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span
              style={{
                fontWeight: 700,
                fontSize: "1rem",
                letterSpacing: "-0.01em",
              }}
            >
              TodoFlow
            </span>
          </div>

          {/* ── Desktop nav items (hidden on mobile) ── */}
          <div
            className="hidden sm:flex"
            style={{ alignItems: "center", gap: "4px", flex: 1 }}
          >
            {/* Static dropdown */}
            <NavDropdown
              label="Static"
              open={staticOpen}
              onToggle={() => {
                setStaticOpen((p) => !p);
                setDynamicOpen(false);
              }}
              onClose={() => setStaticOpen(false)}
            >
              {STATIC_LINKS.length === 0 ? (
                <div style={{ padding: "20px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: "22px", marginBottom: "6px" }}>
                    🚧
                  </div>
                  <div
                    style={{
                      fontSize: "12.5px",
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                      marginBottom: "2px",
                    }}
                  >
                    Coming soon
                  </div>
                  <div
                    style={{ fontSize: "11.5px", color: "var(--text-muted)" }}
                  >
                    Static pages will appear here.
                  </div>
                </div>
              ) : (
                STATIC_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setStaticOpen(false)}
                    style={{
                      display: "block",
                      padding: "10px 14px",
                      textDecoration: "none",
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "13.5px",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        marginTop: "2px",
                      }}
                    >
                      {item.description}
                    </div>
                  </Link>
                ))
              )}
            </NavDropdown>

            {/* Dynamic dropdown */}
            <NavDropdown
              label="Dynamic"
              badge={`${DYNAMIC_LINKS.length}`}
              open={dynamicOpen}
              onToggle={() => {
                setDynamicOpen((p) => !p);
                setStaticOpen(false);
              }}
              onClose={() => setDynamicOpen(false)}
            >
              <div style={{ padding: "6px" }}>
                {DYNAMIC_LINKS.map((item, i) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDynamicOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      padding: "10px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      transition: "background 0.13s",
                      marginBottom: i < DYNAMIC_LINKS.length - 1 ? "2px" : 0,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--bg-hover)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        backgroundColor: item.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: item.color,
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "13.5px",
                          fontWeight: 600,
                          color: "var(--text-primary)",
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--text-muted)",
                          marginTop: "2px",
                        }}
                      >
                        {item.description}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </NavDropdown>
          </div>

          {/* ── Right side: desktop ── */}
          <div
            className="hidden sm:flex"
            style={{ alignItems: "center", gap: "10px", flexShrink: 0 }}
          >
            <ThemeToggle />
            {mounted && user?.email ? (
              <>
                <Link
                  href="/profile"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 10px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-default)",
                    backgroundColor: "var(--bg-surface)",
                    color: "var(--text-secondary)",
                    fontSize: "13px",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      background: "var(--accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  {displayName}
                </Link>
                <button
                  onClick={() => void logout()}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-default)",
                    backgroundColor: "transparent",
                    color: "var(--text-muted)",
                    fontSize: "13px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Sign out
                </button>
              </>
            ) : mounted ? (
              <Link
                href="/login"
                style={{
                  padding: "6px 16px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-default)",
                  backgroundColor: "var(--accent)",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 500,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Sign in
              </Link>
            ) : null}
          </div>

          {/* ── Right side: mobile — theme + hamburger only ── */}
          <div
            className="flex sm:hidden"
            style={{ alignItems: "center", gap: "8px", flexShrink: 0 }}
          >
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen((p) => !p)}
              aria-label="Toggle menu"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                border: "1px solid var(--border-default)",
                backgroundColor: mobileMenuOpen
                  ? "var(--bg-hover)"
                  : "transparent",
                color: "var(--text-secondary)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {mobileMenuOpen ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* ── Mobile slide-down menu ───────────────────────────── */}
        {mobileMenuOpen && (
          <div
            className="sm:hidden"
            style={{
              position: "sticky",
              top: "64px",
              zIndex: 49,
              backgroundColor: "var(--bg-surface)",
              borderBottom: "1px solid var(--border-default)",
              boxShadow: "var(--shadow-md)",
              padding: "12px 16px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            {/* Section label: Static */}
            <div
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                padding: "6px 8px 4px",
              }}
            >
              Static
            </div>
            {STATIC_LINKS.length === 0 ? (
              <div
                style={{
                  padding: "8px",
                  fontSize: "12.5px",
                  color: "var(--text-muted)",
                  fontStyle: "italic",
                }}
              >
                Coming soon — static pages
              </div>
            ) : (
              STATIC_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: "block",
                    padding: "10px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    color: "var(--text-primary)",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </Link>
              ))
            )}

            {/* Divider */}
            <div
              style={{
                height: "1px",
                backgroundColor: "var(--border-subtle)",
                margin: "6px 0",
              }}
            />

            {/* Section label: Dynamic */}
            <div
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                padding: "2px 8px 4px",
              }}
            >
              Dynamic
            </div>
            {DYNAMIC_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px",
                  borderRadius: "8px",
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    backgroundColor: item.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: item.color,
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                    }}
                  >
                    {item.label}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {item.description}
                  </div>
                </div>
              </Link>
            ))}

            {/* Divider */}
            <div
              style={{
                height: "1px",
                backgroundColor: "var(--border-subtle)",
                margin: "6px 0",
              }}
            />

            {/* Profile + Sign out */}
            {mounted && user?.email ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px",
                    borderRadius: "8px",
                    textDecoration: "none",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "var(--accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                      }}
                    >
                      Profile
                    </div>
                    <div
                      style={{ fontSize: "12px", color: "var(--text-muted)" }}
                    >
                      {user.email}
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    void logout();
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      backgroundColor: "rgba(239,68,68,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg
                      className="w-4 h-4"
                      style={{ color: "#ef4444" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#ef4444",
                    }}
                  >
                    Sign out
                  </div>
                </button>
              </>
            ) : mounted ? (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  backgroundColor: "var(--accent)",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}
                >
                  Sign in
                </div>
              </Link>
            ) : null}
          </div>
        )}

        {/* ── HERO ────────────────────────────────────────────── */}
        <section
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding:
              "clamp(4rem, 10vw, 8rem) clamp(1.5rem, 5vw, 4rem) clamp(2rem, 6vw, 4rem)",
            textAlign: "center",
          }}
        >
          {/* Greeting badge */}
          {mounted && user?.email && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 14px",
                borderRadius: "100px",
                backgroundColor: "var(--accent-subtle)",
                color: "var(--accent)",
                fontSize: "13px",
                fontWeight: 500,
                marginBottom: "1.5rem",
                border: "1px solid var(--border-default)",
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  backgroundColor: "var(--accent)",
                  display: "inline-block",
                }}
              />
              Welcome back, {displayName}
            </div>
          )}

          {/* Main heading */}
          <h1
            style={{
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
              margin: "0 0 1.25rem",
              color: "var(--text-primary)",
            }}
          >
            Your personal
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, var(--accent) 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              productivity hub
            </span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              color: "var(--text-muted)",
              maxWidth: "560px",
              margin: "0 auto 3rem",
              lineHeight: 1.6,
            }}
          >
            Manage tasks, capture insights, and build the habit of intentional
            daily progress.
          </p>

          {/* CTA buttons */}
          <div
            style={{
              display: "flex",
              gap: "14px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/app"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "13px 28px",
                borderRadius: "10px",
                backgroundColor: "var(--accent)",
                color: "#fff",
                fontSize: "15px",
                fontWeight: 600,
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(12,102,228,0.3)",
                letterSpacing: "-0.01em",
              }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.2}
                  d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                />
              </svg>
              Open Task Manager
            </Link>
            <Link
              href="/quotes"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "13px 28px",
                borderRadius: "10px",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-primary)",
                fontSize: "15px",
                fontWeight: 600,
                textDecoration: "none",
                border: "1px solid var(--border-default)",
                boxShadow: "var(--shadow-sm)",
                letterSpacing: "-0.01em",
              }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              Go to Quotes
            </Link>
          </div>
        </section>

        {/* ── APP CARDS ────────────────────────────────────────── */}
        <section
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "0 clamp(1.5rem, 5vw, 4rem) clamp(2rem, 5vw, 4rem)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {/* Task Manager card */}
            <Link href="/app" style={{ textDecoration: "none" }}>
              <div
                style={{
                  padding: "28px",
                  borderRadius: "16px",
                  border: "1px solid var(--border-default)",
                  backgroundColor: "var(--bg-surface)",
                  boxShadow: "var(--shadow-sm)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  height: "100%",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "translateY(-2px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "var(--shadow-md)";
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "var(--shadow-sm)";
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "var(--border-default)";
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: "rgba(12,102,228,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                    color: "#0c66e4",
                  }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <h3
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    margin: "0 0 8px",
                    color: "var(--text-primary)",
                  }}
                >
                  Task Manager
                </h3>
                <p
                  style={{
                    fontSize: "13.5px",
                    color: "var(--text-muted)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  Kanban board, list view and calendar. Full CRUD, priorities,
                  tags, subtasks and time tracking.
                </p>
                <div
                  style={{
                    marginTop: "20px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#0c66e4",
                  }}
                >
                  Open App
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Quotes card */}
            <Link href="/quotes" style={{ textDecoration: "none" }}>
              <div
                style={{
                  padding: "28px",
                  borderRadius: "16px",
                  border: "1px solid var(--border-default)",
                  backgroundColor: "var(--bg-surface)",
                  boxShadow: "var(--shadow-sm)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  height: "100%",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "translateY(-2px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "var(--shadow-md)";
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "#8b5cf6";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "var(--shadow-sm)";
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "var(--border-default)";
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: "rgba(139,92,246,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                    color: "#8b5cf6",
                  }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h3
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    margin: "0 0 8px",
                    color: "var(--text-primary)",
                  }}
                >
                  Quotes &amp; Insights
                </h3>
                <p
                  style={{
                    fontSize: "13.5px",
                    color: "var(--text-muted)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  Capture daily quotes, life lessons and things to remember.
                  Three columns to keep wisdom organized.
                </p>
                <div
                  style={{
                    marginTop: "20px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#8b5cf6",
                  }}
                >
                  Open Quotes
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────────────── */}
        <section
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding:
              "clamp(1rem, 3vw, 2rem) clamp(1.5rem, 5vw, 4rem) clamp(3rem, 8vw, 6rem)",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: "1.25rem",
            }}
          >
            Included in Task Manager
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px",
            }}
          >
            {FEATURES.map((f) => (
              <div
                key={f.label}
                style={{
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: "var(--bg-subtle)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    backgroundColor: f.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: f.color,
                    flexShrink: 0,
                  }}
                >
                  {f.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "13.5px",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      marginBottom: "4px",
                    }}
                  >
                    {f.label}
                  </div>
                  <div
                    style={{
                      fontSize: "12.5px",
                      color: "var(--text-muted)",
                      lineHeight: 1.5,
                    }}
                  >
                    {f.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FOOTER ──────────────────────────────────────────── */}
        <footer
          style={{
            borderTop: "1px solid var(--border-subtle)",
            padding: "20px clamp(1.5rem, 5vw, 4rem)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} TodoFlow. Built with Next.js &amp;
            MongoDB Atlas.
          </span>
          <div style={{ display: "flex", gap: "16px" }}>
            <Link
              href="/app"
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                textDecoration: "none",
              }}
            >
              Task Manager
            </Link>
            <Link
              href="/quotes"
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                textDecoration: "none",
              }}
            >
              Quotes
            </Link>
            <Link
              href="/profile"
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                textDecoration: "none",
              }}
            >
              Profile
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
