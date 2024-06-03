"use client";

import { useState, useRef, Key, useEffect } from "react";
import { toast } from "sonner";

import { usePathname } from "next/navigation";
import { createComment } from "@/actions/comment.actions";
import { i18n } from "@/app/(root)/i118n";
import { getCookie } from "cookies-next";

interface Props {
  commentOwnerId: string | Key | null | undefined;
  commentOwnerType: string;
  currentUserId: number | string | null;
  setShowForm: (isShow: boolean) => void;
}

export default function CommentForm({
  commentOwnerId,
  currentUserId,
  commentOwnerType,
  setShowForm,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputData, setInputData] = useState("");
  const [lang, setLang] = useState("en");

  const editorRef = useRef(null);
  const pathname = usePathname();

  let addComment = i18n()[lang]["addComment"];
  let comment = i18n()[lang]["comment"];

  useEffect(() => {
    setLang(getCookie("lang")?.toLocaleLowerCase() || "en");
    addComment = i18n()[lang]["addComment"];
    comment = i18n()[lang]["comment"];
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!currentUserId) {
      return toast.error(`You mussed be logged in to comment ${commentOwnerType}`);
    }
    setIsSubmitting(true);
    try {
      await createComment({
        content: inputData,
        owner_type: commentOwnerType,
        owner_id: commentOwnerId,
        user_id: currentUserId,
        path: pathname,
      });
      toast.success("Comment submitted successfully");
      setInputData("");
      setShowForm(false);

      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent("");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-5 flex items-start space-x-4">
      <div className="min-w-0 flex-1">
        <form onSubmit={handleSubmit}>
          <div className="rounded-lg p-3 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
            <label htmlFor="comment" className="sr-only">
              {addComment}
            </label>
            <textarea
              rows={2}
              name="comment"
              value={inputData}
              id="comment"
              className="text-dark300_light700 placeholder:text-dark300_light700 h-28 w-full resize-none bg-transparent outline-none sm:text-sm sm:leading-6"
              placeholder="Add your comment..."
              onChange={(event) => setInputData(event.target.value)}
            />
            <button
              type="submit"
              className="primary-gradient h-10 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              {comment}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
