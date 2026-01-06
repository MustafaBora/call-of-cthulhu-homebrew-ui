import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import './App.css';
import PlayersList from './PlayersList';
import PlayerForm from "./PlayerForm";
import CocCharacterForm from "./CocCharacterForm";
import { ConnectivityProvider } from "./ConnectivityProvider";

function App() {
  const [mode, setMode] = useState("list"); // "list" | "new" | "edit" | "characterForm"
  const [editingPlayer, setEditingPlayer] = useState(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    document.title = i18n.t("app.title");
  }, [i18n.language, i18n]);

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

export default App;
