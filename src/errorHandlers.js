export const handleBadRequest = (err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send({
      status: "Bad request",
      message: err.message,
      success: false,
      errorsList: err.errorsList,
    })
  } else {
    next(err)
  }
}
export const handleNotFound = (err, req, res, next) => {
  if (err.status === 404) {
    res
      .status(404)
      .send({ status: "Not found", message: err.message, success: false })
  } else {
    next(err)
  }
}
export const handleUnauthorized = (err, req, res, next) => {
  if (err.status === 401) {
    res
      .status(401)
      .send({ status: "Unauthorized", message: err.message, success: false })
  } else {
    next(err)
  }
}
export const genericServerError = (err, req, res, next) => {
  if (err.status === 500) {
    console.log("error", err)
    res.status(500).send({
      status: "Server error",
      message: "server error, we will fix this shortly",
      success: false,
    })
  } else {
    next(err)
  }
}
