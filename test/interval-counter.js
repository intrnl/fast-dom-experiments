// <script>
//   let count = ref(0);
//   let timer = setInterval(() => count.value++, 1000);
//
//   onDestroy(() => clearInterval(timer));
// </script>
//
// <div>{count}</div>

import { ref } from '../lib/reactivity';
import { onDestroy } from '../lib/component';

import { define as __define } from '../lib/component';
import { template as __template, clone as __clone, append as __append } from '../lib/dom';
import { text as __text } from '../lib/logic';
import { unref as __unref } from '../lib/reactivity';

let $template1 = __template('<div><!></div>');

export default __define('x-app', {
	setup ($props, $root, $host) {
		let count = ref(0);
		let timer = setInterval(() => count.value++, 1000);

		onDestroy(() => clearInterval(timer));

		////// START: TEMPLATE
		let [$fragment, $marker1] = __clone($template1);
		__append($fragment, $root);

		/// {count}
		__text(() => (__unref(count)), $marker1);
		////// END: TEMPLATE
	},
});
