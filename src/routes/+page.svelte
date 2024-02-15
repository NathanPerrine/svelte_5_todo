<script lang="ts">
	import Board from "$lib/components/Board.svelte";
  import type { Todo } from "$lib/types/types"

  import { setContext } from 'svelte';
  setContext('remove', { removeTodo })
  setContext('drop', {handleDroppedTodo})

	let todos = $state<Todo[]>([])

  $effect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      todos = JSON.parse(savedTodos)
    } else {
      todos = [
        {text: 'Hello there', status: 'todo', id: "1"},
        {text: 'General Kenobi', status: "in progress", id: "2"},
        {text: 'Take pizza out of oven', status: 'completed', id: "3"}
      ]
    }
  })

  $effect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  })

  let boards = [
    {
      title: 'Todo',
      filter: 'todo',
    },
    {
      title: 'In Progress',
      filter: 'in progress',
    },
    {
      title: 'Completed',
      filter: 'completed'
    },
  ]

  function addTodo(event: KeyboardEvent) {
    if (event.key != 'Enter') return

    const todoEl = event.target as HTMLInputElement
    const id = window.crypto.randomUUID()
    const text = todoEl.value.trim()
    const done = false
    const status = 'todo'

    if (text === '') {
      todoEl.value = ''
      return
    }
    todos = [...todos, { text, status, id}]
    todoEl.value = ''
  }

  function removeTodo(id: string) {
    let index = todos.findIndex((todo) => {
      return todo.id === id;
    })
    todos.splice(index, 1)
  }

  function handleDroppedTodo(id: string, board: string) {
    const todo = todos.find((todo) => todo.id === id)
    if (todo) {
      todo.status = board
    }
  }

</script>
<div class="card bg-base-200 w-[90%] md:w-11/12 md:max-w-7xl h-[90vh] max-h-[90vh] mx-auto mt-10 md:mt-20 border border-primary flex justify-center flex-col ">

  <!-- add todos -->
  <div class="bg-secondary
  mx-auto mt-4 p-4
  min-h-36 w-5/6 max-w-xl
  card overflow-hidden flex-row">

    <h1 class="text-secondary-content card-title text-center">What do you need to do?</h1>
    <textarea class="textarea textarea-accent w-full md:max-h-80 md:textarea-lg" onkeydown={addTodo} placeholder="Add todo"/>

  </div>

  <div class="divider divider-accent"></div>

  <!-- todo board container -->
  <div class="flex flex-1 overflow-auto p-4 flex-col sm:flex-row">
    {#each boards as board}
      <Board todos={todos.filter((todo) => todo.status.toLowerCase() == board.filter)} title={board.title} filter={board.filter} />
    {/each}
  </div>

</div>

<style>

</style>