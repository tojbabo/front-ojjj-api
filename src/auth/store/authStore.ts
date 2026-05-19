import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";

type AuthState = {
  accessToken: string | null;
  loginId: string | null;
  loginPw: string | null;
  setAccessToken: (token: string | null) => void;
  setLoginCredentials: (id: string, pw: string) => void;
  clearAccessToken: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      loginId: null,
      loginPw: null,
      setAccessToken: (token) => set({ accessToken: token }),
      setLoginCredentials: (id, pw) => set({ loginId: id, loginPw: pw }),
      clearAccessToken: () => set({ accessToken: null, loginId: null, loginPw: null }),
    }),
    {
      name: "auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        loginId: state.loginId,
        loginPw: state.loginPw,
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

export function getLoginCredentialsFromStore(): LoginCredentials {
  const { loginId, loginPw } = useAuthStore.getState();
  return {
    id: loginId?.trim() ?? "",
    pw: loginPw ?? "",
  };
}

type LoginCredentials = {
  id: string;
  pw: string;
};

