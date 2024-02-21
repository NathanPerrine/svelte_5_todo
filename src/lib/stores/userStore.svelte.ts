/**
 * @returns a store with the current firebase user
 */

import { goto } from "$app/navigation";
import { auth, googleProvider, db } from "$lib/firebase";
import { signInWithPopup, type User } from "firebase/auth";
import { doc, onSnapshot, arrayUnion, updateDoc, setDoc, arrayRemove } from "firebase/firestore"
import type { Todo } from "$lib/types/types";

export function userStore() {
  let isLoggedIn = $state(false)
  let currentUser = $state<User | null>()
  let todos = $state<Todo[]>([])

  const authHandlers = {
    logout: async () => {
      await auth.signOut();
      currentUser = null
      isLoggedIn = false
      goto('/')
    },
    loginWithGoogle: async() => {
      await signInWithPopup(auth, googleProvider)
        .then((result) => {
          currentUser = result.user
          isLoggedIn = true
        })
    }
  }

  const todoHandlers = {
    getTodos: () => {
      if (currentUser){
        const docRef = doc(db, `users/${currentUser.uid}`)
        onSnapshot(docRef, (snapshot) => {
          todos = (snapshot.data()?.todos ) ?? []
        })
      }
    },
    addTodo: async (text: string, status: string, id: string, callback: () => void) => {
      let uid = currentUser?.uid
      if (uid) {
        console.log('adding todo...')
        await setDoc(doc(db, "users", uid),
        { todos: arrayUnion({
            text: text,
            status: status,
            id: id
          })
        },
        { merge: true }
        )
      }
      callback()
    },
    editTodo: async (newText: string, newStatus: string, id: string) => {
      // update todos
      let currentTodos = [...todos]
      const todoIndex = currentTodos.findIndex((todo) => todo.id === id)
      currentTodos[todoIndex].text = newText
      currentTodos[todoIndex].status = newStatus.toLowerCase()

      // update firestore with updated todos
      let uid = currentUser?.uid
      if (uid) {
        console.log('Updating todos...')
        await setDoc(doc(db, "users", uid),
        { todos: currentTodos},
        { merge: true }
        )
      }
    },
    removeTodo: async (todo: Todo) => {
      // remove todo from firestore
      console.log('Removing todo from firestore...')
      let uid = currentUser?.uid
      if (uid) {
        const userRef = doc(db, "users", uid)
        await updateDoc(userRef, {
          todos: arrayRemove(todo)
        })
      }
    },
    handleDroppedTodo: async (todo: Todo, board: string) => {
      console.log('Updating dropped todo..')

      // check if status needs changed
      if (board.toLowerCase() === todo.status) return

      let currentTodos = [...todos]
      const todoIndex = currentTodos.findIndex((currentTodo) => currentTodo.id === todo.id)
      currentTodos[todoIndex].status = board.toLowerCase()

      let uid = currentUser?.uid
      if (uid) {
        await setDoc(doc(db, "users", uid),
          { todos: currentTodos },
          { merge: true }
        )
      }


      if (todo) {
        todo.status = board
      }
    }
  }


  return {
    get currentUser() { return currentUser},
    set currentUser(newUser) { currentUser = newUser },

    get isLoggedIn() { return isLoggedIn },
    set isLoggedIn( newValue:boolean ) { isLoggedIn = newValue},

    get todos() { return todos },
    set todos(newValue: Todo[]) { todos = newValue},

    authHandlers,
    todoHandlers,
  }
}

export const currentUser = userStore();
