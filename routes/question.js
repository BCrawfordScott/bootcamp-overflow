const { Router } = require('express');

const {
    questionIndex,
    questionNew,
    questionCreate,
    questionShow,
    questionEdit,
    questionUpdate,
    questionDestroy,
} = require('../controllers/questions');

const {
    answerCreate,
} = require('../controllers/answers');

const router = Router();

router.get('/', questionIndex);
router.get('/:id(\\d+)/', questionShow);
router.get('/new', questionNew);
router.get('/:id(\\d+)/edit', questionEdit);
router.post('/', questionCreate);
router.post('/:id(\\d+)', questionUpdate);
router.post('/:id(\\d+)/delete', questionDestroy);
router.post('/:id/answers', answerCreate)

module.exports = router;
