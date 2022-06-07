import mongoose from "mongoose"
const { Schema, model } = mongoose

const postSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      //server generated image url
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
  },
  { timestamps: true }
)

export default model("Post", postSchema)
