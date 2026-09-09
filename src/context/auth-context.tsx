"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import type { User } from "@/lib/types";
import * as authStore from "@/lib/store/auth";

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => User;
  register: (email: string, password: string) => User;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useSyncExternalStore(
    authStore.subscribeAuth,
    authStore.getCurrentUser,
    authStore.getServerUser,
  );

  const value: AuthContextValue = {
    user,
    login: authStore.login,
    register: authStore.register,
    logout: authStore.logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
