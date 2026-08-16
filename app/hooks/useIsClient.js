"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

export function useIsClient() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false
  );
}

export function useMediaQuery(query) {
  const subscribe = (onChange) => {
    const list = window.matchMedia(query);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  };

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}
