let color = 3;
let vname = "foo";

let xsize = 13;
let ysize = 8;

let isDrawing = false;

let xmax = 598;
let ymax = 368;
let xstep = xmax / xsize;
let ystep = ymax / ysize;
let resolution_name = "13 x 8";

const led_colors = [
    "rgb(0, 0, 34)",
    "rgb(0, 0, 170)",
    "rgb(0,34, 255)",
    "rgb(0,136, 255)",
];

let state = Array.from({ length: ysize }, () => Array(xsize).fill(0));

function setResolution(x_pixels, y_pixels, title) {
  xsize = x_pixels;
  ysize = y_pixels;
  xmax = (xsize < 20)? xsize * 46 : xsize * 16;
  ymax = (ysize < 20)? ysize * 46 : ysize * 16;
  xstep = xmax / xsize;
  ystep = ymax / ysize;
  state = Array.from({ length: ysize }, () => Array(xsize).fill(0));
  const key = "ledmatrix";
  const canvas = document.getElementById(key);
  canvas.width = xmax;
  canvas.height = ymax;
  updateColor(3);
  vname = "foo";
  updateCode();
  drawCanvas();
  resolution_name = title;
  updateResolution();
}

function clearMatrix() {
  for (let i = 0; i < ysize; i++) {
    for (let j = 0; j < xsize; j++) {
      state[i][j] = color;
    }
  }
  updateCode();
  drawCanvas();
}

function getName() {
  return vname;
}

function getResolutionName() {
  return resolution_name;
}

function updateResolution() {
  let node = document.getElementById("dimensions");
  node.innerHTML = `Dimensions: <b>${resolution_name}</b>`;
}

function left( do_rotate) {
  let tmp = [];
  for (let y = 0; y < ysize; y++) {
    for (let x = 0; x < xsize; x++) {
      if (x == 0) {
        tmp.push(state[y][0]);
      } else {
        state[y][x - 1] = state[y][x];
      }
    }
  }
  for (let y = 0; y < ysize; y++) {
    let v = 0;
    if (do_rotate) {
      v = tmp[y];
    }
    state[y][xsize - 1] = v;
  }
}

function right( do_rotate) {
  let tmp = [];
  for (let y = 0; y < ysize; y++) {
    for (let x = xsize - 1; x >= 0; x--) {
      if (x == xsize - 1) {
        tmp.push(state[y][x]);
      } else {
        state[y][x + 1] = state[y][x];
      }
    }
  }
  for (let y = 0; y < ysize; y++) {
    let v = 0;
    if (do_rotate) {
      v = tmp[y];
    }
    state[y][0] = v;
  }
}

function go_up( do_rotate) {
  let tmp = [];
  for (let x = 0; x < xsize; x++) {
    tmp.push(state[0][x]);
  }
  for (let y = 1; y < ysize ; y++) {
    for (let x = 0; x < xsize ; x++) {
       state[y - 1][x] = state[y][x];
    }
  }

  for (let x = 0; x < xsize; x++) {
    let v = 0;
    if (do_rotate) {
      v = tmp[x];
    }
    state[ysize - 1][x] = v;
  }
}

function go_down( do_rotate) {
  console.log(`rotate down? ${do_rotate}`);
  let tmp = [];
  for (let x = 0; x < xsize; x++) {
    tmp.push(state[ysize - 1][x]);
  }

  for (let y = ysize - 1; y > 0 ; y--) {
    for (let x = 0; x < xsize ; x++) {
       state[y][x] = state[y - 1][x];
    }
  }
  for (let x = 0; x < xsize; x++) {
    let v = 0;
    if (do_rotate) {
      v = tmp[x];
    }
    console.log(`v: ? ${v} ${tmp}`);
    state[0][x] = v;
  }
}

function shift(dx, dy, do_rotate) {
  console.log(` Shift: ${dx} ${dy} and ${do_rotate}!`);
  if (dx != 0) {
     if (dx < 0) {
       left(do_rotate);
     } else {
       right(do_rotate);
     }
  }
  if (dy != 0) {
     if (dy < 0) {
       go_up(do_rotate);
     } else {
       go_down(do_rotate);
     }
  }
  drawCanvas();
  updateCode();
}

