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
    let winState = ""; //tracks if there is a win/loss/draw
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
        if (gameboard.getCellValue(index) === "") { //check if cell is empty
            gameboard.setCellValue(index, getCurrentPlayerPiece()); //if it is, place the currentPlayer's piece
        }
        //CHECK IF WIN STATE EXISTS
        if (currentTurn === 9) { //check if every space on the board is full
            winState = "draw";
            gameOver = "true"
        }
        currentTurn++;
    };

    return {
        takeTurn,
    }
})();