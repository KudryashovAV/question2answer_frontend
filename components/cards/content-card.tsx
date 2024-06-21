import Link from "next/link";
import QuestionCard from "./question-card";
import { i18n } from "@/app/(root)/i118n";
import { userContentTitle } from "@/lib/utils";

interface Props {
  questions: any[];
  clerkId: string | null;
  lang: string;
  name: string;
  type: string;
  link: string;
}

const ContentCard = ({ questions, clerkId, lang, name, type, link }: Props) => {
  return (
    <section
      aria-labelledby="related-heading"
      className="mt-5 border-t border-gray-200 px-4 py-8 sm:px-0"
    >
      <div id="related-heading" className="text-dark300_light700 text-xl font-bold">
        {userContentTitle(questions.length, lang, name, type)}
      </div>

      <div className="mt-10 flex flex-col gap-5">
        {questions.length > 0 &&
          questions
            .slice(0, 2)
            .map((question: any) => (
              <QuestionCard key={question.id} question={question} clerkId={clerkId!} />
            ))}
      </div>
      {questions.length > 1 && (
        <div className="mt-10 flex flex-row justify-end space-x-1 hover:text-orange-500 md:flex md:flex-grow">
          <Link href={link}>
            {i18n()[lang]["allQuestions"]}
            {` (${questions.length}) >>`}
          </Link>
        </div>
      )}
    </section>
  );
};

export default ContentCard;
