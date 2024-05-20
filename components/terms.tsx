"use client";

import { i18n } from "@/app/(root)/i118n";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import ParseHTML from "./parse-html";

export default function TermsPage() {
  const [lang, setLang] = useState("en");

  let termsPageTitle = i18n()[lang]["termsPageTitle"];
  let termsTitle1 = i18n()[lang]["termsTitle1"];
  let termsTitle2 = i18n()[lang]["termsTitle2"];
  let termsTitle3 = i18n()[lang]["termsTitle3"];
  let termsTitle4 = i18n()[lang]["termsTitle4"];
  let termsTitle5 = i18n()[lang]["termsTitle5"];
  let termsTitle6 = i18n()[lang]["termsTitle6"];
  let termsTitle7 = i18n()[lang]["termsTitle7"];
  let termsTitle8 = i18n()[lang]["termsTitle8"];
  let termsParagraph0 = i18n()[lang]["termsParagraph0"];
  let termsParagraph1 = i18n()[lang]["termsParagraph1"];
  let termsParagraph2 = i18n()[lang]["termsParagraph2"];
  let termsParagraph3 = i18n()[lang]["termsParagraph3"];
  let termsParagraph4 = i18n()[lang]["termsParagraph4"];
  let termsParagraph5 = i18n()[lang]["termsParagraph5"];
  let termsParagraph6 = i18n()[lang]["termsParagraph6"];
  let termsParagraph7 = i18n()[lang]["termsParagraph7"];
  let termsParagraph8 = i18n()[lang]["termsParagraph8"];

  useEffect(() => {
    setLang(getCookie("lang")?.toLocaleLowerCase() || "en");
    termsPageTitle = i18n()[lang]["termsPageTitle"];
    termsTitle1 = i18n()[lang]["termsTitle1"];
    termsTitle2 = i18n()[lang]["termsTitle2"];
    termsTitle3 = i18n()[lang]["termsTitle3"];
    termsTitle4 = i18n()[lang]["termsTitle4"];
    termsTitle5 = i18n()[lang]["termsTitle5"];
    termsTitle6 = i18n()[lang]["termsTitle6"];
    termsTitle7 = i18n()[lang]["termsTitle7"];
    termsTitle8 = i18n()[lang]["termsTitle8"];
    termsParagraph0 = i18n()[lang]["termsParagraph0"];
    termsParagraph1 = i18n()[lang]["termsParagraph1"];
    termsParagraph2 = i18n()[lang]["termsParagraph2"];
    termsParagraph3 = i18n()[lang]["termsParagraph3"];
    termsParagraph4 = i18n()[lang]["termsParagraph4"];
    termsParagraph5 = i18n()[lang]["termsParagraph5"];
    termsParagraph6 = i18n()[lang]["termsParagraph6"];
    termsParagraph7 = i18n()[lang]["termsParagraph7"];
    termsParagraph8 = i18n()[lang]["termsParagraph8"];
  }, []);

  return (
    <div className="text-dark100_light900 mx-auto grid max-w-4xl gap-4 p-8 text-justify">
      <h1 className="h1-bold text-dark100_light900">{termsPageTitle}</h1>
      <span className="mt-12">{termsParagraph0}</span>
      <h2 className="mt-5 text-2xl font-bold">{termsTitle1}</h2>
      <span>{termsParagraph1}</span>
      <h2 className="mt-5 text-2xl font-bold">{termsTitle2}</h2>
      <ParseHTML content={termsParagraph2} />
      <h2 className="text-2xl font-bold">{termsTitle3}</h2>
      <span>{termsParagraph3}</span>
      <h2 className="mt-5 text-2xl font-bold">{termsTitle4}</h2>
      <ParseHTML content={termsParagraph4} />
      <h2 className="text-2xl font-bold">{termsTitle5}</h2>
      <span>{termsParagraph5}</span>
      <h2 className="mt-5 text-2xl font-bold">{termsTitle6}</h2>
      <span>{termsParagraph6}</span>
      <h2 className="mt-5 text-2xl font-bold">{termsTitle7}</h2>
      <span>{termsParagraph7}</span>
      <h2 className="mt-5 text-2xl font-bold">{termsTitle8}</h2>
      <ParseHTML content={termsParagraph8} />
    </div>
  );
}
