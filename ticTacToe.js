// Factory to create new player and associate a "piece" with them
const Player = (piece) => {
    this.piece = piece;

    const sayPiece = () => {
        return(piece);
    }

    return {
        sayPiece,
    }
}

//gameboard module: holds functions to manipulate the array represeting the gameboard
const gameboard = (() => {
    let board = ["","","","","","","","",""];

    // enables setting a specific cell to a player's piece
    const setCellValue = (index, piece) => {
        if (index < board.length) {
            board[index] = piece;
        }
    }
    // enables fetching which piece is on a specific cell
    const getCellValue = (index) => {
        if (index < board.length) {
            return board[index];
        }
    }
    // iterates through gameboard array, replaces everything with ""
    const reset = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    }

    //Selects a random cell on the board
    const selectRandomCell = () => {
        let emptyCells = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                emptyCells.push(i);
            }
        }
        let selectedCell = emptyCells[Math.floor(Math.random()*emptyCells.length)];
        return selectedCell;
    }

    // Makes these functions & variables accessible globally
    return {
        reset, 
        setCellValue,
        getCellValue,
        board,
        selectRandomCell, 
    }
})();

//displayController module: Everything DOM related (Click events), references gameboard module. 
const displayController = (() => {
    const boardCells = document.querySelectorAll(".gameCell");
    const status = document.getElementById("status");
    const reset = document.getElementById("resetBtn");

    for (let i = 0; i < boardCells.length; i++) {
        boardCells[i].addEventListener("click", function() {
            if (gameController.opponent === "player") {
                //Code below runs for current player's selection
                gameController.takeTurn(i);
                if (gameController.isWin === false && gameController.isDraw === false) {
                    updateStatus(`Player ${gameController.getCurrentPlayerPiece()}'s Turn`);
                }
                if (gameController.isWin === true) {
                    updateStatus(`Player ${gameController.getCurrentPlayerPiece()} Wins!`);
                }
                if (gameController.isDraw === true) {
                    updateStatus(`It's a Draw!`);
                }
                showResetButton();
                updateBoard();
            }
            if (gameController.opponent === "bot") {
                //Player's Move:
                gameController.takeTurn(i);
                if (gameController.isWin === false && gameController.isDraw === false) {
                    updateStatus(`Player ${gameController.getCurrentPlayerPiece()}'s Turn`);
                }
                if (gameController.isWin === true) {
                    updateStatus(`Player ${gameController.getCurrentPlayerPiece()} Wins!`);
                }
                if (gameController.isDraw === true) {
                    updateStatus(`It's a Draw!`);
                }
                showResetButton();
                updateBoard();

                //Bot's Move:
                if (gameController.difficulty === "easy") {
                    gameController.takeTurn(gameboard.selectRandomCell());
                    if (gameController.isWin === false && gameController.isDraw === false) {
                        updateStatus(`Player ${gameController.getCurrentPlayerPiece()}'s Turn`);
                    }
                    if (gameController.isWin === true) {
                        updateStatus(`Player ${gameController.getCurrentPlayerPiece()} Wins!`);
                    }
                    if (gameController.isDraw === true) {
                        updateStatus(`It's a Draw!`);
                    }
                    showResetButton();
                    updateBoard();
                }
                if (gameController.difficulty === "intermediate") {
                    if (gameController.checkIfNearWin() !== undefined) {
                        gameController.takeTurn(gameController.checkIfNearWin());
                    } else {
                        gameController.takeTurn(gameboard.selectRandomCell());
                    }

                    if (gameController.isWin === false && gameController.isDraw === false) {
                        updateStatus(`Player ${gameController.getCurrentPlayerPiece()}'s Turn`);
                    }
                    if (gameController.isWin === true) {
                        updateStatus(`Player ${gameController.getCurrentPlayerPiece()} Wins!`);
                    }
                    if (gameController.isDraw === true) {
                        updateStatus(`It's a Draw!`);
                    }
                    showResetButton();
                    updateBoard();
                }
            }
        })
    }

    //Resets everything on click of the reset button
    reset.addEventListener("click", () => {
        gameController.reset();
        gameboard.reset();
        updateStatus(`Player ${gameController.getCurrentPlayerPiece()}'s Turn`);
        hideResetButton();
        updateBoard();
    })

    //Updates the DOM's board to match the board Array
    const updateBoard = () => {
        for (let i = 0; i < boardCells.length; i++) {
            boardCells[i].textContent = gameboard.getCellValue(i);
        }
    }

    //Updates the status message
    const updateStatus = (phrase) => {
        status.textContent = phrase;
    }

    //Shows the reset button on the DOM
    const showResetButton = () => {
        if (gameController.gameOver === true) {
            reset.style.display = "block";
        }
    }

    //Hides the reset button on the DOM
    const hideResetButton = () => {
        if (gameController.gameOver === true) {
            reset.style.display = "none";
        }
    }
})();

