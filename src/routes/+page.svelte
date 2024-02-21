<script lang="ts">
	import Board from "$lib/components/Board.svelte";
  import type { Todo } from "$lib/types/types"
  import { currentUser } from "$lib/stores/userStore.svelte";

  import { db } from "$lib/firebase";
  import { doc, onSnapshot } from "firebase/firestore"
	let todos = $state<Todo[]>([])

  $effect(() => {
    if (currentUser.isLoggedIn === false) {
      todos = []
    }
    if (currentUser.currentUser){
      const docRef = doc(db, `users/${currentUser.currentUser.uid}`)
      onSnapshot(docRef, (snapshot) => {
        todos = (snapshot.data()?.todos ) ?? []
      })
    }
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

  async function addTodo(event: KeyboardEvent) {
    if (event.key != 'Enter') return

    let todoEl = event.target as HTMLInputElement
    let text = todoEl.value.trim();
    let id = window.crypto.randomUUID();
    let status = 'todo';

    if (text === '') {
      todoEl.value = ''
      return
    }

    currentUser.todoHandlers.addTodo(text, status, id, clearText)

    function clearText() {
      (event.target as HTMLInputElement).value = ''
    }
  }

</script>
<div class="card z-[1] bg-base-200 w-[90%] md:w-11/12 md:max-w-7xl h-[90vh] max-h-[90vh] mx-auto mt-3 md:mt-10 border border-primary flex justify-center flex-col ">

  <!-- add todos -->
  <div class="bg-secondary
  mx-auto mt-4 p-4
  min-h-36 w-5/6 max-w-xl
  card overflow-hidden flex-row">

    <h1 class="text-secondary-content card-title text-center">What do you need to do?</h1>
    <textarea class="textarea textarea-accent w-full md:max-h-80 md:textarea-lg" onkeydown={addTodo}
    disabled={!currentUser.isLoggedIn}
    placeholder={currentUser.isLoggedIn ? 'Add todo' : 'Please log in to continue'}/>
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