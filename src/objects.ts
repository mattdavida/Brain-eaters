//--- The sprite object

class SpriteObject {
  sourceX: any;
  sourceY: any;
  sourceWidth: any;
  sourceHeight: any;
  width: any;
  height: any;
  x: any;
  y: any;
  vx: any;
  vy: any;
  visible: true;
  scrollable: true;

  constructor() {
    this.sourceX = 0;
    this.sourceY= 0;
    this.sourceWidth= 64;
    this.sourceHeight= 64;
    this.width= 64;
    this.height= 64;
    this.x= 0;
    this.y= 0;
    this.vx= 0;
    this.vy= 0,
    this.visible= true;
    this.scrollable= true;
  }

  //Getters
  centerX() {
    return this.x + (this.width / 2);
  }
  centerY() {
    return this.y + (this.height / 2);
  }
  halfWidth() {
    return this.width / 2;
  }
  halfHeight() {
    return this.height / 2;
  }
};

class Enemy {
  sourceX: any;
  sourceY: any;
  sourceWidth: any;
  sourceHeight: any;
  width: any;
  height: any;
  x: any;
  y: any;
  vx: any;
  vy: any;
  visible: true;
  scrollable: true;
  NORMAL: any;
  SCARED: any;
  state: any;
  speed: any;
  NONE: any;
  UP: any;
  DOWN: any;
  LEFT: any;
  RIGHT: any;
  validDirections: any;
  direction: any;
  hunt: any;


  constructor() {
    this.sourceX = 128;
    this.sourceY= 0;
    this.sourceWidth= 64;
    this.sourceHeight= 64;
    this.width= 64;
    this.height= 64;
    this.x= 0;
    this.y= 0;
    this.vx= 0;
    this.vy= 0,
    this.visible= true;
    this.scrollable= true;
    this.NORMAL = [2,0];
    this.SCARED = [2,1];
    this.state = this.NORMAL;
    this.speed = 1;
    this.NONE = 0;
    this.UP = 1;
    this.DOWN = 2;
    this.LEFT = 3;
    this.RIGHT = 4;
    this.validDirections = [];
    this.direction = this.NONE;
    this.hunt = true;

  }

  //Getters
  centerX() {
    return this.x + (this.width / 2);
  }
  centerY() {
    return this.y + (this.height / 2);
  }
  halfWidth() {
    return this.width / 2;
  }
  halfHeight() {
    return this.height / 2;
  }
};

//--- The monster object
let monsterObject = new Enemy();
