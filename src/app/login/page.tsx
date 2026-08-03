import type { Metadata } from "next";
import { AuthFlow } from "@/components/auth/AuthFlow";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Login",
  description: "Login to your Paras Enterprises account to track orders, download invoices and manage your profile.",
  path: "/login",
});

export default function LoginPage() {
  return <AuthFlow mode="login" />;
}
