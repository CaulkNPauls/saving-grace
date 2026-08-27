import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Login — Saving Grace",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="paper flex min-h-svh items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm border border-ink/25 bg-parchment/40 p-8">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-oxblood">Saving Grace</p>
        <h1 className="mt-2 font-display text-3xl uppercase tracking-wide text-ink">Admin</h1>
        <LoginForm />
      </div>
    </div>
  );
}
