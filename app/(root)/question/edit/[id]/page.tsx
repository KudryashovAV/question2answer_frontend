import { Metadata } from "next";
import { getQuestionById } from "@/actions/question.action";
import QuestionForm from "@/components/forms/question-form";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Wanswers | Edit Question",
  description:
    "Edit your question. Get unstuck, share ideas, and learn together. Join us, it only takes a minute.",
};

export default async function EditQuestionPage({ params }: { params: { id: string } }) {
  const getCurrentUser = async () => {
    const cookieStore = cookies();
    return JSON.parse(cookieStore.get("currentUser")?.value);
  };

  const currentUser = await getCurrentUser();
  const question = await getQuestionById(params.id);

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <div className="mt-9">
        <QuestionForm
          type="Edit"
          userId={currentUser.id}
          questionDetails={JSON.stringify(question)}
        />
      </div>
    </>
  );
}
