"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateUser } from "@/actions/user.action";
import { Button } from "@/components/ui/button";
import { i18n } from "@/app/(root)/i118n";
import { getCookie } from "cookies-next";

interface Props {
  user: string;
}

export default function ProfileForm({ user }: Props) {
  const parsedUser = JSON.parse(user);
  console.log("parsedUser", parsedUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameData, setNameData] = useState<string | null>(parsedUser.name);
  const [countryData, setCountryData] = useState<string | null>(parsedUser.country);
  const [cityData, setCityData] = useState<string | null>(parsedUser.city);
  const [locationData, setLocationData] = useState<string | null>(parsedUser.location);
  const [bioData, setBioData] = useState<string | null>(parsedUser.bio);
  const [youtubeLinkData, setYoutubeLinkData] = useState<string | null>(parsedUser.youtube_link);
  const [linkedinLinkData, setLinkedinLinkData] = useState<string | null>(parsedUser.linkedin_link);
  const [facebookLinkData, setFacebookLinkData] = useState<string | null>(parsedUser.facebook_link);
  const [instagramLinkData, setInstagramLinkData] = useState<string | null>(
    parsedUser.instagram_link,
  );
  const [githubLinkData, setGithubLinkData] = useState<string | null>(parsedUser.github_link);
  const [xLinkData, setXLinkData] = useState<string | null>(parsedUser.x_link);
  const [lang, setLang] = useState("en");

  const router = useRouter();

  const inputClass =
    "my-10 paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50";

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

  async function onSubmit(event: any) {
    event.preventDefault();

    setIsSubmitting(true);
    try {
      const payload = {
        id: parsedUser.id,
        name: nameData,
        country: countryData,
        city: cityData,
        location: locationData,
        bio: bioData,
        youtube_link: youtubeLinkData,
        linkedin_link: linkedinLinkData,
        facebook_link: facebookLinkData,
        instagram_link: instagramLinkData,
        github_link: githubLinkData,
        x_link: xLinkData,
      };

      await updateUser(parsedUser.id, payload);
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
    <form onSubmit={(e) => onSubmit(e)}>
      <div>
        <span className="paragraph-semibold text-dark400_light800">
          {name} <span className="text-brand-500">*</span>
        </span>
        <input
          className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 mb-10 mt-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
          defaultValue={nameData}
          name="name"
          onChange={(e) => setNameData(e.target.value)}
          type="text"
        />
      </div>

      <input
        className={inputClass}
        defaultValue={parsedUser.email}
        name="email"
        disabled={true}
        type="text"
      />

      <input
        className={inputClass}
        defaultValue={countryData}
        name="country"
        onChange={(e) => setCountryData(e.target.value)}
        placeholder={country}
        type="text"
      />

      <input
        className={inputClass}
        defaultValue={cityData}
        name="city"
        onChange={(e) => setCityData(e.target.value)}
        placeholder={city}
        type="text"
      />

      <input
        className={inputClass}
        defaultValue={locationData}
        name="location"
        onChange={(e) => setLocationData(e.target.value)}
        placeholder={prefferedLang}
        type="text"
      />

      <textarea
        className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 my-10 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
        name="bio"
        defaultValue={bioData}
        onChange={(e) => setBioData(e.target.value)}
        placeholder={tellAboutYou}
        rows={4}
      />

      <input
        className={inputClass}
        defaultValue={youtubeLinkData}
        name="youtube_link"
        onChange={(e) => setYoutubeLinkData(e.target.value)}
        placeholder={youtube}
        type="text"
      />

      <input
        className={inputClass}
        defaultValue={linkedinLinkData}
        name="linkedin_link"
        onChange={(e) => setLinkedinLinkData(e.target.value)}
        placeholder={linkedin}
        type="text"
      />

      <input
        className={inputClass}
        defaultValue={facebookLinkData}
        name="facebook_link"
        onChange={(e) => setFacebookLinkData(e.target.value)}
        placeholder={facebook}
        type="text"
      />

      <input
        className={inputClass}
        defaultValue={instagramLinkData}
        name="instagram_link"
        onChange={(e) => setInstagramLinkData(e.target.value)}
        placeholder={instagram}
        type="text"
      />

      <input
        className={inputClass}
        defaultValue={githubLinkData}
        name="github_link"
        onChange={(e) => setGithubLinkData(e.target.value)}
        placeholder={github}
        type="text"
      />

      <input
        className={inputClass}
        defaultValue={xLinkData}
        name="x_link"
        onChange={(e) => setXLinkData(e.target.value)}
        placeholder={twitter}
        type="text"
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="primary-gradient px-10 text-light-800"
      >
        {isSubmitting ? saving : save}
      </Button>
    </form>
  );
}
