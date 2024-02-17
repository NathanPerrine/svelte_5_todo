/**
 * @returns a store with the current firebase user
 */

import { goto } from "$app/navigation";
import { auth, googleProvider } from "$lib/firebase";
import { signInWithPopup, type User } from "firebase/auth";

export function userStore() {
  let isLoading = $state(true)
  let currentUser = $state<User | null>()

  const authHandlers = {
    logout: async () => {
      await auth.signOut();
      currentUser = null
      goto('/')
    },
    loginWithGoogle: async() => {
      await signInWithPopup(auth, googleProvider)
        .then((result) => {

          console.log(result)
          currentUser = result.user
        })
    }
  }

  return {
    get currentUser() { return currentUser},
    set currentUser(newUser) { currentUser = newUser },
    set isLoading(loading: boolean) { isLoading = loading },
    authHandlers
  }
}

export const currentUser = userStore();