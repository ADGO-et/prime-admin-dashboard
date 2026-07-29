import { useEffect, useState, useCallback } from "react";
import { applicationsApi } from "../api/applications-api";
import { createPortal } from "react-dom";

export function DocumentViewer({ label, filename }: { label: string; filename: string | null }) {
  const [zoom, setZoom] = useState(100);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!filename);
  const [error, setError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalZoom, setModalZoom] = useState(100);

  useEffect(() => {
    if (!filename) {
      setObjectUrl(null);
      return;
    }

    let active = true;
    let blobUrl: string | null = null;
    setLoading(true);
    setError(false);

    applicationsApi
      .fetchDocumentBlob(filename)
      .then((blob) => {
        if (!active) return;
        blobUrl = URL.createObjectURL(blob);
        setObjectUrl(blobUrl);
      })
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [filename]);

  useEffect(() => {
    if (!modalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen]);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  const handleDownload = useCallback(() => {
    if (!objectUrl || !filename) return;
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [objectUrl, filename]);

  const openModal = () => {
    setModalZoom(100);
    setModalOpen(true);
  };

  if (!filename) {
    return (
      <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center text-slate-400 text-xs">
        {label}: Not uploaded
      </div>
    );
  }

  if (loading) {
    return (
      <div className="border border-slate-200 rounded-xl p-6 text-center text-slate-400 text-xs animate-pulse">
        Loading {label}...
      </div>
    );
  }

  if (error || !objectUrl) {
    return (
      <div className="border border-red-200 rounded-xl p-6 text-center text-red-500 text-xs">
        {label}: Failed to load (auth required)
      </div>
    );
  }

  const isPdf = filename.toLowerCase().endsWith(".pdf");

  return (
    <>
      {/* Compact inline card — just label + action buttons */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white/80">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 rounded-lg bg-brand-dark/5 flex items-center justify-center text-sm shrink-0">
              {isPdf ? "📑" : "🖼️"}
            </span>
            <span className="text-xs font-bold text-slate-700 truncate">{label}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={openModal}
              className="px-3 py-1.5 text-xs font-bold text-brand-dark bg-brand-dark/5 hover:bg-brand-dark/10 rounded-lg transition-colors"
            >
              View
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
            >
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Full-page overlay — portaled to body, covers everything including sidebar */}
      {modalOpen &&
        createPortal(
          <FullPageDocumentOverlay
            label={label}
            filename={filename}
            objectUrl={objectUrl}
            isPdf={isPdf}
            zoom={modalZoom}
            onZoomChange={setModalZoom}
            onClose={() => setModalOpen(false)}
            onDownload={handleDownload}
          />,
          document.body
        )}
    </>
  );
}

/* ─── Full-page overlay ─── */

function FullPageDocumentOverlay({
  label,
  filename,
  objectUrl,
  isPdf,
  zoom,
  onZoomChange,
  onClose,
  onDownload,
}: {
  label: string;
  filename: string;
  objectUrl: string;
  isPdf: boolean;
  zoom: number;
  onZoomChange: (z: number) => void;
  onClose: () => void;
  onDownload: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(160deg, #f8fafc 0%, #eef2ff 45%, #f1f5f9 100%)",
        animation: "docFadeIn 0.2s ease-out",
      }}
    >
      <style>{`
        @keyframes docFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* Top bar — matches the app's glass topbar style */}
      <div
        style={{
          height: 64,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(226,232,240,0.8)",
          boxShadow: "0 1px 8px rgba(1,1,111,0.04)",
          flexShrink: 0,
        }}
      >
        {/* Left: back + doc info */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: 10,
              border: "1px solid #e2e8f0",
              background: "white",
              color: "#01016f",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "white"; }}
          >
            ← Back
          </button>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#01016f", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {label}
            </div>
            <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {filename}
            </div>
          </div>
        </div>

        {/* Right: zoom + download */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {!isPdf && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                border: "1px solid #e2e8f0",
                borderRadius: 10,
                padding: "4px 6px",
                background: "white",
              }}
            >
              <button
                type="button"
                onClick={() => onZoomChange(Math.max(25, zoom - 25))}
                style={{
                  width: 30, height: 28, borderRadius: 6,
                  border: "none", background: "transparent",
                  color: "#334155", fontSize: 16, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                −
              </button>
              <span style={{ fontSize: 12, color: "#64748b", width: 44, textAlign: "center", fontWeight: 600 }}>
                {zoom}%
              </span>
              <button
                type="button"
                onClick={() => onZoomChange(Math.min(400, zoom + 25))}
                style={{
                  width: 30, height: 28, borderRadius: 6,
                  border: "none", background: "transparent",
                  color: "#334155", fontSize: 16, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                +
              </button>
              <button
                type="button"
                onClick={() => onZoomChange(100)}
                style={{
                  height: 28, borderRadius: 6, padding: "0 8px",
                  border: "none", background: "transparent",
                  color: "#94a3b8", fontSize: 11, cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Reset
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onDownload}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 18px", borderRadius: 10,
              border: "none",
              background: "#059669",
              color: "white", fontSize: 13, fontWeight: 700,
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#10b981"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#059669"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download
          </button>
        </div>
      </div>

      {/* Document content area — fills the whole remaining space */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          alignItems: isPdf ? "stretch" : "center",
          justifyContent: "center",
          padding: isPdf ? 0 : 32,
        }}
      >
        {isPdf ? (
          <iframe
            src={objectUrl}
            title={label}
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        ) : (
          <img
            src={objectUrl}
            alt={label}
            draggable={false}
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: "center",
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              borderRadius: 16,
              boxShadow: "0 4px 24px rgba(1,1,111,0.08), 0 1px 3px rgba(1,1,111,0.05)",
              border: "1px solid rgba(226,232,240,0.9)",
              transition: "transform 0.2s ease",
              userSelect: "none",
            }}
          />
        )}
      </div>
    </div>
  );
}
