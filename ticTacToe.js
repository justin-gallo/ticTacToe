const Player = (piece) => {
    this.piece = piece;

    const returnPiece = () => {
        return this.piece;
    }

    return {
        returnPiece
    }
}

//gameboard module: holds functions to manipulate the array represeting the gameboard
const gameboard = (() => {
    let board = ["X","O","X","X","O","X","X","O","X"];

    const reset = () => {
        for (let i = 0; i <= board.length; i++) {
            board[i] = "";
        }
    }

    return {
        reset,
    }
})();

//displayController module: Everything DOM related (Click events), references gameboard module. 
const displayController = (() => {
    const board = document.querySelectorAll(".cell");
    const message = document.getElementById("message");
    const reset = document.getElementById("resetBtn");


})();

//gameController module: controls gameplay, turns, game logic. 
const gameController = (() => {
    player1 = Player("X");
    player2 = Player("O");

})();