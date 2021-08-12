// <script>
//   import { reactive, ref } from '@reactivity';
//
//   let todos = reactive([]);
//   let input = ref('');
//
//   function handleFormSubmit (ev) {
//     ev.preventDefault();
//
//     todos.push(input.value);
//     input.value = '';
//   }
// </script>
//
// <main>
//   <form on:submit={handleFormSubmit}>
//     <input type='text' bind:value={input} />
//     <button type='submit'>Add Todo</button>
//   </form>
//
//   <ul>
//     {#each todos as todo}
//       <li>{todo}</li>
//     {/each}
//   </ul>
// </main>

import { reactive, ref } from '../lib';

import { define as __define } from '../lib/component';
import { html as __html, clone as __clone, append as __append, after as __after, traverse as __traverse } from '../lib/dom';
import { show as __show, each as __each, text as __text } from '../lib/logic';
import { unref as __unref, computed as __computed, effect as __effect } from '../lib/reactivity';


let $template1 = __html('<main> <form> <input type="text"> <button type="submit">Add Todo</button> </form> <ul><!></ul> </main>');
let $template2 = __html('<li><!></li><!>');

export default __define('x-app', {
	setup: ($props, $root, $host) => {
		let todos = reactive([]);
		let input = ref('');

		function handleFormSubmit (ev) {
			ev.preventDefault();

			todos.push(input.value);
			input.value = '';
		}


		let $handleInputBind1 = (ev) => {
			input.value = ev.target.value;
		}


		let $block1 = ($root, todo) => {
			let [$fragment, $marker1, $marker2] = __clone($template2);

			__after($fragment, $root);
			__text($marker1, () => __unref(todo));

			return $marker2;
		};

		let [$fragment, $marker1] = __clone($template1);
		let $node1 = __traverse($fragment, 0, 1);
		let $node2 = __traverse($fragment, 0, 1, 1);

		__append($fragment, $root);

		__each($marker1, $block1, () => Array.from(__unref(todos) ?? []));

		$node1.addEventListener('submit', handleFormSubmit);

		__effect(() => $node2.value = __unref(input));
		$node2.addEventListener('input', $handleInputBind1);
	},
});
