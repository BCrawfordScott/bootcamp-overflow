const { Router } = require('express');

const {
    questionIndex,
    questionNew,
    questionCreate,
} = require('../controllers/questions');

const router = Router();

router.get('/', questionIndex);
router.get('/new', questionNew);
router.post('/', questionCreate);

module.exports = router;