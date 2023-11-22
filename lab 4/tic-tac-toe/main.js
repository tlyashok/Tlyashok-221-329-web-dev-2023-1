'use strict';

function init() {
    let board = document.getElementById("board");
    for (let i = 0; i < 9; i++) {
        let elem = document.createElement('div');
        elem.className = "cell";
        board.append(elem);
    }
    return board;
}

let player = "X";
let gameOver = false;

function isFull(cells) {
    for (let i = 0; i < 9; i++) {
        if (cells[i].innerHTML == "") return false;
    }
    return true;
}

function checkForEndCondition(cell) {
    let board = cell.closest("#board");
    if (!gameOver && board.id == "board") {
        let cells = board.children;
        let cellContents = [];
        for (let i = 0; i < 3; i++) {
            let temp = [];
            for (let j = 0; j < 3; j++) {
                temp.push(cells[i * 3 + j]);
            }
            cellContents.push(temp);
        }

        for (let i = 0; i < 3; i++) {
            if (
                cellContents[i][0].textContent !== "" &&
                cellContents[i][0].innerHTML === cellContents[i][1].innerHTML &&
                cellContents[i][1].innerHTML === cellContents[i][2].innerHTML
            ) {
                displayMessage(`Победа ${player}`);
                gameOver = true;
                return;
            }
            if (
                cellContents[0][i].textContent !== "" &&
                cellContents[0][i].innerHTML === cellContents[1][i].innerHTML &&
                cellContents[1][i].innerHTML === cellContents[2][i].innerHTML
            ) {
                displayMessage(`Победа ${player}`);
                gameOver = true;
                return;
            }
        }
        if (
            cellContents[0][0].textContent !== "" &&
            cellContents[0][0].innerHTML === cellContents[1][1].innerHTML &&
            cellContents[1][1].innerHTML === cellContents[2][2].innerHTML
        ) {
            displayMessage(`Победа ${player}`);
            gameOver = true;
            return;
        }
        if (
            cellContents[0][2].textContent !== "" &&
            cellContents[0][2].innerHTML === cellContents[1][1].innerHTML &&
            cellContents[1][1].innerHTML === cellContents[2][0].innerHTML
        ) {
            displayMessage(`Победа ${player}`);
            gameOver = true;
            return;
        }
        if (isFull(cells)) {
            displayMessage("Ничья");
            gameOver = true;
            return;
        }
        
    }
}

function clickHandler(event) {
    let target = event.target;
    if (target.className == "cell") {
        if (gameOver) {
            displayMessage("Игра завершена", "error");
            newGame();
            return;
        }
        if (target.innerHTML != "") {
            displayMessage("Ячейка занята", "error");
            return;
        }
        target.innerHTML = player;
        checkForEndCondition(target);
        player = (player == "X") ? "0" : "X";
    }
}

function newGame(){
    gameOver = false;
    player = "X";
    let board = document.getElementById("board");
    while (board.firstChild) {
        board.removeChild(board.firstChild);
    }
    init();
}

function displayMessage(message, type = "success") {
    let messageDiv = document.querySelector(".messages");
    let newMessage = document.createElement("div");
    newMessage.textContent = message;
    newMessage.className = "message";
    newMessage.className += " " + type;
    messageDiv.append(newMessage);
    setTimeout(()=>
    {
        newMessage.remove();
    },
    3000)
}

window.onload = function() {
    let board = init();
    board.addEventListener("click", clickHandler);
    let button = document.getElementsByClassName("btn")[0];
    button.addEventListener("click", newGame);
};

