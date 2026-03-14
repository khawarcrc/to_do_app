'use client';

import { useEffect, useState, useCallback } from 'react';
import { Quote, QuoteFormData, QuoteCategory, QUOTE_CATEGORY_CONFIG } from '@/types';
import MainNav from '@/components/MainNav';

// ── Quote Modal ───────────────────────────────────────────────────────────────

interface ModalProps {
  quote: Quote | null;
  defaultCategory?: QuoteCategory;
  onClose: () => void;
  onSave: (data: QuoteFormData) => Promise<void>;
}

const CATEGORIES: QuoteCategory[] = ['daily', 'life-lessons', 'remember'];

function QuoteModal({ quote, defaultCategory = 'daily', onClose, onSave }: ModalProps) {
  const [content, setContent] = useState(quote?.content ?? '');
  const [author, setAuthor] = useState(quote?.author ?? '');
  const [source, setSource] = useState(quote?.source ?? '');
  const [category, setCategory] = useState<QuoteCategory>(quote?.category ?? defaultCategory);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) { setError('Quote content is required'); return; }
    setSaving(true);
    setError('');
    try {
      await onSave({
        content: content.trim(),
        author: author.trim() || undefined,
        source: source.trim() || undefined,
        category,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
      setSaving(false);
    }
  }

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const cfg = QUOTE_CATEGORY_CONFIG[category];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 200,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-xl)',
          width: '100%',
          maxWidth: '520px',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {quote ? 'Edit Quote' : 'Add Quote'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '4px',
              display: 'flex',
              borderRadius: '6px',
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {error && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  color: '#ef4444',
                  fontSize: '13px',
                }}
              >
                {error}
              </div>
            )}

            {/* Category */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Category
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {CATEGORIES.map((cat) => {
                  const c = QUOTE_CATEGORY_CONFIG[cat];
                  const active = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '100px',
                        fontSize: '12.5px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        border: `1px solid ${active ? c.color : 'var(--border-default)'}`,
                        backgroundColor: active ? c.bgColor : 'transparent',
                        color: active ? c.color : 'var(--text-muted)',
                        transition: 'all 0.15s',
                      }}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Quote / Insight *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter a quote, insight, or life lesson…"
                rows={4}
                autoFocus
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${content ? cfg.color + '66' : 'var(--border-default)'}`,
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'border-color 0.15s',
                }}
              />
            </div>

            {/* Author */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Author
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Marcus Aurelius"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-default)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13.5px',
                    fontFamily: 'inherit',
                    outline: 'none',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Source
                </label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g. Meditations, p.42"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-default)',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '13.5px',
                    fontFamily: 'inherit',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: '1px solid var(--border-default)',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                fontSize: '13.5px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !content.trim()}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: saving || !content.trim() ? 'var(--border-strong)' : 'var(--accent)',
                color: '#fff',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: saving || !content.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {saving ? 'Saving…' : quote ? 'Save Changes' : 'Add Quote'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Quote Card ────────────────────────────────────────────────────────────────

interface CardProps {
  quote: Quote;
  onEdit: (q: Quote) => void;
  onDelete: (id: string) => void;
}

function QuoteCard({ quote, onEdit, onDelete }: CardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const cfg = QUOTE_CATEGORY_CONFIG[quote.category];

  return (
    <div
      style={{
        padding: '16px',
        borderRadius: '12px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'box-shadow 0.2s, border-color 0.2s',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-md)';
        (e.currentTarget as HTMLDivElement).style.borderColor = cfg.borderColor;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-sm)';
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-default)';
      }}
    >
      {/* Quote mark */}
      <div
        style={{
          fontSize: '32px',
          lineHeight: 1,
          color: cfg.color,
          opacity: 0.3,
          fontFamily: 'Georgia, serif',
          marginBottom: '-6px',
          userSelect: 'none',
        }}
      >
        &ldquo;
      </div>

      {/* Content */}
      <p
        style={{
          margin: 0,
          fontSize: '14px',
          lineHeight: 1.65,
          color: 'var(--text-primary)',
          wordBreak: 'break-word',
        }}
      >
        {quote.content}
      </p>

      {/* Attribution */}
      {(quote.author || quote.source) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {quote.author && (
            <span style={{ fontSize: '12px', fontWeight: 600, color: cfg.color }}>
              — {quote.author}
            </span>
          )}
          {quote.source && (
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              {quote.source}
            </span>
          )}
        </div>
      )}

      {/* Footer row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '4px',
          paddingTop: '10px',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {new Date(quote.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>

        {/* Actions */}
        {confirmDelete ? (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Delete?</span>
            <button
              onClick={() => onDelete(quote.id)}
              style={{
                padding: '3px 10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#ef4444',
                color: '#fff',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Yes
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              style={{
                padding: '3px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border-default)',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                fontSize: '11.5px',
                cursor: 'pointer',
              }}
            >
              No
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => onEdit(quote)}
              title="Edit"
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid var(--border-default)',
                backgroundColor: 'transparent',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11.5px',
              }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              title="Delete"
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid var(--border-default)',
                backgroundColor: 'transparent',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11.5px',
              }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Column ────────────────────────────────────────────────────────────────────

interface ColumnProps {
  category: QuoteCategory;
  quotes: Quote[];
  onAdd: (cat: QuoteCategory) => void;
  onEdit: (q: Quote) => void;
  onDelete: (id: string) => void;
}

function QuoteColumn({ category, quotes, onAdd, onEdit, onDelete }: ColumnProps) {
  const cfg = QUOTE_CATEGORY_CONFIG[category];

  return (
    <div
      style={{
        flex: '1 1 0',
        minWidth: '260px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
        backgroundColor: 'var(--bg-subtle)',
        borderRadius: '14px',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
      }}
    >
      {/* Column header */}
      <div
        style={{
          padding: '14px 16px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `2px solid ${cfg.color}22`,
          backgroundColor: cfg.bgColor,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: cfg.color,
                flexShrink: 0,
              }}
            />
            <span style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--text-primary)' }}>
              {cfg.label}
            </span>
            <span
              style={{
                padding: '1px 8px',
                borderRadius: '100px',
                backgroundColor: cfg.bgColor,
                color: cfg.color,
                fontSize: '11px',
                fontWeight: 700,
                border: `1px solid ${cfg.borderColor}`,
              }}
            >
              {quotes.length}
            </span>
          </div>
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', paddingLeft: '18px' }}>
            {cfg.description}
          </span>
        </div>
        <button
          onClick={() => onAdd(category)}
          title={`Add to ${cfg.label}`}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            border: `1px solid ${cfg.borderColor}`,
            backgroundColor: cfg.bgColor,
            color: cfg.color,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontWeight: 700,
            fontSize: '18px',
            lineHeight: 1,
          }}
        >
          +
        </button>
      </div>

      {/* Cards */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {quotes.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '2.5rem 1rem',
              color: 'var(--text-muted)',
              fontSize: '13px',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: cfg.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                fontSize: '20px',
                color: cfg.color,
                opacity: 0.6,
              }}
            >
              &ldquo;
            </div>
            <p style={{ margin: 0 }}>No quotes yet.<br />Click <strong>+</strong> to add one.</p>
          </div>
        ) : (
          quotes.map((q) => (
            <QuoteCard key={q.id} quote={q} onEdit={onEdit} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [defaultCat, setDefaultCat] = useState<QuoteCategory>('daily');

  /* ── Fetch quotes ───────────────────────────────────────── */
  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/quotes');
      if (res.ok) {
        const data = await res.json() as { quotes: Quote[] };
        setQuotes(data.quotes);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchQuotes(); }, [fetchQuotes]);

  /* ── CRUD handlers ──────────────────────────────────────── */
  async function handleSave(data: QuoteFormData) {
    if (editingQuote) {
      const res = await fetch(`/api/quotes/${editingQuote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json() as { error: string };
        throw new Error(err.error ?? 'Failed to update');
      }
      const { quote } = await res.json() as { quote: Quote };
      setQuotes((prev) => prev.map((q) => (q.id === quote.id ? quote : q)));
    } else {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json() as { error: string };
        throw new Error(err.error ?? 'Failed to create');
      }
      const { quote } = await res.json() as { quote: Quote };
      setQuotes((prev) => [quote, ...prev]);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/quotes/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setQuotes((prev) => prev.filter((q) => q.id !== id));
    }
  }

  function openAdd(cat: QuoteCategory) {
    setEditingQuote(null);
    setDefaultCat(cat);
    setModalOpen(true);
  }

  function openEdit(q: Quote) {
    setEditingQuote(q);
    setDefaultCat(q.category);
    setModalOpen(true);
  }

  const byCategory = (cat: QuoteCategory) => quotes.filter((q) => q.category === cat);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-base)',
        color: 'var(--text-primary)',
      }}
    >
      {/* ── Nav ─────────────────────────────────────────────── */}
      <MainNav />

      {/* ── Sub-header ──────────────────────────────────────── */}
      <div
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          height: '44px',
          borderBottom: '1px solid var(--border-default)',
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: 'rgba(139,92,246,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8b5cf6',
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: '15px' }}>Quotes &amp; Insights</span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {loading ? '…' : `${quotes.length} entries`}
          </span>
        </div>
        <button
          onClick={() => openAdd('daily')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'var(--accent)',
            color: '#fff',
            fontSize: '13.5px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(12,102,228,0.25)',
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 4v16m8-8H4" />
          </svg>
          Add Quote
        </button>
      </div>

      {/* ── Board ────────────────────────────────────────────── */}
      {loading ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            gap: '10px',
            fontSize: '14px',
          }}
        >
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading quotes…
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            overflowX: 'auto',
            overflowY: 'hidden',
            padding: '20px',
            display: 'flex',
            gap: '16px',
            alignItems: 'stretch',
          }}
        >
          {CATEGORIES.map((cat) => (
            <QuoteColumn
              key={cat}
              category={cat}
              quotes={byCategory(cat)}
              onAdd={openAdd}
              onEdit={openEdit}
              onDelete={(id) => void handleDelete(id)}
            />
          ))}
        </div>
      )}

      {/* ── Modal ────────────────────────────────────────────── */}
      {modalOpen && (
        <QuoteModal
          quote={editingQuote}
          defaultCategory={defaultCat}
          onClose={() => { setModalOpen(false); setEditingQuote(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
