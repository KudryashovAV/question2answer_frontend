import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Wanswers | Sign Up",
  description: "Create your Wanswers account today and start asking questions and answering them!",
};

export default function SignUpPage() {
  return <SignUp />;
}
