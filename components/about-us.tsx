"use client";

import { i18n } from "@/app/(root)/i118n";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

export default function AboutUsPage() {
  const [lang, setLang] = useState("en");

  let aboutUsPageTitle = i18n()[lang]["aboutUsPageTitle"];
  let aboutUsParagraph1 = i18n()[lang]["aboutUsParagraph1"];
  let aboutUsParagraph2 = i18n()[lang]["aboutUsParagraph2"];
  let aboutUsParagraph3 = i18n()[lang]["aboutUsParagraph3"];
  let aboutUsParagraph4 = i18n()[lang]["aboutUsFoaboutUsParagraph4urthParagraph"];
  let aboutUsParagraph5 = i18n()[lang]["aboutUsParagraph5"];
  let aboutUsParagraph6 = i18n()[lang]["aboutUsParagraph6"];
  let aboutUsParagraph7 = i18n()[lang]["aboutUsParagraph7"];
  let aboutUsParagraph8 = i18n()[lang]["aboutUsEighthParagraph"];

  useEffect(() => {
    setLang(getCookie("lang")?.toLocaleLowerCase() || "en");
    aboutUsParagraph1 = i18n()[lang]["aboutUsParagraph1"];
    aboutUsParagraph2 = i18n()[lang]["aboutUsParagraph2"];
    aboutUsParagraph3 = i18n()[lang]["aboutUsParagraph3"];
    aboutUsParagraph4 = i18n()[lang]["aboutUsParagraph4"];
    aboutUsParagraph5 = i18n()[lang]["aboutUsParagraph5"];
    aboutUsParagraph6 = i18n()[lang]["aboutUsParagraph6"];
    aboutUsParagraph7 = i18n()[lang]["aboutUsParagraph7"];
    aboutUsParagraph8 = i18n()[lang]["aboutUsParagraph8"];
  }, []);

  return (
    <div className="text-dark100_light900 mx-auto grid max-w-4xl gap-4 p-8 text-justify">
      <h1 className="mr-15 h1-bold text-dark100_light900">{aboutUsPageTitle}</h1>

      <p className="mt-12">{aboutUsParagraph1}</p>
      <p>{aboutUsParagraph2}</p>
      <p>{aboutUsParagraph3}</p>
      <p className="mt-10">{aboutUsParagraph4}</p>
      <p>{aboutUsParagraph5}</p>
      <p className="mt-10">{aboutUsParagraph6}</p>
      <p className="mt-10">{aboutUsParagraph7}</p>
      <p className="mt-10">{aboutUsParagraph8}</p>
    </div>
  );
}
