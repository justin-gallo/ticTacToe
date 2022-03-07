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
    const message = document.getElementById("status");
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

    return {
        //functions to return
    }
})();

//gameController module: controls gameplay, turns, game logic. 
const gameController = (() => {
    const playerX = Player("X");
    const playerO = Player("O");
    let turn = 1;

    //Determines who's turn it is (X plays on odd turns, O plays on evens)
    function getCurrentPlayerPiece() {
        if (turn % 2 == 1) {
            return playerX.sayPiece();
        } else {
            return playerO.sayPiece();
        }
    }

    const takeTurn = (index) => {
        if (gameboard.getCellValue(index) === "") {
            gameboard.setCellValue(index, getCurrentPlayerPiece());
        } else {
            return;
        };
        turn++;
    };

    return {
        takeTurn,
        getCurrentPlayerPiece,
        playerX, 
        playerO,
    }
})();