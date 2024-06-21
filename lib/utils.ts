import { i18n } from "@/app/(root)/i118n";
import { type ClassValue, clsx } from "clsx";
import { getCookie } from "cookies-next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTimeStamp(date: Date) {
  const lang = getCookie("lang")?.toLocaleLowerCase() || "en";

  const now = new Date();
  const timeDifference = now.getTime() - date.getTime();
  const seconds = Math.floor(timeDifference / 1000);

  // define time intervals in milliseconds
  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;
  let timeStamp = "";

  if (timeDifference < minute) {
    timeStamp = `${seconds} ${seconds > 1 ? i18n()[lang]["seconds"] : i18n()[lang]["second"]}`;
  } else if (timeDifference < hour) {
    timeStamp = `${Math.floor(seconds / 60)} ${
      Math.floor(seconds / 60) > 1 ? i18n()[lang]["minutes"] : i18n()[lang]["minute"]
    }`;
  } else if (timeDifference < day) {
    timeStamp = `${Math.floor(seconds / 60 / 60)} ${
      Math.floor(seconds / 60 / 60) > 1 ? i18n()[lang]["hours"] : i18n()[lang]["hour"]
    }`;
  } else if (timeDifference < week) {
    timeStamp = `${Math.floor(seconds / 60 / 60 / 24)} ${
      Math.floor(seconds / 60 / 60 / 24) > 1 ? i18n()[lang]["days"] : i18n()[lang]["day"]
    }`;
  } else if (timeDifference < month) {
    timeStamp = `${Math.floor(seconds / 60 / 60 / 24 / 7)} ${
      Math.floor(seconds / 60 / 60 / 24 / 7) > 1 ? i18n()[lang]["weeks"] : i18n()[lang]["week"]
    }`;
  } else {
    timeStamp = `${Math.floor(seconds / 60 / 60 / 24 / 30)} ${
      Math.floor(seconds / 60 / 60 / 24 / 30) > 1 ? i18n()[lang]["months"] : i18n()[lang]["month"]
    }`;
  }
  return timeStamp;
}

const getTitles = (
  type: string,
  lang: string,
  name: string,
): { pluralTitle?: string; monoTitle?: string; comboTitle?: string } => {
  if (type === "question") {
    return {
      pluralTitle: i18n()[lang]["questions4"],
      monoTitle: i18n()[lang]["questions3"],
      comboTitle: `${i18n()[lang]["askedQuestions1"]} ${name} ${i18n()[lang]["askedQuestions2"]}`,
    };
  } else if (type === "answer") {
    return {
      pluralTitle: i18n()[lang]["answers"],
      monoTitle: i18n()[lang]["answer"],
      comboTitle: `${i18n()[lang]["askedQuestions1"]} ${name} ${i18n()[lang]["askedQuestions2"]}`,
    };
  } else if (type === "comment") {
    return {
      pluralTitle: i18n()[lang]["comments"],
      monoTitle: i18n()[lang]["comment1"],
      comboTitle: `${i18n()[lang]["leftComments"]} ${name} ${i18n()[lang]["leftComments2"]}`,
    };
  } else {
    return {};
  }
};

export const userContentTitle = (
  questionsCount: number,
  lang: string,
  name: string,
  type: string,
) => {
  if (questionsCount > 0) {
    return questionsCount > 1
      ? `${questionsCount} ${getTitles(type, lang, name).pluralTitle}:`
      : `${questionsCount} ${getTitles(type, lang, name).monoTitle}:`;
  } else {
    return getTitles(type, lang, name).comboTitle;
  }
};
