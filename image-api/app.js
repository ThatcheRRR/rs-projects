const canvas = document.querySelector('canvas');
const pencil = document.querySelector('.pencil');
const bucket = document.querySelector('.bucket');
const choose = document.querySelector('.choose-color');
const tool = document.querySelectorAll('.tool');
const sizeSwitcher = document.querySelectorAll('.switcher__size');
const checkbox = document.querySelectorAll('.switcher__size_checkbox');
const red = document.querySelector('.red');
const blue = document.querySelector('.blue');
const previous = document.querySelector('.previous-color');
const color = document.querySelector('.color');
const colors = document.querySelector('.colors');
const grayscaleButton = document.querySelector('.grayscale');
const loadButton = document.querySelector('.load');
const pencilCode = 80;
const bucketCode = 66;
const chooseCode = 67;
const maxFieldSize = 512;
const small = 128;
const medium = 256;
const large = 512;
const redColor = '#F74141';
const blueColor = '#00BCD4';
const ctx = canvas.getContext('2d');
const tools = ['bucket', 'colorPicker', 'pencil'];

let pickerActive = false;
const currentCanvas = localStorage.getItem('fieldStatus');
let currentColor = '#FFC107';
let previousColor = '#FFEB3B';
let activeTool = 'pencil';
let sc = 0;
let lastX = 0;
let lastY = 0;
let isDrawing = false;

const defaultMatrix = [
  ['fff', 'fff', 'fff', 'fff'],
  ['fff', 'fff', 'fff', 'fff'],
  ['fff', 'fff', 'fff', 'fff'],
  ['fff', 'fff', 'fff', 'fff'],
];

function canvasInit() {
  for (let row = 0; row < defaultMatrix.length; row += 1) {
    for (let col = 0; col < defaultMatrix[0].length; col += 1) {
      ctx.fillStyle = `#${defaultMatrix[row][col]}`;
      ctx.fillRect(col * sc, row * sc, sc, sc);
    }
  }
}

if (currentCanvas === null) {
  sc = small;
  canvasInit();
} else {
  const dataURL = currentCanvas;
  const img = new Image();
  img.src = dataURL;
  img.onload = () => {
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
  };
}

function floodFill() {
  ctx.fillStyle = currentColor;
  ctx.fillRect(0, 0, maxFieldSize, maxFieldSize);
}

function drawing(e) {
  if (!isDrawing) return;
  ctx.strokeStyle = currentColor;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX / sc, e.offsetY / sc);
  [lastX, lastY] = [e.offsetX / sc, e.offsetY / sc];
  ctx.stroke();
  if (activeTool === 'bucket') {
    floodFill();
  }
}

function setCanvasSize(size) {
  const img = new Image();
  img.onload = () => {
    canvas.width = size;
    canvas.height = size;
    sc = maxFieldSize / size;
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, size, size);
  };
  img.src = canvas.toDataURL();
}

pencil.classList.add('active-tool');

function changeColors() {
  if (previousColor === currentColor) return;
  document.querySelector('.cur-color').style.backgroundColor = currentColor;
  document.querySelector('.prev-color').style.backgroundColor = previousColor;
}

function rgbConvert(r, g, b) {
  let redConvert = r.toString(16);
  let greenConvert = g.toString(16);
  let blueConvert = b.toString(16);
  if (redConvert.length === 1) redConvert = `0${redConvert}`;
  if (greenConvert.length === 1) greenConvert = `0${greenConvert}`;
  if (blueConvert.length === 1) blueConvert = `0${blueConvert}`;
  return `#${redConvert}${greenConvert}${blueConvert}`;
}

function colorPicker(e) {
  if (pickerActive === true && e.target === canvas) {
    const r = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data[0];
    const g = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data[1];
    const b = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data[2];
    previousColor = currentColor;
    currentColor = rgbConvert(r, g, b);
    if (previousColor === currentColor) {
      return;
    }
    changeColors();
  } else if (e.currentTarget === tool[1]) {
    pickerActive = true;
    activeTool = 'colorPicker';
  }
}

function changeCurrentColor(e) {
  const temp = currentColor;
  switch (true) {
    case e.target === previous || e.target === previous.children[1]:
      currentColor = previousColor;
      previousColor = temp;
      changeColors();
      break;
    case e.target === red || e.target === red.children[1]:
      previousColor = currentColor;
      currentColor = redColor;
      changeColors();
      break;
    case e.target === blue || e.target === blue.children[1]:
      previousColor = currentColor;
      currentColor = blueColor;
      changeColors();
      break;
    default:
      break;
  }
}

