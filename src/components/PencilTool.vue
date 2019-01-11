<template>
	<div class="draw-tools" >
		<button class="icon-btn" data-tooltip="Undo" @click.prevent="undo(1)">
			<img src="assets/Eraser.png" alt="">
		</button>
		<button class="icon-btn" data-tooltip="Draw" @click="toggle(!isActive)" >
			<img src="assets/Draw Cursor copy.png" alt="">
		</button>
		<div class="color-picker">
			<button id="hue-cursor"></button>
			<canvas id="hue-canvas"></canvas>
		</div>
	</div>
</template>

<script>
	import * as THREE from 'three'
	import { MeshLine, MeshLineMaterial } from '@libs/MeshLine'
	import ColorPicker from '@modules/ColorPicker'

	export default {
		name: 'PencilTool',

		props: {
			canvas: HTMLCanvasElement
		},

		data: () => ({
			lineConfig: {
				maxPoints: 500,
				color: 0x000000,
				width: 6,
			},
			intersection: {
				intersects: false,
				point: new THREE.Vector3(),
				normal: new THREE.Vector3(),
				object: {}
			},
			isMouseDown: false,
			isActive: false
		}),

		computed: {
			drawings() {
				return this.$store.state.drawings
			},
			drawer() {
				return this.$store.state.controller
			},
			isMobile() {
				return this.$store.state.mobile
			}
		},

		mounted() {

			new ColorPicker(this.lineConfig);

			this.canvas.addEventListener('mousemove', this._onMouseMove.bind(this), false);
			this.canvas.addEventListener('touchmove', this._onMouseMove.bind(this), { passive: false });

			this.canvas.addEventListener('mousedown', this._onMouseDown.bind(this), false);
			this.canvas.addEventListener('touchstart', this._onMouseDown.bind(this), false);

			this.canvas.addEventListener('mouseup', this._onMouseUp.bind(this), false);
			this.canvas.addEventListener('touchend', this._onMouseUp.bind(this), false);

			this.canvas.addEventListener('contextmenu', e => {
				e.preventDefault();
				e.stopImmediatePropagation();

				if(this.isActive) {
					this.toggle(false);
				}
			});

			document.addEventListener('keydown', (event) => {
				if (event.code == 'KeyZ' && (event.ctrlKey || event.metaKey)) {
					this.undo();
				}
			});

			document.addEventListener('keyup', (e) => {
				if (e.keyCode == 27 && this.isActive) {
					e.stopImmediatePropagation();
					this.toggle(false);
				}
			});




		},

		methods: {
			undo(length = 1) {
				this.$store.commit('REMOVE_DRAWINGS', length);
			},

			toggle(on) {
				this.isActive = on;
				this.drawer.toggleControls(!on);
			},

			_onMouseDown(e) {
				if (!this.isActive) return;

				this.isMouseDown = true;

				this._intersectionStatus(e);

				if (!e.button) { // ie not at pan start
					this._createLine();
				}
			},

			_onMouseUp() {
				this.isMouseDown = false;
				this.intersection.point.copy(new THREE.Vector3());
				this.intersection.normal.copy(new THREE.Vector3());
			},

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
			},

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
			},

			_createLine() {
				const lineMaterial = new MeshLineMaterial({
					color: new THREE.Color(this.lineConfig.color),
					resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
					lineWidth: this.lineConfig.width,
					sizeAttenuation: false,
					far: this.drawer.camera.far,
					near: this.drawer.camera.near
				});
				const meshLine = new MeshLine();
				const geometry = new Float32Array(this.lineConfig.maxPoints * 3);
				const line = new THREE.Mesh(meshLine.geometry, lineMaterial);

				meshLine.setGeometry(geometry);

				line.g = meshLine;
				line.geo = geometry;
				line.map = [];
				line.name = 'pencil-line';
				line.drawMode = THREE.TrianglesDrawMode;


				this.$store.commit('ADD_DRAWING', line);
				this.drawer.addObject(line);

			},

			_draw(point) {
				const activeLine = this.drawings[this.drawings.length - 1];

				if (activeLine.map.length * 3 >= this.lineConfig.maxPoints) return;

				let index = 0;
				const g = activeLine.g;
				const geo = activeLine.geo = new Float32Array(activeLine.map.length * 3);
				const vNow = new THREE.Vector3().copy(point);

				activeLine.map.push(vNow);

				for (let i = 0, l = activeLine.map.length; i < l; i++) {
					geo[index++] = activeLine.map[i].x;
					geo[index++] = activeLine.map[i].y;
					geo[index++] = activeLine.map[i].z;
				}

				g.setGeometry(geo);
			},

			_intersectionStatus(event) {

				//external method is used (SceneManager.checkIntersection)
				let intersects = this.drawer.checkIntersection(event, {
					x: 0,
					y: this.isMobile ? 0 : 30
				});
				let target = intersects[0];

				this.intersection.intersects = false;

				if (target) {

					if (target.object.material.clippingPlanes) {
						intersects = intersects.filter((elem) => {
							return target.object.material.clippingPlanes.every((elem2) => {
								return elem2.distanceToPoint(elem.point) > 0;
							});
						});
						target = intersects[0];
					}

					this.intersection.object = target.object;
					this.intersection.point = target.point;
					this.intersection.normal = target.face.normal;
					this.intersection.intersects = true;
				}
			}
		}
	}
</script>

<style lang="scss">
	.is-pencil-mode {
		#button-pencil,
		#tester {
			cursor: url('~/assets/Draw Cursor.png'), auto;
		}
	}

	.color-picker {
		position: relative;
	}

	.draw-tools {
		position: absolute;
		right: 15px;
		left: auto;
		bottom: 0;
		top: auto;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
	}

	#hue-cursor {
		border-radius: 100%;
		background: #ccc;
		box-sizing: border-box;
		position: absolute;
		pointer-events: none;
		z-index: 2;
		border: 2px solid #fff;
		cursor: grab;
		top: 0;
		left: 50%;
		height: 20px;
		width: 20px;
		transform: translateX(-50%);
		@media screen and (min-width: $width-s) {
			height: 30px;
			width: 30px;
			border-width: 4px;
		}
	}

	#hue-canvas {
		position: relative;
		border-radius: 1em;
		width: 16px;
		height: 40vh;
		background: #ccc;
		border: 2px solid #fff;
		@media screen and (min-width: $width-s) {
			width: 26px;
			border-width: 4px;
		}
		@media screen and (min-height: 500px) {
			height: 333px;
		}
	}
</style>