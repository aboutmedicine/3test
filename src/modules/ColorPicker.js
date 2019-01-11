import { tinycolor } from '@libs/tinycolor-min.js'

var ColorPicker = function (lineConfig) {

	var canvas = document.getElementById('hue-canvas');
	var hueCtx = canvas.getContext('2d');
	var hueCursor = document.getElementById('hue-cursor');
	var hueRect = canvas.getBoundingClientRect();

	var hue = 0;

	var ctx = hueCtx;
	var hueGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);

	hueGradient.addColorStop(0.00, "hsl(0,100%,50%)");
	hueGradient.addColorStop(0.17, "hsl(298.8, 100%, 50%)");
	hueGradient.addColorStop(0.33, "hsl(241.2, 100%, 50%)");
	hueGradient.addColorStop(0.50, "hsl(180, 100%, 50%)");
	hueGradient.addColorStop(0.67, "hsl(118.8, 100%, 50%)");
	hueGradient.addColorStop(0.83, "hsl(61.2,100%,50%)");
	hueGradient.addColorStop(1.00, "hsl(360,100%,50%)");

	ctx.fillStyle = hueGradient;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	canvas.addEventListener('mousedown', function (e) {
		hueRect = canvas.getBoundingClientRect();
		startGetHueColor(e);
	});

	window.addEventListener('resize', function () {
		hueRect = canvas.getBoundingClientRect();
	});

	function setCurrentColor(color) {
		color = window.tinycolor(color);
		hueCursor.style.backgroundColor = 'hsl(' + color.toHsl().h + ', 100%, 50%)';

		lineConfig.color = color._originalInput;

	}

	function startGetHueColor(e) {
		getHueColor(e);
		canvas.addEventListener('mousemove', getHueColor);
		canvas.addEventListener('mouseup', endGetHueColor);
	}

	function endGetHueColor() {
		hueCursor.classList.remove('dragging');
		canvas.removeEventListener('mousemove', getHueColor);
	}

	function getHueColor(e) {
		e.preventDefault();
		var saturation = 1;
		var lightness = 0.5;
		var y = e.pageY - hueRect.top;
		if (y > hueRect.height) {
			y = hueRect.height;
		}
		if (y < 0) {
			y = 0;
		}
		var percent = y / hueRect.height;
		hue = 360 - (360 * percent);
		var color = window.tinycolor('hsl ' + hue + ' ' + saturation + ' ' + lightness).toHslString();
		hueCursor.style.top = y + 'px';

		setCurrentColor(color);

	}
};

export default ColorPicker