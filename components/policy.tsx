"use client";

import { i18n } from "@/app/(root)/i118n";
import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";
import ParseHTML from "./parse-html";

export default function PolicyPage() {
  const [lang, setLang] = useState("en");

  let privacyPageTitle = i18n()[lang]["privacyPageTitle"];
  let privacyTitle0 = i18n()[lang]["privacyTitle0"];
  let privacyTitle1 = i18n()[lang]["privacyTitle1"];
  let privacyTitle2 = i18n()[lang]["privacyTitle2"];
  let privacyTitle3 = i18n()[lang]["privacyTitle3"];
  let privacyTitle4 = i18n()[lang]["privacyTitle4"];
  let privacyTitle5 = i18n()[lang]["privacyTitle5"];
  let privacyTitle6 = i18n()[lang]["privacyTitle6"];
  let privacyTitle7 = i18n()[lang]["privacyTitle7"];
  let privacyTitle8 = i18n()[lang]["privacyTitle8"];
  let privacyTitle9 = i18n()[lang]["privacyTitle9"];
  let privacyParagraph0 = i18n()[lang]["privacyParagraph0"];
  let privacyParagraph1 = i18n()[lang]["privacyParagraph1"];
  let privacyParagraph2 = i18n()[lang]["privacyParagraph2"];
  let privacyParagraph3 = i18n()[lang]["privacyParagraph3"];
  let privacyParagraph4 = i18n()[lang]["privacyParagraph4"];
  let privacyParagraph5 = i18n()[lang]["privacyParagraph5"];
  let privacyParagraph6 = i18n()[lang]["privacyParagraph6"];
  let privacyParagraph7 = i18n()[lang]["privacyParagraph7"];
  let privacyParagraph8 = i18n()[lang]["privacyParagraph8"];
  let privacyParagraph9 = i18n()[lang]["privacyParagraph9"];
  let privacyParagraph10 = i18n()[lang]["privacyParagraph10"];

  useEffect(() => {
    setLang(getCookie("lang")?.toLocaleLowerCase() || "en");
    privacyPageTitle = i18n()[lang]["privacyPageTitle"];
    privacyTitle0 = i18n()[lang]["privacyTitle0"];
    privacyTitle1 = i18n()[lang]["privacyTitle1"];
    privacyTitle2 = i18n()[lang]["privacyTitle2"];
    privacyTitle3 = i18n()[lang]["privacyTitle3"];
    privacyTitle4 = i18n()[lang]["privacyTitle4"];
    privacyTitle5 = i18n()[lang]["privacyTitle5"];
    privacyTitle6 = i18n()[lang]["privacyTitle6"];
    privacyTitle7 = i18n()[lang]["privacyTitle7"];
    privacyTitle8 = i18n()[lang]["privacyTitle8"];
    privacyTitle9 = i18n()[lang]["privacyTitle9"];
    privacyParagraph0 = i18n()[lang]["privacyParagraph0"];
    privacyParagraph1 = i18n()[lang]["privacyParagraph1"];
    privacyParagraph2 = i18n()[lang]["privacyParagraph2"];
    privacyParagraph3 = i18n()[lang]["privacyParagraph3"];
    privacyParagraph4 = i18n()[lang]["privacyParagraph4"];
    privacyParagraph5 = i18n()[lang]["privacyParagraph5"];
    privacyParagraph6 = i18n()[lang]["privacyParagraph6"];
    privacyParagraph7 = i18n()[lang]["privacyParagraph7"];
    privacyParagraph8 = i18n()[lang]["privacyParagraph8"];
    privacyParagraph9 = i18n()[lang]["privacyParagraph9"];
    privacyParagraph10 = i18n()[lang]["privacyParagraph10"];
  }, []);

  return (
    <div className="text-dark100_light900 mx-auto grid max-w-4xl gap-4 p-8 text-justify">
      <h1 className="mr-15 h1-bold text-dark100_light900">{privacyPageTitle}</h1>
      <span className="mt-12">{privacyParagraph0}</span>
      <h2 className="mt-5 text-2xl font-bold">{privacyTitle0}</h2>
      <ParseHTML content={privacyParagraph1} />
      <h2 className="text-2xl font-bold">{privacyTitle1}</h2>
      <ParseHTML content={privacyParagraph2} />
      <h2 className="text-2xl font-bold">{privacyTitle2}</h2>
      <span>{privacyParagraph3}</span>
      <h2 className="mt-5 text-2xl font-bold">{privacyTitle3}</h2>
      <span>{privacyParagraph4}</span>
      <h2 className="mt-5 text-2xl font-bold">{privacyTitle4}</h2>
      <span>{privacyParagraph5}</span>
      <h2 className="mt-5 text-2xl font-bold">{privacyTitle5}</h2>
      <ParseHTML content={privacyParagraph6} />
      <h2 className="text-2xl font-bold">{privacyTitle6}</h2>
      <span>{privacyParagraph7}</span>
      <h2 className="mt-5 text-2xl font-bold">{privacyTitle7}</h2>
      <span>{privacyParagraph8}</span>
      <h2 className="mt-5 text-2xl font-bold">{privacyTitle8}</h2>
      <span>{privacyParagraph9}</span>
      <h2 className="mt-5 text-2xl font-bold">{privacyTitle9}</h2>
      <ParseHTML content={privacyParagraph10} />
    </div>
  );
}
