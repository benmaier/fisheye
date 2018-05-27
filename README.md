# A visually more appealing fisheye function

Check out [the interactive notebook](https://beta.observablehq.com/@benmaier/a-visually-more-appealing-fisheye-function) for a description.

## Usage

```javascript

// initialize
let radius = 100;
let f = new fisheye(radius);

// set additional parameters as explained in the interactive article
f.magnification(3)
 .demagnificationWidth(0.4)
 .functionMode('continuous');

// Note that those are default parameters.
// For the traditional function, set f.mode('sarkar');


// ========== one-dimensional system ============
// update focus of the fisheye
f.focus(1);                   // set focus to p = 1
let new_x = f.fisheye(0.5);   // calculate new coordinate of 0.5

// calculate original coordinate (back transformation)
// the result should be 0.5
console.log("original point = ", f.fisheyeInverse(new_x));

// say you're in a canvas with width = 1000 and you don't want
// data to leave the canvas. Simply set
f.range([0,1000]);
console.log("range =", f.range());

// ========== two-dimensional system, cartesian ============
// update focus of the fisheye
f.focus([0,0]);                            // set focus to origin
let new_pos = f.fisheyeCartesian([1,1]);   // calculate new coordinate of [1,1]

// calculate original coordinate (back transformation)
// the result should be [1,1]
console.log("original point = ", f.fisheyeCartesianInverse(new_pos));

// say you're in a canvas with width = 1000 and height = 500 and you don't want
// data to leave the canvas. Simply set
f.rangeX([0,1000]);
f.rangeY([0,500]);

// ========== two-dimensional system, radial ============
// update focus of the fisheye
f.focus([0,0]);                         // set focus to origin
new_pos = f.fisheyeRadial([1,1]);   // calculate new coordinate of [1,1]

// calculate original coordinate (back transformation)
// the result should be [1,1]
console.log("original point = ", f.fisheyeRadialInverse(new_pos));

// ========== Get parameter values ==========

console.log( "magnification = ", f.magnification() );
console.log( "radius = ", f.radius() );
console.log( "demagnificationWidth = ", f.demagnificationWidth() );
console.log( "focus = ", f.focus() );
console.log( "mode = ", f.functionMode() );
console.log( "range = ", f.range() ); // this returns f.rangeX()
console.log( "rangeX = ", f.rangeX() );
console.log( "rangeY = ", f.rangeY() );               

```
