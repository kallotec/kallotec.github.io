
      var grid = new Array();

      var cellWidth = 12;
      var cellHeight = 12;
      var cellGap = 1;

      var gridMaxX;
      var gridMaxY;

      var ctx;
      var playInterval = 200;

      var isPaused = true;
      var drawDebug = false;
      var drawEffeciently = false; //still a few bugs when set to true


      $(document).ready(function () {

          //if canvas' context couldnt be initialized
          //don't continue
          if (setup() != false)
              loop();

      });


      function setup() {

          var canvas = document.getElementById("drawingSurface");

          if (!canvas.getContext)
              return false;

          //hook up controls
          $(window).resize(windowResized);
          canvas.addEventListener("mousedown", canvasClick, false);

          $("#playPauseBtn").click(pausePlay);
          $("#nextBtn").click(nextClick);
          $("#clearBtn").click(clearGrid);
          $("#resetBtn").click(windowResized);
          $("#menu").click(menuExpanded);

          //hook up the Speed Slider
          $("#speedSliderVal").text(playInterval + "ms");
          $("#speedSlider").bind("mouseup", function () {
              playInterval = $(this).val();
              $("#speedSliderVal").text(playInterval + "ms");
          });

          $("#sizeSlider").bind("mouseup", function () {
              var val = $(this).val();
              if (val != cellWidth) {
                  cellWidth = val;
                  cellHeight = val;
                  $("#sizeSliderVal").text(cellWidth);
                  windowResized();
              }
          });
          $("#sizeSliderVal").text(cellWidth);

          $("#cellGapCheck").change(function () {
              cellGap = (this.checked == true ? 1 : 0);
          });

          //capture the context and attach the canvas to it
          ctx = canvas.getContext("2d");
          ctx.canvas = canvas;

          //force the window resized event
          //which will configure the grid and controls
          //based on window size
          windowResized();

      }


      function loop(singleIteration) {

          var bounds;

          //only update when not paused
          //or only update when a forced single iteration
          if (!isPaused || singleIteration) {
              bounds = update();
          }

          if (!isPaused)
          {
              //draw efficiently
              draw(bounds.lowX,
                   bounds.lowY,
                   bounds.highX,
                   bounds.highY);
          } else {
              //draw entire grid
              draw();
          }

          //loopback only if not a single iteration
          if (!singleIteration)
              setTimeout(loop, playInterval);

      }

      function update() {

          //create a deep copy of our grid
          var copy = createCopyArray(grid);
          var row;

          var minX = gridMaxX;
          var minY = gridMaxY;
          var maxX = 0;
          var maxY = 0;

          //for each cell, determine which cells live or die
          for (var x = 0; x < copy.length; x++) {
              row = copy[x];
              for (var y = 0; y < row.length; y++) {

                  //current status of cell
                  var val = copy[x][y];
                  var changed = false;

                  //get alive neighbour count
                  var ncount = getAliveNeighbours(x, y, copy);

                  //if alive
                  if (val == 1) {

                      //kill condition
                      if (ncount < 2 || ncount > 3) {
                          changed = true;
                          grid[x][y] = 0;
                      }

                  } else {
                      //if dead

                      //bring to life condition
                      if (ncount == 3) {
                          changed = true;
                          grid[x][y] = 1;
                      }

                  }

                  if (changed == true) {
                      if (x < minX) minX = x - 1;
                      if (y < minY) minY = y - 1;
                      if (x > maxX) maxX = x + 1;
                      if (y > maxY) maxY = y + 1;
                  }
              }
          }

          if (minX < 0) minX = 0;
          if (minY < 0) minY = 0;
          if (maxX > gridMaxX) maxX = gridMaxX;
          if (maxY > gridMaxY) maxY = gridMaxY;

          return {
              lowX: minX,
              lowY: minY,
              highX: maxX,
              highY: maxY
          };

      }

      function draw(startingX, startingY, maxX, maxY) {

          if (drawEffeciently == false) {
              startingX = 0;
              startingY = 0;
              maxX = gridMaxX;
              maxY = gridMaxY;
          }
          else if (drawDebug == false) {
              //ensure params are defaulted if undefined
              //this ensures the entire grid is drawn
              if (startingX == undefined) startingX = 0;
              if (startingY == undefined) startingY = 0;
              if (maxX == undefined) maxX = gridMaxX;
              if (maxY == undefined) maxY = gridMaxY;
          }

          //draw each cell
          for (var x = startingX; x < maxX; x++) {
              var col = grid[x];
              for (var y = startingY; y < maxY; y++) {

                  ctx.beginPath();

                  //alive color
                  if (col[y] == 1)
                      ctx.fillStyle = "#333"; //orange
                  else //dead color
                      ctx.fillStyle = "#ccc";

                  ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth - cellGap, cellHeight - cellGap);

              }
          }

          if (drawDebug == true) {
              //display the region that was re-draw
              var drawx = startingX * cellWidth;
              var drawy = startingY * cellHeight;
              var drawwidth = (maxX * cellWidth) - drawx;
              var drawheight = (maxY * cellHeight) - drawy;
              ctx.beginPath();
              ctx.strokeRect(drawx, drawy, drawwidth, drawheight);
          }
      }


      function nextClick() {

          //force a single update iteration
          loop(true);

      }

      function canvasClick(e) {

          //find the cell that was clicked
          var canoffset = $(ctx.canvas).offset();
          var mouseX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(canoffset.left);
          var mouseY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(canoffset.top) + 1;
          var gridX = Math.floor(mouseX / cellWidth);
          var gridY = Math.floor(mouseY / cellHeight);
          var cols = grid[gridX];

          for (var y = 0; y < cols.length; y++) {
              if (y == gridY) {

                  //invert current value
                  cols[y] = (cols[y] == 0 ? 1 : 0);

                  //force redraw
                  draw();

                  return;
              }
          }

      }

      function windowResized() {

          //decide whether to show more controls
          if (window.innerWidth < 800 && jQuery.browser.mobile == true) {
              $("#cellSizeControl").hide();
          } else {
              $("#cellSizeControl").show();
          }

          //redetermine amount of cells that can fit in the available space
          var canoffset = $(ctx.canvas).offset();
          ctx.canvas.width = window.innerWidth - 5;
          ctx.canvas.height = window.innerHeight - (canoffset.top + 7);
          var width = ctx.canvas.width;
          var height = ctx.canvas.height;
          //cell count available for x and y
          var cellsX = Math.ceil(width / cellWidth);
          var cellsY = Math.ceil(height / cellHeight);

          //initialize the x dimention of array
          grid = new Array(cellsX);

          //initialize the y dimension of array
          for (var i = 0; i < grid.length; i++) {
              grid[i] = new Array(cellsY);
          }

          //initialize every value as 0
          for (var x = 0; x < grid.length; x++) {
              var xline = grid[x];
              for (var y = 0; y < xline.length; y++) {
                  xline[y] = 0; //initialize as dead cells
              }
          }

          //capture new max dimensions of the grid
          gridMaxX = grid.length;
          var line = grid[0];
          gridMaxY = line.length;

          //insert r-pentimo in center of grid
          var cX = Math.floor(cellsX / 2);
          var cY = Math.floor(cellsY / 2);
          insertPattern_RPentomio(cX, cY, grid);

      }

      function menuExpanded() {
          $("#moreControls").toggle(50);
      }


      function clearGrid() {

          //set each cell's value to dead
          for (var x = 0; x < grid.length; x++) {
              var line = grid[x];
              for (var y = 0; y < line.length; y++) {
                  grid[x][y] = 0;
              }
          }

      }

      function pausePlay() {

          //toggle looping on or off
          //and switch button text
          if (isPaused == true) {

              isPaused = false;
              $(this).val("Pause");

          } else {

              isPaused = true;
              $(this).val("Play");

          }
      }

      function createCopyArray(arr) {

          //create a deep copy of array argument
          //including values
          //and return the copy
          var newArr = new Array(arr.length);

          for (x = 0; x < arr.length; x++) {

              var line = arr[x];
              var newLine = new Array(line.length);

              for (y = 0; y < line.length ; y++) {
                  newLine[y] = line[y];
              }

              newArr[x] = newLine;
          }

          return newArr;

      }

      function getAliveNeighbours(cellx, celly, copy) {

          //take a constrained count of alive cell neighbours
          //of cell {cellx, celly}
          //on grid[][]

          var count = 0;

          var xmin = (cellx == 0 ? 0 : cellx - 1);
          var ymin = (celly == 0 ? 0 : celly - 1);

          var xmax = (cellx == copy.length - 1 ? cellx : cellx + 1);
          var line = copy[cellx];
          var ymax = (celly == line.length - 1 ? celly : celly + 1);

          for (var x = xmin; x <= xmax; x++) {
              for (var y = ymin; y <= ymax; y++) {
                  if (x == cellx && y == celly) {
                  } else {

                      if (copy[x][y] == 1)
                          count++;
                  }
              }
          }

          return count;

      }


      function insertPattern_Glider(x, y, gridParam) {

          //add a glider to the grid
          gridParam[x][y] = 1;
          gridParam[x + 1][y] = 1;
          gridParam[x + 2][y] = 1;
          gridParam[x + 2][y - 1] = 1;
          gridParam[x + 1][y - 2] = 1;

      }

      function insertPattern_UnstableHoneyComb(x, y, gridParam) {

          //add an unstable honeycomb to the grid
          gridParam[x][y] = 1;
          gridParam[x+1][y-1] = 1;
          gridParam[x+2][y-1] = 1;
          gridParam[x+2][y] = 1;
          gridParam[x+3][y] = 1;
          gridParam[x+2][y+1] = 1;
          gridParam[x+1][y+1] = 1;

      }

      function insertPattern_RPentomio(x, y, gridParam) {

          //add an r-pentomino to the grid
          gridParam[x][y] = 1;
          gridParam[x][y-1] = 1;
          gridParam[x+1][y-1] = 1;
          gridParam[x][y+1] = 1;
          gridParam[x-1][y] = 1;

      }
