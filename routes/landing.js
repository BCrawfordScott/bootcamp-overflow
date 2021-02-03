const { Router } = require('express');

const { Questions } = require('../db/models')

const router = Router();

router.get('/', async (_req, res) => { 
    const questions = await Questions.findAll({ order: [['createdAt', 'DESC']], limit: 10});
    res.render('landing', {
        title: 'Welcome',
        questions,
     }); 
});

module.exports = router;