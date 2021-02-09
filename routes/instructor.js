const { Router } = require('express');

const {
    userShow,
} = require('../controllers/users');

const router = Router();

// router.get('/:id(\\d+)', userShow);

module.exports = router;
