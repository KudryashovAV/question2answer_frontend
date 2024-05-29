"use server";

import md5 from "md5";
import envConfig from "@/config";

import { revalidatePath } from "next/cache";
import { Key } from "react";

interface CreateCommentsParams {
  content: string;
  owner_id: string | Key | null | undefined;
  owner_type: string;
  user_id: number | string;
  path: string;
}

interface DeleteCommentParams {
  owner_id: string;
  owner_type: string;
}

export const createComment = async (params: CreateCommentsParams) => {
  try {
    const { path } = params;

    const nowDate = new Date();
    const date =
      nowDate.getFullYear() +
      "/" +
      ("0" + (nowDate.getMonth() + 1)).slice(-2) +
      "/" +
      ("0" + nowDate.getDate()).slice(-2);

    console.log("params", params);

    const answer = await fetch(`${envConfig.HOST}/api/comments`, {
      cache: "no-store",
      method: "POST",
      body: JSON.stringify(params),
      headers: { "X-CSRF-Token": md5(date) },
    }).then((result) => result.json());

    if (answer.status != "success") {
      throw "Record was not created!";
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// export const deleteAnswer = async (params: DeleteCommentParams) => {
//   try {
//     const { answerId, path } = params;
//     const answer = await Answer.findByIdAndDelete({ _id: answerId });
//     if (!answer) throw new Error('Answer not found');
//     await Question.updateMany({ _id: answer.question }, { $pull: { answers: answerId } });
//     await Interaction.deleteMany({ answer: answerId });
//     revalidatePath(path);
//     return answer;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };
