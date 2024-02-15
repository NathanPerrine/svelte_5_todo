import type { Todo } from "$lib/types/types"

// export function currentDraggedTodo() {
//   let currentDraggedTodo = $state<Todo>()

//   return {
//     get currentDraggedTodo() { return currentDraggedTodo },
//     set currentDraggedTodo(newValue) { currentDraggedTodo = newValue }
//   }
// }


import { writable, type Writable } from 'svelte/store'

export const currentDraggedTodo: Writable<Todo> = writable()
