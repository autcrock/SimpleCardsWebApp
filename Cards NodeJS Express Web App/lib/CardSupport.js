'use strict';

function Card(name, suit, value) {
    this.name = name;
    this.suit = suit;
    this.value = value;
    this.score = function (trumpSuit) {
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

function dealToPlayer(player, shuffledDeck) {
    const cardsInDeal = 5;
    const cardIndex = player * cardsInDeal;
    const allowForTrumpCardDrawIndex = cardIndex + 1;
    return shuffledDeck.slice(allowForTrumpCardDrawIndex, allowForTrumpCardDrawIndex + cardsInDeal);
}

function swapArrayElements(a, i, j) {
    const temp = a[j];
    a[j] = a[i];
    a[i] = temp;
}

// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle

function fisherYatesInPlace(items) {
    let itemsToGo = items.length;
    while (itemsToGo > 0) {
        const itemToSwap = Math.floor(Math.random() * itemsToGo--);
        swapArrayElements(items, itemToSwap, itemsToGo);
    }
    return items;
}

function addUp(trumps, hand) {
    const values = hand.map(function(card) {
        return card.suit === trumps ? card.value * 2 : card.value;
    });

    const total = values.reduce(function(cumulateValue, nextValue) {
        return cumulateValue + nextValue;
    }, 0);

    return total;
}

function cardSupport() {
    this.getAndStoreDealFor = function (numberOfPlayers) {
        let theDeck = deck();
        const shuffledDeck = fisherYatesInPlace(theDeck);
        const trumps = shuffledDeck[0];
        const trumpSuit = trumps.suit;
        let hands = [];

        for (let handIndex = 0; handIndex < numberOfPlayers; handIndex++) {
            const thisHand = dealToPlayer(handIndex, shuffledDeck);
            const thisScore = addUp(trumpSuit, thisHand);
            const sortedHand = thisHand.sort((a, b) => b.score(trumpSuit) - a.score(trumpSuit));
            hands[handIndex] = {hand: sortedHand, score: thisScore};
        }

        const sortedHands = hands.sort((a, b) => b.score - a.score);

        return {
            "trumps": trumps,
            "handsByPlayerNumber": sortedHands
        }
    }
}

module.exports = cardSupport;
