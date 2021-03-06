import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
const { Schema, model } = mongoose

const likeSchema = new Schema(
  {
    user: [{ type: mongoose.Types.ObjectId, required: true, unique: true }],
    post: { type: mongoose.Types.ObjectId, required: true }
  },
  { timestamps: true }
)

likeSchema.plugin(uniqueValidator)
export default model('Like', likeSchema)
