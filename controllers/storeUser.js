const User = require("../models/User");
const path = require('path');

module.exports = async (req, res) => {
    User.create(req.body, (error, user) => {
        if (error) {
            // res.status(404).send(error)
            const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message)
            // req.session.validationErrors = validationErrors
            req.flash('validationErrors', validationErrors)
            req.flash('data', req.body)
            return res.redirect('/auth/register')

        }

        res.redirect('/')
    })
}