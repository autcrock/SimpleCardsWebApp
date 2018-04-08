# Simple Card Game NodeJS Express Web App

**Introduction**

I chose to use node.js as I haven't built a Node.js application under Visual Studio before
and I was interested to try it out having previously used Node only in AWS EC2 (Ubuntu)
and Lambda environments.

Small demos of my work with Visual Studio ASP.NET and Azure can be found at https://github.com/autcrock
in the Petrowiz, KGSBrowseMVC, KGSBrowseMVCExpress repositories. 

This particular project is at https://github.com/autcrock/SimpleCardsWebApp

I used Visual Studio 2017 Community to develop the project.


**Design**

Express serves up the web application from the Pug template in views/index.pug.

The initial view contains the specified number of players submission button and a frame.

After entering a browser validated number of players, pressing the button uses a
HTTP GET route to ask the server to generate a trump card for
the dealer, and hands for the requisite number of players.  The server then uses views/index.pug
to display the hands held by the dealer and each of the other players, in addition to the submission button.

The display has been built to be reasonably resilient with respect to browser window size reconfiguration.
The winner(s), in addition to being designated through a red border and labelling, also get the benefit
of CSS colour cycling.  The players are identified by number at the time of hand generation.  The players
are sorted in order of score, with the winner(s) first.  Each five card hand annotated with the player
name and score, is further sorted in order of its 
score.  Each card background is coloured according to whether it is a non-scoring card
(ie a zero score) - white, a scoring non-trump card (a ginger colour), or a scoring trump card (a nice winning gold colour).
This layout allows easier assessment by the player of how the cards fell, and whether the score is correct.

At any stage, initial or otherwise, a second button on the view allows the browser client to finish the session.
Finishing the session serves up a second view (views/finish.pug) which directs the user to an SQLlite DB browser download
should they wish to examine the game history for assessment purposes.  Each row contains details
of a specific deal, the respective trump suit, a list of winners (to allow for a tied hand) and also client
connection and browser data, with a time/date stamp.

As this is a game (albeit simulated, by virtue of the multi-player nature on a single display),
I have decreased the possibility of external interference by encapsulating the dealing mechanism
in a module on the server in lib/CardSupport.js, rather than using the browser to generate data.
No state escapes from the CardSupport module, other than that required to render the hands
on the browser, sent via handler for the /shuffle route (routes/index.js), and that data stored in the database,
which is only on the server.  This has the advantage of minimising technical debt were the game to be altered to multiple displays
with logins for each player.  It also helps to avoid interference by technically inclined former
cricket players on the browser end.  The disadvantage is that in a high load environment, the server
has slightly more work to do.  

The generated deal includes the scores accounting for the trump suit following the scoring
rules set out in the instructions.

The Pug generated views contain no javascript on the client.  Relevant CSS classes are defined in public/stylesheets/main.css.

The database and game history table (deals) is initialised should it not already exist on the
first call to the / route.  The database remains open across session finishes, to enable new sessions to
be started, and to ensure that other sessions do not crash when they attempt to write to the database.

In a high use environment, it would be essential to install and administer the database separately to the application. 
The present system allows bundling of the database via the Visual Studio NPM package installation mechanism, for convenience.


**Testing**

The application has been lightly tested on Chrome and Edge on Windows 10 Home, including simultaneous sessions.  It would be interesting
to see how it goes on a very small display such as a smart phone, but that will have to wait.

Jasmine unit tests have been written for some aspects of the CardSupport module in test/UnitTest.js.  Unfortunately, at the time of writing
this documentation, I have not yet managed to convince Visual Studio that it should execute the tests.

