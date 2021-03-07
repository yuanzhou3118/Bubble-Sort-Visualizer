/* Main JS File for sorting visualizer */
var rangeInput = document.getElementById('myRange');
// Get the number of array elements the user wants //
var defaultSize = 10;
var arrSize = defaultSize;
var maxSize = 100;
var startTime;
var endTime;
var graph = document.getElementById('graph');
var durationEle = document.getElementById('duration');
durationEle.innerHTML = 0;

/* Sorting colors */
var unsortColor = 'rgb(240, 173, 78)';
var sortColor = 'rgb(2, 117, 216)';
var midColor = 'rgb(155, 58, 155)';

/* Get info bar to show text explaining each element on the page */
var arrGen = document.getElementById('arrGen');
var changeArr = document.getElementById('changeArr');
var sort = document.getElementById('sort');
var speed = document.getElementById('speed');
var hoverList = [arrGen, changeArr, sort, speed];

var pageTitle = document.getElementById('pageTitle');

/* Generate array of random numbers based on size of array, aka arrSize */
// Uses onclick event from Generate Array button //
var arr;
var bar;
var barWidth;
var percent = '%';
var barWidthString;
var vertbar;
var newDiv;
var numDiv;
var numDivVal;
var maxArr;

// Access bargraph container //

function arrayGenerator() {
  durationEle.innerHTML = 0;
  arrSize = parseInt(rangeInput.value);
  // Generate random array //
  arr = [];
  // Max of this array is 350. Repeated numbers allowed. //
  for (let i = 0; i < arrSize; i++) {
    arr.push(Math.floor(Math.random() * maxSize) + 1);
  }
  maxArr = Math.max(...arr);

  // Delete pre-existing divs to make room for new ones //
  graph.innerHTML = '';

  // Create an arrSize number of vertical bars //
  for (let i = 0; i < arrSize; i++) {
    newDiv = document.createElement('div');
    newDiv.classList.add('vertbar');
    graph.appendChild(newDiv);
  }

  vertbar = document.querySelectorAll('.vertbar');
  barWidth = 60 / arrSize; // Will later be converted to percent, 60 because 3/4 bar, 1/4 space //

  // Convert variables to string percents
  barWidthString = barWidth.toString().concat(percent);

  /* Change width and height of vertical bars where height and width are in percent */
  for (let i = 0; i < vertbar.length; i++) {
    vertbar[i].style.width = barWidthString;
    vertbar[i].style.height = ((arr[i] / maxSize) * 100)
      .toString()
      .concat(percent);

    // If array size is less than or equal to 30, show the number on the bar
    if (arrSize <= 35) {
      numDiv = document.createElement('h2');
      numDivVal = arr[i].toString();
      numDiv.innerHTML = numDivVal;
      // Place number on top of bar if bar is too short
      if (arr[i] < 0.25 * maxArr) {
        numDiv.classList.add('numdivshort');
        vertbar[i].appendChild(numDiv);
      } else {
        numDiv.classList.add('numdiv');
        vertbar[i].appendChild(numDiv);
      }
    }
  }

  sort.disabled = false;
}

/* Function to get speed of sorting algorithm */
var delay = 0.01;
// 100 is default/medium speed
// below is the user-chosen speed
var veryslow = document.getElementById('veryslow');
var slow = document.getElementById('slow');
var medium = document.getElementById('medium');
var fast = document.getElementById('fast');
var veryfast = document.getElementById('veryfast');

/* Sleep Function to be used on algorithms */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function speedSort(userSpeed) {
  if (userSpeed == 'veryslow') {
    delay = 400;
    speed.innerHTML = 'Very Slow';
  } else if (userSpeed == 'slow') {
    delay = 200;
    speed.innerHTML = 'Slow';
  } else if (userSpeed == 'medium') {
    delay = 100;
    speed.innerHTML = 'Medium';
  } else if (userSpeed == 'fast') {
    delay = 1;
    speed.innerHTML = 'Fast';
  } else if (userSpeed == 'veryfast') {
    delay = 0.01;
    speed.innerHTML = 'Very Fast';
  }
}

/* Bubble Sort Algorithm */
async function bubbleSort(arr) {
  let temp = [];
  for (let i = 0; i < arrSize; i++) {
    for (let j = i + 1; j < arrSize; j++) {
      // If the adjacent elements are in order or equal, do nothing. Else, swap.
      if (arr[i] > arr[j]) {
        // Swaps values every value of time so users can see the change
        await swap(arr, i, j);
      }
    }
  }
  // Ensure all vertbars have the sorted color
  return arr;
}

/* Swap function to swap array indices */
async function swap(arr, i, j) {
  let temp;
  temp = arr[j];
  arr[j] = arr[i];
  arr[i] = temp;
  await swapHeight(arr, i, j);
}

/* Swap function to swap heights and text of vertbars */
async function swapHeight(arr, i, j) {
  // Change color to unsorted color
  vertbar[i].style.backgroundColor = unsortColor;
  vertbar[j].style.backgroundColor = unsortColor;
  await sleep(delay);

  let tempHeight = vertbar[j].style.height;
  vertbar[j].style.height = vertbar[i].style.height;
  vertbar[i].style.height = tempHeight;
  await sleep(delay);

  if (arrSize <= 35) {
    let tempHeightVal = vertbar[i].innerHTML;
    vertbar[i].innerHTML = vertbar[j].innerHTML;
    vertbar[j].innerHTML = tempHeightVal;
  }

  // Change background color to sorted color
  vertbar[i].style.backgroundColor = sortColor;
  vertbar[j].style.backgroundColor = sortColor;
}

async function sortFun() {
  if (isFinished()) {
    startTime = new Date();
    // Make it so other algorithms can't be run at the same time
    finished = false;
    sort.disabled = true;
    arrGen.disabled = true;
    await bubbleSort(arr);
    for (let w = 0; w < arrSize; w++) {
      vertbar[w].style.backgroundColor = sortColor;
    }

    finished = true;
    // sort.disabled = false;
    arrGen.disabled = false;

    endTime = new Date();
    durationEle.innerHTML = endTime.getTime() - startTime.getTime();
  }
}

// Disables arrGen and other sort algorithms from being clicked while sort is running
var finished = true;

function isFinished() {
  if (!arr) {
    return false;
  }
  while (finished == true) {
    return true;
  }
}
