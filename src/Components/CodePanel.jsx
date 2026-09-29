import { useState } from "react";
import { FileCode, Cpu, Copy, Check, Download, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { exportToWokwiDiagram, getWokwiSimulationUrl } from "../utils/wokwiExporter";

/**
 * Lightweight syntax highlighter for Arduino C++ code without external dependencies.
 * Safely parses tokens: comments, preprocessors, keywords, built-ins, strings, and numbers.
 */
function highlightCpp(code) {
  if (!code) return [];

  const lines = code.split("\n");

  return lines.map((line, index) => {
    if (line.trim().startsWith("//")) {
      return (
        <span key={index} className="code-line">
          <span className="token-comment">{line}</span>
        </span>
      );
    }

    const tokens = [];
    let remaining = line;
    let keyIdx = 0;

    let inlineComment = "";
    const commentMatch = remaining.match(/(\/\/.*)$/);
    if (commentMatch) {
      inlineComment = commentMatch[1];
      remaining = remaining.substring(0, commentMatch.index);
    }

    const tokenRegex =
      /(#define|#include\s+<[^>]+>|#include\s+"[^"]+"|"(?:[^"\\]|\\.)*"|\b(?:void|int|bool|float|char|const|unsigned|long|uint8_t|if|else|while|for|return)\b|\b(?:pinMode|digitalWrite|digitalRead|delay|Serial|begin|println|print|setup|loop|OUTPUT|INPUT|INPUT_PULLUP|HIGH|LOW)\b|\b\d+\b)/g;

    let lastIndex = 0;
    let match;

    while ((match = tokenRegex.exec(remaining)) !== null) {
      if (match.index > lastIndex) {
        tokens.push(
          <span key={`${index}-${keyIdx++}`}>
            {remaining.substring(lastIndex, match.index)}
          </span>
        );
      }

      const matchText = match[0];

      if (matchText.startsWith("#")) {
        tokens.push(
          <span key={`${index}-${keyIdx++}`} className="token-preprocessor">
            {matchText}
          </span>
        );
      } else if (matchText.startsWith('"')) {
        tokens.push(
          <span key={`${index}-${keyIdx++}`} className="token-string">
            {matchText}
          </span>
        );
      } else if (/^\d+$/.test(matchText)) {
        tokens.push(
          <span key={`${index}-${keyIdx++}`} className="token-number">
            {matchText}
          </span>
        );
      } else if (
        /^(void|int|bool|float|char|const|unsigned|long|uint8_t|if|else|while|for|return)$/.test(
          matchText
        )
      ) {
        tokens.push(
          <span key={`${index}-${keyIdx++}`} className="token-keyword">
            {matchText}
          </span>
        );
      } else {
        tokens.push(
          <span key={`${index}-${keyIdx++}`} className="token-builtin">
            {matchText}
          </span>
        );
      }

      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < remaining.length) {
      tokens.push(
        <span key={`${index}-${keyIdx}`}>
          {remaining.substring(lastIndex)}
        </span>
      );
    }

    if (inlineComment) {
      tokens.push(
        <span key={`${index}-comment`} className="token-comment">
          {inlineComment}
        </span>
      );
    }

    return (
      <span key={index} className="code-line">
        {tokens}
      </span>
    );
  });
}

function CodePanel({
  code,
  boardModel = "ESP32 DevKit V1",
  circuit = null,
  isLoading = false,
  error = null,
}) {
  const [copied, setCopied] = useState(false);
  const [copiedWokwi, setCopiedWokwi] = useState(false);

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const handleCopyWokwiJson = async () => {
    if (!circuit) return;
    try {
      const diagram = exportToWokwiDiagram(circuit);
      await navigator.clipboard.writeText(JSON.stringify(diagram, null, 2));
      setCopiedWokwi(true);
      setTimeout(() => setCopiedWokwi(false), 2500);
    } catch (err) {
      console.error("Failed to copy Wokwi diagram:", err);
    }
  };

  const handleOpenWokwi = () => {
    window.open(getWokwiSimulationUrl(), "_blank", "noopener,noreferrer");
  };

  const handleDownload = () => {
    if (!code) return;
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "BlinkySketch.ino";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const lineCount = code ? code.split("\n").length : 0;

  return (
    <div className="code-panel">
      {/* Header Bar */}
      <div className="code-header">
        <div className="code-header-left">
          <span className="file-badge">
            <FileCode size={13} className="text-amber-400" />
            <span>sketch.ino</span>
          </span>
          <span className="board-badge">
            <Cpu size={12} className="text-red-400" />
            <span>{boardModel}</span>
          </span>
        </div>
        <div className="code-header-actions">
          <button
            type="button"
            className="action-btn wokwi-btn group"
            onClick={handleOpenWokwi}
            title="Open online ESP32 simulator in Wokwi"
          >
            <div className="w-4 h-4 rounded border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-400">
              <ExternalLink size={10} />
            </div>
            <span>Wokwi Simulator</span>
          </button>
          <button
            type="button"
            className="action-btn group"
            onClick={handleCopyWokwiJson}
            title="Copy Wokwi diagram.json configuration"
          >
            <div className="w-4 h-4 rounded border border-white/10 bg-white/[0.04] flex items-center justify-center text-zinc-400 group-hover:text-amber-400">
              {copiedWokwi ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
            </div>
            <span>{copiedWokwi ? "Wokwi JSON Copied!" : "Wokwi JSON"}</span>
          </button>
          <button
            type="button"
            className="action-btn group"
            onClick={handleDownload}
            disabled={!code || isLoading}
            title="Download Arduino Sketch (.ino)"
          >
            <div className="w-4 h-4 rounded border border-white/10 bg-white/[0.04] flex items-center justify-center text-zinc-400 group-hover:text-amber-400">
              <Download size={10} />
            </div>
            <span>Download .ino</span>
          </button>
          <button
            type="button"
            className={`action-btn copy-btn group ${copied ? "copied" : ""}`}
            onClick={handleCopy}
            disabled={!code || isLoading}
          >
            <div className="w-4 h-4 rounded border border-white/10 bg-white/[0.04] flex items-center justify-center text-zinc-400 group-hover:text-amber-400">
              {copied ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
            </div>
            <span>{copied ? "Copied!" : "Copy Code"}</span>
          </button>
        </div>
      </div>

      {/* Code Viewer Body */}
      {isLoading ? (
        <div className="code-status-state">
          <Loader2 size={32} className="animate-spin text-amber-500" />
          <p>Generating Arduino C++ code...</p>
        </div>
      ) : error ? (
        <div className="code-status-state error">
          <AlertCircle size={24} className="text-red-400" />
          <p>Failed to load code: {error}</p>
        </div>
      ) : !code ? (
        <div className="code-status-state empty">
          <FileCode size={28} className="text-zinc-500 mb-2" />
          <p>No Arduino code available.</p>
          <small>Select a project circuit or submit a prompt to generate firmware.</small>
        </div>
      ) : (
        <div className="code-editor-container">
          <div className="line-numbers">
            {Array.from({ length: lineCount }, (_, i) => (
              <span key={i + 1}>{i + 1}</span>
            ))}
          </div>
          <pre className="code-content">
            <code>{highlightCpp(code)}</code>
          </pre>
        </div>
      )}

      {/* Code Footer Quick Summary */}
      {code && (
        <div className="code-footer">
          <span>Arduino C++ (ESP32)</span>
          <span>{lineCount} lines</span>
        </div>
      )}
    </div>
  );
}

export default CodePanel;
