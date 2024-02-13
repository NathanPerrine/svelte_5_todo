<script lang="ts">
  import type { Todo } from '$lib/types/types'
	import TodoCard from './TodoCard.svelte';

  let { todos, title } = $props<{ todos: Todo[], title: string}>()
</script>

<div class="m-4 p-4 pr-1 bg-primary border border-accent card md:w-1/2 overflow-hidden flex flex-1">
  <h1 class="text-2xl text-center font-bold">{title}</h1>

  <!-- todo container -->
  <div class="overflow-auto">
    {#key todos}
    {#each todos as todo, i}
      <TodoCard bind:todo={todo} />
    {/each}
    {/key}

  </div>
</div>