"use client";

import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { Editor } from "@tinymce/tinymce-react";
import envConfig from "@/config";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "next/navigation";
import { getUserByClerkId } from "@/actions/user.action";
import { createQuestion, updateQuestion } from "@/actions/question.action";
import { TagBadge } from "../tags-badge";
import { useTheme } from "next-themes";
import { i18n } from "@/app/(root)/i118n";
import { getCookie } from "cookies-next";

const formSchema = z.object({
  title: z.string().trim().min(1, { message: "Required" }).min(5).max(120),
  content: z.string().min(20),
  location: z.string(),
  tags: z.array(z.string().trim().min(1).max(15)).min(1, { message: "Required" }).max(3),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  type: "Create" | "Edit";
  userId: string;
  questionDetails?: string;
}

export default function QuestionForm({ userId, type, questionDetails }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lang, setLang] = useState("en");
  const editorRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();

  const parsedQuestionDetails = JSON.parse(questionDetails || "{}");
  const questionTags = parsedQuestionDetails?.tags?.map((tag: any) => tag.name);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: any) => {
    if (e.key === "Enter" && field.name === "tags") {
      e.preventDefault();
      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim().toLocaleLowerCase(); // trim for removing spaces and toLowerCase for consistency
      if (tagValue.length > 15) {
        form.setError("tags", {
          type: "required",
          message: "Tag length should be less than 15 characters",
        });
      }
      if (!field.value.includes(tagValue as never)) {
        form.setValue("tags", [...field.value, tagValue]);
        tagInput.value = "";
        form.clearErrors("tags");
      } else {
        form.trigger();
      }
    }
  };

  const handleTagRemove = (tag: string, field: any) => {
    const newTags = field.value.filter((t: string) => t !== tag);
    form.setValue("tags", newTags);
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: parsedQuestionDetails.title || "",
      content: parsedQuestionDetails.content || "",
      location: "EN",
      tags: questionTags || [],
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      const currentUser = await getUserByClerkId(userId!);
      if (type === "Create") {
        const payload = { ...values, author: currentUser._id, location: lang.toUpperCase() };
        const question = await createQuestion(payload);
        if (question.status !== "error") {
          toast.success(toastCreateQuestion);
          router.push(`/question/${question.slug}`);
        } else {
          toast.error("Something went wrong");
        }
      } else if (type === "Edit") {
        await updateQuestion({
          questionId: parsedQuestionDetails._id,
          title: values.title,
          content: values.content,
          location: lang.toUpperCase(),
          path: pathname,
        });
        toast.success(toastUpdateQuestion);
        router.push(`/question/${parsedQuestionDetails._id}`);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  let questionTitle = i18n()[lang]["questionTitle"];
  let whatYourQuestion = i18n()[lang]["whatYourQuestion"];
  let tip1 = i18n()[lang]["tip1"];
  let tip2 = i18n()[lang]["tip2"];
  let tip3 = i18n()[lang]["tip3"];
  let tip4 = i18n()[lang]["tip4"];
  let tip5 = i18n()[lang]["tip5"];
  let tip6 = i18n()[lang]["tip6"];
  let tags = i18n()[lang]["tags"];
  let postQuestion = i18n()[lang]["postQuestion"];
  let posting = i18n()[lang]["posting"];
  let saveChanges = i18n()[lang]["saveChanges"];
  let updating = i18n()[lang]["updating"];
  let addTags = i18n()[lang]["addTags"];
  let toastCreateQuestion = i18n()[lang]["toastCreateQuestion"];
  let toastUpdateQuestion = i18n()[lang]["toastUpdateQuestion"];

  useEffect(() => {
    setLang(getCookie("lang")?.toLocaleLowerCase() || "en");
    questionTitle = i18n()[lang]["questionTitle"];
    whatYourQuestion = i18n()[lang]["whatYourQuestion"];
    tip1 = i18n()[lang]["tip1"];
    tip2 = i18n()[lang]["tip2"];
    tip3 = i18n()[lang]["tip3"];
    tip4 = i18n()[lang]["tip4"];
    tip5 = i18n()[lang]["tip5"];
    tip6 = i18n()[lang]["tip6"];
    tags = i18n()[lang]["tags"];
    postQuestion = i18n()[lang]["postQuestion"];
    posting = i18n()[lang]["posting"];
    saveChanges = i18n()[lang]["saveChanges"];
    updating = i18n()[lang]["updating"];
    addTags = i18n()[lang]["addTags"];
    toastCreateQuestion = i18n()[lang]["toastCreateQuestion"];
    toastUpdateQuestion = i18n()[lang]["toastUpdateQuestion"];
  }, [lang]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                {questionTitle} <span className="text-brand-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={whatYourQuestion}
                  className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700"
                  {...field}
                />
              </FormControl>
              <FormDescription>{tip1}</FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                {tip2} <span className="text-brand-500">*</span>
              </FormLabel>
              <FormControl>
                <Editor
                  apiKey={envConfig.TINY_API_KEY}
                  // @ts-ignore
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  onBlur={field.onBlur}
                  onEditorChange={(content) => field.onChange(content)}
                  initialValue={parsedQuestionDetails.content || ""}
                  init={{
                    height: 350,
                    menubar: false,
                    placeholder: "Explain your problem in detail...",
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
                    content_style: "body { font-family:Inter; font-size:14px }",
                    skin: theme === "dark" ? "oxide-dark" : "oxide",
                    content_css: theme === "dark" ? "dark" : "light",
                  }}
                />
              </FormControl>
              <FormDescription>{tip3}</FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                {tags} <span className="text-brand-500">*</span>
              </FormLabel>
              <FormControl>
                <>
                  <Input
                    placeholder={addTags}
                    disabled={type === "Edit"}
                    className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 border"
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />
                  {field.value.length > 0 && (
                    <div className="mt-2.5 flex items-center gap-2.5">
                      {field.value.map((tag: string) => (
                        <TagBadge key={tag} size="sm">
                          {tag}
                          {type === "Create" && (
                            <XIcon
                              className="h-3.5 w-3.5"
                              role="button"
                              onClick={() => handleTagRemove(tag, field)}
                            />
                          )}
                        </TagBadge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription>
                {tip4}
                <kbd className="font-semibold text-light-500">{tip5}</kbd>
                {tip6}
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="primary-gradient px-10 text-light-800"
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
    </Form>
  );
}
