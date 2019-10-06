var originalBoard;
const humanPlayer ='X';
const aiPlayer ='O';

//storing all wining combos
const winCombos =[
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

//getting the cell's in the html doc
const cells = document.querySelectorAll('.cell');

//starting the game
startGame();


//function that start the Game and Replay
function startGame(){

    //hiding the last match result
    document.querySelector('.endgame').style.display = "none";
    
    //seting the board
    originalBoard = Array.from(Array(9).keys());
    //empty cells
    for(var i=0; i<cells.length; i++){
     cells[i].innerText ='';
     cells[i].addEventListener('click', turnClick, false);
     cells[i].style.backgroundColor = '#333';
    }
}

//happen when-ever we click on a cell
function turnClick(square){

    //check if cell was not used by player or computer
    if(typeof originalBoard[square.target.id] == 'number'){

        //calling the Human turn to play
        turn(square.target.id, humanPlayer);

        //disable the player from making multiple consecutive clicks
        //disable click on the board
        for(var i = 0; i < cells.length; i++){
            cells[i].removeEventListener('click', turnClick, false);
        }

        //check if not Tie , then computer Play
        if (!checkWin(originalBoard, humanPlayer) && !checkTie()) {
            //make the computer wait for a little moment befor playing after us
            setTimeout(function (){
                
                turn(bestSpot(), aiPlayer);
                
                //Re-enable the click on the board again
                for(var i = 0; i < cells.length; i++)
                {
                    cells[i].addEventListener('click', turnClick, false);
                }
                
              }, 500);
   
        }   
    }    
}

//called on each turn
function turn(squareId, player){
    
    //the selected cell take the symbole of the current player (X or O)
    originalBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    
    //test if Game is Won
    let gameWon = checkWin(originalBoard, player);
    //call Game Over if the game is Won
    if(gameWon) gameOver(gameWon);
}

//function that check if the game is Won
function checkWin(board, player) {

 //get the combinations on the board   
 //all the places the player played on the board
 let plays = board.reduce((a, e, i) =>
 (e === player) ? a.concat(i) : a , []);
    
 let gameWon = null;
 //loop through winning combinations
 for (let[index, win] of winCombos.entries())
 {
     if (win.every(elem => plays.indexOf(elem) > -1)) 
     {
        gameWon = {index: index, player: player};
        break;
     }
 }
 return gameWon;

}

//GameOver function
function gameOver(gameWon){
    //highlight the winning blocks
    for(let index of winCombos[gameWon.index]){
        document.getElementById(index).style.backgroundColor = "rgba(245, 245, 220, .2)";
        //in case we want a diffrent color to highlight for each player
        //gameWon.player == humanPlayer ? "rgba(245, 245, 220, .2)" : "blue";
    }
    // now disable click on the board
    for(var i = 0; i < cells.length; i++){
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == humanPlayer ? "You Win!" : "The Matrix Win");
}

//find the spot for the computer to play
function bestSpot(){
//return an empty square (a random square for now)
return emptySquares()[Math.floor(Math.random()*emptySquares().length)];
}

//return the empty squares on the board
function emptySquares(){
    return originalBoard.filter(s => typeof s == 'number');
}

//if Game is Tie function
function checkTie(){
    if(emptySquares().length == 0){
        for(var i = 0; i < cells.length; i++){
            cells[i].style.backgroundColor ="rgba(245, 245, 220, .2)";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game!");
        return true;
    }
    return false;
}

//function that show who won
function declareWinner(winner){
 document.querySelector(".endgame").style.display ="block";
 document.querySelector(".endgame .text").innerText = winner;
}