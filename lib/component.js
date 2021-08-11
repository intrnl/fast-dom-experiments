import { effectScope, onScopeDispose, getCurrentScope, reactive } from '@vue/reactivity';
import { isFunction, camelize, hyphenate } from '@vue/shared';
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
		let prop = camelize(attr);
		host.$p[prop] = next;
	}
}

export function define (tag, options) {
	let { props = [], setup } = options;

	class VelvetElement extends BaseElement {
		static tagName = tag;
		static observedAttributes = props.map(hyphenate);

		$s = setup;
	}

	for (let prop in props) {
		Object.defineProperty(VelvetElement.prototype, prop, {
			get () {
				return this.$p[prop];
			},
			set (value) {
				this.$p[prop] = value;
			}
		});
	}

	customElements.define(tag, VelvetElement);
	return VelvetElement;
}
