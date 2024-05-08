'use server';

import { FilterQuery } from 'mongoose';
import Tag, { ITag } from '@/db/models/tag.model';
import User from '@/db/models/user.model';
import Question from '@/db/models/question.model';
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from '@/types/action';
import envConfig from '@/config';
import { MAX_PAGE_RESULT } from '@/utils/constants';

export const getAllTags = async (params: GetAllTagsParams) => {
  try {
    const { searchQuery, page = 1 } = params;
    const query: FilterQuery<typeof Tag> = {};
    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, 'i') } }];
    }

    const tags = await fetch(`${envConfig.HOST}/api/tags?query=${searchQuery}&page=${page}`).then(
      (result) => result.json(),
    );

    // const totalTags = await Tag.countDocuments(query);
    const isNext = tags.length > MAX_PAGE_RESULT;
    return { tags, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getTopInteractedTags = async (params: GetTopInteractedTagsParams) => {
  try {
    const { userId, limit = 3 } = params;
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    const tags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: '$questions' } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: limit },
    ]);
    return [
      { id: '1', name: 'Tag 1' },
      { id: '2', name: 'Tag 2' },
      { id: '3', name: 'Tag 3' },
    ];
  } catch (error) {
    console.log(error);
  }
};

export const getQuestionsByTagId = async (params: GetQuestionsByTagIdParams) => {
  try {
    const { tagId } = params;

    const { tag, questions } = await fetch(`${envConfig.HOST}/api/tags/${tagId}`).then((result) =>
      result.json(),
    );

    const isNext = questions.length > MAX_PAGE_RESULT;
    return { tagName: tag.name, questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getPopularTags = async () => {
  try {
    const tags = await fetch(`${envConfig.HOST}/api/tags`).then((result) => result.json());

    return tags.slice(0, 5);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
