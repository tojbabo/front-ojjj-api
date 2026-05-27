import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";
import { parseSessionPayload } from "@/src/auth/lib/parseSessionPayload";

type AuthState = {
  accessToken: string | null;
  userId: string | null;
  setAccessToken: (token: string | null) => void;
  setUserId: (userId: string) => void;
  applySession: (payload: unknown) => boolean;
  clearAccessToken: () => void;
};

type PersistedAuthState = {
  accessToken: string | null;
  userId: string | null;
  loginId?: string | null;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      userId: null,
      setAccessToken: (token) => set({ accessToken: token }),
      setUserId: (userId) => set({ userId: userId.trim() || null }),
      applySession: (payload) => {
        const session = parseSessionPayload(payload);
        if (!session) return false;
        set({
          accessToken: session.accessToken,
          userId: session.userId || null,
        });
        return true;
      },
      clearAccessToken: () => set({ accessToken: null, userId: null }),
    }),
    {
      name: "auth",
      version: 1,
      migrate: (persisted) => {
        const state = persisted as PersistedAuthState;
        return {
          accessToken: state.accessToken ?? null,
          userId: state.userId ?? state.loginId ?? null,
        };
      },
      partialize: (state) => ({
        accessToken: state.accessToken,
        userId: state.userId,
      }),
    },
  ),
);

export function useAuthHydrated() {
  const [hydrated, setHydrated] = useState(() => useAuthStore.persist.hasHydrated());

  useEffect(() => {
    setHydrated(useAuthStore.persist.hasHydrated());
    return useAuthStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  return hydrated;
}

export function getAutoFillUserIdFromStore(): string {
  return useAuthStore.getState().userId?.trim() ?? "";
}
