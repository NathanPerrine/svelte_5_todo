<script lang="ts">
  import type { Todo } from '$lib/types/types'
	import TodoCard from './TodoCard.svelte';

  let { todos, title } = $props<{ todos: Todo[], title: string}>()

  import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	const [send, receive] = crossfade({
		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});
</script>

<div class="m-4 p-4 pr-1 bg-primary border border-accent card md:w-1/2 overflow-hidden flex flex-1">
  <h1 class="text-2xl text-center font-bold">{title}</h1>

  <!-- todo container -->
  <div class="overflow-auto">
    <!-- {#key todos} -->
    {#each todos as todo (todo.id)}
      <div in:receive={{ key: todo.id }} out:send={{ key: todo.id}} animate:flip>
        <TodoCard bind:todo={todo} />
      </div>
    {/each}
    <!-- {/key} -->

  </div>
</div>