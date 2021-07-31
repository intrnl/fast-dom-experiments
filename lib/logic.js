import { effect, effectScope, getCurrentScope, onScopeDispose } from '@vue/reactivity';
import { removeBetween } from './dom';
import { clearEffectScope } from './utils';


export function text (expression, marker) {
	let node = marker;

	effect(() => {
		let data = '' + expression();

		if (node.nodeType !== Node.TEXT_NODE) {
			node.replaceWith(node = document.createTextNode(data));
		}
		else {
			node.data = data;
		}
	});
}

export function show (expression, marker) {
	let parent = getCurrentScope();

	let currentBlock = null;
	let endBlock = null;
	let scope = effectScope();

	let cleanupBlock = () => {
		if (endBlock) {
			clearEffectScope(scope);
			removeBetween(marker.nextSibling, endBlock);

			endBlock = null;
		}
	};

	effect(() => {
		let block = expression();

		// Don't do anything if block matches current
		if (block === currentBlock) {
			return
		}

		// Cleanup existing block
		cleanupBlock();

		// Handle empty blocks
		if (!block) {
			return
		}

		currentBlock = block;
		scope.run(() => endBlock = block(marker));
	});

	onScopeDispose(cleanupBlock);
}

export function iterate (expression, marker) {
}
