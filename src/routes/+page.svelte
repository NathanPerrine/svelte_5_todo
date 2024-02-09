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
    const text = todoEl.value.trim()
    const done = false

    if (text === '') {
      todoEl.value = ''
      return
    }
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
<div class="bg-base-200 w-[90%] md:w-3/4 md:max-w-7xl h-[90vh] max-h-[90vh] md:h-[33vh] mx-auto mt-10 md:mt-20 border border-primary flex justify-center flex-col md:flex-row">

  <!-- add todos -->
  <div class="bg-primary m-4 card border-b md:border-r border-b-secondary md:border-r-secondary mt-4 p-4 md:w-1/2 overflow-hidden min-h-36">
    <label for="todo-input" class="form-control">
      <div class="label">
        <span class="label-text text-secondary-content">What do you plan to do?</span>
      </div>
      <textarea class="textarea textarea-accent w-full md:max-h-80 md:textarea-lg" onkeydown={addTodo} placeholder="Add todo"/>
    </label>
  </div>

  <!-- todo section container -->
  <div class="m-4 bg-secondary border border-secondary card md:border-b md:border-l md:border-b-secondary md:border-l-secondary mt-4 p-4 md:w-1/2 overflow-hidden flex flex-1">
    <!-- button container -->
    <div class="border-b border-accent rounded pb-4">
      {#each ['all', 'active', 'completed'] as filter}
      <button class="btn btn-sm btn-outline mx-2 border-b-2" onclick={() => setFilter(filter)}>
        <span class="first-letter:capitalize">{filter}</span>
      </button>
      {/each}
    </div>
    <!-- todo container -->
    <div class="m-2 p-2 overflow-auto">
      {#key filteredTodos}
      {#each filteredTodos as todo, i}
      <div class={"relative w-11/12 " + (todo.done ? " opacity-40" : '')}>
        <textarea oninput={editTodo} data-index={i} value={todo.text} class=" my-2 textarea textarea-secondary w-full max-h-64"/>
        <input onchange={toggleTodo} data-index={i} class="absolute -right-[8%] top-1/3 -translate-y-1/2" checked={todo.done} type="checkbox">
        <button onclick={removeTodo} data-index={i} class="absolute -right-[8%] top-2/3 -translate-y-1/2">
          <svg class="text-error" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M16 2v4h6v2h-2v14H4V8H2V6h6V2zm-2 2h-4v2h4zm0 4H6v12h12V8zm-5 2h2v8H9zm6 0h-2v8h2z"/></svg>
        </button>
      </div>
      {/each}
      {/key}

    </div>
  </div>


</div>

<style>

</style>