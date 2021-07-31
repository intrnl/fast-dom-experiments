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
