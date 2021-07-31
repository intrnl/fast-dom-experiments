export function clearEffectScope (scope) {
	if (scope.active) {
		scope.effects.forEach((effect) => effect.stop());
		scope.cleanups.forEach((cleanup) => cleanup());
		scope.scopes?.forEach((child) => child.stop(true));

		scope.effects = [];
		scope.cleanups = [];
	}
}
