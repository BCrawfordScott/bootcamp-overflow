const { Router } = require('express');

const {
    answerCreate,
} = require('../controllers/answers');

const router = Router();

router.post('/', answerCreate);


module.exports = router;
