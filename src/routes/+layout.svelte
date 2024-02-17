<script lang="ts">
  import type { LayoutData } from './$types';
  import "../app.css"
	import AuthButton from '$lib/components/AuthButton.svelte';

  export let data: LayoutData;
</script>

<AuthButton />
<slot />