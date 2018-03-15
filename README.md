# AsciiDraw.js

A Javascript library for creating Ascii graphics in the browswer.

### Setup / Usage
Link files
```html
<script src="asciiDraw.js"></script>
<link rel="stylesheet" type="text/css" href="asciiDraw.css">
```

Create div where the drawing will be displayed
```html
<div id="asciiCanvas"></div>
```

Set size of drawing and then initialize
```javascript
size(100,80);
init();
```
Note that throughout the library, the units usead are characters, not pixels.

Call drawing functions
```javascript
point(x,y);
line(x1,y1,x2,y2);
fillRect(x,y,width,height);
strokeRect(x,y,width,height);
clearRect(x,y,width,height);
fillEllipse(x,y,width,height);
strokeEllipse(x,y,width,height);
text(string,x,y,direction)
```

```javascript
stroke(character);
background(character);
```

Afterwards display the drawing.
```javascript
display(targetDiv);
```

### Coming soon
-Gradients
-3D graphics engine