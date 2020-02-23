const square = [
    ["00BCD4", "FFEB3B", "FFEB3B", "00BCD4"],
    ["FFEB3B", "FFC107", "FFC107", "FFEB3B"],
    ["FFEB3B", "FFC107", "FFC107", "FFEB3B"],
	["00BCD4", "FFEB3B", "FFEB3B", "00BCD4"]];
function drawing(size) {
    const field = document.querySelector('canvas'),
		  ctx = field.getContext('2d'),
		  scale = Math.round(512 / size);
		  field.width = 512;
		  field.height = 512;
	let blockWidth = 0,
		blockHeight = 0;
	switch(size) {
		case 4:
			blockWidth = square[0].length,
			blockHeight = square.length;
        	for (let row = 0; row < blockWidth; row++) {
        		for (let col = 0; col < blockHeight; col++) {
            		ctx.fillStyle = '#' + square[row][col];
            		ctx.fillRect(col * scale, row * scale, scale, scale);
            	}
        	}
		break;
    	case 32:
			blockWidth = bigSquare[0].length,
			blockHeight = bigSquare.length;
			for (let row = 0; row < blockWidth; row++) {
				for (let col = 0; col < blockHeight; col++) {
					ctx.fillStyle = `rgba(${bigSquare[row][col]})`;
					ctx.fillRect(col * scale, row * scale, scale, scale);
				}
			}
		break;
    	case 512:
			const img = new Image();
			img.onload = function() {
				ctx.drawImage(img, 0, 0, field.width = 512, field.height = 512);
			}
			img.src = 'image.png';
		break;
    }
}
const sizeSwitcher = document.querySelectorAll('.switcher__size');
const checkbox = document.querySelectorAll('.switcher__size_checkbox');
sizeSwitcher[0].addEventListener('click', function() {
    sizeSwitcher[0].classList.add('current-size');
    sizeSwitcher[1].classList.remove('current-size');
    sizeSwitcher[2].classList.remove('current-size');
    checkbox[0].classList.add("current-size__checkbox");
    checkbox[1].classList.remove("current-size__checkbox");
    checkbox[2].classList.remove("current-size__checkbox");
    drawing(4);
});
sizeSwitcher[1].addEventListener('click', function() {
    sizeSwitcher[0].classList.remove('current-size');
    sizeSwitcher[1].classList.add('current-size');
    sizeSwitcher[2].classList.remove('current-size');
    checkbox[0].classList.remove('current-size__checkbox');
    checkbox[1].classList.add('current-size__checkbox');
    checkbox[2].classList.remove('current-size__checkbox');
    drawing(32);
});
sizeSwitcher[2].addEventListener('click', function() {
    sizeSwitcher[0].classList.remove('current-size');
    sizeSwitcher[1].classList.remove('current-size');
    sizeSwitcher[2].classList.add('current-size');
    checkbox[0].classList.remove('current-size__checkbox');
    checkbox[1].classList.remove('current-size__checkbox');
    checkbox[2].classList.add('current-size__checkbox');
    drawing(512);
});