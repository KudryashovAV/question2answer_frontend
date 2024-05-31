"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { setUrlParams } from "@/utils/queryString";
import { Button } from "@/components/ui/button";
import { i18n } from "@/app/(root)/i118n";
import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";
import { MAX_PAGE_RESULT } from "@/utils/constants";

interface PaginationProps {
  pageNumber: number;
  total_pages: number;
  total_records: number;
  records_type: string;
  isNext: boolean;
}

export default function Pagination({
  pageNumber,
  isNext,
  total_pages,
  total_records,
  records_type,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lang, setLang] = useState("en");

  const handlePagination = (direction: string) => {
    const nextPageNumber = direction === "prev" ? pageNumber - 1 : pageNumber + 1;
    const newUrl = setUrlParams({
      params: searchParams.toString(),
      key: "page",
      value: nextPageNumber.toString(),
    });
    router.push(newUrl);
  };

  let next = i18n()[lang]["next"];
  let prev = i18n()[lang]["prev"];
  let page = i18n()[lang]["page"];
  let from = i18n()[lang]["from"];

  useEffect(() => {
    setLang(getCookie("lang")?.toLocaleLowerCase() || "en");
    next = i18n()[lang]["next"];
    prev = i18n()[lang]["prev"];
    page = i18n()[lang]["page"];
    from = i18n()[lang]["from"];
  }, [lang]);

  if (!isNext && pageNumber === 1) return null;

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <Button
        size="sm"
        disabled={pageNumber === 1}
        onClick={() => handlePagination("prev")}
        className="dark:bg-light-700"
      >
        {prev}
      </Button>
      <div className="rounded-md bg-brand-500 px-3.5 py-2 text-sm font-semibold text-light-800">
        <p>
          {page} {pageNumber} {from} {total_pages} - {MAX_PAGE_RESULT} {from} {total_records}{" "}
          {records_type}
        </p>
      </div>
      <Button
        size="sm"
        disabled={pageNumber >= total_pages}
        onClick={() => handlePagination("next")}
        className="dark:bg-light-700"
      >
        {next}
      </Button>
    </div>
  );
}
