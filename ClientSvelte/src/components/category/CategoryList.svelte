<script>
    import Request from "../../services/RequestController";
    import {ErrorWrapper} from "../../services/RequestWrapper";
    import Dialog from "../Dialog.svelte";

    const ActionToRemove = async ({id}) => {
        try {
            await Request.category.delete({BudgetID: budgetID, CategoryID: id});
            await UpdateCategories();
        } catch (err) {
            ErrorWrapper(err);
        }
    }

    const UpdateCategories = async () => {
        try {
            categories = (await Request.category.getList({BudgetID: budgetID})).data;
        } catch (err) {
            ErrorWrapper(err);
        }
    }

    export let categories = [];
    export let budgetID;
</script>

<div>
    {#each categories as category}
        <Dialog ModalID="modal_remove_{category.id}" ConfirmFunction={ActionToRemove}
                ConfirmFunctionParams={{id:category.id}}>
            <h1>You really want to remove <br/><b>{category.name}</b> category?</h1>
        </Dialog>
        <div class="card card-bordered w-96 bg-base-100 shadow">
            <label for="modal_remove_{category.id}"
                   class="btn btn-outline btn-sm btn-circle absolute right-2 top-2">
                ✕
            </label>
            <h4 class="text-center px-2 pt-2" style="color:{category.color}">
                {category.name}
            </h4>
            <figure class="px-2 pt-2">
                {#await Request.photo.get(category.name)}
                    <p>Loading...</p>
                {:then photoURL}
                    <img src="{photoURL}" alt="{category.name}" class="rounded-xl"/>
                {:catch err}
                {/await}
            </figure>
            <h3 class="text-center" style="color:{category.income ? 'green':'red'}">
                {category.income ? "income" : "outcome"}
            </h3>
        </div>
        <br/>
    {:else}
        <h1 class="text-center">No categories</h1>
    {/each}
</div>