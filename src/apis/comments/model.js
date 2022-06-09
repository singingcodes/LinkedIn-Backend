import mongoose from "mongoose"
const { Schema, model } = mongoose

const commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 500,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
  },
  { timestamps: true }
)

export default model("Comment", commentSchema)
