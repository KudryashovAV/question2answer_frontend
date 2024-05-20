import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Wanswers | Login",
  description: "Login to Wanswers",
};

export default function SignInPage() {
  return <SignIn />;
}
