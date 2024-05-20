import { Metadata } from "next";
import AboutUsPage from "@/components/about-us";

export const metadata: Metadata = {
  title: "Wanswers | About us",
  description: "Wanswers public platform is used by nearly everyone who share their knowledge.",
};

export default function AboutUs() {
  return (
    <div>
      <div className="mt-9">
        <AboutUsPage />
      </div>
    </div>
  );
}
