import { useState } from "react";
import api from "../api/api";

export function useFamilyAPI() {
  const [helloState, setHelloState] = useState({ error: "", loading: false, message: "" });
  const [resolveState, setResolveState] = useState({ error: "", loading: false, message: "" });
  const [treeState, setTreeState] = useState({ error: "", loading: false, message: "" });

  const callHelloApi = async () => {
    setHelloState(prev => ({ ...prev, error: "", loading: true }));
    try {
      const response = await api.get("/hello");
      setHelloState({ error: "", loading: false, message: response.data });
    } catch {
      setHelloState({ error: "Error calling backend", loading: false, message: "" });
    }
  };

  const callResolveApi = async (sourceId, targetId) => {
    setResolveState(prev => ({ ...prev, error: "", loading: true }));
    try {
      const response = await api.get(`/relationships/resolve?sourceId=${sourceId}&targetId=${targetId}`);
      const msg = typeof response.data === "object" ? JSON.stringify(response.data, null, 2) : response.data;
      setResolveState({ error: "", loading: false, message: msg });
    } catch (err) {
      setResolveState({ error: `Error calling backend: ${err.message}`, loading: false, message: "" });
    }
  };

  const callTreeApi = async (treePersonId) => {
    setTreeState(prev => ({ ...prev, error: "", loading: true }));
    try {
      const response = await api.get(`/tree/${treePersonId}`);
      const msg = typeof response.data === "object" ? JSON.stringify(response.data, null, 2) : response.data;
      setTreeState({ error: "", loading: false, message: msg });
    } catch (err) {
      setTreeState({ error: `Error calling backend: ${err.message}`, loading: false, message: "" });
    }
  };

  return {
    helloState, callHelloApi,
    resolveState, callResolveApi,
    treeState, callTreeApi
  };
}
