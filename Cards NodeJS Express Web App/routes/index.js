'use strict';
var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();

const db_name = "simple_card_game_db";
var db = new sqlite3.Database(db_name);

var CardSupport = require('../lib/CardSupport');
var cards = new CardSupport();

const table_name = 'deals';
const working_column = 'deal';

/* GET home page. */
router.get('/', function (req, res) {
    db.serialize(function () {
        db.run("CREATE TABLE IF NOT EXISTS " + table_name + " (" + working_column + " TEXT)");
    });
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

    const theDealString = JSON.stringify(theDeal);
    db.serialize(function () {
        var stmt = db.prepare("INSERT INTO " + table_name + " VALUES (?)");
        stmt.run(theDealString);
        stmt.finalize();

        db.each( "SELECT rowid AS id, " + table_name + "FROM " + table_name
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

/* GET shuffle and deal for up to 10 players. */
router.get('/finish', function (req, res) {
    db.close();
    res.render('finish',
        {
            title: 'Simple Card Game says - Gone - like your last pay cheque. Gone, gone away.'
            , attribution: '(Paraphrasing the John Hiatt song: Gone)'
        });
});

module.exports = router;
