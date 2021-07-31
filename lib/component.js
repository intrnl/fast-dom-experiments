import { effectScope, onScopeDispose, reactive } from '@vue/reactivity';
import { clearEffectScope } from './utils';

class BaseElement extends HTMLElement {
	/** setup function */
	$s;
	/** props */
	$p = reactive({});
	/** effect scope */
	$c = effectScope(true);
	/** is mounted */
	$m = false;

	connectedCallback () {
		let host = this;

		if (!host.$m) {
			host.$m = true;

			let root = host.attachShadow({ mode: 'open' });

			let setup = host.$s;
			let props = host.$p;
			let scope = host.$c;

			scope.run(() => setup(props, root, host));
		}
	}

	disconnectedCallback () {
		let host = this;

		if (host.$m) {
			clearEffectScope(host.$c);
			host.$m = false;
		}
	}

	attributeChangeCallback (attr, prev, next) {
		let host = this;
		host.$p[attr] = next;
	}
}

export function define (tag, options) {
	let { props, setup } = options;

	class VelvetElement extends BaseElement {
		static tagName = tag;
		static observedAttributes = [];

		$s = setup;
	}

	// define getters setters

	customElements.define(tag, VelvetElement);
	return VelvetElement;
}

export function onMount (fn) {
	if (typeof fn !== 'function') return;

	let cleanup = fn();
	onDestroy(cleanup);
}

export function onDestroy (fn) {
	if (typeof fn !== 'function') return;

	onScopeDispose(fn);
}
