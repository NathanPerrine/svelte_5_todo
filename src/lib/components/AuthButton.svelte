<script lang="ts">
  import { auth } from "$lib/firebase";
  import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
  import { currentUser } from "$lib/stores/userStore.svelte";

  $effect(() => {
    const unsubsubscribe = auth.onAuthStateChanged((user) => {
      console.log(user)
      currentUser.currentUser = user
    })
    return unsubsubscribe
  })

  currentUser.currentUser?.displayName
</script>

<button onclick={currentUser.authHandlers.loginWithGoogle} class="btn btn-primary">Log in to continue</button>
<button onclick={currentUser.authHandlers.logout} class="btn btn-warning">Sign Out</button>
<h1>Hi, {currentUser.currentUser?.displayName}</h1>
<img src={currentUser.currentUser?.photoURL} alt="user">