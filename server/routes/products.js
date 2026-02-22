const router = require("express").Router()
const createError = require("http-errors")
const productsModel = require("../models/products")

// read all records
router.get("/products", (req, res, next) =>
{
    productsModel.find({})
    .then(data => res.json(data))
    .catch(err => next(err))
})

// read one record
router.get("/products/:id", (req, res, next) =>
{
    productsModel.findById(req.params.id)
    .then(data => res.json(data))
    .catch(err => next(err))
})

// add new record
router.post("/products", (req, res, next) =>
{
    productsModel.create(req.body)
    .then(data => res.json(data))
    .catch(err => next(err))
})

// update one record
router.put("/products/:id", (req, res, next) =>
{
    productsModel.findByIdAndUpdate(req.params.id, {$set: req.body})
    .then(data => res.json(data))
    .catch(err => next(err))
})

// delete one record
router.delete("/products/:id", (req, res, next) =>
{
    productsModel.findByIdAndDelete(req.params.id)
    .then(data => res.json(data))
    .catch(err => next(err))
})

module.exports = router