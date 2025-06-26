"use client";
import { ProfileProvider } from "@/contexts/ProfileContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <ProfileProvider>{children}</ProfileProvider>;
}
