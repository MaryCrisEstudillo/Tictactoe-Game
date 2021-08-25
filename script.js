let arrBoxes = [ //2D array for the X and O inputs
  ["","",""],
  ["","",""],
  ["","",""]
];
let nextArr = []; //blank array for next button function
let prevArr = []; //blank array for previous button function


  
let arrHistory = []; //blank array for history of tictactoe 
let arrClickedNum = 0; // value set for clicking the boxes to have value
let endGame = false; //end game boolean to make the game keep going because it not the end.
let i; // use for for looping

const boxArr = document.querySelector('box'); //dom selector for the tictactoe boxes as array
const boxes = document.querySelectorAll('.box')
boxes.forEach(box => {
  box.addEventListener('click',whenClicked, {once:true}) //setting a each boxes to be use in function
})

let input; //declaring the variable input for the X and O input 
function toStartGame(){
  input = false;
  if(input){
    document.getElementById('Pturn').innerHTML = "Player O Turn"
  }else {document.getElementById('Pturn').innerHTML = "Player X Turn" } //showing the move turn in div "Pturn"
  
} 
toStartGame()
function toEndGame(){
  endGame = true;
  document.getElementById('Previous').classList.add('showBtn'); // to make the previous button appear when the game already has a winner
}

function whenClicked(e) { //functions when boxes or tictactoe are clicked
  if (!endGame){
    const boxesInside = e.target //targetting the tictactoe boxes.
    const boxesImage = input ? "bilog": "ekis" //if else shorthand for the input image in the boxes
    const boxesRow = boxesInside.dataset.row //setting the data set from html
    const boxesColumn = boxesInside.dataset.column //concatination
    arrBoxes[boxesRow][boxesColumn] = boxesImage
    boxesInside.classList.add(boxesImage) //adding classlist when clicked
    if(input=!input){
      document.getElementById('Pturn').innerHTML = "Player O Turn"
    }else {document.getElementById('Pturn').innerHTML = "Player X Turn"} //printing the turns
    arrHistory[arrClickedNum] = [arrClickedNum, boxesImage, boxesRow, boxesColumn];
    arrClickedNum++      
    
    
// winning combinations
    prevArr.push([boxesImage,boxesRow,boxesColumn])
    for (let bRow =0; bRow < arrBoxes.length; bRow++){
      let a = arrBoxes[bRow][0];
      let b = arrBoxes[bRow][1];
      let c = arrBoxes[bRow][2];
  
      if (a && a === b && b === c){     //Holizontal winning combo
        toEndGame();
         if(input=== true){
          document.getElementById('Pturn').innerHTML = `"X" Won!`;
         }else {document.getElementById('Pturn').innerHTML = `"O" Won!`;}
        return;
      }  
    }
    for (let bColumn = 0; bColumn < arrBoxes.length; bColumn++){
      let a = arrBoxes[0][bColumn];
      let b = arrBoxes[1][bColumn];
      let c = arrBoxes[2][bColumn];
    
      if (a && a === b && b === c){
        toEndGame();
        if(input=== true){
          document.getElementById('Pturn').innerHTML = `"X" Won!`;
         }else {document.getElementById('Pturn').innerHTML = `"O" Won!`;}
        return;
      }
  
    }
    let a = arrBoxes[0][0];
    let b = arrBoxes[1][1];
    let c = arrBoxes[2][2];
    let d = arrBoxes[2][0];
    let f = arrBoxes[0][2];

    if ((a && a === b && b === c)||(d && d === f && f === b)) { //vertical and diagonal winning combo
      toEndGame();
      if(input=== true){
        document.getElementById('Pturn').innerHTML = `"X" Won!`;
       }else {document.getElementById('Pturn').innerHTML = `"O" Won!`;}
    }

    // For Tie Win
    if (arrHistory.length === 9){
      toEndGame();
      document.getElementById('Pturn').innerHTML = `Its a Tie!`;
    }
  }
}

//to make the boxes blank again
function reStart (){ 
  arrBoxes = [
    ["","",""],
    ["","",""],
    ["","",""]
  ];
  
  arrHistory = [];
  arrClickedNum = 0;
  prevArr = [];
  nextArr =[];
  endGame = false;
  
  //To Start Game again
  toStartGame()
  boxes.forEach(box =>{
    box.addEventListener('click',whenClicked, {once:true});
    box.classList.remove("bilog","ekis");
  });

  //Functions for Next and Previous buttons

  //function for Next Button when clicked
}
document.getElementById("Restart").addEventListener('click',reStart);
document.getElementById("Previous").addEventListener('click',() =>{
  nextArr.push(...prevArr.splice(prevArr.length-1,1))
  for (i=0; i<nextArr.length; i++){
    document.querySelector(`[data-row='${nextArr[i][1]}'][data-column='${nextArr[i][2]}']`)
    .classList.remove(nextArr[i][0])
  }
  if (nextArr.length<prevArr.length){
    document.getElementById('Next').classList.add("showBtn");
  } 
  if (prevArr.length==0){
    document.getElementById('Previous').classList.remove("showBtn");
  }
});

//function for Previous Button when clicked
document.getElementById("Next").addEventListener('click',() =>{
  prevArr.push(...nextArr.splice(nextArr.length-1,1))
  for(i=0; i<prevArr.length; i++){
    document.querySelector(`[data-row='${prevArr[i][1]}'][data-column='${prevArr[i][2]}']`)
    .classList.add(prevArr[i][0])
  }
  if (prevArr.length<nextArr.length){
    document.getElementById("Previous").classList.add("showBtn");
  }
  if (nextArr.length==0){
    document.getElementById("Next").classList.remove("showBtn");
  }

});
//setting the Start game button div then dissappear when clicked
  
document.getElementById('start').addEventListener('click', () =>{
const header = document.getElementById('headerfront');
const frontGame = document.getElementById('frontgame');
const starter = document.getElementById('start');

header.style.display = "none";
frontGame.style.display = "none";
starter.style.display = "none";

})


    

  