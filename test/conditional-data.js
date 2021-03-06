// <script>
//   let data = {
//     name: {
//       first: 'John',
//       last: 'Doe',
//     },
//   };
// </script>
//
// {#if data.name}
//   <div>{data.name.first}</div>
//   <div>{data.name.last}</div>
// {:else}
//   <div>No name!</div>
// {/if}

import { define as __define } from '../lib/component';
import { html as __html, clone as __clone, append as __append, after as __after } from '../lib/dom';
import { text as __text, show as __show } from '../lib/logic';
import { unref as __unref } from '../lib/reactivity';

let $template1 = __html('<!>');
let $template2 = __html('<div><!></div> <div><!></div><!>');
let $template3 = __html('<div>No name!</div><!>');

export default __define('x-app', {
  setup ($props, $root, $host) {
    let data = {
      name: {
        first: 'John',
        last: 'Doe',
      },
    };

		////// START: TEMPLATE
    let [$fragment, $marker1] = __clone($template1);
    __append($fragment, $root);

    ////// START: IF BLOCK
    /// {#if data.name}
    let $block1 = ($root) => {
      let [$fragment, $marker1, $marker2, $marker3] = __clone($template2);
      __after($fragment, $root);

      __text($marker1, () => (__unref(data).name.first));
      __text($marker2, () => (__unref(data).name.last));

      return $marker3;
    };
    /// {:else}
    let $block2 = ($root) => {
      let [$fragment, $marker1] = __clone($template3);
      __after($fragment, $root);

      return $marker1;
    };
    /// {/if}

    __show($marker1, () => (__unref(data).name ? $block1 : $block2));
    ////// END: IF BLOCK
		////// END: TEMPLATE
  },
});
