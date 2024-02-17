<script lang="ts">
  import type { Todo } from '$lib/types/types'
	import TodoCard from './TodoCard.svelte';
  import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';

  let { todos, title, filter } = $props<{ todos: Todo[], title: string, filter: string}>()

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

  let isDraggingOver = $state(false)
  import { draggedTodo } from '$lib/stores/draggedTodo.svelte';

  function dragEnter(e: DragEvent) {
    isDraggingOver = true;
  }

  function dragLeave(e: DragEvent) {
    isDraggingOver = false;
  }

  import { getContext } from "svelte"
  const { handleDroppedTodo } = getContext<any>('drop')

  function todoDragging(e: DragEvent) {
    const id = (e.target as HTMLElement).getAttribute('data-id');
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
      draggedTodo.draggedTodo = todo;
    }
  }

  function assignDrop(e: DragEvent) {
    if (draggedTodo.draggedTodo) {
      handleDroppedTodo(draggedTodo.draggedTodo.id, filter)
      isDraggingOver = false
    }
  }

  function dragOver(e:DragEvent) {
    e.preventDefault();
  }

</script>

<div
on:drop={assignDrop}
on:dragenter={dragEnter}
on:dragleave={dragLeave}
on:dragover={dragOver}
data-filter={filter}
role="list"
class="todoBoard m-2 p-4 pr-1 bg-primary border border-accent card md:w-1/2 sm:overflow-hidden flex flex-1 h-1/ sm:h-auto"
class:ring={isDraggingOver}
class:[&_*]:pointer-events-none={isDraggingOver}
>
  <h1 class="text-2xl text-center font-bold">{title}</h1>

  <!-- todo container -->
  <div class="overflow-auto h-full">
    <div class="flex flex-row sm:flex-col">
      {#each todos as todo (todo.id)}
      <div in:receive={{ key: todo.id }} out:send={{ key: todo.id}} animate:flip>
        <TodoCard bind:todo={todo} on:drag={todoDragging} />
      </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .todoBoard:global(.droppable) {
    outline: 0.1rem solid black;
    outline-offset: 0.25rem;
  }
  .todoBoard:global(.droppable) * {
    pointer-events: none;
  }
</style>