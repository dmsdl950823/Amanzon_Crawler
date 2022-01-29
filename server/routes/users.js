const router = require('express').Router()
let User = require('../models/user.model')

router.route('/').get((req, res) => {
  User.find()
    .then(users => )
})