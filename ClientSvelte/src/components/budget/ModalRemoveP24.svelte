<script>
    import Request from "../../services/RequestController";
    import {ErrorWrapper} from "../../services/RequestWrapper";

    const toDelete = async () => {
        try {
            modelToRequest.BudgetID = budget.id;
            await Request.budget.privat24.delete(modelToRequest);
            await SuccessAction();
            try {
                document.getElementById(ID).click(); //to close.
            } catch {
            }
            modelToRequest = initialRequestModel;
        } catch (err) {
            ErrorWrapper(err);
        }
    };
    export let budget;
    export let ID = "budget-remove-p24-modal"
    export let SuccessAction = () => {
    };
    let initialRequestModel={
        BudgetID: "",
        Privat24CredentialID: ""
    }
    let modelToRequest = initialRequestModel;
</script>

<input type="checkbox" id="{ID}" class="modal-toggle"/>
<label for="{ID}" class="modal cursor-pointer">
    <div class="modal-box relative form-control">
        <div class="form-control">
            <label class="label">
                <span class="label-text">Select card to remove:</span>
            </label>
            <select class="select select-bordered" bind:value={modelToRequest.Privat24CredentialID}>
                {#each budget.privat24Credentials as budgetDetail}
                    <option value={budgetDetail.id}>{budgetDetail.cardNumber}</option>
                {/each}
            </select>
        </div>
        <br/>
        <label class="btn btn-outline" on:click={toDelete}>Remove</label>
    </div>
</label>