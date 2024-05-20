import { Metadata } from "next";
import PolicyPage from "@/components/policy";

export const metadata: Metadata = {
  title: "Wanswers | Terms & Conditions",
  description:
    "Wanswers is a community of developers, where you can ask questions and receive answers from other members of the community.",
};

export default function AboutUs() {
  return (
    <div>
      <div className="mt-9">
        <PolicyPage />
      </div>
    </div>
  );
}
