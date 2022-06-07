import mongoose from 'mongoose'
const { Schema, model } = mongoose

const experienceSchema = new Schema(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String, required: true },
    area: { type: String, required: true },
    image: {
      type: String,
      default: 'https://www.kindpng.com/picc/m/451-4517876_default-profile-hd-png-download.png'
    },
    profile: { type: Schema.Types.ObjectId, required: true, ref: 'Profile' }
  },
  { timestamps: true }
)

export default model('Experience', experienceSchema)
