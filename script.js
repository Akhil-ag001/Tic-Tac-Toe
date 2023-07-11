const box = document.getElementsByClassName("box");
const gameBoard = document.getElementById("gameboard-box");
const form = document.getElementById("input");

const replayBtn = document.getElementById("replay-btn");
const resetBtn = document.getElementById("reset-btn");
const startBtn = document.getElementById("start-btn");

var player1;
var player2;

const winCombo = [
    [1,2,3],
    [4,5,6],
    [7,8,9],
    [1,4,7],
    [2,5,8],
    [3,6,9],
    [1,5,9],
    [3,5,7]
]
var moveCount = 0;

const Person = (name, marker, url)=>{

    var moves = new Array();
    var score = 0;

    // getters
    const getName = ()=>{
        return name;
    }
    const getMarker = ()=>{
        return marker;
    }
    const getURL = ()=>{
        return url;
    }
    const getScore = ()=>{
        return score;
    }

    const addMove = (move)=>{
        moves.push(move);
    }

    const checkWin = ()=>{
        var check = 0, count = 0;

        winCombo.forEach((element, index)=>{
            count = 0;
            element.forEach(item=>{
                if(moves.includes(item))
                    count++;
            })
            if(count == 3)
                check = 1;
        })
        if(check == 1)
            return true;
        return false;
    }

    const updateScore = ()=>{
        if(checkWin() == true){
            score++;
        }
    }
    
    const resetMoves = ()=>{
        moves = [];
    }
    const resetScore = ()=>{
        score = 0;
    }

    return {getName, getMarker, getURL, getScore, addMove, checkWin, updateScore, resetMoves, resetScore};
}

// Game Module Pattern
const Game = (()=>{
    var board = new Array(9);
    let chance = 1;

    const updateChance = ()=>{
        if(chance == 1)
            chance = 2;
        else
            chance = 1;
    }

    const getPlayer = ()=>{
        if(chance == 1)
            return player1;
        else
            return player2;
    }

    const resetChance =()=>{
        chance = 1;
    }

    // Getters
    const getChance = ()=>{
        console.log(chance);
        return chance;
    }

    return{getChance, updateChance, getPlayer, resetChance};
})();

// GameBoard Module Pattern
const GameBoard = (()=>{
    const boxes = document.getElementsByClassName("box");

    const scoreBox1 = document.querySelector("#player1>.info>.score-box");
    const scoreBox2 = document.querySelector("#player2>.info>.score-box");


    const resultBox1 = document.querySelector("#player1>.info>.result-box");
    const resultBox2 = document.querySelector("#player2>.info>.result-box");


    const nameBox1 = document.querySelector("#player1>.info>.name");
    const nameBox2 = document.querySelector("#player2>.info>.name");

    const displayScore = ()=>{
        scoreBox1.textContent = player1.getScore();
        scoreBox2.textContent = player2.getScore();
    }

    const displayResult = (result)=>{
        if(result == "win"){
            if(Game.getPlayer().getMarker() == "X"){
                resultBox1.textContent = "Winner!"
            }
            else{
                resultBox2.textContent = "Winner!"
            }

        }
        else{
            resultBox1.textContent = "Tie!"
            resultBox2.textContent = "Tie!"   
        }
    }

    const displayNames = ()=>{
        nameBox1.textContent = player1.getName();
        nameBox2.textContent = player2.getName();
    }

    const resetBoard = ()=>{
        Array.from(boxes).forEach(element=>{
            element.classList.remove("occupied");
            element.textContent = "";
        })
        resultBox1.textContent = "";
        resultBox2.textContent = "";
    }

    const resetScore = ()=>{
        scoreBox1.textContent = "0";
        scoreBox2.textContent = "0";
    }

    return {displayScore, displayResult, resetBoard, resetScore, displayNames}
})()

const Form = (()=>{
    const playerName1 = document.getElementById("player1-name");
    const playerName2 = document.getElementById("player2-name");

    const createPlayer1 = ()=>{
        player1 = Person(playerName1.value, "X", "./Assets/Images/x.svg");

        return player1;
    }
    const createPlayer2 = ()=>{
        player2 = Person(playerName2.value, "O", "./Assets/Images/o.svg");

        return player2;
    }

    const clearForm = ()=>{
        playerName1.value = "";
        playerName2.value = "";
    }

    return {playerName1, playerName2, createPlayer1, createPlayer2, clearForm}
})()


gameBoard.addEventListener("click",updateBoard);

function updateBoard(e){

    if(e.target.classList.contains("box")){

        if(~e.target.classList.contains("occupied")){
            e.target.classList.add("occupied");
            e.target.textContent = Game.getPlayer().getMarker();

            var currentPlayer = Game.getPlayer();
            moveCount++;

            currentPlayer.addMove(e.target.id[3] - 0);

            if(currentPlayer.checkWin()){
                gameBoard.removeEventListener("click", updateBoard);
                GameBoard.displayResult("win");

                currentPlayer.updateScore();
                GameBoard.displayScore();
                moveCount = 0;
            }
            Game.updateChance();
        }

        if(moveCount == 9 && player1.checkWin && player2.checkWin){
            gameBoard.removeEventListener("click", updateBoard);
            GameBoard.displayResult("tie");
            moveCount = 0;
        }
    }
}

replayBtn.addEventListener("click", ()=>{
    player1.resetMoves();
    player2.resetMoves();

    GameBoard.resetBoard();
    Game.resetChance();
    moveCount = 0;

    gameBoard.addEventListener("click", updateBoard);
})

resetBtn.addEventListener("click", ()=>{
    player1.resetMoves();
    player1.resetScore();

    player2.resetMoves();
    player2.resetScore();

    GameBoard.resetBoard();
    GameBoard.resetScore();
    Game.resetChance();
    moveCount = 0;

    toggleClasses();
    Form.clearForm();

    gameBoard.addEventListener("click", updateBoard);
})

startBtn.addEventListener("click", (e)=>{

    if(Form.playerName1.value == ""){
        Form.playerName1.setCustomValidity("Name Required");
    }
    else if(Form.playerName2.value == ""){
        Form.playerName2.setCustomValidity("Name Required");
    }
    else{
        e.preventDefault();

        Form.createPlayer1();
        Form.createPlayer2(); 
        
        console.log(player1.getName());
        console.log(player2.getName());

        toggleClasses();
        GameBoard.displayNames();
    }

})

const toggleClasses = ()=>{
    document.querySelector("div.form").classList.toggle("display");
    document.querySelector("div#player1").classList.toggle("display");
    document.querySelector("div#player2").classList.toggle("display");
    document.querySelector("div.gameboard").classList.toggle("display");
    document.querySelector("div.buttons").classList.toggle("display");
}

// test

// const player1 = Person("AKHIL", "X");
// const player2 = Person("ARPIT", "O");

// test ends
