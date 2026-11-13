"use client";

import { useEffect, useState } from "react";

type Resource<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

export function useResource<T>(key: string, load: (key: string, signal: AbortSignal) => Promise<T>) {
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState<{ key: string; version: number; state: Resource<T> }>();

  useEffect(() => {
    const controller = new AbortController();
    async function fetchResource() {
      try {
        const data = await load(key, controller.signal);
        if (!controller.signal.aborted) {
          setResult({ key, version, state: { status: "success", data } });
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          const failure = error instanceof Error ? error : new Error("The request failed.");
          setResult({ key, version, state: { status: "error", error: failure } });
        }
      }
    }
    void fetchResource();
    return () => controller.abort();
  }, [key, load, version]);

  const state: Resource<T> = result?.key === key && result.version === version
    ? result.state
    : { status: "loading" };

  return {
    state,
    refresh: () => setVersion((current) => current + 1),
    update: (data: T) => setResult({ key, version, state: { status: "success", data } }),
  };
}
