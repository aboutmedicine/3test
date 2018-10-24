class Annotation {
	constructor(data = {}) {
		this.id = Math.random().toString(16).slice(-4);
		this.isOpen = false;
		this.isPlaced = false;
		this.position = {
			parent: null,
			self: null
		};

		this._build(data.appendTo);

		if (data.position) {
			this.move(data.position);
		}
	}

	get html() {
		return this._html;
	}

	place(atPoint, origin) {
		this.isPlaced = true;
		this.position.self = atPoint;
		this.position.parent = origin;
	}

	move(toPoint) {
		this._html.style.top = `${toPoint.y}px`;
		this._html.style.left = `${toPoint.x}px`;
	}

	open() {
		this._html.classList.add('open');
		this.isOpen = true;
	}

	close() {
		this._html.classList.remove('open');
		this.isOpen = false;
	}

	_build(appendTo) {
		const container = document.createElement('div');
		const str = `<div class="annotation-content">
				<i data-feather="x" class="ico close-annotation"></i>
				
				<input class="annotationtitle" placeholder="Annotation">
				<textarea rows="3" placeholder="Type Here..."></textarea>
				
				<i data-feather="delete" class="ico delete delete-annotation"></i>
				<i data-feather="save" class="ico save save-annotation"></i>
			</div>`;

		container.className = 'annotation';
		container.id = this.id;
		container.innerHTML = str;

		this._html = container;


		container.addEventListener('click', (e) => {
			if (!this.isPlaced) return false;

			if (!this.isOpen) {
				this.open();
			}
			if (e.target.matches('.close-annotation, .close-annotation *')) {
				this.close();
			}

		});

		if (appendTo) {
			appendTo.appendChild(container);

			//to be removed/replaced
			window.feather.replace();
		}
	}

}

export default Annotation;