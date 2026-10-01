import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Authentication | DocuCollab",
    template: "%s | DocuCollab",
  },
}

export default function AuthLayout({ children }: LayoutProps<'/'>) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      {children}
    </main>
  );
}
