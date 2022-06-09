import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
const { Schema, model } = mongoose

const likeSchema = new Schema(
  {
    user: { type: mongoose.Types.ObjectId, required: true },
    postLiked: { type: mongoose.Types.ObjectId, required: true, unique: true }
  },
  { timestamps: true }
)

likeSchema.plugin(uniqueValidator)
export default model('Like', likeSchema)
