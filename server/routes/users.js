const router = require(`express`).Router()
const createError = require('http-errors')
const usersModel = require(`../models/users`)


// IMPORTANT
// Obviously, in a production release, you should never have the code below, as it allows a user to delete a database collection
// The code below is for development testing purposes only 
router.post(`/users/reset_user_collection`, (req, res, next) =>
{
    usersModel.deleteMany({})
    .then(data =>
    {
        const adminPassword = `123-qwe_QWE`

        usersModel.create({name: "Administrator", email: "admin@admin.com", password: adminPassword, accessLevel: parseInt(process.env.ACCESS_LEVEL_ADMIN)})
        .then(createData => res.json(createData))
        .catch(err => next(createError(500, `Failed to create Admin user for testing purposes`)))
    })
    .catch(err => next(err))
})


router.post(`/users/register/:name/:email/:password`, (req, res, next) =>
{
    // If a user with this email does not already exist, then create new user
    usersModel.findOne({email: req.params.email})
    .then(uniqueData =>
    {
        if(uniqueData)
        {
            next(createError(500, `User already exists`))
        }
        else
        {
            usersModel.create({name: req.params.name, email: req.params.email, password: req.params.password})
            .then(data => res.json({name: data.name, accessLevel: data.accessLevel}))
            .catch(err => next(err))
        }
    })
    .catch(err => next(err))
})


module.exports = router
