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

    return {
        reset, 
        setCellValue,
        getCellValue,
        board,
    }
})();

//displayController module: Everything DOM related (Click events), references gameboard module. 
const displayController = (() => {
    const boardCells = document.querySelectorAll(".gameCell");
    const status = document.getElementById("status");
    const reset = document.getElementById("resetBtn");

    for (let i = 0; i < boardCells.length; i++) {
        boardCells[i].addEventListener("click", function() {
            gameController.takeTurn(i);
            updateBoard();
        })
    }

    const updateBoard = () => {
        for (let i = 0; i < boardCells.length; i++) {
            boardCells[i].textContent = gameboard.getCellValue(i);
        }
    }

    const updateStatus = (phrase) => {
        status.textContent = "phrase";
    }

    return {
        updateStatus,
    }
})();

//gameController module: controls gameplay, turns, game logic. 
const gameController = (() => {
    const playerX = Player("X"); //creates playerX
    const playerO = Player("O"); //creates playerO
    let currentTurn = 1; //sets the current turn to 1
    let isWin = false; //tracks if there is a win
    let isDraw = false; //tracks if there is a draw
    let gameOver = false; //tracks if the game is over

    //Determines who's turn it is (X plays on odd turns, O plays on evens)
    function getCurrentPlayerPiece() {
        if (currentTurn % 2 == 1) {
            return playerX.sayPiece();
        } else {
            return playerO.sayPiece();
        }
    }

    //Allows the active player (determined by getCurrentPlayerPiece()) to place a piece.
    const takeTurn = (index) => {
        if (gameboard.getCellValue(index) === "" && gameOver === false) { //check if cell is empty
            gameboard.setCellValue(index, getCurrentPlayerPiece()); //if it is, place the currentPlayer's piece
            checkIfWin(); //checks if there is a winner after placing a new piece
            checkIfDraw(); //Check if there is a draw
            currentTurn++; //increments the currentTurn variable
        }
    };

    //Checks if there is a draw on the board. If there is, isDraw becomes TRUE and gameOver becomes TRUE.
    const checkIfDraw = () => {
        if (currentTurn === 9) {
            gameController.isDraw = true;
            gameController.gameOver = true;
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
            [1, 4, 8], 
            [2, 4, 6]
        ];


        // This code works; sucessfully results in arrays containing the pieces for both X and O
        let indexOfXPieces = [];
        let indexOfOPieces = [];
        for (i = 0; i < (gameboard.board).length; i++) {
            if (gameboard.board[i] === "X") {
                indexOfXPieces.push(i);
            }
            if (gameboard.board[i] === "O") {
                indexOfOPieces.push(i);
            }
        }

        // This code works to match the indexOfXPieces/indexOfOPieces to the validWinStates
        for (let i = 0; i < validWinStates.length; i++) {
            if (validWinStates[i].every(elem => indexOfXPieces.includes(elem)) === true) {
                isWin = true;
                gameOver = true;
            } else if (validWinStates[i].every(elem => indexOfOPieces.includes(elem)) === true) {
                isWin = true;
                gameOver = true;
            }
        }
        gameController.isWin = isWin;
        gameController.gameOver = gameOver;
    }

    return {
        takeTurn,
    }
})();