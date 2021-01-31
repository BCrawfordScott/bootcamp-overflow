const { Router } = require('express');

const { 
    createUser,
    newUser
 } = require('../controllers/users');

const router = Router();

router.post('/', createUser);
router.get('/new', newUser);

module.exports = router;

