// @ts-nocheck
import type { Todo } from "$lib/types/types"
import { browser } from "$app/environment"

// const check = browser ? window.localStorage.getItem('todos') : null;
// console.log(check)
// let initialValue: Todo[] = []

// if (typeof check === 'string') {
//   initialValue = JSON.parse(check)
//   // const savedTodos = localStorage.getItem('todos')
//   // // savedTodos && (todos = JSON.parse(savedTodos))
//   // if (savedTodos) {
//   //   todos = JSON.parse(savedTodos)
//   // }
// }

export function createTodos() {
  let todos = $state<Todo[]>([])

  $effect(() => {
    console.log(todos)
  })

  if (browser) {
    todos = JSON.parse(window.localStorage.getItem('todos'))
  }

  function update() {
    if (browser) {
      localStorage.setItem('todos', JSON.stringify(todos))
    }
  }

  interface todoInterface {
    text: string,
    status: string,
    id: string
  }
  function addTodo({text, status, id}: todoInterface) {
    todos = [...todos, { text, status, id}]
    update()
  }

  function removeTodo(id: string) {
    let index = todos.findIndex((todo) => {
		  return todo.id === id;
		})
		todos.splice(index, 1)
    update()
  }

  function updateTodo({text, status, id}: todoInterface) {
    let index = todos.findIndex((todo) => {
		  return todo.id === id;
		})
    todos[index].text = text
    todos[index].status = status
    update()
  }

  return {
    get todos() { return todos },
    addTodo,
    removeTodo,
    updateTodo
  }
}