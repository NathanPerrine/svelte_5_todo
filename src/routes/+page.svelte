<script lang="ts">

  type Todo = {
    text: string
    done: boolean
  }

  type Filters = 'all' | 'active' | 'completed'

	let todos = $state<Todo[]>([])
	let filter = $state<Filters>('all')
	let filteredTodos = $derived(filterTodos())

  $effect(() => {
    const savedTodos = localStorage.getItem('todos')
    // savedTodos && (todos = JSON.parse(savedTodos))
    if (savedTodos) {
      todos = JSON.parse(savedTodos)
    }
  })

  $effect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  })

  function addTodo(event: KeyboardEvent) {
    if (event.key != 'Enter') return

    // check if anything in input before adding
    const todoEl = event.target as HTMLInputElement
    const id = window.crypto.randomUUID()
    const text = todoEl.value
    const done = false

    todos = [...todos, { text, done}]
    todoEl.value = ''
  }

  function editTodo(event: Event) {
    const inputEl = event.target as HTMLInputElement
    const index = +inputEl.dataset.index!
    todos[index].text = inputEl.value
  }

  function toggleTodo(event: Event) {
    const inputEl = event.target as HTMLInputElement
    const index = +inputEl.dataset.index!
    todos[index].done = !todos[index].done
  }

  function setFilter(newFilter: string) {
    if (newFilter === 'all' || newFilter === 'active' || newFilter === 'completed') {
      filter= newFilter
    }
  }

  function filterTodos() {
    switch (filter) {
      case 'all':
        return todos
      case 'active':
        return todos.filter((todo) => !todo.done)
      case 'completed':
        return todos.filter((todo) => todo.done)
    }
  }

  function removeTodo(event: Event) {
    const inputEl = event.currentTarget as HTMLInputElement
    const index = +inputEl.dataset.index!
    todos = [...todos.slice(0, index), ...todos.slice(index+1)]
  }

  function remaining() {
    return todos.filter((todo) => !todo.done).length
  }

</script>

<div class="h-full flex flex-col justify-center items-center">


  <div class="todos grid gap-4">
    <input class="w-full p-4" onkeydown={addTodo} type="text" placeholder="Add todo"/>
    {#key filteredTodos}
      {#each filteredTodos as todo, i}
        <div class={"relative " + (todo.done ? " opacity-40" : '')}>
          <input oninput={editTodo} data-index={i}
          class={"w-full p-4 transition-opacity " }
          value={todo.text} type="text">
          <input onchange={toggleTodo} data-index={i} class="absolute right-[4%] top-1/2 -translate-y-1/2" checked={todo.done} type="checkbox">
          <button onclick={removeTodo} data-index={i} class="absolute -right-4 top-1/2 -translate-y-1/2">
              <svg class="text-error" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M16 2v4h6v2h-2v14H4V8H2V6h6V2zm-2 2h-4v2h4zm0 4H6v12h12V8zm-5 2h2v8H9zm6 0h-2v8h2z"/></svg>
            </button>
        </div>
      {/each}
    {/key}
  </div>

  <div class="flex m-4">
    {#each ['all', 'active', 'completed'] as filter}
      <button
        class="btn btn-outline mx-2"
        onclick={() => setFilter(filter)}
      >
        <span class="first-letter:capitalize">{filter}</span>
      </button>
    {/each}
  </div>

  <p>{remaining()} remaining</p>
</div>

<style>

</style>