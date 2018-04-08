//require("jasmine");
//require("jasmine-expect");
//var CardSupport = require('../lib/CardSupport');

describe('Test dealing', function () {
    it('Number of hands dealt equals number of players requested', function () {
        for (let i = 0; i < 100; i++) {
            let cards = new CardSupport();
            const numberOfPlayers = Math.floor(Math.random() * 10) + 1;
            const deal = cards.getAndStoreDealFor(numberOfPlayers);
            const numberOfHands = deal.handsByPlayerNumber.length;
            expect(numberOfPlayers === numberOfHands).toEqual(true);
        }
    });

    it('NaN number of players returns an error', function () {
        let cards = new CardSupport();
        const numberOfPlayers = NaN;
        const deal = cards.getAndStoreDealFor(numberOfPlayers);
        const errorWasReturned = error in deal;
        const noHandWasReturned = !(handsByPlayerNumber in deal);
        expect(errorWasReturned && noHandWasReturned).toEqual(true);
    });

    it('Zero players returns an error', function () {
        let cards = new CardSupport();
        const numberOfPlayers = 0;
        const deal = cards.getAndStoreDealFor(numberOfPlayers);
        const errorWasReturned = error in deal;
        const noHandWasReturned = !(handsByPlayerNumber in deal);
        expect(errorWasReturned && noHandWasReturned).toEqual(true);
    });

    it('Negative players returns an error', function () {
        let cards = new CardSupport();
        const numberOfPlayers = -1;
        const deal = cards.getAndStoreDealFor(numberOfPlayers);
        const errorWasReturned = error in deal;
        const noHandWasReturned = !(handsByPlayerNumber in deal);
        expect(errorWasReturned && noHandWasReturned).toEqual(true);
    });

    it('Number of players > 10 returns an error', function () {
        let cards = new CardSupport();
        const numberOfPlayers = -1;
        const deal = cards.getAndStoreDealFor(numberOfPlayers);
        const errorWasReturned = error in deal;
        const noHandWasReturned = !(handsByPlayerNumber in deal);
        expect(errorWasReturned && noHandWasReturned).toEqual(true);
    });

});
