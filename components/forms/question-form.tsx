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
  title: z.string().trim().min(1, { message: "Please ask your question" }).min(5).max(120),
  content: z.string(),
  location: z.string(),
  tags: z.array(z.string().trim().min(1).max(15)),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  type: "Create" | "Edit";
  userId: string;
  questionDetails?: string;
}

export default function QuestionForm({ userId, type, questionDetails }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [titleData, setTitleData] = useState("");
  const [contentData, setContentData] = useState("");
  const [tagsData, setTagsData] = useState([] as string[]);
  const [tagsInputData, setTagsInputData] = useState("");
  const [lang, setLang] = useState("en");
  const editorRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();

  const parsedQuestionDetails = JSON.parse(questionDetails || "{}");
  const questionTags = parsedQuestionDetails?.tags?.map((tag: any) => tag.name);

  useEffect(() => {
    setTagsInputData("");
  }, [tagsData]);

  function onlyUnique(value: any, index: number, array: any) {
    return array.indexOf(value) === index;
  }

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const tagInput = event.target as HTMLInputElement;

    if (event.key === "Enter" && tagInput.name === "tags") {
      event.preventDefault();
      const tags: string[] = tagInput.value.trim().split(" ").filter(onlyUnique);
      tags.forEach((tag: string) => {
        let tempTag: string = tag.trim().toLocaleLowerCase();

        tempTag = tempTag.slice(-1) === "," ? tempTag.slice(0, -1) : tempTag;
        tempTag = tempTag.charAt(0) === "#" ? tempTag : "#" + tempTag;

        setTagsData((prevState) => prevState.concat(tempTag));
      });
    }
  };

  const prepareTags = () => {
    if (tagsInputData.length === 0) {
      return tagsData;
    } else {
      return setTagsData((prevState) => prevState.concat(tagsInputData).filter(onlyUnique));
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

  async function onSubmit(event: any) {
    event.preventDefault();
    prepareTags();
    setIsSubmitting(true);
    try {
      const currentUser = await getUserByClerkId(userId!);
      if (type === "Create") {
        const payload = {
          title: titleData,
          content: contentData,
          tags: tagsData.filter(onlyUnique),
          author_id: currentUser.id,
          location: lang.toUpperCase(),
        };
        const question = await createQuestion(payload);
        if (question.status !== "error") {
          router.push(`/question/${question.slug}`);
        } else {
          toast.error("Something went wrong");
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

  let whatYourQuestion = i18n()[lang]["whatYourQuestion"];
  let tinyPlaceholder = i18n()[lang]["tinyPlaceholder"];
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

  return (
    <form onSubmit={(e) => onSubmit(e)}>
      <input
        type="text"
        name="title"
        className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 mb-10 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
        onChange={(e) => setTitleData(e.target.value)}
        placeholder={whatYourQuestion}
      />

      <Editor
        apiKey={envConfig.TINY_API_KEY}
        // @ts-ignore
        onInit={(evt, editor) => (editorRef.current = editor)}
        onEditorChange={(content) => setContentData(content)}
        initialValue={parsedQuestionDetails.content || ""}
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
            value={tagsInputData}
            className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 flex h-10 w-full border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            onChange={(event) => {
              setTitleData(event.target.value);
              setTagsInputData(event.target.value);
            }}
            onKeyDown={(event) => handleInputKeyDown(event)}
            placeholder={addTags}
          />
        </div>
        <button
          type="button"
          className="background-light700_dark300 text-dark300_light700 hover:primary-gradient relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md border px-3 py-2 text-sm font-semibold"
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
          {tagsData.map((tag: string) => (
            <TagBadge key={tag} size="sm">
              {tag}
              {type === "Create" && <XIcon className="h-3.5 w-3.5" role="button" />}
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
  // return (
  // <Form {...form}>
  //   <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
  //     <FormField
  //       control={form.control}
  //       name="title"
  //       render={({ field }) => (
  //         <FormItem>
  //           <FormControl>
  //             <Input
  //               placeholder={whatYourQuestion}
  //               className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700"
  //               {...field}
  //             />
  //           </FormControl>
  //           <FormMessage className="text-red-500" />
  //         </FormItem>
  //       )}
  //     />
  //     <FormField
  //       control={form.control}
  //       name="content"
  //       render={({ field }) => (
  //         <FormItem>
  //           <FormControl>
  //             <Editor
  //               apiKey={envConfig.TINY_API_KEY}
  //               // @ts-ignore
  //               onInit={(evt, editor) => (editorRef.current = editor)}
  //               onBlur={field.onBlur}
  //               onEditorChange={(content) => field.onChange(content)}
  //               initialValue={parsedQuestionDetails.content || ""}
  //               init={{
  //                 height: 350,
  //                 menubar: false,
  //                 placeholder: tinyPlaceholder,
  //                 plugins: [
  //                   "advlist",
  //                   "autolink",
  //                   "lists",
  //                   "link",
  //                   "image",
  //                   "charmap",
  //                   "preview",
  //                   "anchor",
  //                   "searchreplace",
  //                   "visualblocks",
  //                   "codesample",
  //                   "fullscreen",
  //                   "insertdatetime",
  //                   "media",
  //                   "table",
  //                 ],
  //                 toolbar:
  //                   "undo redo | codesample | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist fullscreen",
  //                 content_style:
  //                   "body { font-family:__Inter_aaf875,__Inter_Fallback_aaf875; font-size:1rem; }" +
  //                   ".mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {color: #e2995f !important; }",
  //                 skin: theme === "dark" ? "oxide-dark" : "oxide",
  //                 content_css: theme === "dark" ? "dark" : "light",
  //               }}
  //             />
  //           </FormControl>
  //           <FormDescription>{tip3}</FormDescription>
  //           <FormMessage className="text-red-500" />
  //         </FormItem>
  //       )}
  //     />
  //     <FormField
  //       control={form.control}
  //       name="tags"
  //       render={({ field }) => (
  //         <FormItem>
  //           <FormControl>
  //             <>
  //               <div className="flex flex-row">
  //                 <div className="background-light700_dark300 text-dark300_light700 light-border-2 inline-flex items-center rounded-l-md border border-r-0 px-3 sm:text-sm">
  //                   #
  //                 </div>
  //                 <div className="w-full">
  //                   <Input
  //                     placeholder={addTags}
  //                     disabled={type === "Edit"}
  //                     className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 focus-visible:right-border-2 flex h-10 w-full rounded-none border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
  //                     onKeyDown={(e) => handleInputKeyDown(e, field)}
  //                   />
  //                 </div>
  //                 <button
  //                   type="button"
  //                   className="background-light700_dark300 text-dark300_light700 hover:primary-gradient relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md border px-3 py-2 text-sm font-semibold"
  //                 >
  //                   Add
  //                 </button>
  //               </div>

  //               {field.value.length > 0 && (
  //                 <div className="mt-2.5 flex items-center gap-2.5">
  //                   {field.value.map((tag: string) => (
  //                     <TagBadge key={tag} size="sm">
  //                       {tag}
  //                       {type === "Create" && (
  //                         <XIcon
  //                           className="h-3.5 w-3.5"
  //                           role="button"
  //                           onClick={() => handleTagRemove(tag, field)}
  //                         />
  //                       )}
  //                     </TagBadge>
  //                   ))}
  //                 </div>
  //               )}
  //             </>
  //           </FormControl>
  //           <FormDescription>
  //             {tip4}
  //             <kbd className="font-semibold text-light-500">{tip5}</kbd>
  //             {tip6}
  //           </FormDescription>
  //           <FormMessage className="text-red-500" />
  //         </FormItem>
  //       )}
  //     />
  //     <Button
  //       type="submit"
  //       disabled={isSubmitting}
  //       className="primary-gradient px-10 text-light-800"
  //     >
  //       {isSubmitting ? (
  //         <>
  //           <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
  //           {type === "Create" ? posting : updating}
  //         </>
  //       ) : (
  //         <>{type === "Create" ? postQuestion : saveChanges}</>
  //       )}
  //     </Button>
  //   </form>
  // </Form>
  // );
}
