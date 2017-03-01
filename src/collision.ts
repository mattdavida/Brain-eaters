//hitTestPoint
let hitTestPoint = (pointX, pointY, sprite) => {
  let hit
    = pointX > sprite.left() && pointX < sprite.right()
    && pointY > sprite.top() && pointY < sprite.bottom();

  return hit;
}

let hitTestRectangle = (r1, r2) => {
  //A variable to determine whether there's a collision
  let hit = false;

  //Calculate the distance vector
  let vx = r1.centerX() - r2.centerX();
  let vy = r1.centerY() - r2.centerY();

  //Figure out the combined half-widths and half-heights
  let combinedHalfWidths = r1.halfWidth() + r2.halfWidth();
  let combinedHalfHeights = r1.halfHeight() + r2.halfHeight();

  //Check for a collision on the x axis
  if(Math.abs(vx) < combinedHalfWidths) {
    //A collision might be occuring. Check for a collision on the y axis
    if(Math.abs(vy) < combinedHalfHeights) {
      //There's definitely a collision happening
      hit = true;
    }
    else {
      //There's no collision on the y axis
      hit = false;
    }
  }
  else {
    //There's no collision on the x axis
    hit = false;
  }

  return hit;
}

//blockRectangle

let blockRectangle = (r1, r2) => {
  //A variable to tell us which side the
  //collision is occurring on
  let collisionSide = "";

  //Calculate the distance vector
  let vx = r1.centerX() - r2.centerX();
  let vy = r1.centerY() - r2.centerY();

  //Figure out the combined half-widths and half-heights
  let combinedHalfWidths = r1.halfWidth() + r2.halfWidth();
  let combinedHalfHeights = r1.halfHeight() + r2.halfHeight();

  //Check whether vx is less than the combined half widths
  if(Math.abs(vx) < combinedHalfWidths) {
    //A collision might be occurring!
    //Check whether vy is less than the combined half heights
    if(Math.abs(vy) < combinedHalfHeights) {
      //A collision has occurred! This is good!
      //Find out the size of the overlap on both the X and Y axes
      let overlapX = combinedHalfWidths - Math.abs(vx);
      let overlapY = combinedHalfHeights - Math.abs(vy);

      //The collision has occurred on the axis with the
      //*smallest* amount of overlap. Next we will figure out which
      //axis that is

      if(overlapX >=  overlapY) {
        //The collision is happening on the X axis
        //But on which side? vy can tell us
        if(vy > 0) {
          collisionSide = "top";

          //Move the rectangle out of the collision
          r1.y = r1.y + overlapY;
        }
        else {
          collisionSide = "bottom";

          //Move the rectangle out of the collision
          r1.y = r1.y - overlapY;
        }
      }
      else {
        //The collision is happening on the Y axis
        //But on which side? vx can tell us
        if(vx > 0) {
          collisionSide = "left";

          //Move the rectangle out of the collision
          r1.x = r1.x + overlapX;
        }
        else {
          collisionSide = "right";

          //Move the rectangle out of the collision
          r1.x = r1.x - overlapX;
        }
      }
    }
    else {
      //No collision
      collisionSide = "none";
    }
  }
  else {
    //No collision
    collisionSide = "none";
  }

  return collisionSide;
}
