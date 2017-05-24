/**
 * A slot machine. User get to make bets with a credit fund. Push the spin 
 * button to start the game. 
 * 
 * @author Adrian Lundhe
 */

var slotmachine = document.getElementById("slotmachine");
var sm = slotmachine.getContext("2d");

/*
 * Fields and object about the machine state and user funds.
 */
var Img = [];
var columns = [col = [], col = [], col = [], col = [], col = []];

var divPics = {
    spinBtn:spinBtn = new Image(),
    background:background = new Image()
};

var machine = {
    WIDTH:slotmachine.width,
    HEIGHT:slotmachine.height,
    picWidth:slotmachine.width * 0.06,
    picHeight:slotmachine.height * 0.06
};

var money = {
    credit:1000,
    bet:10
}; 

/**
 * Load the images.
 */
ImgInit = function(){
    var maxNumPics = 9;
    
    for(var i = 0; i < maxNumPics; i++){ 
        Img[i] = new Image();
        Img[i].src = "assets/" + (i + 1) + ".png";
    }
    
    upBtn = new Image();
    upBtn.src = "assets/upBtn.png";
    downBtn = new Image();
    downBtn.src = "assets/downBtn.png";
    divPics.spinBtn.src = "assets/spinBtn.png";
    divPics.background.src = "assets/background.png";
};

/**
 * Draw the circle reels.
 */
drawReels = function(){
    var yCircPos = [225, 320, 420, 225, 320, 420];
    var xCircPos = [150, 150, 150, 1125, 1125, 1125];
    numbCircles = 6;
    
    for(var i = 0; i < numbCircles; i++){
        sm.fillStyle = "#DDA0DD";
        sm.beginPath();
        sm.arc(xCircPos[i], yCircPos[i], 15, 0, 2 * Math.PI);
        sm.fill();
    }
};

/**
 * Draw all basic items on the screen. Background, buttons...
 */
drawDefault = function(){
    sm.drawImage(divPics.background, 0, 0, machine.WIDTH, machine.HEIGHT);
    sm.drawImage(divPics.spinBtn, machine.WIDTH / 2 - 50, machine.HEIGHT - 100, 
        machine.picWidth, machine.picHeight);
    
    sm.drawImage(upBtn, 300, machine.HEIGHT - 120, 
        machine.picWidth, machine.picHeight);
    sm.drawImage(downBtn, 300, machine.HEIGHT - 70, 
        machine.picWidth, machine.picHeight);

    updateBetWindow(0);
    updateCreditWindow(0);
    drawReels();
};

/*
 * Create and randomize the columns of images on the screen.
 */
setupColumns = function(){
    for(var i = 0; i < columns.length; i++){
        columns[i] = Img.slice();
        columns[i] = randomizeColumns(columns[i]);
    }
};

/*
 * Randomize the columns.
 */
