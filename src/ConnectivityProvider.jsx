import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "./config";

const ConnectivityContext = createContext({
  offlineMode: false,
  setOfflineMode: () => {},
  backendAvailable: true,
  showBackendPrompt: false,
  acceptBackend: () => {},
  stayOffline: () => {},
  fetchWithTimeout: async () => {},
  enqueueRequest: () => {},
  queueLength: 0,
});

const DEFAULT_FETCH_TIMEOUT_MS = 4000;
const BACKEND_POLL_INTERVAL_MS = 30000;
const PROMPT_COOLDOWN_MS = 10 * 60 * 1000;
const PROMPT_COOLDOWN_KEY = "backendPromptCooldownUntil";
const OFFLINE_QUEUE_KEY = "offlineRequestQueue";

const readQueue = () => {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
};

const writeQueue = (queue) => {
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
};

export const ConnectivityProvider = ({ children }) => {
  const { t } = useTranslation();
  const [offlineMode, setOfflineMode] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState(true);
  const [showBackendPrompt, setShowBackendPrompt] = useState(false);
  const [queue, setQueue] = useState(() => readQueue());
  const [isFlushing, setIsFlushing] = useState(false);
  const pollRef = useRef(null);

  const fetchWithTimeout = useCallback(async (url, options = {}, timeoutMs = DEFAULT_FETCH_TIMEOUT_MS) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const resp = await fetch(url, { ...options, signal: controller.signal, cache: "no-store" });
      return resp;
    } finally {
      clearTimeout(id);
    }
  }, []);

  const saveQueue = useCallback((next) => {
    setQueue(next);
    writeQueue(next);
  }, []);

  const enqueueRequest = useCallback((req) => {
    const entry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      createdAt: Date.now(),
      method: req.method || "POST",
      url: req.url,
      headers: req.headers,
      body: req.body,
    };
    saveQueue([...readQueue(), entry]);
  }, [saveQueue]);

  const flushQueue = useCallback(async () => {
    if (isFlushing) return;
    if (!queue.length) return;
    setIsFlushing(true);
    let current = readQueue();

    for (const item of current) {
      try {
        const resp = await fetchWithTimeout(item.url, {
          method: item.method,
          headers: item.headers,
          body: item.body,
        }, DEFAULT_FETCH_TIMEOUT_MS);

        if (!resp.ok) {
          throw new Error(`Queue item failed: ${resp.status}`);
        }
        current = current.filter((q) => q.id !== item.id);
        saveQueue(current);
      } catch (err) {
        console.warn("[Connectivity] Flush halted", err?.message || err);
        setOfflineMode(true);
        setBackendAvailable(false);
        setIsFlushing(false);
        return;
      }
    }

    setIsFlushing(false);
  }, [fetchWithTimeout, isFlushing, queue.length, saveQueue]);

  const startPolling = useCallback(() => {
    if (pollRef.current) return;
    pollRef.current = setInterval(async () => {
      try {
        const resp = await fetchWithTimeout(`${API_BASE_URL}/players`, { method: "GET" }, 2000);
        if (resp.ok) {
          setBackendAvailable(true);
          const cooldownUntil = Number(localStorage.getItem(PROMPT_COOLDOWN_KEY) || "0");
          if (Date.now() > cooldownUntil) {
            setShowBackendPrompt(true);
          }
        }
      } catch (_) {
        // still offline
      }
    }, BACKEND_POLL_INTERVAL_MS);
  }, [fetchWithTimeout]);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (offlineMode) {
      startPolling();
    } else {
      stopPolling();
    }
  }, [offlineMode, startPolling, stopPolling]);

  useEffect(() => {
    const checkInitial = async () => {
      try {
        const resp = await fetchWithTimeout(`${API_BASE_URL}/players`, { method: "GET" }, 2000);
        setBackendAvailable(resp.ok);
      } catch (_) {
        setBackendAvailable(false);
        setOfflineMode(true);
      }
    };
    checkInitial();
  }, [fetchWithTimeout]);

  useEffect(() => {
    if (!offlineMode && backendAvailable) {
      flushQueue();
    }
  }, [offlineMode, backendAvailable, flushQueue]);

  const acceptBackend = useCallback(() => {
    setShowBackendPrompt(false);
    setOfflineMode(false);
    setBackendAvailable(true);
    flushQueue();
  }, [flushQueue]);

  const stayOffline = useCallback(() => {
    const until = Date.now() + PROMPT_COOLDOWN_MS;
    localStorage.setItem(PROMPT_COOLDOWN_KEY, String(until));
    setShowBackendPrompt(false);
  }, []);

  const value = useMemo(() => ({
    offlineMode,
    setOfflineMode,
    backendAvailable,
    showBackendPrompt,
    acceptBackend,
    stayOffline,
    fetchWithTimeout,
    enqueueRequest,
    queueLength: queue.length,
  }), [offlineMode, backendAvailable, showBackendPrompt, fetchWithTimeout, enqueueRequest, queue.length, acceptBackend, stayOffline]);

  return (
    <ConnectivityContext.Provider value={value}>
      {children}
      {showBackendPrompt && (
        <div style={styles.promptOverlay} role="dialog" aria-modal="true">
          <div style={styles.promptCard}>
            <div style={styles.promptTitle}>{t("players.backendAvailableTitle", "Backend available")}</div>
            <div style={styles.promptMessage}>{t("players.backendAvailableMessage", "The server is back online. Switch to backend?")}</div>
            <div style={styles.promptButtons}>
              <button type="button" style={styles.promptPrimary} onClick={acceptBackend}>
                {t("players.useBackend", "Use Backend")}
              </button>
              <button type="button" style={styles.promptSecondary} onClick={stayOffline}>
                {t("players.stayOffline", "Stay Offline")}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConnectivityContext.Provider>
  );
};

export const useConnectivity = () => useContext(ConnectivityContext);

const styles = {
  promptOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    padding: "1rem",
  },
  promptCard: {
    background: "#fdfaf3",
    borderRadius: "0.75rem",
    border: "2px solid #8b7d6b",
    boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
    maxWidth: "520px",
    width: "100%",
    padding: "1rem",
    color: "#3e3a2f",
  },
  promptTitle: {
    fontSize: "1.1rem",
    fontWeight: 800,
    marginBottom: "0.5rem",
    color: "#5a4a3a",
  },
  promptMessage: {
    fontSize: "0.95rem",
    marginBottom: "0.75rem",
  },
  promptButtons: {
    display: "flex",
    gap: "0.5rem",
    justifyContent: "flex-end",
    flexWrap: "wrap",
  },
  promptPrimary: {
    padding: "0.45rem 0.9rem",
    borderRadius: "0.35rem",
    border: "2px solid #6d5d4b",
    background: "linear-gradient(135deg, #7a6a56, #6d5d4b)",
    color: "#f5f3e8",
    fontWeight: 700,
    cursor: "pointer",
  },
  promptSecondary: {
    padding: "0.45rem 0.9rem",
    borderRadius: "0.35rem",
    border: "2px solid #b8860b",
    background: "linear-gradient(135deg, #daa520 0%, #b8860b 100%)",
    color: "#3e3a2f",
    fontWeight: 700,
    cursor: "pointer",
  },
};
