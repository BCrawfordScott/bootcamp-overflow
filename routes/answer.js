const { Router } = require('express');

const {
    answerUpdate,
    answerDestroy,
} = require('../controllers/answers');

const router = Router();

router.post('/:id(\\d+)', answerUpdate);
router.post('/:id(\\d+)/delete', answerDestroy);

module.exports = router;
