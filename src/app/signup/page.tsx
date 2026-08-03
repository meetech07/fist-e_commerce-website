import type { Metadata } from "next";
import { AuthFlow } from "@/components/auth/AuthFlow";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Create Account",
  description: "Create a free account with DIA Enterprises for faster checkout, order tracking and trade pricing.",
  path: "/signup",
});

export default function SignupPage() {
  return <AuthFlow mode="signup" />;
}
