"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from ".";

/**
 * Client-side Redux Provider wrapper component.
 * Allows state persistence and dispatch access across root server-side layout structures.
 */
export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
