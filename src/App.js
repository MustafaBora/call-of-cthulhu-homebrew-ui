import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import './App.css';
import PlayersList from './PlayersList';
import PlayerForm from "./PlayerForm";
import CocCharacterForm from "./CocCharacterForm";
import { ConnectivityProvider } from "./ConnectivityProvider";
import { API_BASE_URL } from "./config";

const RULES_CACHE_KEY = "rulesCache";
const RULES_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function AppContent() {
  const [mode, setMode] = useState("list"); // "list" | "new" | "edit" | "characterForm"
  const [editingPlayer, setEditingPlayer] = useState(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    document.title = i18n.t("app.title");
  }, [i18n.language, i18n]);

  // Load rules spec from backend on app startup (only once)
  useEffect(() => {
    const loadRules = async () => {
      try {
        // Check if rules are already cached and fresh
        const cachedRaw = localStorage.getItem(RULES_CACHE_KEY);
        if (cachedRaw) {
          try {
            const cached = JSON.parse(cachedRaw);
            const isFresh = cached?.timestamp && cached?.spec && (Date.now() - cached.timestamp < RULES_CACHE_TTL_MS);
            if (isFresh) {
              console.log("[App] Using cached rules spec");
              return;
            }
          } catch (parseErr) {
            console.warn("[App] Failed to parse cached rules, clearing cache", parseErr);
            localStorage.removeItem(RULES_CACHE_KEY);
          }
        }

        console.log("[App] Fetching rules from backend");
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 4000);
        
        try {
          const response = await fetch(`${API_BASE_URL}/players/rules`, { 
            method: "GET",
            signal: controller.signal,
            cache: "no-store"
          });
          
          if (response.ok) {
            const spec = await response.json();
            console.log("[App] Rules loaded from backend successfully");
            // Cache the rules
            localStorage.setItem(RULES_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), spec }));
          } else {
            console.warn(`[App] Rules fetch returned status ${response.status}`);
          }
        } finally {
          clearTimeout(id);
        }
      } catch (err) {
        console.error("[App] Rules loading error:", err.message);
      }
    };

    loadRules();
  }, []);

  const renderMode = () => {
    if (mode === "list") {
      return (
        <PlayersList
          onEditPlayer={(p) => {
            setEditingPlayer(p);
            setMode("edit");
          }}
          onNewPlayer={() => setMode("new")}
          onCharacterForm={(p) => {
            setEditingPlayer(p);
            setMode("characterForm");
          }}
        />
      );
    }

    if (mode === "new") {
      return (
        <PlayerForm
          mode="create"
          player={null}
          onCancel={() => setMode("list")}
          onCreated={() => setMode("list")}
        />
      );
    }

    if (mode === "edit" && editingPlayer) {
      return (
        <PlayerForm
          mode="edit"
          player={editingPlayer}
          onCancel={() => {
            setEditingPlayer(null);
            setMode("list");
          }}
          onUpdated={(_, { stay } = {}) => {
            if (!stay) {
              setEditingPlayer(null);
              setMode("list");
            }
          }}
        />
      );
    }

    if (mode === "characterForm" && editingPlayer) {
      return (
        <CocCharacterForm
          player={editingPlayer}
          onCancel={() => {
            setEditingPlayer(null);
            setMode("list");
          }}
        />
      );
    }

    return <PlayersList />;
  };

  return (
    <ConnectivityProvider>
      {renderMode()}
    </ConnectivityProvider>
  );
}

function App() {
  return <AppContent />;
}

export default App;
