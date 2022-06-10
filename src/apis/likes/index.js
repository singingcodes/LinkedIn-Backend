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
    const user = ProfileModel.findById(req.body.userId)
    if (!user) return next(createError(404, `User with ID ${req.body.userId} not found!`))
    const newLike = new LikeModel(req.body)
    const { _id } = await newLike.save()
    res.status(201).send(_id)
  } catch (error) {
    console.log(error)
    next(error)
  }
})
router.delete('/:postId/like/:likeId/:userId', async (req, res, next) => {
  try {
    const post = PostModel.findById(req.params.postId)
    if (!post) return next(createError(404, `Post with ID ${req.params.postId} not found!`))

    const user = ProfileModel.findById(req.body.userId)
    if (!user) return next(createError(404, `User with ID ${req.body.userId} not found!`))

    const like = LikeModel.findById(req.params.likeId)
    if (!like) return next(createError(404, `Like with id ${req.params.likeId} not found!`))
    const foundUser = like.user.find((user) => user._id === req.params.userId)
    if (!foundUser) return next(createError(404, `User with id ${req.params.userId} not found!`))
    const updatedLike = LikeModel.findByIdAndUpdate(
      req.params.likeId,
      { $pull: { 'like.user': foundUser } },
      { new: true, runValidators: true }
    )
    res.status(204).send()
  } catch (error) {
    console.log(error)
    next(error)
  }
})

export default router
