# ticTacToe
A tic-tac-toe game to practice factory functions &amp; the module pattern. 

#### [Live Preview](https://justin-gallo.github.io/ticTacToe/)

### Things I Learned: 
- Worked out how to structure JavaScript code using the module pattern & factory functions. 
- Experienced *why* these patterns are useful (such as private variables & functions, and more readable code)
- Increased understanding of arrow functions. 
- Became more proficient with CSS transitions and states (such as :hover)
- Learned how to create fancier radio buttons, and make those buttons run a JS function on their click event. 
- Improved UI design skills. 

### Things to Change: 
- As the code sits now, I know that there's a more effective way to organize my functions. 
  - I'd like to better organize functions within my modules to prevent so many functions/variables being exposed globally. 
  - I think this could be accomplished by moving some of the bot functions (findDefensiveMove, findBestEarlyMove) to the gameboard module. 
  - Some of the logic within the gameCells onclick event could also probably be made into a function within the gameController module, to prevent the gameController variables from having to be exposed. 
- Want to fix a bug where the game gets confused if you try to change from a human player to the bot in the middle of the game, or vice versa.
