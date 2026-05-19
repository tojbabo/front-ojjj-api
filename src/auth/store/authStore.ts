import { create } from "zustand";
import { persist } from "zustand/middleware";

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
      }),
    },
  ),
);

