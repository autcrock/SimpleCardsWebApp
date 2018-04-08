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
const workingColumn4 = 'request';

var db = new sqlite3.Database(dbName);

var CardSupport = require('../lib/CardSupport');
var cards = new CardSupport();

/* GET home page. */
router.get('/', function (req, res) {
    db.serialize(function () {
        db.run("CREATE TABLE IF NOT EXISTS " + tableName + " ("
            + workingColumn1 + " TEXT, "
            + workingColumn2 + " TEXT, "
            + workingColumn3 + " INTEGER, "
            + workingColumn4 + " TEXT, datetimestamp datetime)");
    });
    res.render('index', { title: 'Simple Card Game', dealtCardsPerUser: false });
});

/* GET shuffle and deal for up to 10 players. Record details in game history database. */
router.get('/shuffle?', function (req, res) {
    var numberOfPlayers = parseInt(req.query.players);
    let theDeal;

    // Client identification needs more investigation, but the intent is here...
    // See https://stackoverflow.com/questions/8107856/how-to-determine-a-users-ip-address-in-node
    // Further work could include NPM's useragent module.
    const xForwardedFor = req.headers['x-forwarded-for'];
    const ip = xForwardedFor
        ? xForwardedFor.split(',').pop()
        : req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    const clientDetails = {
        ip: ip
        , headers: req.headers
    }

    if (!isNaN(numberOfPlayers) && numberOfPlayers > 0 && numberOfPlayers <= 10) {
        theDeal = cards.getAndStoreDealFor(numberOfPlayers);
    } else {
        theDeal = {numberOfPlayersError: numberOfPlayers};
    }

    db.serialize(function () {
        var stmt = db.prepare("INSERT INTO " + tableName + " VALUES (?, ?, ?, ?, datetime('now'))");
        stmt.run(
            JSON.stringify(theDeal)
            , JSON.stringify(theDeal.winners)
            , theDeal.winningScore
            , JSON.stringify(clientDetails));
        stmt.finalize();

        db.each( "SELECT rowid AS id, " + tableName + "FROM " + tableName
                , function (err, row) {
                    console.log("deal: "
                    + workingColumn1 + ", "
                    + workingColumn2 + ", "
                    + workingColumn3 + ", "
                    + workingColumn4 + " TEXT, datetimestamp datetime)");}
                , function () {
                    res.render('index',
                        {
                            title: 'Simple Card Game', dealtCardsPerUser: JSON.stringify(theDeal)
                        });
                });
    });
});

/* GET Finish game session. */
router.get('/finish', function (req, res) {
    // Don't close the DB when a browser session closes, to allow other sessions to continue and for new ones to start
    // Further investigation needed to ensure graceful closedown of SQLite when express itself is closed
    // either deliberately or by misadventure.

//    db.close((err) => {
//        if (err) {
//            console.error(err.message);
//        }
//        console.log('Closed the SQLite database connection.');
//    });

    res.render('finish',
        {
            title: 'Simple Card Game is finished.'
        });
});

module.exports = router;
