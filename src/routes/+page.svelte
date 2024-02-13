<script lang="ts">
	import Board from '$lib/components/Board.svelte';
	import type { Todo } from '$lib/types/types';

	import { setContext } from 'svelte';
	setContext('remove', { removeTodo });

	// let todos = $state<Todo[]>([])
	import { createTodos } from '$lib/stores/todos.svelte';
	const todos = createTodos();

	// $effect(() => {
	//   const savedTodos = localStorage.getItem('todos')
	//   // savedTodos && (todos = JSON.parse(savedTodos))
	//   if (savedTodos) {
	//     todos = JSON.parse(savedTodos)
	//   }
	// })

	// $effect(() => {
	//   localStorage.setItem('todos', JSON.stringify(todos))
	// })

	let boards = [
		{
			title: 'Todo',
			filter: 'todo'
		},
		{
			title: 'In Progress',
			filter: 'in progress'
		},
		{
			title: 'Completed',
			filter: 'completed'
		}
	];

	function addTodos(event: KeyboardEvent) {
		if (event.key != 'Enter') return;

		const todoEl = event.target as HTMLInputElement;
		const id = window.crypto.randomUUID();
		const addText = todoEl.value.trim();
		const addStatus = 'todo';

    // todos.addTodo(text, status, id)
    todos.addTodo({text: addText, status: addStatus, id: id})
		// if (text === '') {
		// 	todoEl.value = '';
		// 	return;
		// }
		// // todos = [...todos, { text, status, id}]
		todoEl.value = '';
	}

	function removeTodo(id: string) {
		// let index = todos.findIndex((todo) => {
		//   // return todo.id === id;
		// })
		// // todos.splice(index, 1)
	}
</script>

<div
	class="card bg-base-200 w-[90%] md:w-11/12 md:max-w-7xl h-[90vh] max-h-[90vh] mx-auto mt-10 md:mt-20 border border-primary flex justify-center flex-col"
>
	<!-- add todos -->
	<div
		class="bg-primary
  mx-auto mt-4 p-4
  min-h-36 w-5/6 max-w-xl
  card border-b md:border-r border-b-secondary md:border-r-secondary overflow-hidden flex-row"
	>
		<h1 class="text-secondary-content card-title text-center">What do you need to do?</h1>
		<textarea
			class="textarea textarea-accent w-full md:max-h-80 md:textarea-lg"
			onkeydown={addTodos}
			placeholder="Add todo"
		/>
	</div>

	<!-- todo board container
    todos={todos.todos.filter((todo) => todo.status.toLowerCase() == board.filter)}
  -->
	<div class="flex flex-1 overflow-hidden p-4">
		{#each boards as board}
			<Board

				title={board.title}
        filter={board.filter}
			/>
		{/each}
	</div>
</div>

<style>
</style>
