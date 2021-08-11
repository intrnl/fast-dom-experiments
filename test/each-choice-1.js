// <script>
//   let items = [
//     { first: 'Hal' , last: 'Phalen' },
//     { first: 'Annamarie' , last: 'Holdsworth' },
//     { first: 'Ariel' , last: 'Diemer' },
//     { first: 'Johanne' , last: 'Greer' },
//     { first: 'Mike' , last: 'Haston' },
//   ];
// </script>
//
// {#each items as item}
//   <div>{item.first} {item.last}</div>
// {:else}
//   <div>List is empty.</div>
// {/each}

import { define as __define } from '../lib/component';
import { html as __html, clone as __clone, append as __append, after as __after } from '../lib/dom';
import { show as __show, each as __each, text as __text } from '../lib/logic';
import { unref as __unref, computed as __computed } from '../lib/reactivity';

// Choice #1: Put each block inside of conditional
let $template1 = __html('<!>');
let $template2 = __html('<!><!>');
let $template3 = __html('<div>List is empty.</div><!>');
let $template4 = __html('<div><!> <!></div><!>');

export default __define('x-app', {
	setup ($props, $root, $host) {
		let items = [
			{ first: 'Hal' , last: 'Phalen' },
			{ first: 'Annamarie' , last: 'Holdsworth' },
			{ first: 'Ariel' , last: 'Diemer' },
			{ first: 'Johanne' , last: 'Greer' },
			{ first: 'Mike' , last: 'Haston' },
		];


		let [$fragment, $marker1] = __clone($template1);
		__append($fragment, $root);

		let $computed1 = __computed(() => Array.from(__unref(items)));

		let $block1 = ($root) => {
			let [$fragment, $marker1, $marker2] = __clone($template2);
			__after($fragment, $root);

			__each($marker1, $block3, () => $computed1.value);
			return $marker2;
		};

		let $block2 = ($root) => {
			let [$fragment, $marker1] = __clone($template3);
			__after($fragment, $root);

			return $marker1;
		};

		let $block3 = ($root, item) => {
			let [$fragment, $marker1, $marker2, $marker3] = __clone($template4);
			__after($fragment, $root);

			__text($marker1, () => __unref(item).first);
			__text($marker2, () => __unref(item).last);

			return $marker3;
		};

		__show($marker1, () => __unref($computed1).length ? $block1 : $block2);
	},
});
