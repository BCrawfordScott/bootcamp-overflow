const { Router } = require('express');

const {
    questionIndex,
    questionNew,
    questionCreate,
    questionShow,
} = require('../controllers/questions');

const router = Router();

router.get('/', questionIndex);
router.get('/:id', questionShow);
router.get('/new', questionNew);
router.post('/', questionCreate);

module.exports = router;