function drawCircle() {
   const radiusNode = document.getElementById("radius-select");
   const radius = radiusNode.value;
   const xcenter = xsize / 2;
   const ycenter = ysize / 2;
   const r2 = radius * radius;


  for (let y = 0; y < ysize; y++) {
    let single = [];
    for (let x = 0; x < xsize; x++) {
      let distx = x - xcenter;
      let disty = y - ycenter;
      distx = distx * distx;
      disty = disty * disty;
      const dist = distx + disty;
      if (dist <= r2) {
         state[y][x] = color;
      }
    }
  }
  drawCanvas();
  updateCode();
}

function updateName(n) {
  let node = document.getElementById("name");
  vname = escape(node.value);
  updateCode();
}

function updateCode() {
  let lines = [];
  lines.push("uint8_t " + vname + "[104] = {");
  for (let y = 0;  y < ysize; y++) {
    let row = [];
    for (let x = 0; x < xsize; x++) {
      const v = state[y][x];
      row.push(`${v}`);
    }
    lines.push(row.join(', ') + ",");
  }
  lines.push('};');
  let innie = lines.join('\n');
  let node = document.getElementById("code");
  node.innerHTML = innie;
}

function updateColor(c) {
  let selectnode = document.getElementById(`p${color}`);
  selectnode.innerHTML = "&#9634;";
  
  color = c;
  const colornode = document.getElementById("colorId");
  const classname = `pixel${color}`;
  colornode.className = classname;

  selectnode = document.getElementById(`p${color}`);
  selectnode.innerHTML = "&#9724;";
}

function drawPixel(color1, color2, fx, fy, fdx, fdy, ctx) {
   const offset = 2;
 
   ctx.fillStyle = color1;
   const x = Math.floor(fx);
   const y = Math.floor(fy);
   const dx = Math.floor(fdx);
   const dy = Math.floor(fdy);
   ctx.fillRect(fx, fy, dx,dy);
   ctx.fillStyle = "black";
   ctx.fillRect(fx + offset, fy + offset, dx - offset,dy - offset);
   ctx.fillStyle = color2;
   ctx.fillRect(fx + offset * 2, fy + offset * 2, dx - offset  * 2, dy - offset * 2);
}

function drawCanvas() {
   const key = "ledmatrix";
   const canvas = document.getElementById(key);
   const ctx = canvas.getContext("2d");
   for (let y = 0; y < ysize; y++) {
      for (let x = 0; x < xsize; x++) {
        color1  = `rgb(32, 32, 32)`;
        color2  = led_colors[state[Math.floor(y)][Math.floor(x)]];
        drawPixel(color1, color2, x * xstep, y * ystep, xstep, ystep, ctx);
      }
   }
}

function handleDraw(x, y) {
  let sector_x = Math.floor(x / xstep);
  let sector_y = Math.floor(y / ystep);
  const centerx = sector_x * xstep + xstep / 2;
  const centery = sector_y * ystep + ystep / 2;
  // pretend we are in a circle:
  const deltax = centerx - x;
  const deltay = centery - y;
  const d2 =  deltax * deltax + deltay * deltay;
  if (d2 < xstep * ystep * 0.20) {
      state[sector_y][sector_x] = color;
      drawCanvas();
      updateCode();
  }
}

function initCanvas() {
   state = Array.from({ length: ysize }, () => Array(xsize).fill(0));
   console.log("Init Canvas");
   const key = "ledmatrix";
   const canvas = document.getElementById(key);
   const ctx = canvas.getContext("2d");

   canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
     handleDraw(e.offsetX, e.offsetY);
   });

   canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
     handleDraw(e.offsetX, e.offsetY);
  });

  canvas.addEventListener('mouseup', () => {
    isDrawing = false;
  });   
}

updateCode();
initCanvas();
updateResolution();
drawCanvas();
updateColor(color);
