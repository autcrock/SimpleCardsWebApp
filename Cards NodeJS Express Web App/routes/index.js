'use strict';
var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();

/* SQLite3 table and column names */
const dbName = 'simple_card_game.db';
const tableName = 'deals';
const workingColumn1 = 'deal';
const workingColumn2 = 'winners';
const workingColumn3 = 'winningscore';

var db = new sqlite3.Database(dbName);

var CardSupport = require('../lib/CardSupport');
var cards = new CardSupport();

/* GET home page. */
router.get('/', function (req, res) {
    db.serialize(function () {
        db.run("CREATE TABLE IF NOT EXISTS " + tableName + " (" + workingColumn1 + " TEXT, " + workingColumn2 + " TEXT, " + workingColumn3 + " INTEGER, datetimestamp datetime)");
    });
    res.render('index', { title: 'Simple Card Game', dealtCardsPerUser: false });
});

/* GET shuffle and deal for up to 10 players. */
router.get('/shuffle?', function (req, res) {
    var numberOfPlayers = parseInt(req.query.players);
    let theDeal;
    if (!isNaN(numberOfPlayers) && numberOfPlayers > 0 && numberOfPlayers <= 10) {
        theDeal = cards.getAndStoreDealFor(numberOfPlayers);
    } else {
        theDeal = {numberOfPlayersError: numberOfPlayers};
    }

    db.serialize(function () {
        var stmt = db.prepare("INSERT INTO " + tableName + " VALUES (?, ?, ?, datetime('now'))");
        stmt.run(JSON.stringify(theDeal), JSON.stringify(theDeal.winners), theDeal.winningScore);
        stmt.finalize();

        db.each( "SELECT rowid AS id, " + tableName + "FROM " + tableName
                , function (err, row) {
                    console.log("deal: " + row.id + ": " + row.info);
                }, function () {
                    res.render('index',
                        {
                            title: 'Simple Card Game', dealtCardsPerUser: JSON.stringify(theDeal)
                        });
                });
    });
});

/* GET Finish game session. */
router.get('/finish', function (req, res) {
    db.close();
    res.render('finish',
        {
            title: 'Simple Card Game is finished and gone, like your last pay cheque. Gone, gone away.'
            , attribution: '(Paraphrasing the John Hiatt song: Gone)'
        });
});

module.exports = router;