function selectTool(e) {
  for (let i = 0; i < tool.length; i += 1) {
    tool[i].classList.remove('active-tool');
    if (e.currentTarget === tool[i]) {
      tool[i].classList.add('active-tool');
      activeTool = tools[i];
      if (activeTool !== 'colorPicker') {
        pickerActive = false;
      }
    }
  }
}

function selectCurrentColor() {
  previousColor = currentColor;
  currentColor = color.value;
  changeColors();
}

function binds(event) {
  switch (event.keyCode) {
    case pencilCode:
      for (let i = 0; i < tool.length; i += 1) {
        tool[i].classList.remove('active-tool');
      }
      pencil.classList.add('active-tool');
      activeTool = 'pencil';
      pickerActive = false;
      break;
    case bucketCode:
      for (let i = 0; i < tool.length; i += 1) {
        tool[i].classList.remove('active-tool');
      }
      bucket.classList.add('active-tool');
      activeTool = 'bucket';
      pickerActive = false;
      break;
    case chooseCode:
      for (let i = 0; i < tool.length; i += 1) {
        tool[i].classList.remove('active-tool');
      }
      choose.classList.add('active-tool');
      activeTool = 'colorPicker';
      pickerActive = true;
      colorPicker(event);
      break;
    default:
      break;
  }
}

for (let i = 0; i < tool.length; i += 1) {
  tool[i].addEventListener('mousedown', selectTool);
}

colors.addEventListener('mousedown', changeCurrentColor);
canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX / sc, e.offsetY / sc];
});
canvas.addEventListener('mouseup', () => {
  isDrawing = false;
});
canvas.addEventListener('mouseout', () => {
  isDrawing = false;
});
canvas.addEventListener('mousemove', drawing);
choose.addEventListener('mousedown', colorPicker);
canvas.addEventListener('mousedown', colorPicker);
choose.addEventListener('input', selectCurrentColor);
document.addEventListener('keyup', binds);

for (let i = 0; i < sizeSwitcher.length; i += 1) {
  sizeSwitcher[i].addEventListener('mouseup', () => {
    for (let j = 0; j < sizeSwitcher.length; j += 1) {
      sizeSwitcher[j].className = 'switcher__size';
      checkbox[j].className = 'switcher__size_checkbox';
    }
    if (sizeSwitcher[i].innerText === '128x128') {
      sizeSwitcher[i].classList.add('current-size');
      checkbox[i].classList.add('current-size__checkbox');
      setCanvasSize(small);
    }
    if (sizeSwitcher[i].innerText === '256x256') {
      sizeSwitcher[i].classList.add('current-size');
      checkbox[i].classList.add('current-size__checkbox');
      setCanvasSize(medium);
    }
    if (sizeSwitcher[i].innerText === '512x512') {
      sizeSwitcher[i].classList.add('current-size');
      checkbox[i].classList.add('current-size__checkbox');
      setCanvasSize(large);
    }
  });
}

const token = '6e4329932c1d46bcb4f0bc1ebab7abb59c3705d935eb5dd795c04797abbb0159';
async function getLinkToImage(city) {
  const url = `https://api.unsplash.com/photos/random?query=town,${city}&client_id=${token}`;
  const data = await fetch(url).then((res) => res.json());
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = data.urls.small;
  img.onload = () => {
    const wRatio = canvas.width / img.width;
    const hRatio = canvas.height / img.height;
    const ratio = Math.min(wRatio, hRatio);
    const centerX = (canvas.width - img.width * ratio) / 2;
    const centerY = (canvas.height - img.height * ratio) / 2;
    ctx.fillStyle = 'rgb(192, 192, 192)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, img.width, img.height,
      centerX, centerY, img.width * ratio, img.height * ratio);
  };
}

const grayscale = () => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const rgbColor = imageData.data;
  for (let i = 0; i < rgbColor.length; i += 4) {
    const avg = (rgbColor[i] + rgbColor[i + 1] + rgbColor[i + 2]) / 3;
    rgbColor[i] = avg;
    rgbColor[i + 1] = avg;
    rgbColor[i + 2] = avg;
  }
  ctx.putImageData(imageData, 0, 0);
};

loadButton.addEventListener('click', () => {
  const keyWord = document.querySelector('.search__input').value;
  getLinkToImage(keyWord);
});

grayscaleButton.addEventListener('click', () => {
  grayscale();
});

window.addEventListener('beforeunload', () => {
  localStorage.setItem('fieldStatus', canvas.toDataURL());
});
