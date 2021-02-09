const { Router } = require('express');

const { 
    createUser,
    newUser,
    userShow,
 } = require('../controllers/users');

const router = Router();

router.post('/', createUser);
router.get('/new', newUser);
router.get('/:id(\\d+)', userShow);

module.exports = router;

