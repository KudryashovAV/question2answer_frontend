'use server';

import { FilterQuery } from 'mongoose';
import { revalidatePath } from 'next/cache';
import User, { IUser } from '@/db/models/user.model';
import Question from '@/db/models/question.model';
import Answer from '@/db/models/answer.model';
import Tag from '@/db/models/tag.model';
import {
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
} from '@/types/action';
import assignBadge from '@/utils/assignBadge';
import connectToDb from '@/db';
import envConfig from '@/config';
import md5 from 'md5';
import { MAX_PAGE_RESULT } from '@/utils/constants';

export const createUser = async (payload: IUser) => {
  try {
    const nowDate = new Date();
    const date =
      nowDate.getFullYear() +
      '/' +
      ('0' + (nowDate.getMonth() + 1)).slice(-2) +
      '/' +
      nowDate.getDate();

    console.log('payload', payload);
    const user = await fetch(`${envConfig.HOST}/api/users`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'X-CSRF-Token': md5(date),
        'Access-Control-Allow-Origin': '*',
      },
    }).then((result) => result.json());

    if (user.status != 'success') {
      throw 'Record was not created!';
    }

    return user;
  } catch (err) {
    console.log('Failed to create user', err);
    throw err;
  }
};

export const getAllUsers = async (params: GetAllUsersParams) => {
  try {
    const { searchQuery, page = 1 } = params;

    const users = await fetch(`${envConfig.HOST}/api/users?query=${searchQuery}&page=${page}`).then(
      (result) => result.json(),
    );

    const isNext = users.length > MAX_PAGE_RESULT;
    return { users, isNext };
  } catch (err) {
    console.log('Failed to get all users', err);
    throw err;
  }
};

export const getUserById = async (clerkId: string) => {
  try {
    const user = await fetch(`${envConfig.HOST}/api/users/${clerkId}`).then((result) =>
      result.json(),
    );

    return user;
  } catch (err) {
    console.log('Failed to get user by id', err);
    throw err;
  }
};

export const updateUser = async (clerkId: string, payload: any) => {
  try {
    await connectToDb();
    const existingUser = await User.findOne({ clerkId });
    if (!existingUser) throw new Error('User not found');
    const user = await User.findOneAndUpdate({ clerkId }, payload, { new: true });
    revalidatePath(`/profile/${user.username}`);
    return user;
  } catch (err) {
    console.log('Failed to update user', err);
    throw err;
  }
};

export const deleteUser = async (clerkId: string) => {
  try {
    await connectToDb();
    const user = await User.findOneAndDelete({ clerkId });
    if (!user) {
      throw new Error('User not found');
    }
    const userQuestionIds = await Question.find({ author: user._id }).distinct('_id');
    await Question.deleteMany({ author: user._id });
    await Answer.deleteMany({ author: user._id });
    return user;
  } catch (err) {
    console.log('Failed to delete user', err);
    throw err;
  }
};

export const toggleSaveQuestion = async (params: ToggleSaveQuestionParams) => {
  try {
    const { questionId, userId, path } = params;
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    const isQuestionSaved = user.savedQuestions.includes(questionId);
    if (isQuestionSaved) {
      // remove question from savedQuestions
      await user.updateOne({ $pull: { savedQuestions: questionId } });
    } else {
      // add question to savedQuestions
      await user.updateOne({ $push: { savedQuestions: questionId } });
    }
    revalidatePath(path);
  } catch (err) {
    console.log('Failed to save question', err);
    throw err;
  }
};

export const getSavedQuestions = async (params: GetSavedQuestionsParams) => {
  try {
    const { clerkId, searchQuery, filter, page = 1, pageSize = 20 } = params;
    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, 'i') } }
      : {};
    const skip = (page - 1) * pageSize;
    let sortOptions = {};
    switch (filter) {
      case 'most_recent':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'most_voted':
        sortOptions = { upvotes: -1 };
        break;
      case 'most_viewed':
        sortOptions = { views: -1 };
        break;
      case 'most_answered':
        sortOptions = { answers: -1 };
        break;
      default:
        break;
    }

    const user = await User.findOne({ clerkId }).populate({
      path: 'savedQuestions',
      match: query,
      options: {
        sort: sortOptions,
        skip,
        limit: pageSize,
      },
      populate: [
        { path: 'tags', model: Tag, select: '_id name' },
        { path: 'author', model: User, select: '_id clerkId name username picture' },
      ],
    });
    if (!user) throw new Error('User not found');
    // User's saved questions without pagination & sorting for checking if there is next page
    const user2 = await User.findOne({ clerkId }).populate({
      path: 'savedQuestions',
      match: query,
    });
    const isNext = user2.savedQuestions.length > skip + user.savedQuestions.length;
    const savedQuestions = user.savedQuestions;
    return { savedQuestions, isNext };
  } catch (err) {
    console.log('Failed to get saved questions', err);
    throw err;
  }
};

export const getUserInfo = async (id: string) => {
  try {
    const userInfo = await fetch(`${envConfig.HOST}/api/user_info?id=${id}`).then((result) =>
      result.json(),
    );
  
    if (!userInfo) throw new Error('User not found');

    return { userInfo };
  } catch (err) {
    console.log('Failed to get user info', err);
    throw err;
  }
};

export const getUserQuestions = async (params: GetUserStatsParams) => {
  try {
    const { userId, page = 1, pageSize = 10 } = params;
    const skip = (page - 1) * pageSize;
    const totalQuestions = await Question.countDocuments({ author: userId });
    const userQuestions = await Question.find({ author: userId })
      .sort({ createdAt: -1, views: -1, upvotes: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate('tags', '_id name')
      .populate('author', '_id clerkId name username picture');
    const isNext = totalQuestions > skip + userQuestions.length;
    return { totalQuestions, userQuestions, isNext };
  } catch (err) {
    console.log('Failed to get user questions', err);
    throw err;
  }
};

export const getUserAnswers = async (params: GetUserStatsParams) => {
  try {
    const { userId, page = 1, pageSize = 10 } = params;
    const skip = (page - 1) * pageSize;
    const totalAnswers = await Answer.countDocuments({ author: userId });
    const userAnswers = await Answer.find({ author: userId })
      .sort({ upvotes: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate('question', '_id title')
      .populate('author', '_id clerkId name username picture');
    const isNext = totalAnswers > skip + userAnswers.length;
    return { totalAnswers, userAnswers, isNext };
  } catch (err) {
    console.log('Failed to get user answers', err);
    throw err;
  }
};
