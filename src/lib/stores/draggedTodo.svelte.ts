import type { Todo } from "$lib/types/types"

export function currentDraggedTodo() {
  let draggedTodo = $state<Todo>()

  return {
    get draggedTodo() { return draggedTodo },
    set draggedTodo(newValue) { draggedTodo = newValue }
  }
}

export const draggedTodo = currentDraggedTodo()
