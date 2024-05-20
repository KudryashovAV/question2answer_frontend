"use client";

import ParseHTML from "./parse-html";
import { Key, useEffect, useState } from "react";
import CommentForm from "./forms/comment-form";
import { getTimeStamp } from "@/lib/utils";
import { IComments } from "@/types/props";
import { i18n } from "@/app/(root)/i118n";
import { getCookie } from "cookies-next";

interface Props {
  ownerId: string | Key | null | undefined;
  ownerType: string;
  comments: IComments[];
  currentUserId: string | null;
  defaultCommentsCount: number;
}

export default function AllComments({
  comments,
  ownerId,
  ownerType,
  currentUserId,
  defaultCommentsCount,
}: Props) {
  const [showFrom, setShowForm] = useState(false);
  const [showAllComments, SetShowAllComments] = useState(false);
  const [lang, setLang] = useState("en");
  const currentComments = comments || [];

  const visibleComments = showAllComments
    ? currentComments
    : currentComments.slice(0, defaultCommentsCount);
  const allowComment = () => {
    return setShowForm(true);
  };

  let addComment = i18n()[lang]["addComment"];
  let show = i18n()[lang]["show"];
  let moreComments = i18n()[lang]["moreComments"];

  useEffect(() => {
    setLang(getCookie("lang")?.toLocaleLowerCase() || "en");
    addComment = i18n()[lang]["addComment"];
    show = i18n()[lang]["show"];
    moreComments = i18n()[lang]["moreComments"];
  }, []);

  return (
    <div className="mt-5 flex flex-col">
      <div>
        {visibleComments.map((comment) => (
          <article key={comment.id} className="border-b border-gray-300 px-2 py-2 text-sm md:px-5">
            <ParseHTML className="inline text-sm" content={comment.content} />
            {" - "}
            <a href="" className="text-blue-800">
              {comment.user_name}
            </a>{" "}
            <span className="text-gray-400">{getTimeStamp(new Date(comment.created_at))} ago</span>
          </article>
        ))}
      </div>
      {currentUserId && (
        <>
          <button
            className={`mt-5 text-blue-800${
              currentComments.length <= defaultCommentsCount || showAllComments ? " hidden" : ""
            }`}
            onClick={() => SetShowAllComments(true)}
          >
            {`${show} ${currentComments.length - defaultCommentsCount} ${moreComments}`}
          </button>
          {(ownerType == "question" || showAllComments || currentComments.length == 0) && (
            <span>
              <div className={`${showFrom ? "hidden" : ""}`} onClick={allowComment}>
                <button
                  className={
                    `${showFrom ? "hidden " : ""}` +
                    "primary-gradient mt-5 h-10 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  }
                >
                  {addComment}
                </button>
              </div>
              <div className={`${showFrom ? "" : "invisible h-0"}`}>
                <CommentForm
                  commentOwnerId={ownerId}
                  commentOwnerType={ownerType}
                  setShowForm={setShowForm}
                  currentUserId={currentUserId}
                />
              </div>
            </span>
          )}
        </>
      )}
    </div>
  );
}
