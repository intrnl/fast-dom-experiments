// <script>
//   import { ref } from '@lib';
//
//   let show = ref(false);
//
//   function toggle () {
//     show.value = !show.value;
//   }
// </script>
//
// <button @click={toggle}>toggle</button>
// {#if show}
//   <div>Foo</div>
//   <div>Bar</div>
// {:else}
//   <div>Baz</div>
//   <div>Qux</div>
// {/if}

import { ref } from '../lib/reactivity';

import { define as __define } from '../lib/component';
import { template as __template, clone as __clone, append as __append, after as __after } from '../lib/dom';
import { show as __show } from '../lib/logic';
import { unref as __unref } from '../lib/reactivity';

let $template1 = __template('<button>toggle</button> <!>');
let $template2 = __template('<div>Foo</div> <div>Bar</div><!>');
let $template3 = __template('<div>Baz</div> <div>Qux</div><!>');

export default __define('x-app', {
	setup ($props, $root, $host) {
		let show = ref(false);

		function toggle () {
			show.value = !show.value;
		}

		////// START: TEMPLATE
		let [$fragment, $marker1] = __clone($template1);
		let $child1 = $fragment.firstChild;
		__append($fragment, $root);

		/// <button @click={toggle}>toggle</button>
		$child1.addEventListener('click', toggle);

		////// START: IF BLOCK
		/// {#if show}
		let $block1 = ($root) => {
			let [$fragment, $marker1] = __clone($template2);
			__after($fragment, $root);

			return $marker1;
		};
		/// {:else}
		let $block2 = ($root) => {
			let [$fragment, $marker1] = __clone($template3);
			__after($fragment, $root);

			return $marker1;
		};
		/// {/if}

		__show(() => (__unref(show) ? $block1 : $block2), $marker1);
		////// END: TEMPLATE
	},
});
