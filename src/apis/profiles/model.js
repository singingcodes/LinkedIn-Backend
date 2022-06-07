import mongoose from "mongoose"
import uniqueValidator from "mongoose-unique-validator"
const { Schema, model } = mongoose

const profileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png",
    },
    area: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
)

profileSchema.plugin(uniqueValidator)
export default model("Profile", profileSchema)
