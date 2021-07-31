import { ref, effect, effectScope, onScopeDispose,  } from '@vue/reactivity';
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

export function iterate (marker, block, expression, key) {
}

export function promise (marker, pending, resolved, rejected, expression) {
	// 0 is a special holding state, we'll wait for the next microtask to see if
	// the promise has resolved yet before actually showing the pending block

	// 0 = undefined, 1 = pending, 2 = resolved, 3 = rejected
	let status = ref();
	let result = ref();
	let error = ref();

	if (resolved) resolved = resolved.bind(0, result);
	if (rejected) rejected = rejected.bind(0, error);

	effect(() => {
		status.value = 0;
		result.value = null;
		error.value = null;

		try {
			let promise = Promise.resolve(expression());

			promise.then(
				(val) => {
					result.value = val;
					status.value = 2;
				},
				(err) => {
					error.value = err;
					status.value = 3;
				},
			);

			queueMicrotask(() => {
				if (status.value === 0) {
					status.value = 1;
				}
			});
		} catch (err) {
			error.value = err;
			status.value = 3;

			throw err;
		}
	});

	show(marker, () => {
		let status = status.value;
		return status === 1 ? pending : status === 2 ? resolved : status === 3 ? rejected : null;
	});
}
