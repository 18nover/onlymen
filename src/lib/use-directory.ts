import { createContext, createElement, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { directoryFn } from "@/lib/account/api";
import { models, type Model } from "@/lib/models";
import { mergeDirectory, toDirectoryModel, type DirectoryPayload } from "@/lib/directory";

let cache: { at: number; value: DirectoryPayload } | null = null;
let inflight: Promise<DirectoryPayload> | null = null;

export function primeDirectory(data: DirectoryPayload) {
  cache = { at: Date.now(), value: data };
}

async function load(): Promise<DirectoryPayload> {
  if (cache && Date.now() - cache.at < 30_000) return cache.value;
  if (!inflight) {
    inflight = directoryFn()
      .catch((): DirectoryPayload => cache?.value ?? { showDemo: false, profiles: [] })
      .then((d) => {
        cache = { at: Date.now(), value: d };
        inflight = null;
        return d;
      });
  }
  return inflight;
}

const DirectoryCtx = createContext<DirectoryPayload | null>(null);

export function DirectoryProvider({ payload, children }: { payload: DirectoryPayload; children: ReactNode }) {
  useEffect(() => {
    primeDirectory(payload);
  }, [payload]);
  return createElement(DirectoryCtx.Provider, { value: payload }, children);
}

export function useDirectory(): { list: Model[]; showDemo: boolean; ready: boolean } {
  const ctx = useContext(DirectoryCtx);
  const [data, setData] = useState<DirectoryPayload | null>(ctx ?? cache?.value ?? null);
  useEffect(() => {
    if (ctx) {
      setData(ctx);
      return;
    }
    let live = true;
    void load().then((d) => live && setData(d));
    return () => {
      live = false;
    };
  }, [ctx]);
  return useMemo(() => {
    const showDemo = data?.showDemo ?? false;
    const real = (data?.profiles ?? []).flatMap((p) => {
      const m = toDirectoryModel(p);
      return m ? [m] : [];
    });
    return { list: mergeDirectory(models, real, showDemo), showDemo, ready: data != null };
  }, [data]);
}