//gameController module: controls gameplay, turns, game logic. 
const gameController = (() => {
    const playerX = Player("X"); //creates playerX
    const playerO = Player("O"); //creates playerO
    const playerBot = Player("O"); //creates Bot
    var currentTurn = 1; //sets the current turn to 1
    let isWin = false; //tracks if there is a win
    let isDraw = false; //tracks if there is a draw
    let gameOver = false; //tracks if the game is over
    let opponent = "player"; //Either "player" or "bot", determines opponent type
    let difficulty = "intermediate"; // "easy", "intermediate", and "expert"

    //Determines who's turn it is (X plays on odd turns, O plays on evens)
    function getCurrentPlayerPiece() {
        if (currentTurn % 2 == 1) {
            return playerX.sayPiece();
        } else { //Returns the other player if opponent is player, and bot if bot
            if (opponent === "player") {
                return playerO.sayPiece();
            } else if (opponent === "bot") {
                return playerBot.sayPiece();
            }
        }
    }

    //Allows the active player (determined by getCurrentPlayerPiece()) to place a piece.
    const takeTurn = (index) => {
        if (gameboard.getCellValue(index) === "" && gameOver === false) { //check if cell is empty
            gameboard.setCellValue(index, getCurrentPlayerPiece()); //if it is, place the currentPlayer's piece
            checkIfWin(); //checks if there is a winner after placing a new piece
            checkIfDraw(); //Check if there is a draw
            if (isWin === false && isDraw === false) {
                currentTurn++; //increments the currentTurn variable
            }
        }
        gameController.currentTurn = currentTurn;
    };

    //Checks if there is a draw on the board. If there is, isDraw becomes TRUE and gameOver becomes TRUE.
    const checkIfDraw = () => {
        if (currentTurn === 9 && isWin === false) {
            isDraw = true;
            gameOver = true;
        }
        gameController.isDraw = isDraw;
        gameController.gameOver = gameOver;
    }

    //Determines if the player is near a win, and returns the index of the space for the bot to place its piece if yes.
    const checkIfNearWin = () => {
        const validWinStates = [ //Hardcoded win states. These INDEXES of the board array must MATCH for a win
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8], 
            [0, 3, 6], 
            [1, 4, 7], 
            [2, 5, 8], 
            [0, 4, 8], 
            [2, 4, 6]
        ];
        for (let i = 0; i < validWinStates.length; i++) {
            let subArray = validWinStates[i]; //Each array of three in validWinStates becomes a "subArray"
            if (gameboard.board[subArray[0]] === "X" && gameboard.board[subArray[1]] === "X") { 
                console.log("near win");
                if (gameboard.board[subArray[2]] === "") {
                    return subArray[2];
                };
            } else if (gameboard.board[subArray[0]] === "X" && gameboard.board[subArray[2]] === "X") {
                console.log("near win");
                if (gameboard.board[subArray[1]] === "") {
                    return subArray[1];
                };
            } else if (gameboard.board[subArray[1]] === "X" && gameboard.board[subArray[2]] === "X") {
                console.log("near win");
                if (gameboard.board[subArray[0]] === "") {
                    return subArray[0];
                };
            }
        }
    }

    //Checks if there is a win state on the board. If there is, isWin becomes TRUE and gameOver becomes TRUE.
    const checkIfWin = () => {
        const validWinStates = [ //Hardcoded win states. These INDEXES of the board array must MATCH for a win
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8], 
            [0, 3, 6], 
            [1, 4, 7], 
            [2, 5, 8],
            [0, 4, 8], 
            [2, 4, 6]
        ];

        //Creates two arrays which contain the indicies occupied by X or O pieces.
        let indexOfXPieces = [];
        let indexOfOPieces = [];
        for (i = 0; i < (gameboard.board).length; i++) {
            if (gameboard.board[i] === "X") {
                indexOfXPieces.push(i);
            }
            if (gameboard.board[i] !== "X" && gameboard.board[i] !== "") {
                indexOfOPieces.push(i);
            }
        }

        // Matches the indexOfXPieces/indexOfOPieces to the validWinStates
        for (let i = 0; i < validWinStates.length; i++) {
            if (validWinStates[i].every(elem => indexOfXPieces.includes(elem)) === true) {
                isWin = true;
                gameOver = true;
            } else if (validWinStates[i].every(elem => indexOfOPieces.includes(elem)) === true) {
                isWin = true;
                gameOver = true;
            }
        }
        //Pass local variables out to module scope
        gameController.isWin = isWin;
        gameController.gameOver = gameOver;
    }

    //Resets the state of the gameController()
    const reset = () => {
        isWin = false;
        isDraw = false;
        gameOver = false;
        currentTurn = 1;
    }

    //Makes these functions & variables accessible globally
    return {
        takeTurn,
        isWin,
        isDraw,
        gameOver,
        getCurrentPlayerPiece,
        reset,
        opponent,
        difficulty,
        checkIfNearWin,
        currentTurn,
    }
})();