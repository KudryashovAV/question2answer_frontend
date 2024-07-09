import { Schema, model, models } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password?: string;
  bio?: string;
  picture: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
  savedQuestions?: Schema.Types.ObjectId[];
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    bio: { type: String },
    picture: { type: String, required: true },
    location: { type: String },
    portfolio: { type: String },
    reputation: { type: Number, default: 0 },
    savedQuestions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  },
  { timestamps: true },
);

const User = models.User || model<IUser>("User", userSchema);

export default User;
