const { Router } = require('express');

const {
    newLogin,
    loginUser,
    logoutUser,
} = require('../controllers/auth');

const router = Router();

router.get('/login', newLogin);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

module.exports = router;