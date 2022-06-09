import express from "express"
import CommentsModel from "./model.js"
import createError from "http-errors"

const router = express.Router()

//GET /api/posts/{id}/comment
router.get("/:id", async (req, res, next) => {
  try {
    const comments = await CommentsModel.find({ post: req.params.id }).populate(
      { path: "post" }
    )
    res.send(comments)
  } catch (err) {
    next(err)
  }
})

//POST /api/posts/{id}/comment
router.post("/:id", async (req, res, next) => {
  try {
    const newComment = new CommentsModel(req.body)
    newComment.post = req.params.id
    const { _id } = await newComment.save()
    res.status(201).send({ _id })
  } catch (err) {
    next(err)
  }
})

//PUT /api/posts/{id}/comment
router.put("/:id", async (req, res, next) => {
  try {
    const comment = await CommentsModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
    if (!comment) {
      next(createError(404, `Comment with id ${req.params.id} not found`))
    }
    res.send(comment)
  } catch (err) {
    next(err)
  }
})
//DELETE /api/posts/{id}/comment
router.delete("/:id", async (req, res, next) => {
  try {
    const comment = await CommentsModel.findByIdAndDelete(req.params.id)
    if (!comment) {
      next(createError(404, `Comment with id ${req.params.id} not found`))
    }
    res.status(204).send()
  } catch (err) {
    next(err)
  }
})

export default router
