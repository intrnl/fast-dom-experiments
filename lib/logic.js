import { effect, effectScope, getCurrentScope, onScopeDispose } from '@vue/reactivity';
import { removeBetween } from './dom';
import { clearEffectScope } from './utils';


export function text (marker, expression) {
	let node = document.createTextNode('');
	marker.replaceWith(node);

	effect(() => node.data = expression());
}

export function show (marker, expression) {
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

export function iterate (marker, expression) {
}
}