randomizeColumns = function(array){
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle
    while (0 !== currentIndex){
        // Pick a remaining element
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    
    return array; 
};

/*
 * Draw the randomized columns.
 */
drawColumns = function(){
    var maxNumPics = 3;
    var imgHeights = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
    var imgWidths = [200, 400, 600, 800, 1000];

    for(var i = 0; i < columns.length; i++){
        for(var j = 0; j < maxNumPics; j++){
            sm.drawImage(columns[i][j], imgWidths[i], imgHeights[j + 1], 
                machine.picWidth, machine.picHeight);
        }
    }
};

////////// Start of user interaction functions //////////

/*
 * Notification of mouse clicks.
 */
document.onclick = function(mouse){
    var mouseX = mouse.clientX - 
            document.getElementById('slotmachine').getBoundingClientRect().left;
    var mouseY = mouse.clientY - 
            document.getElementById('slotmachine').getBoundingClientRect().top; 

    btnClicked(mouseX, mouseY);
};

/*
 * Determine what action to take based on which picture was clicked on.
 */
btnClicked = function(mouseX, mouseY){
    // Spin button
    var spinBtnXstart = machine.WIDTH / 2 - 50;
    var spinBtnXend = machine.WIDTH / 2 - 50 + machine.picWidth;
    var spinBtnYstart = machine.HEIGHT - 100;
    var spinBtnYend = machine.HEIGHT - 100 + machine.picHeight;
    
    if(mouseX > spinBtnXstart && mouseX < spinBtnXend && mouseY > spinBtnYstart 
            && mouseY < spinBtnYend){
        
        play();
    }

    // Raise the bet
    var upBtnXstart = 300;
    var upBtnXend = 300 + machine.picWidth;
    var upBtnYstart = machine.HEIGHT - 120;
    var upBtnYend = machine.HEIGHT - 120 + machine.picHeight;
    
    if(mouseX > upBtnXstart && mouseX < upBtnXend && mouseY > upBtnYstart 
            && mouseY < upBtnYend){
        
        if(money.bet < money.credit){
            updateBetWindow(10);
        }
    }

    // Lower the bet
    var downBtnXstart = 300;
    var downBtnXend = 300 + machine.picWidth;
    var downBtnYstart = machine.HEIGHT - 70;
    var downBtnYend = machine.HEIGHT - 70 + machine.picHeight;
    
    if(mouseX > downBtnXstart && mouseX < downBtnXend && mouseY > downBtnYstart 
            && mouseY < downBtnYend){
        
        if(money.bet > 10){
            updateBetWindow(-10);
        }
    }
};

////////// Start of update functions of money //////////

/*
 * Update the bet.
 */
updateBetWindow = function(newBet){
    money.bet += newBet;
    sm.font = '24px Arial';
    sm.fillStyle = "#3F51B5";
    sm.clearRect(50, machine.HEIGHT - 100, 200, 50); 
    sm.fillRect(50, machine.HEIGHT - 100, 200, 50); 
    sm.fillStyle = "#3FFFFF";
    sm.fillText("Bet: " + money.bet, 55, machine.HEIGHT - 65); 
};

/*
 * Update the credits.
 */
updateCreditWindow = function(newCredit){
    money.credit += newCredit;
    
    if(money.credit < 1){
        money.credit = 1000;
    }
    
    sm.font = '24px Arial';
    sm.fillStyle = "#3F51B5";
    sm.clearRect(50, machine.HEIGHT - 200, 200, 50); 
    sm.fillRect(50, machine.HEIGHT - 200, 200, 50); 
    sm.fillStyle = "#3FFFFF";
    sm.fillText("Credit: " + money.credit, 55, machine.HEIGHT - 165); 
};

/*
 * Update the credit.
 */
updateSum = function(score, bet){
    return score * bet;
};

////////// Start of gameplay //////////

/*
 * Player started the game.
 */
play = function(){
    spinImages();
   
    setTimeout(function() {
        drawDefault();
        setupColumns();
        drawColumns();
        didWin = checkIfWon();

        if(didWin){
            flashyText();
        }
    }, 600);
};

/**
 * Delay timer for spinning the images / reels.
 */
spinImages = function(){
    for(var i = 0; i < 500; i++){
        setTimeout(randomizeImages, 500);
    }
};

/*
 * Randomize the images.
 */
randomizeImages = function(){
    drawDefault();
    setupColumns();
    drawColumns();
};

/**
 * Randamize numbers.
 * 
 * @returns {rndNumbs.ranNums} shuffled numbers
 */
rndNumbs = function(){
    function shuffle(array){
        var i = array.length;
        var j = 0;
        var temp;

        while (i--){
            j = Math.floor(Math.random() * (i + 1));

            // Swap randomly chosen element with current element
            temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }

        return array;
    }

    ranNums = shuffle([0, 1, 2, 3, 4]);
    
    return ranNums;
};

/**
 * Flash text.
 */
flashyText = function(){
    var count = 4,
    timer = setInterval(function(){
        count--;
        if( count%2 === 1){
            // Draw text
            sm.fillStyle = "#FF8362";
            sm.font = "53px Comic Sans MS";
            sm.fillText("You won! You are the greatest!", 
                machine.WIDTH/2 - 350, 125);
        }
        else {
            // Reset when not drawing text
            drawDefault();
            drawColumns();
        }
        if(count === 0) clearInterval(timer);
    }, 1000);
};

/*
 * Check if one or more rows got 3 of the same on each row.
 */
checkIfWon = function(){
    for(var i = 0; i < 3; i++){
        var result = checkRow(i);
        
        if(result[0] === true){
            updateCreditWindow(updateSum(result[1], money.bet));
            
            return result[0];
            
        }else if(result[0] === false){
            updateCreditWindow(-money.bet);
            
            return false;
        } 
    }
};

/**
 * Check each row for atleast three in a row.
 * 
 * @param {type} z row number
 * @returns {Array} boolean success and score
 */
checkRow = function(z){
    var rowOk = false; 
    var tempScore = 0;
    var tempI = [];
    var tempJ = [];
    
    for(var i = 0; i < columns.length; i++){
        for(var j = 0; j < columns.length; j++){
            if(columns[i][z].src === columns[j][z].src){
                if(!(i === j)){
                   tempJ[i] = i;
                   tempI[j] = j;
                   
                   if(!(tempI.includes(i) && tempJ.includes(j))){
                        tempScore++;
                    }
                }
            }
        }
    }
 
    if(tempScore > 2){
        rowOk = true;    
    }

    return [rowOk, tempScore];
};

/**
 * Strike the images with a line.
 * 
 * @param {type} array array with the winning images in a row
 */
strikeTheWinImages = function(array){
    
};


////////// Initial setup //////////

/*
 * Load images.
 */
ImgInit();

/**
 * Wait with loading the game until images hare loaded.
 */
document.onreadystatechange = function (){
    if(document.readyState === "complete"){
        drawDefault();
        setupColumns();
        drawColumns();
    }
};