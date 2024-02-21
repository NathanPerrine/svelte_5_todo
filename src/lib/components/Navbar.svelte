<script>

	import { currentUser } from "$lib/stores/userStore.svelte";
	import AuthButton from "./AuthButton.svelte";

</script>

<nav class="bg-primary h-16 sticky top-0 flex justify-between z-10">
  <h3 class="text-primary-content text-xl font-medium mx-4 self-center max-w-[25%] text-ellipsis overflow-hidden">
    {#if currentUser.isLoggedIn}
      Welcome, {currentUser.currentUser?.displayName}
    {/if}
  </h3>

  <div class="flex justify-center items-center p-2">
    <AuthButton />
  </div>
</nav>
