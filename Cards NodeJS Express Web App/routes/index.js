'use strict';
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Simple Card Game', players: 0 });
});

/* GET home page. */
router.get('/shuffle?', function (req, res) {
    var numberOfPlayers = parseInt(req.query.players);
    var theDeal = "";
    if (!isNaN(numberOfPlayers))
    {
        theDeal = getAndStoreDealFor(numberOfPlayers);
    }
    res.render('index', { title: 'Simple Card Game', dealtCardsPerUser: theDeal });
});


function Card(name, suite, value) {
    this.name = name;
    this.suit = suit;
    this.value = value;
    this.score = function(trumpSuit) {
        return (trumpSuit === this.suit) ? 2 * value : value;
    }
}

function deck() {
    return [
        new Card("Ace", "Hearts", 11),
        new Card("King", "Hearts", 4),
        new Card("Queen", "Hearts", 3),
        new Card("Jack", "Hearts", 2),
        new Card("10", "Hearts", 10),
        new Card("9", "Hearts", 0),
        new Card("8", "Hearts", 0),
        new Card("7", "Hearts", 0),
        new Card("6", "Hearts", 0),
        new Card("5", "Hearts", 0),
        new Card("4", "Hearts", 0),
        new Card("3", "Hearts", 0),
        new Card("2", "Hearts", 0),
        new Card("Ace", "Diamonds", 11),
        new Card("King", "Diamonds", 4),
        new Card("Queen", "Diamonds", 3),
        new Card("Jack", "Diamonds", 2),
        new Card("10", "Diamonds", 10),
        new Card("9", "Diamonds", 0),
        new Card("8", "Diamonds", 0),
        new Card("7", "Diamonds", 0),
        new Card("6", "Diamonds", 0),
        new Card("5", "Diamonds", 0),
        new Card("4", "Diamonds", 0),
        new Card("3", "Diamonds", 0),
        new Card("2", "Diamonds", 0),
        new Card("Ace", "Spades", 11),
        new Card("King", "Spades", 4),
        new Card("Queen", "Spades", 3),
        new Card("Jack", "Spades", 2),
        new Card("10", "Spades", 10),
        new Card("9", "Spades", 0),
        new Card("8", "Spades", 0),
        new Card("7", "Spades", 0),
        new Card("6", "Spades", 0),
        new Card("5", "Spades", 0),
        new Card("4", "Spades", 0),
        new Card("3", "Spades", 0),
        new Card("2", "Spades", 0),
        new Card("Ace", "Clubs", 11),
        new Card("King", "Clubs", 4),
        new Card("Queen", "Clubs", 3),
        new Card("Jack", "Clubs", 2),
        new Card("10", "Clubs", 10),
        new Card("9", "Clubs", 0),
        new Card("8", "Clubs", 0),
        new Card("7", "Clubs", 0),
        new Card("6", "Clubs", 0),
        new Card("5", "Clubs", 0),
        new Card("4", "Clubs", 0),
        new Card("3", "Clubs", 0),
        new Card("2", "Clubs", 0)
    ];
}

function hand(player, shuffledDeck) {

}

function getAndStoreDealFor(numberOfPlayers) {
    const cardsInSuit = 13;
    const shuffledDeck = fisherYatesInPlace(deck());
    const trumps = shuffledDeck[0].suit;
    var hands = [];

    for (var handIndex = 0; handIndex < numberOfPlayers; handIndex++) {
        var cardIndex = handIndex * cardsInSuit;
        hands[i] = slice(1 + cardIndex, cardIndex + cardsInSuit);
    }

    return {
        "trumps": trumps,
        "hands": hands
    }
}


function swapArrayElements(a, i, j) {
    const temp = a[j];
    a[j] = a[i];
    a[i] = temp;
}

// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle

function fisherYatesInPlace(items) {
    var itemsToGo = items.length;
    while (itemsToGo > 0) {
        var itemToSwap = Math.floor(Math.random() * itemsToGo--);
        swapArrayElements(items, itemToSwap, itemsToGo);
    }
    return items;
}

module.exports = router;
