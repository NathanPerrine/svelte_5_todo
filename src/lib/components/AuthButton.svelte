<script lang="ts">
  import { auth } from "$lib/firebase";
  import { currentUser } from "$lib/stores/userStore.svelte";

  $effect(() => {
    const unsubsubscribe = auth.onAuthStateChanged((user) => {
      currentUser.currentUser = user
      if (currentUser.currentUser) {
        currentUser.isLoggedIn = true
        currentUser.todoHandlers.getTodos()
      } else {
        currentUser.isLoggedIn = false
      }
    })
    return unsubsubscribe
  })

  currentUser.currentUser?.displayName
</script>



{#if !currentUser.isLoggedIn}
  <button type="button" class="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55"
  onclick={currentUser.authHandlers.loginWithGoogle}
  >
    <svg class="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
    <path fill-rule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clip-rule="evenodd"/>
    </svg>
    Sign in with Google
  </button>
{:else}
  <details class="dropdown dropdown-end">
    <summary class="m-1 btn btn-ghost hover:bg-transparent">
      <img class=" w-12 mask mask-squircle" src={currentUser.currentUser?.photoURL} alt="user">
    </summary>
    <ul class="p-2 shadow menu dropdown-content bg-accent rounded-box w-52">
      <li>
        <button onclick={currentUser.authHandlers.logout}
        class="block px-4 py-2 text-sm text-base-content"
        >Sign Out</button>
      </li>
    </ul>
  </details>
{/if}
