import mongoose from 'mongoose'
const { Schema, model } = mongoose

const postSchema = new Schema(
  {
    text: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: 'https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png'
      //server generated image url
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Profile'
    }
  },
  { timestamps: true }
)

export default model('Post', postSchema)
