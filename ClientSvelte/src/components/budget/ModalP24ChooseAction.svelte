<script>
    import ModalAddP24 from "./ModalAddP24.svelte";
    import ModalRemoveP24 from "./ModalRemoveP24.svelte";

    const CloseModal = () => {
        try {
            document.getElementById(ID).click(); //to close.
        } catch {
        }
    }

    export let budget;
    export let ID = "budget-choose-action-p24-modal"
    export let SuccessAction = () => {
    };
    const AddP24BudgetModalID = "budget-add-p24-modal"
    const RemoveP24BudgetModalID = "budget-remove-p24-modal"
</script>

<ModalAddP24 ID={AddP24BudgetModalID+budget.id} budget={budget} SuccessAction={SuccessAction}/>

{#if budget.privat24Credentials.length > 0}
    <ModalRemoveP24 ID={RemoveP24BudgetModalID+budget.id} budget={budget} SuccessAction={SuccessAction}/>
{/if}

<input type="checkbox" id="{ID}" class="modal-toggle"/>
<label for="{ID}" class="modal cursor-pointer">
    <div class="modal-box relative form-control">
        <label class="btn btn-outline  m-1" for={AddP24BudgetModalID+budget.id} on:click={CloseModal}>
            <span>Add</span>
        </label>
        {#if budget.privat24Credentials.length > 0}
            <label class="btn btn-outline m-1" for={RemoveP24BudgetModalID+budget.id} on:click={CloseModal}>
                <span>Remove</span>
            </label>
        {/if}
    </div>
</label>