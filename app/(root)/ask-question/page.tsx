import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import QuestionForm from "@/components/forms/question-form";
import { cookies } from "next/headers";
import { i18n } from "../i118n";

export const metadata: Metadata = {
  title: "Wanswers | Ask a question",
  description:
    "Ask a question on Wanswers and receive answers from other members of the community.",
};

export default async function AskQuestionPage() {
  const userId = auth().userId;

  const getLang = async () => {
    const cookieStore = cookies();
    return cookieStore.get("lang")?.value.toLocaleLowerCase() || "en";
  };
  const lang = await getLang();

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">{i18n()[lang]["askQuestion"]}</h1>
      <div className="mt-9">
        <QuestionForm type="Create" userId={userId!} />
      </div>
    </div>
  );
}
