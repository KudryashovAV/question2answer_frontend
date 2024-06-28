"use client";

import { useState, useEffect } from "react";
import React from "react";
import { Loader2Icon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { getUserByClerkId } from "@/actions/user.action";
import { createQuestion, updateQuestion } from "@/actions/question.action";
import { TagBadge } from "../tags-badge";
import { useTheme } from "next-themes";
import { i18n } from "@/app/(root)/i118n";
import { getCookie } from "cookies-next";
import dynamic from "next/dynamic";

interface Props {
  type: "Create" | "Edit";
  userId: string;
  questionDetails?: string;
}

const TinyEditor = dynamic(() => import("./tiny-editor"), { ssr: false });

export default function QuestionForm({ userId, type, questionDetails }: Props) {
  const { theme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [titleData, setTitleData] = useState("");
  const [contentData, setContentData] = useState("");
  const [tagsData, setTagsData] = useState([] as string[]);
  const [tagsInputData, setTagsInputData] = useState("");
  const [removedTag, setRemovedTag] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [lang, setLang] = useState("en");
  const editorRef = React.useRef<HTMLInputElement>(null);
  const tagsRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const parsedQuestionDetails = JSON.parse(questionDetails || "{}");

  useEffect(() => {
    setTagsInputData("");
  }, [tagsData]);

  useEffect(() => {
    setTitleError(false);
  }, [titleData]);

  useEffect(() => {
    if (currentTheme != theme) {
      window.location.reload();
    }
  }, [theme]);

  useEffect(() => {
    setTagsData((prevState) => {
      const state = prevState.filter((item) => item !== removedTag);
      return state;
    });
  }, [removedTag]);

  function onlyUnique(value: any, index: number, array: any) {
    return array.indexOf(value) === index;
  }

  let whatYourQuestion = i18n()[lang]["whatYourQuestion"];
  let tinyPlaceholder = i18n()[lang]["tinyPlaceholder"];
  let errorTitle = i18n()[lang]["titleError"];
  let tip2 = i18n()[lang]["tip2"];
  let tip3 = i18n()[lang]["tip3"];
  let tip4 = i18n()[lang]["tip4"];
  let tip5 = i18n()[lang]["tip5"];
  let tip6 = i18n()[lang]["tip6"];
  let tags = i18n()[lang]["tags"];
  let butonAdd = i18n()[lang]["butonAdd"];
  let postQuestion = i18n()[lang]["postQuestion"];
  let posting = i18n()[lang]["posting"];
  let saveChanges = i18n()[lang]["saveChanges"];
  let updating = i18n()[lang]["updating"];
  let addTags = i18n()[lang]["addTags"];
  let toastCreateQuestion = i18n()[lang]["toastCreateQuestion"];
  let toastUpdateQuestion = i18n()[lang]["toastUpdateQuestion"];

  useEffect(() => {
    setLang(getCookie("lang")?.toLocaleLowerCase() || "en");
    whatYourQuestion = i18n()[lang]["whatYourQuestion"];
    tinyPlaceholder = i18n()[lang]["tinyPlaceholder"];
    errorTitle = i18n()[lang]["titleError"];
    tip2 = i18n()[lang]["tip2"];
    tip3 = i18n()[lang]["tip3"];
    tip4 = i18n()[lang]["tip4"];
    tip5 = i18n()[lang]["tip5"];
    tip6 = i18n()[lang]["tip6"];
    tags = i18n()[lang]["tags"];
    butonAdd = i18n()[lang]["butonAdd"];
    postQuestion = i18n()[lang]["postQuestion"];
    posting = i18n()[lang]["posting"];
    saveChanges = i18n()[lang]["saveChanges"];
    updating = i18n()[lang]["updating"];
    addTags = i18n()[lang]["addTags"];
    toastCreateQuestion = i18n()[lang]["toastCreateQuestion"];
    toastUpdateQuestion = i18n()[lang]["toastUpdateQuestion"];
  }, [lang]);

  const prepareTags = (tags: string) => {
    const tagsCollection: string[] = tags.trim().split(" ").filter(onlyUnique);
    const preparedTags = tagsCollection.map((tag: string) => {
      let tempTag: string = tag.trim().toLocaleLowerCase();

      tempTag = tempTag.slice(-1) === "," ? tempTag.slice(0, -1) : tempTag;
      tempTag = tempTag.charAt(0) === "#" ? tempTag : "#" + tempTag;

      return tempTag;
    });

    return preparedTags;
  };

  const tagInputSubmitter = (tags: string) => {
    prepareTags(tags).forEach((tag: string) => {
      setTagsData((prevState) => prevState.concat(tag));
    });
  };

  const tagButtonSubmitter = () => {
    const tagInput: any = tagsRef.current;

    if (tagInput) {
      tagInputSubmitter(tagInput.value);
    }
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const tagInput = event.target as HTMLInputElement;

    if (event.key === "Enter" && tagInput.name === "tags") {
      event.preventDefault();
      tagInputSubmitter(tagInput.value);
    }
  };

  const processError = (errors: string[]) => {
    const errorMessage = errors.map((error: string) => {
      if (error === "Slug has already been taken") {
        return errorTitle;
      } else {
        return error;
      }
    });

    return errorMessage.join(";\n");
  };

  async function onSubmit(event: any) {
    event.preventDefault();

    if (titleData.length < 3) {
      setTitleError(true);
      return;
    }
    setTitleError(false);
    setIsSubmitting(true);
    const tags = tagsInputData.length > 0 ? tagsData.concat(prepareTags(tagsInputData)) : tagsData;

    try {
      const currentUser = await getUserByClerkId(userId!);
      if (type === "Create") {
        const payload = {
          title: titleData,
          content: contentData,
          tags: tags.filter(onlyUnique),
          author_id: currentUser.id,
          location: lang.toUpperCase(),
        };
        const question = await createQuestion(payload);
        if (question.status !== "error") {
          router.push(`/question/${question.slug}`);
        } else {
          toast.error(processError(question.errors));
        }
      } else if (type === "Edit") {
        await updateQuestion({
          questionId: parsedQuestionDetails._id,
          title: titleData,
          content: contentData,
          location: lang.toUpperCase(),
          path: pathname,
        });

        router.push(`/question/${parsedQuestionDetails._id}`);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={(e) => onSubmit(e)}>
      <input
        type="text"
        name="title"
        className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
        onChange={(e) => setTitleData(e.target.value)}
        placeholder={whatYourQuestion}
      />

      <div className={`mb-4 mt-2 text-rose-700 ${titleError ? "visible" : "invisible"}`}>
        Please ask your question
      </div>

      <TinyEditor
        content={parsedQuestionDetails.content}
        theme={theme}
        tinyPlaceholder={tinyPlaceholder}
        editorRef={editorRef}
        setContentDataHandler={setContentData}
      />
      <p className="mt-2 text-sm text-muted-foreground">{tip3}</p>

      <div className="mt-10 flex flex-row focus-within:rounded-md focus-within:outline-none focus-within:ring-1 focus-within:ring-brand-500">
        <div className="background-light700_dark300 text-dark300_light700 light-border-2 inline-flex items-center rounded-l-md border border-r-0 px-3 sm:text-sm">
          #
        </div>
        <div className="w-full">
          <input
            type="text"
            disabled={type === "Edit"}
            name="tags"
            ref={tagsRef}
            value={tagsInputData}
            className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 flex h-10 w-full border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            onChange={(event) => {
              setTagsInputData(event.target.value);
            }}
            onKeyDown={(event) => handleInputKeyDown(event)}
            placeholder={addTags}
          />
        </div>
        <button
          type="button"
          className="background-light700_dark300 text-dark300_light700 hover:primary-gradient relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md border px-3 py-2 text-sm font-semibold"
          onClick={tagButtonSubmitter}
        >
          {butonAdd}
        </button>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {tip4}
        <kbd className="font-semibold text-light-500">{tip5}</kbd>
        {tip6}
      </p>

      {tagsData.length > 0 && (
        <div className="mt-2.5 flex items-center gap-2.5">
          {tagsData.filter(onlyUnique).map((tag: string) => (
            <TagBadge key={tag} size="sm">
              {tag}
              {type === "Create" && (
                <XIcon className="h-3.5 w-3.5" role="button" onClick={() => setRemovedTag(tag)} />
              )}
            </TagBadge>
          ))}
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="primary-gradient mt-10 px-10 text-light-800"
      >
        {isSubmitting ? (
          <>
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            {type === "Create" ? posting : updating}
          </>
        ) : (
          <>{type === "Create" ? postQuestion : saveChanges}</>
        )}
      </Button>
    </form>
  );
}
