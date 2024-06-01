"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { updateUser } from "@/actions/user.action";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { i18n } from "@/app/(root)/i118n";
import { getCookie } from "cookies-next";

const formSchema = z.object({
  name: z.string().min(1, { message: "Required" }).min(3).max(50),
  country: z.string().max(50),
  city: z.string().max(50),
  location: z.string().max(50),
  clerkId: z.string().max(150),
  bio: z.string().max(150),
  youtube_link: z.string().max(50),
  linkedin_link: z.string().max(50),
  facebook_link: z.string().max(50),
  instagram_link: z.string().max(50),
  github_link: z.string().max(50),
  x_link: z.string().max(50),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  clerkId: string;
  user: string;
}

export default function ProfileForm({ clerkId, user }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const parsedUser = JSON.parse(user);

  const [lang, setLang] = useState("en");

  let name = i18n()[lang]["name"];
  let country = i18n()[lang]["country"];
  let city = i18n()[lang]["city"];
  let prefferedLang = i18n()[lang]["prefferedLang"];
  let bio = i18n()[lang]["bio"];
  let youtube = i18n()[lang]["youtube"];
  let linkedin = i18n()[lang]["linkedin"];
  let facebook = i18n()[lang]["facebook"];
  let instagram = i18n()[lang]["instagram"];
  let github = i18n()[lang]["github"];
  let twitter = i18n()[lang]["twitter"];
  let save = i18n()[lang]["save"];
  let saving = i18n()[lang]["saving"];
  let whereAreYouFrom = i18n()[lang]["whereAreYouFrom"];
  let tellAboutYou = i18n()[lang]["tellAboutYou"];
  let whichLanguage = i18n()[lang]["whichLanguage"];

  useEffect(() => {
    setLang(getCookie("lang")?.toLocaleLowerCase() || "en");
    name = i18n()[lang]["name"];
    country = i18n()[lang]["country"];
    city = i18n()[lang]["city"];
    prefferedLang = i18n()[lang]["prefferedLang"];
    bio = i18n()[lang]["bio"];
    youtube = i18n()[lang]["youtube"];
    linkedin = i18n()[lang]["linkedin"];
    facebook = i18n()[lang]["facebook"];
    instagram = i18n()[lang]["instagram"];
    github = i18n()[lang]["github"];
    twitter = i18n()[lang]["twitter"];
    save = i18n()[lang]["save"];
    saving = i18n()[lang]["saving"];
    whereAreYouFrom = i18n()[lang]["whereAreYouFrom"];
    tellAboutYou = i18n()[lang]["tellAboutYou"];
    whichLanguage = i18n()[lang]["whichLanguage"];
  }, [lang]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: parsedUser.name || "",
      country: parsedUser.country || "",
      city: parsedUser.city || "",
      location: parsedUser.location || "",
      bio: parsedUser.bio || "",
      clerkId: clerkId,
      youtube_link: parsedUser.youtube_link || "",
      linkedin_link: parsedUser.linkedin_link || "",
      facebook_link: parsedUser.facebook_link || "",
      instagram_link: parsedUser.instagram_link || "",
      github_link: parsedUser.github_link || "",
      x_link: parsedUser.x_link || "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      await updateUser(clerkId, values);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
      router.push(`/profile/${parsedUser.id}`);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                {name} <span className="text-brand-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">{country}</FormLabel>
              <FormControl>
                <Input
                  placeholder={whereAreYouFrom}
                  className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">{city}</FormLabel>
              <FormControl>
                <Input
                  className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                {prefferedLang}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={whichLanguage}
                  className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">{bio}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={tellAboutYou}
                  className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="youtube_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                {youtube}
                <LinkIcon className="ml-1 inline-block h-3.5 w-3.5 text-indigo-500" />
              </FormLabel>
              <FormControl>
                <Input
                  className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="linkedin_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                {linkedin}
                <LinkIcon className="ml-1 inline-block h-3.5 w-3.5 text-indigo-500" />
              </FormLabel>
              <FormControl>
                <Input
                  className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="facebook_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                {facebook}
                <LinkIcon className="ml-1 inline-block h-3.5 w-3.5 text-indigo-500" />
              </FormLabel>
              <FormControl>
                <Input
                  className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instagram_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                {instagram}
                <LinkIcon className="ml-1 inline-block h-3.5 w-3.5 text-indigo-500" />
              </FormLabel>
              <FormControl>
                <Input
                  className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="github_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                {github}
                <LinkIcon className="ml-1 inline-block h-3.5 w-3.5 text-indigo-500" />
              </FormLabel>
              <FormControl>
                <Input
                  className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="x_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                {twitter}
                <LinkIcon className="ml-1 inline-block h-3.5 w-3.5 text-indigo-500" />
              </FormLabel>
              <FormControl>
                <Input
                  className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="primary-gradient px-10 text-light-800"
        >
          {isSubmitting ? saving : save}
        </Button>
      </form>
    </Form>
  );
}
