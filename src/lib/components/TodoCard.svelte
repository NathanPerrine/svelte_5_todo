<script lang="ts">
	import { currentUser } from "$lib/stores/userStore.svelte";
  import type { Todo } from "$lib/types/types"

  let { todo } = $props<{ todo: Todo}>()
  const todoStatus = ['Todo', 'In Progress', 'Completed']

  function save() {

    let text = (document.getElementById(`text-${todo.id}`) as HTMLInputElement).value
    let status = (document.getElementById(`select-${todo.id}`) as HTMLSelectElement).value

    if (todo.text != text || todo.status != status.toLowerCase()) {
      currentUser.todoHandlers.editTodo(text, status, todo.id)

      const modal = <HTMLInputElement>document.getElementById(`edit_modal_${todo.id}`)
      if (modal) {
        modal.checked = !modal.checked
      }

    }
  }

  function removeTodo() {
    currentUser.todoHandlers.removeTodo(todo)
  }

</script>

<div
  draggable="true"
  on:drag
  role="listitem"
  class="card m-2 w-28 sm:w-11/12 bg-base-100 shadow-xl"
  data-id={todo.id}
>
  <div class="card-body p-4">
    <p class="line-clamp-1">{todo.text}</p>
    <div class="card-actions justify-end">
      <label for={`edit_modal_${todo.id}`} class="btn btn-xs btn-primary">Edit</label>
    </div>
  </div>
</div>

<input type="checkbox" id={`edit_modal_${todo.id}`} class="modal-toggle" />
<div class="modal" role="dialog">
  <div class="modal-box">
    <h3 class="text-lg font-bold">Edit</h3>
    <textarea id={`text-${todo.id}`} class="textarea textarea-primary w-full">{todo.text}</textarea>

    <!-- status -->
    <label class="form-control w-full max-w-xs">
      <div class="label">
        <span class="label-text">Status:</span>
      </div>
      <select id={`select-${todo.id}`} class="select select-bordered">
        {#each todoStatus as status}
        <option selected={todo.status == status.toLowerCase()}>{status}</option>
        {/each}
      </select>
    </label>
    <div class="card-actions justify-end mt-4">
      <button onclick={save} class="btn btn-xs btn-primary">Save</button>
      <label for={`edit_modal_${todo.id}`} class="btn btn-xs btn-primary">Close</label>
      <button onclick={removeTodo} class="btn btn-xs btn-error">Delete</button>
    </div>
  </div>
  <label class="modal-backdrop" for={`edit_modal_${todo.id}`}>Close</label>
</div>
