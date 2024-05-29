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
    let sortOptions = {};

    // switch (filter) {
    //   case 'newest':
    //     sortOptions = { createdAt: -1 };
    //     break;
    //   case 'frequent':
    //     sortOptions = { views: -1 };
    //     break;
    //   case 'unanswered':
    //     query.answers = { $size: 0 };
    //     break;
    //   default:
    //     break;
    // }

    // const questions = await Question.find(query)
    //   .populate({ path: 'tags', model: Tag })
    //   .populate({ path: 'author', model: User })
    //   .skip(skip)
    //   .limit(pageSize)
    //   .sort(sortOptions);

    const questions = await fetch(
      `${envConfig.HOST}/api/questions?query=${searchQuery.q}&page=${page}&user_id=${searchQuery.user_id}&answers=${searchQuery.answers}`,
      { cache: "no-store" },
    ).then((result) => result.json());
    // return questions;

    // const questions = [] as any

    // const totalQuestions = 5 //await Question.countDocuments(query);
    const isNext = questions.length > MAX_PAGE_RESULT;
    return { questions, isNext };
  } catch (err) {
    console.log("Failed to get all questions", err);
    throw err;
  }
};

export const getQuestionById = async (id: string) => {
  try {
    // const question = await Question.findById(id)
    //   .populate({
    //     path: 'tags',
    //     model: Tag,
    //     select: '_id name',
    //   })
    //   .populate({
    //     path: 'author',
    //     model: User,
    //     select: '_id clerkId name picture',
    //   });
    // return question;

    const question = await fetch(`${envConfig.HOST}/api/questions/${id}`, {
      cache: "no-store",
    }).then((result) => result.json());
    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const upvoteQuestion = async (params: QuestionVoteParams) => {
  try {
    // const { questionId, userId, hasUpvoted, hasDownvoted, path } = params;
    // let updateQuery = {};
    // if (hasUpvoted) {
    //   updateQuery = { $pull: { upvotes: userId } };
    // } else if (hasDownvoted) {
    //   updateQuery = { $pull: { downvotes: userId }, $push: { upvotes: userId } };
    // } else {
    //   updateQuery = { $addToSet: { upvotes: userId } };
    // }
    // const question = await Question.findByIdAndUpdate(questionId, updateQuery, { new: true });
    // if (!question) throw new Error('Question not found');
    // revalidatePath(path);
    // // Increment user's reputation by +1/-1 for upvoting/revoking a question
    // await User.findByIdAndUpdate(userId, { $inc: { reputation: hasUpvoted ? -1 : 1 } });
    // // Increments author's reputation by +10/-10 for receiving/removing an upvote for the question
    // await User.findByIdAndUpdate(question.author, { $inc: { reputation: hasUpvoted ? -10 : 10 } });

    // return question;
    return {};
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const downvoteQuestion = async (params: QuestionVoteParams) => {
  try {
    // const { questionId, userId, hasUpvoted, hasDownvoted, path } = params;
    // let updateQuery = {};
    // if (hasDownvoted) {
    //   updateQuery = { $pull: { downvotes: userId } };
    // } else if (hasUpvoted) {
    //   updateQuery = { $pull: { upvotes: userId }, $push: { downvotes: userId } };
    // } else {
    //   updateQuery = { $addToSet: { downvotes: userId } };
    // }
    // const question = await Question.findByIdAndUpdate(questionId, updateQuery, { new: true });
    // if (!question) throw new Error('Question not found');
    // // Same logic as upvoting
    // await User.findByIdAndUpdate(userId, { $inc: { reputation: hasDownvoted ? -1 : 1 } });
    // await User.findByIdAndUpdate(question.author, {
    //   $inc: { reputation: hasDownvoted ? -10 : 10 },
    // });
    // revalidatePath(path);
    // // Increment user's reputation by 10 for upvoting a question
    // return question;

    return [];
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

    const questions = await fetch(`${envConfig.HOST}/api/questions?popular=true`, {
      cache: "no-store",
    }).then((result) => result.json());

    return questions;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
