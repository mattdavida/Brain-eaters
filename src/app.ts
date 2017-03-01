//The canvas
let canvas = document.querySelector("canvas");
let drawingSurface = canvas.getContext("2d");

//The game map
let map =
[
  [1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1],
  [1,1,2,2,2,1,2,1,2,1,1],
  [1,1,1,2,1,1,1,1,1,1,1],
  [1,1,1,1,1,2,1,1,2,1,1],
  [1,1,2,1,2,2,1,2,2,1,1],
  [1,1,1,1,1,1,2,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1]
];

//Shuffle the game map // Fisher yates shuffle // http://sedition.com/perl/javascript-fy.html
let shuffle = (array) => {

    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {

        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

//The game objects map

let gameObjects =
[
  [0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,3,0],
  [0,3,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,4,0,0,0,0,0],
  [0,0,3,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0]
];

//Map code
const EMPTY = 0;
const FLOOR = 1;
const BOX = 2;
const MONSTER = 3;
const PLAYER = 4;
const WALL = 5;

//The size of each tile cell
let SIZE = 64;

//we give player an initial value to null because it won't be created until the buildMap object runs...
let player = null;

//The number of rows and columns
let ROWS = map.length;
let COLUMNS = map[0].length;

//The number of columns on the tilesheet
let tilesheetColumns = 3;

//Arrays to store the game objects
let sprites = [];
let monsters = [];
let boxes = [];

let assetsToLoad = [];
let assetsLoaded = 0;

//Game variables

//Game states
let LOADING = 0;
let BUILD_MAP = 1;
let PLAYING = 2;
let OVER = 3;
let gameState = LOADING;

//Arrow key codes
const UP = 38;
const DOWN = 40;
const RIGHT = 39;
const LEFT = 37;

//Directions
let moveUp = false;
let moveDown = false;
let moveRight = false;
let moveLeft = false;

//The load handler
let  loadHandler = () => {
  assetsLoaded++;
  if(assetsLoaded === assetsToLoad.length) {
    //Remove the load handlers
    image.removeEventListener("load", loadHandler, false);

    //Build the map
    gameState = BUILD_MAP;
  }
}

//Load the tilesheet image
let image = new Image();
image.addEventListener("load", loadHandler, false);
image.src = "images/tilesheet.png";
assetsToLoad.push(image);

//Add keyboard listeners
window.addEventListener("keydown", (event) => {
  switch(event.keyCode) {
    case UP:
      moveUp = true;
      break;

    case DOWN:
      moveDown = true;
      break;

    case LEFT:
      moveLeft = true;
      break;

    case RIGHT:
      moveRight = true;
      break;
  }
}, false);

window.addEventListener("keyup", (event) => {
  switch(event.keyCode) {
    case UP:
      moveUp = false;
      break;

    case DOWN:
      moveDown = false;
      break;

    case LEFT:
      moveLeft = false;
      break;

    case RIGHT:
      moveRight = false;
      break;
  }
}, false);

let buildMap = (levelMap) => {
  for(let row = 0; row < ROWS; row++) {
    for(let column = 0; column < COLUMNS; column++) {
      let currentTile = levelMap[row][column];

      if(currentTile !== EMPTY) {
        //Find the tile's x and y position on the tile sheet
        let tilesheetX = Math.floor((currentTile - 1) % tilesheetColumns) * SIZE;
        let tilesheetY = Math.floor((currentTile - 1) / tilesheetColumns) * SIZE;

        switch (currentTile) {
          case FLOOR:
            let floor = new SpriteObject;
            floor.sourceX = tilesheetX;
            floor.sourceY = tilesheetY;
            floor.x = column * SIZE;
            floor.y = row * SIZE;
            sprites.push(floor);
            break;

          case BOX:
            let box = new SpriteObject;
            box.sourceX = tilesheetX;
            box.sourceY = tilesheetY;
            box.x = column * SIZE;
            box.y = row * SIZE;
            sprites.push(box);
            boxes.push(box);
            break;

          case WALL:
            let wall = new SpriteObject;
            wall.sourceX = tilesheetX;
            wall.sourceY = tilesheetY;
            wall.x = column * SIZE;
            wall.y = row * SIZE;
            sprites.push(wall);
            break;

          case PLAYER:
            player = new SpriteObject;
            player.sourceX = tilesheetX;
            player.sourceY = tilesheetY;
            player.x = column * SIZE;
            player.y = row * SIZE;
            sprites.push(player);
            break;

          case MONSTER:
            let monster = new Enemy();
            monster.sourceX = tilesheetX;
            monster.sourceY = tilesheetY;
            monster.x = column * SIZE;
            monster.y = row * SIZE;
            //Make the monster choose a random start direction
            changeDirection(monster)
            monsters.push(monster);
            sprites.push(monster);
            break;
        }
      }
    }
  }
}

let changeDirection = (monster) => {
  //Clear any previous direction the monster has chosen
  monster.validDirections = [];
  monster.direction = monster.NONE;

  //Find the monster's column and row in the array
  let monsterColumn = Math.floor(monster.x / SIZE);
  let monsterRow = Math.floor(monster.y / SIZE);

  //Find out what kinds of things are in the map cells
  //that surround the monster. If the cells contain a FLOOR cell,
  //push the corresponding direction into the validDirections array
  if(monsterRow > 0) {
    let thingAbove = map[monsterRow - 1][monsterColumn];
    if(thingAbove === FLOOR) {
      monster.validDirections.push(monster.UP);
    }
  }
  if(monsterRow < ROWS - 1) {
    let thingBelow = map[monsterRow + 1][monsterColumn];
    if(thingBelow === FLOOR) {
      monster.validDirections.push(monster.DOWN);
    }
  }
  if(monsterColumn > 0) {
    let thingToTheLeft = map[monsterRow][monsterColumn - 1];
    if(thingToTheLeft === FLOOR) {
      monster.validDirections.push(monster.LEFT);
    }
  }
  if(monsterColumn < COLUMNS - 1) {
    let thingToTheRight = map[monsterRow][monsterColumn + 1];
    if(thingToTheRight === FLOOR) {
      monster.validDirections.push(monster.RIGHT);
    }
  }

  //The monster's validDirections array now contains 0 to 4 directions that the
  //contain FLOOR cells. We chooose Which of those directions will the monster
  //choose to move in next...

  //If a valid direction was found, Figure out if the monster is at an
  //maze passage intersection.
  if(monster.validDirections.length !== 0) {
  //Find out if the monster is at an intersection

	let upOrDownPassage
	  = (monster.validDirections.indexOf(monster.UP) !== -1
	  || monster.validDirections.indexOf(monster.DOWN) !== -1);

	let leftOrRightPassage
	  = (monster.validDirections.indexOf(monster.LEFT) !== -1
	  || monster.validDirections.indexOf(monster.RIGHT) !== -1);

    //Change the monster's direction if it's at an intersection or
    //in a cul-de-sac (dead-end)
    if(upOrDownPassage && leftOrRightPassage
	|| monster.validDirections.length === 1) {
	  //Optionally find the closest distance to the player
      if(player !== null && monster.hunt === true) {
        findClosestDirection(monster);
      }

      //Assign a random validDirection if a validDirection wasn't found that brings the monster closer to the player
      if(monster.direction === monster.NONE) {
	    let randomNumber = Math.floor(Math.random() * monster.validDirections.length);
        monster.direction = monster.validDirections[randomNumber];
	  }

      //Choose the monster's final direction
      switch(monster.direction) {
        case monster.RIGHT:
          monster.vx = monster.speed;
          monster.vy = 0;
          break;

        case monster.LEFT:
          monster.vx = -monster.speed;
          monster.vy = 0;
          break;

        case monster.UP:
          monster.vx = 0;
          monster.vy = -monster.speed;
          break;

        case monster.DOWN:
          monster.vx = 0;
          monster.vy = monster.speed;
      }
    }
  }
}

let findClosestDirection = (monster) => {
  let closestDirection = undefined;

  //Find the distance between the monster and the player
  let vx = player.centerX() - monster.centerX();
  let vy = player.centerY() - monster.centerY();

  //If the distance is greater on the x axis...
  if(Math.abs(vx) >= Math.abs(vy)) {
    //Try left and right
    if(vx <= 0) {
      closestDirection = monsterObject.LEFT;
    }
    else {
      closestDirection = monsterObject.RIGHT;
    }
  }
  //If the distance is greater on the y axis...
  else {
    //Try up and down
    if(vy <= 0) {
      closestDirection = monsterObject.UP;
    }
    else {
      closestDirection = monsterObject.DOWN;
    }
  }

  //Find out if the closestDirection is one of the validDirections
  for(let i = 0; i < monster.validDirections.length; i++) {
    if(closestDirection === monster.validDirections[i]) {
      //If it, assign the closestDirection to the monster's direction
      monster.direction = closestDirection;
    }
  }
}

let playGame = () => {
  //Up
  if(moveUp && !moveDown) {
    player.vy = -4;
  }
  //Down
  if(moveDown && !moveUp) {
    player.vy = 4;
  }
  //Left
  if(moveLeft && !moveRight) {
    player.vx = -4;
  }
  //Right
  if(moveRight && !moveLeft) {
    player.vx = 4;
  }

  //Set the player's velocity to zero if none of the keys are being pressed
  if(!moveUp && !moveDown) {
    player.vy = 0;
  }
  if(!moveLeft && !moveRight) {
    player.vx = 0;
  }

  //Move the player and keep it inside the screen boundaries
  player.x = Math.max(0, Math.min(player.x + player.vx, canvas.width - player.width));
  player.y = Math.max(0, Math.min(player.y + player.vy, canvas.height - player.height));

  //Check for collisions between the player and the boxes
  for(let i = 0; i < boxes.length; i++) {
    blockRectangle(player, boxes[i]);
  }

  //Check for collisions with monsters
  for(let i=0; i< monsters.length; i++) {
    let monster = monsters[i];
    if(hitTestRectangle(player, monster)) {
      gameState = OVER;
    }
  }

  //The monsters
  for(let i = 0; i < monsters.length; i++) {
    let monster = monsters[i];

    //Move the monsters
    monster.x += monster.vx;
    monster.y += monster.vy;

    //Check whether the monster is at a tile corner
    if(Math.floor(monster.x) % SIZE === 0
    && Math.floor(monster.y) % SIZE === 0) {
      //Change the monster's direction
      changeDirection(monster);
    }
  }
}

let endGame = () => {
  alert("You have died a horrible death!");
  window.location.reload(true)
}

let render = () => {
  drawingSurface.clearRect(0, 0, canvas.width, canvas.height);

  //Display the sprites
  if(sprites.length !== 0) {
    for(let i = 0; i < sprites.length; i++) {
	  let sprite = sprites[i];
	  if(sprite.visible) {
        drawingSurface.drawImage
        (
           image,
           sprite.sourceX, sprite.sourceY,
           sprite.sourceWidth, sprite.sourceHeight,
           Math.floor(sprite.x), Math.floor(sprite.y),
           sprite.width, sprite.height
        );
      }
    }
  }
}

let  update = () => {
  //The animation loop
  requestAnimationFrame(update, canvas);

  //Change what the game is doing based on the game state
  switch(gameState) {
    case LOADING:
      console.log("loading...");
      break;

    case BUILD_MAP:
      shuffle(map);
      buildMap(map);
      buildMap(gameObjects);
      //createOtherObjects();
      gameState = PLAYING;
      break;

    case PLAYING:
      playGame();
      break;

    case OVER:
      endGame();
      break;
  }

  //Render the game
  render();
}
//Start the game animation loop
update();
