import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import HeaderAuthButton from "@/app/components/HeaderAuthButton";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OJ 개발자 센터",
  description: "API 문서, 가이드, 공지와 도구를 한 곳에서.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-background text-foreground">
          <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
            <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4">
              <Link href="/" className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--brand)] text-white"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 18V6h6.25c3.14 0 5.3 2.02 5.3 5 0 3.05-2.2 5.02-5.46 5.02H9.8V18H6Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <div className="leading-tight">
                  <div className="text-sm font-semibold tracking-tight">
                    OJ 개발자 센터
                  </div>
                  <div className="text-xs text-muted">Developers</div>
                </div>
              </Link>

              <nav className="ml-4 hidden items-center gap-5 text-sm font-medium md:flex">
                <a className="text-foreground/80 hover:text-foreground" href="#docs">
                  문서
                </a>
                <a
                  className="text-foreground/80 hover:text-foreground"
                  href="#api"
                >
                  API
                </a>
                <a
                  className="text-foreground/80 hover:text-foreground"
                  href="#guides"
                >
                  가이드
                </a>
                <a
                  className="text-foreground/80 hover:text-foreground"
                  href="#notice"
                >
                  공지
                </a>
              </nav>

              <div className="ml-auto flex items-center gap-2">
                <label className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm text-muted shadow-sm sm:flex">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-muted"
                  >
                    <path
                      d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M16.5 16.5 21 21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <input
                    className="w-64 bg-transparent outline-none placeholder:text-muted"
                    placeholder="문서/SDK/에러코드 검색"
                  />
                  <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">
                    /
                  </span>
                </label>
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-card px-4 text-sm font-medium shadow-sm hover:bg-[color:var(--brand-weak)]"
                  href="/user">
                  관리
                </Link>
                <HeaderAuthButton />
              </div>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
