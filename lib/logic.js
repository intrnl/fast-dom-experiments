import { ref, effect, effectScope, onScopeDispose } from '@vue/reactivity';
import { removeParts } from './dom';
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

	effect(() => {
		let block = expression();

		// Don't do anything if block matches current
		if (block === currentBlock) {
			return
		}

		// Cleanup existing block
		if (endBlock) {
			destroyBlock(marker, endBlock, scope);
			endBlock = null;
		}

		// Handle empty blocks
		if (!block) {
			return
		}

		currentBlock = block;
		scope.run(() => endBlock = block(marker));
	});

	onScopeDispose(() => {
		if (endBlock) {
			clearEffectScope(scope);
		}
	});
}

export function promise (marker, pending, resolved, rejected, expression) {
	// 0 is a special holding state, we'll wait for the next microtask to see if
	// the promise has resolved yet before actually showing the pending block

	// 0 = undefined, 1 = pending, 2 = resolved, 3 = rejected
	let status = ref();
	let result = ref();
	let error = ref();
	let uid = 0;

	if (resolved) resolved = resolved.bind(0, result);
	if (rejected) rejected = rejected.bind(0, error);

	effect(() => {
		let id = uid++;

		status.value = 0;
		result.value = null;
		error.value = null;

		try {
			let promise = Promise.resolve(expression());

			promise.then(
				(val) => {
					if (id !== uid) return;

					result.value = val;
					status.value = 2;
				},
				(err) => {
					if (id !== uid) return;

					error.value = err;
					status.value = 3;
				},
			);

			queueMicrotask(() => {
				if (id !== uid) return;

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

export function each (marker, block, expression) {
	// [scope, marker, item]
	let parts = [];

	effect(() => {
		let items = Array.from(expression());
		let index = 0;

		for (; index < items.length; index++) {
			if (parts[index]) {
				let item = parts[index][2];
				item.value = items[index];
			}
			else {
				let prev = parts[index - 1];
				let start = prev ? prev[1] : marker;

				let item = ref(items[index]);
				let scope = effectScope();

				parts[index] = [scope, scope.run(() => block(start, item, index)), item];
			}
		}

		for (; index < parts.length; index++) {
			let prev = parts[index - 1];
			let start = prev ? prev[1] : marker;

			let [scope, end] = parts[index];
			destroyBlock(start, end, scope);
		}

		parts.length = items.length;
	});

	onScopeDispose(() => {
		for (let [scope] of parts) {
			clearEffectScope(scope);
		}
	});
}

export function keyed (marker, block, expression) {
	let init = false;
	let currentKey = null;
	let endBlock = null;
	let scope = effectScope();

	effect(() => {
		let key = expression();

		if (!init || key !== currentKey) {
			if (endBlock) {
				destroyBlock(marker, endBlock, scope);
				endBlock = null;
			}

			scope.run(() => endBlock = block(marker));
		}

		init = true;
	});

	onScopeDispose(() => {
		if (endBlock) {
			clearEffectScope(scope);
		}
	});
}


function destroyBlock (marker, end, scope) {
	clearEffectScope(scope);
	removeParts(marker.nextSibling, end);
}
