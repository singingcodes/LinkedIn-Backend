import express from 'express'
import LikeModel from './model.js'
import PostModel from '../posts/model.js'
import ProfileModel from '../profiles/model.js'
import createError from 'http-errors'

const router = express.Router()

router.post('/:postId/like', async (req, res, next) => {
  try {
    const post = PostModel.findById(req.params.postId)
    if (!post) return next(createError(404, `Post with ID ${req.params.postId} not found!`))
    const user = ProfileModel.findById(req.params.userId)
    if (!user) return next(createError(404, `User with ID ${req.params.userId} not found!`))
    const newLike = new LikeModel(req.body)
    const { _id } = await newLike.save()
    res.status(201).send(_id)
  } catch (error) {
    console.log(error)
    next(error)
  }
})
router.delete('/:postId/like', async (req, res, next) => {
  try {
    const post = PostModel.findById(req.params.postId)
    if (!post) return next(createError(404, `Post with ID ${req.params.postId} not found!`))
    const user = ProfileModel.findById(req.params.userId)
    if (!user) return next(createError(404, `User with ID ${req.params.userId} not found!`))
    const deletedLike = LikeModel.findByIdAndDelete()
  } catch (error) {
    console.log(error)
    next(error)
  }
})

export default router
