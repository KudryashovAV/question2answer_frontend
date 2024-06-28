"use client";

import React, { RefObject } from "react";
import { Editor } from "@tinymce/tinymce-react";
import envConfig from "@/config";

interface editorProps {
  content: string;
  theme: string | undefined;
  tinyPlaceholder: string;
  editorRef: RefObject<HTMLInputElement>;
  setContentDataHandler: React.Dispatch<React.SetStateAction<string>>;
}

export default function tinyEditor({
  content,
  theme,
  tinyPlaceholder,
  editorRef,
  setContentDataHandler,
}: editorProps) {
  return (
    <Editor
      apiKey={envConfig.TINY_API_KEY}
      // @ts-ignore
      onInit={(evt, editor) => (editorRef.current = editor)}
      onEditorChange={(content) => setContentDataHandler(content)}
      initialValue={content || ""}
      init={{
        height: 350,
        menubar: false,
        placeholder: tinyPlaceholder,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "codesample",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
        ],
        toolbar:
          "undo redo | codesample | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist fullscreen | preview",
        content_style:
          "body { font-family:__Inter_aaf875,__Inter_Fallback_aaf875; font-size:1rem; }" +
          ".mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {color: #e2995f !important; }",
        skin: theme === "dark" ? "oxide-dark" : "oxide",
        content_css: theme === "dark" ? "dark" : "light",
      }}
    />
  );
}
