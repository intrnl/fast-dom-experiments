// Stopping an effect scope deactivates the effect scope entirely, it should be
// possible to only clear the scope for future usage.
// https://github.com/vuejs/vue-next/issues/4217
export function clearEffectScope (scope) {
	if (scope.active) {
		scope.effects.forEach((effect) => effect.stop());
		scope.cleanups.forEach((cleanup) => cleanup());
		scope.scopes?.forEach((child) => child.stop(true));

		scope.effects = [];
		scope.cleanups = [];
	}
}

let RE_CAMEL = /[A-Z]/g;
let RE_KEBAB = /-([a-z])/g;

export function kebabCase (str) {
	return str.replace(RE_CAMEL, '-$&').toLowerCase();
}

export function camelCase (str) {
	return str.replace(RE_KEBAB, (_, l) => l.toUpperCase());
}
