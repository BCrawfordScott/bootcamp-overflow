const { Router } = require('express');

const {
    userChangeRole,
} = require('../controllers/users');

const router = Router();

router.patch('/users/:id(\\d+)/changerole', userChangeRole);

module.exports = router;
