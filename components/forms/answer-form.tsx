"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useTheme } from "next-themes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";
import { toast } from "sonner";
import envConfig from "@/config";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { createAnswer } from "@/actions/answer.action";
import { usePathname } from "next/navigation";
import { i18n } from "@/app/(root)/i118n";
import { getCookie } from "cookies-next";

const formSchema = z.object({
  answer: z
    .string()
    .min(1, { message: "The field is required and cannot be empty" })
    .min(10, { message: "The answer must contain at least 3 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  questionId: string;
  questionTitleContent: string;
  userId: string;
}

export default function AnswerForm({ questionId, userId, questionTitleContent }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lang, setLang] = useState("en");
  // const [isSubmittingAI, setIsSubmittingAI] = useState(false);
  const editorRef = useRef(null);
  const pathname = usePathname();
  const { theme } = useTheme();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answer: "",
    },
  });

  async function onSubmit(values: FormValues) {
    if (!userId) {
      return toast.error("You mussed be logged in to answer question");
    }
    setIsSubmitting(true);
    try {
      await createAnswer({
        content: values.answer,
        question: questionId,
        author: userId,
        path: pathname,
      });
      toast.success("Answer submitted successfully");
      form.reset();
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
  }

  const generateAIAnswer = async () => {
    if (!userId) {
      return toast.error("You mussed be logged in to generate AI answer");
    }
    // setIsSubmittingAI(true);
    // try {
    //   // const res = await fetch(`${envConfig.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`, {
    //   //   method: 'POST',
    //   //   body: JSON.stringify({ question: questionTitleContent }),
    //   // });
    //   // const aiAnswer = await res.json();
    //   // convert plain text to html
    //   // const htmlAnswer = aiAnswer.reply.replace(/\n/g, '<br />');
    //   // if (editorRef.current) {
    //   //   const editor = editorRef.current as any;
    //   //   editor.setContent(htmlAnswer);
    //   // }
    //   // toast.success('AI Answer generated successfully');
    // } catch (error) {
    //   console.log(error);
    //   toast.error('Something went wrong');
    // } finally {
    //   setIsSubmittingAI(false);
    // }
  };

  let writeYourAnswerHere = i18n()[lang]["writeYourAnswerHere"];

  useEffect(() => {
    setLang(getCookie("lang")?.toLocaleLowerCase() || "en");
    writeYourAnswerHere = i18n()[lang]["writeYourAnswerHere"];
  }, [lang]);

  return (
    <>
      <hr className="h-0.5 border-t-0 bg-neutral-100 dark:bg-white/20" />
      {userId ? (
        <div className="mt-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <h4 className="paragraph-semibold text-dark400_light800">{writeYourAnswerHere}</h4>
            {/* <Button
          disabled={isSubmittingAI}
          className="btn light-border-2 border text-brand-500"
          onClick={generateAIAnswer}
        >
          <Sparkles className="mr-1 h-4 w-4 fill-orange-300" />
          {isSubmittingAI ? 'Generating...' : 'Generate AI Answer'}
        </Button> */}
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-8">
              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Editor
                        apiKey={envConfig.TINY_API_KEY}
                        // @ts-ignore
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        onBlur={field.onBlur}
                        onEditorChange={(content) => field.onChange(content)}
                        init={{
                          height: 350,
                          menubar: false,
                          placeholder: writeYourAnswerHere,
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
                            "undo redo | codesample | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist fullscreen",
                          content_style:
                            "body { font-family:__Inter_aaf875,__Inter_Fallback_aaf875; font-size:1rem; }" +
                            ".mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {color: #e2995f !important; }",
                          skin: theme === "dark" ? "oxide-dark" : "oxide",
                          content_css: theme === "dark" ? "dark" : "light",
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="primary-gradient float-right px-10 text-light-800"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </Form>
        </div>
      ) : (
        <h4 className="paragraph-semibold text-dark400_light800 mt-10">
          Please log in before writing your answer.
        </h4>
      )}
    </>
  );
}
