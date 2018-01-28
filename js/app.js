// Enemies our player must avoid
var Enemy = function (x, y, speed, sprite) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = speed;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    //keep enemies movement within the canvas borders.
    if (this.x >= 505) {
        this.x = 0;
    }

    this.checkCollisions(this);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
//characterOptions is a multiple options array
var characterOptions = ['images/char-boy.png',
                        'images/char-cat-girl.png',
                        'images/char-horn-girl.png',
                        'images/char-pink-girl.png',
                        'images/char-princess-girl.png'];
//character is the selector between the options.
var character = 0;
//all characters are loaded here.
for (var i = 0; i < characterOptions.length; i++) {
    Resources.load(characterOptions[i]);
}
// This class requires an update(), render() and
// a handleInput() method.
var Player = function (x, y, speed, sprite) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = characterOptions[character];
};

Player.prototype.update = function (dt) {
    //nothing here yet
};

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    displayScoreLevel(score, gameLevel, totalScore);
};

Player.prototype.handleInput = function (keyPress) {
    if (keyPress === 'left') {
        this.x -= this.speed + 50;
    }
    if (keyPress === 'up') {
        this.y -= this.speed + 35;
    }
    if (keyPress === 'right') {
        this.x += this.speed + 50;
    }
    if (keyPress === 'down') {
        this.y += this.speed + 35;
    }
    console.log('keyPress is: ' + keyPress);
};

Enemy.prototype.checkCollisions = function (anEnemy) {
    // check for collision between enemy and player
    if (
        player.y + 131 >= anEnemy.y + 90 &&
        player.x + 25 <= anEnemy.x + 88 &&
        player.y + 73 <= anEnemy.y + 135 &&
        player.x + 76 >= anEnemy.x + 11
    ) {
        console.log('Death!');
        //return the player to initial spot
        player.x = 202.5;
        player.y = 383;
        //change the character selector to next one
        character += 1;
        //check if it's game over
        if (character > characterOptions.length - 1) {
            console.log("Game Over!");
            character = 0;
            score = 0;
            gameLevel = 1;
        }
        //change the sprite
        player.sprite = characterOptions[character];
    }

    // check for player reaching top of canvas and winning the game
    // if player wins, add 1 to the score and level
    // pass score as an argument to the increaseDifficulty function
    if (player.y + 63 <= 0) {
        player.x = 202.5;
        player.y = 383;
        console.log('Success!');

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 505, 171);

        score += 1;
        gameLevel += 1;
        totalScore += 1;
        console.log('Your score: ' + score + ', Your level: ' + gameLevel + ', Total Score: ' +
            totalScore);
        increaseDifficulty(score);

    }

    // check if player runs into left, bottom, or right canvas walls
    // prevent player from moving beyond canvas wall boundaries
    if (player.y > 383) {
        player.y = 383;
    }
    if (player.x > 402.5) {
        player.x = 402.5;
    }
    if (player.x < 2.5) {
        player.x = 2.5;
    }
};

// Increase number of enemies on screen based on player's score
var increaseDifficulty = function (numEnemies) {
    // remove all previous enemies on canvas
    allEnemies.length = 0;

    // load new set of enemies
    for (var i = 0; i <= numEnemies; i++) {
        var enemy = new Enemy(Math.random() * 505, Math.random() * 184 + 50, Math.random() * 256);

        allEnemies.push(enemy);
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var totalScore = 0;
var allEnemies = [];
var player = new Player(202.5, 383, 50);
var score = 0;
var gameLevel = 1;
var scoreLevelDiv = document.createElement('div');
var enemy = new Enemy(0, Math.random() * 184 + 50, Math.random() * 256);

allEnemies.push(enemy);

// Function to display player's score
var displayScoreLevel = function (yourScore, yourLevel, totalScore) {
    var canvas = document.getElementsByTagName('canvas');
    var firstCanvasTag = canvas[0];
    // add player score and level to div element created
    scoreLevelDiv.innerHTML = 'Score: ' + yourScore + ' / ' + 'Level: ' + yourLevel + ' / ' +
        'Total Score: ' + totalScore;
    document.body.insertBefore(scoreLevelDiv, firstCanvasTag[0]);
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
