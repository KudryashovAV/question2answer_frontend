import { Schema, model, models } from "mongoose";

export interface IQuestion {
  title: string;
  content: string;
  tags: Schema.Types.ObjectId[];
  views: number;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  author: Schema.Types.ObjectId;
  answers: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    views: { type: Number, default: 0 },
    upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    author: { type: Schema.Types.ObjectId, ref: "User" },
    answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
  },
  { timestamps: true },
);

const Question = models.Question || model<IQuestion>("Question", questionSchema);

export default Question;
