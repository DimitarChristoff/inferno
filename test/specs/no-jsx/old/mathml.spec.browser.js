import Inferno from '../../../../packages/inferno/src/';
import InfernoDOM from '../../../../packages/inferno-dom/src/';

// WHY would we need this??

import { addTreeConstructor } from '../../../../src/core/createTemplate';
import createDOMTree from '../../../../src/DOM/createTree';
addTreeConstructor( 'dom', createDOMTree );

describe( 'mathML - (non-JSX)', () => {

	let container;

	beforeEach(() => {
		container = document.createElement('div');
	});

	afterEach(() => {
		container.innerHTML = '';
	});

	it('should set MathML as default namespace for <math>', () => {

		let template = Inferno.createTemplate(() => ({
			tag: 'math'
		}));

		InfernoDOM.render(template(), container);
		expect(container.firstChild.namespaceURI).to.equal("http://www.w3.org/1998/Math/MathML");

		InfernoDOM.render(template(), container);
		expect(container.firstChild.namespaceURI).to.equal("http://www.w3.org/1998/Math/MathML");

		InfernoDOM.render(template(), container);
		expect(container.firstChild.namespaceURI).to.equal("http://www.w3.org/1998/Math/MathML");
	});

	it('should solve mathML edge when wrapped inside a non-namespace element ( static )', () => {

		let template = Inferno.createTemplate(() => ({
			tag: 'div',
			children:{
				tag: 'math'

			}
		}));

		InfernoDOM.render(template(), container);
		expect(container.firstChild.firstChild.namespaceURI).to.equal('http://www.w3.org/1998/Math/MathML');
		InfernoDOM.render(template(), container);
		expect(container.firstChild.firstChild.namespaceURI).to.equal('http://www.w3.org/1998/Math/MathML');

	})

	it('should solve mathML edge when wrapped inside a non-namespace element ( dynamic )', () => {

		let child = Inferno.createTemplate(() => ({
			tag: 'math',
		}));

		let template = Inferno.createTemplate((child) => ({
			tag: 'div',
			children:child
		}));

		InfernoDOM.render(template(child()), container);
		expect(container.firstChild.firstChild.namespaceURI).to.equal('http://www.w3.org/1998/Math/MathML');
		InfernoDOM.render(template(child()), container);
		expect(container.firstChild.firstChild.namespaceURI).to.equal('http://www.w3.org/1998/Math/MathML');
	})

	/**
	 * This is an edge case, and will turn out wrong for the end-dev because of stupidity, but at
	 * least the correct namespace is kept all the way down to the last element.
	 * */
	it('should solve mathML edge when wrapped inside multiple non-namespace element children ( dynamic )', () => {

		let child = Inferno.createTemplate(() => ({
			tag: 'math',
			children: {
				tag: 'span',
				children: {
					tag: 'mo'
				}
			}
		}));

		let template = Inferno.createTemplate((child) => ({
			tag: 'div',
			children:child
		}));

		InfernoDOM.render(template(child()), container);

		expect(container.firstChild.tagName).to.equal('DIV');
		expect(container.firstChild.firstChild.tagName).to.equal('math');
		expect(container.firstChild.firstChild.firstChild.tagName).to.equal('span');
		expect(container.firstChild.firstChild.firstChild.firstChild.tagName).to.equal('mo');
		expect(container.firstChild.firstChild.namespaceURI).to.equal('http://www.w3.org/1998/Math/MathML');
		expect(container.firstChild.firstChild.firstChild.namespaceURI).to.equal('http://www.w3.org/1998/Math/MathML');
		expect(container.firstChild.firstChild.firstChild.firstChild.namespaceURI).to.equal('http://www.w3.org/1998/Math/MathML');
		expect(container.firstChild.firstChild.firstChild.firstChild.namespaceURI).to.equal('http://www.w3.org/1998/Math/MathML');
	})
});