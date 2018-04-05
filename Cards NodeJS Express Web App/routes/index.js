'use strict';
var express = require('express');
var router = express.Router();

var CardSupport = require('../lib/CardSupport');
var cards = new CardSupport();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Simple Card Game', dealtCardsPerUser: false });
});

/* GET shuffle and deal for up to 10 players. */
router.get('/shuffle?', function (req, res) {
    var numberOfPlayers = parseInt(req.query.players);
    let theDeal;
    if (!isNaN(numberOfPlayers) && numberOfPlayers <= 10) {
        theDeal = cards.getAndStoreDealFor(numberOfPlayers);
    } else {
        theDeal = {numberOfPlayersError: numberOfPlayers};
    }
    res.render('index', { title: 'Simple Card Game', dealtCardsPerUser: JSON.stringify(theDeal) });
});


module.exports = router;
