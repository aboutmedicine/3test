import * as THREE from 'three';

import Dispatcher from '@modules/Dispatcher'

import { MeshLine, MeshLineMaterial } from '@libs/MeshLine'

export default class GreasePencil extends Dispatcher {
	constructor(drawer, state) {
		super();

		this.drawer = drawer;

		this.lineConfig = {
			maxPoints: 500,
			color: 0x000000,
			width: 6,
		};

		this.drawings = [];

		this.intersection = {
			intersects: false,
			point: new THREE.Vector3(),
			normal: new THREE.Vector3(),
			object: {}
		};

		this.isActive = false;
		this.isMouseDown = false;
		this.isMobile = state.mobile;


		document.addEventListener('mousemove', this._onMouseMove.bind(this), false);
		document.addEventListener('touchmove', this._onMouseMove.bind(this), { passive: false });

		document.addEventListener('mousedown', this._onMouseDown.bind(this), false);
		document.addEventListener('touchstart', this._onMouseDown.bind(this), false);

		document.addEventListener('mouseup', this._onMouseUp.bind(this), false);
		document.addEventListener('touchend', this._onMouseUp.bind(this), false);

		// $('body').on('contextmenu', '#main-webgl-canvas', function(event) {
		//    event.preventDefault();
		//    event.stopImmediatePropagation();
		//    if(isActive) toggleDrawMode();
		// });
		//
		// $('body').on('click', '#draw-mode-off', function() {
		//    // $('body').removeClass('is-draw-mode');
		//    undoDrawing(drawings.length); //undo all
		//
		// });


		// document.addEventListener( 'keydown', function (event) {
		//    if(event.code == 'KeyZ' && (event.ctrlKey || event.metaKey)) {
		//
		//     undoDrawing();
		//    }
		// });
	}

	toggle(on) {
		this.isActive = on;

		console.log(this.isActive);
		// $('body').toggleClass('is-pencil-mode');

		// if( isMobile ) {
		//    toggleFullScreen();
		// }
	}

	_onMouseDown(e) {
		if (!this.isActive) return;

		this.isMouseDown = true;


		this._intersectionStatus(e);

		if (!e.button) { // ie not at pan start
			this._createLine();
		}
	}

	_onMouseUp() {
		this.isMouseDown = false;
		this.intersection.point = new THREE.Vector3();
		this.intersection.normal = new THREE.Vector3();
	}

	_onMouseMove(event) {
		if (!this.isActive) return;

		if (this.isMouseDown) {

			this._intersectionStatus(event);

			if (this.isMobile) {
				event.preventDefault();
			}

			if (this.intersection.intersects) {
				this._computePositions(this.intersection);
				this._draw(this.intersection.normal);
			}

		}
	}

	_computePositions(intersection) {
		const point = intersection.point;
		const normal = intersection.normal;
		const object = intersection.object;
		const dirToCamera = this.drawer.camera.position.clone().sub(point).normalize();
		let angleValue;

		//important operations order:
		object.geometry.computeFaceNormals();
		normal.transformDirection(object.matrixWorld);
		angleValue = normal.dot(dirToCamera);

		//this slightly shifts the position of line above the model. TODO better calculations
		normal.multiplyScalar(Math.sign(angleValue) * 0.004);

		normal.add(point);

		//update intersection obj:
		intersection.point.copy(point);
		intersection.normal.copy(normal);

	}

	_createLine() {

		var lineMaterial = new MeshLineMaterial({
			// color: new THREE.Color(0xFFF000),
			color: new THREE.Color(this.lineConfig.color),
			resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
			lineWidth: this.lineConfig.width,
			sizeAttenuation: false,
			far: this.drawer.camera.far,
			near: this.drawer.camera.near
		});
		var meshLine = new MeshLine();
		var geometry = new Float32Array(this.lineConfig.maxPoints * 3);
		var line = new THREE.Mesh(meshLine.geometry, lineMaterial);

		meshLine.setGeometry(geometry);

		line.g = meshLine;
		line.geo = geometry;
		line.map = [];
		line.name = 'pencil-line';
		line.drawMode = THREE.TrianglesDrawMode; //default
		// line.drawMode = THREE.TriangleStripDrawMode;

		this.drawings.push(line);
		this.drawer.addObject(line);

	}

	_draw(point) {
		var activeLine = this.drawings[this.drawings.length - 1];

		if (activeLine.map.length * 3 >= this.lineConfig.maxPoints) return;

		var index = 0;
		var g = activeLine.g;
		var geo = activeLine.geo = new Float32Array(activeLine.map.length * 3);
		var vNow = new THREE.Vector3().copy(point);

		activeLine.map.push(vNow);

		for (var i = 0, l = activeLine.map.length; i < l; i++) {
			geo[index++] = activeLine.map[i].x;
			geo[index++] = activeLine.map[i].y;
			geo[index++] = activeLine.map[i].z;
		}

		g.setGeometry(geo);
	}

	_intersectionStatus(event) {

		let intersects = this.drawer.checkIntersection(event, { x: 0, y: this.isMobile ? 0 : 30 });
		let target = intersects[0];

		this.intersection.intersects = false;

		if (target && target.object.material.clippingPlanes) {
			intersects = intersects.filter((elem) => {
				return target.object.material.clippingPlanes.every((elem2) => {
					return elem2.distanceToPoint(elem.point) > 0;
				});
			});
			target = intersects[0];
		}

		if (target) {
			this.intersection.object = target.object;
			this.intersection.point = target.point;
			this.intersection.normal = target.face.normal;
			this.intersection.intersects = true;
		}
	}
}

/*function toggleFullScreen() {

			var doc = window.document;
			var docEl = doc.documentElement;

			var requestFullScreen = docEl.requestFullscreen ||
				docEl.mozRequestFullScreen ||
				docEl.webkitRequestFullScreen ||
				docEl.msRequestFullscreen;

			var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;


			if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
				requestFullScreen.call(docEl);
			}
			else {
				cancelFullScreen.call(doc);
			}
		}*/
