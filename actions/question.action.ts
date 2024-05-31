"use server";

import { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";
import { MAX_PAGE_RESULT } from "@/utils/constants";
import Question from "@/db/models/question.model";
import envConfig from "@/config";
import {
  DeleteQuestionParams,
  EditQuestionParams,
  GetAllQuestionsParams,
  QuestionVoteParams,
} from "@/types/action";
import md5 from "md5";
import { auth } from "@clerk/nextjs/server";

export const createQuestion = async (payload: any) => {
  const { tags, ...rest } = payload;
  try {
    const nowDate = new Date();
    const date =
      nowDate.getFullYear() +
      "/" +
      ("0" + (nowDate.getMonth() + 1)).slice(-2) +
      "/" +
      ("0" + nowDate.getDate()).slice(-2);
    const csrfToken = md5(date);
    const userId = auth().userId;

    const question = await fetch(`${envConfig.HOST}/api/questions`, {
      cache: "no-store",
      method: "POST",
      body: JSON.stringify({ user_id: userId, ...rest }),
      headers: {
        "X-CSRF-Token": csrfToken,
        "Access-Control-Allow-Origin": "*",
      },
    }).then((result) => result.json());

    for (const tagName of tags) {
      const tag = await fetch(`${envConfig.HOST}/api/tags`, {
        cache: "no-store",
        method: "POST",
        body: JSON.stringify({ name: tagName }),
        headers: {
          "X-CSRF-Token": csrfToken,
          "Access-Control-Allow-Origin": "*",
        },
      }).then((result) => result.json());

      await fetch(`${envConfig.HOST}/api/question_tags`, {
        cache: "no-store",
        method: "POST",
        body: JSON.stringify({ questionId: question.id, tagId: tag.id }),
        headers: {
          "X-CSRF-Token": csrfToken,
          "Access-Control-Allow-Origin": "*",
        },
      }).then((result) => result.json());
    }

    revalidatePath("/");
  } catch (err) {
    console.log("Failed to create question", err);
    throw err;
  }
};

export const getAllQuestions = async (params: GetAllQuestionsParams) => {
  try {
    const { searchQuery, filter, page = 1 } = params;
    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }
    const defaultPage = searchQuery.q != "undefind" ? 1 : page;

    const { questions, total_pages, total_records } = await fetch(
      `${envConfig.HOST}/api/questions?query=${searchQuery.q}&page=${defaultPage}&user_id=${searchQuery.user_id}&answers=${searchQuery.answers}&comments=${searchQuery.comments}`,
      { cache: "no-store" },
    ).then((result) => result.json());

    const isNext = total_records > MAX_PAGE_RESULT && page <= total_pages;
    return { questions, isNext, total_pages, total_records };
  } catch (err) {
    console.log("Failed to get all questions", err);
    throw err;
  }
};

export const getQuestionById = async (slug: string) => {
  try {
    const question = await fetch(`${envConfig.HOST}/api/questions/${slug}`, {
      cache: "no-store",
    }).then((result) => result.json());

    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateQuestion = async (params: EditQuestionParams) => {
  try {
    // const { questionId, title, content, path } = params;
    // const question = await Question.findByIdAndUpdate(
    //   { _id: questionId },
    //   { title, content },
    //   { new: true },
    // );
    // if (!question) throw new Error('Question not found');
    // revalidatePath(path);
    // return question;
    return {};
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteQuestion = async (params: DeleteQuestionParams) => {
  try {
    // const { questionId, path } = params;
    // const question = await Question.findByIdAndDelete({ _id: questionId });
    // if (!question) throw new Error('Question not found');
    // await Answer.deleteMany({ question: questionId });
    // await Tag.updateMany({ questions: questionId }, { $pull: { questions: questionId } });
    // await Interaction.deleteMany({ question: questionId });
    // revalidatePath(path);
    // return question;
    return {};
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getTopQuestions = async () => {
  try {
    // const topQuestions = await Question.find({}).sort({ views: -1, upvotes: -1 }).limit(5);
    // return topQuestions;

    const { questions, total_pages, total_records } = await fetch(
      `${envConfig.HOST}/api/questions?popular=true`,
      {
        cache: "no-store",
      },
    ).then((result) => result.json());

    return { questions, total_pages, total_records };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
