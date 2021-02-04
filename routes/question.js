const { Router } = require('express');

const {
    questionIndex,
    questionNew,
    questionCreate,
    questionShow,
    questionEdit,
    questionUpdate,
} = require('../controllers/questions');

const router = Router();

router.get('/', questionIndex);
router.get('/:id(\\d+)/', questionShow);
router.get('/new', questionNew);
router.get('/:id(\\d+)/edit', questionEdit);
router.post('/', questionCreate);
router.post('/:id(\\d+)', questionUpdate)

module.exports = router;
