<script>
    import Request from "../../services/RequestController";
    import { ErrorWrapper } from "../../services/RequestWrapper";
    import { CloseModelIfOpened } from "../../services/Utils";

    const toDelete = async () => {
        try {
            modelToRequest.BudgetID = budget.id;
            await Request.budget.bank.delete(modelToRequest);
            await SuccessAction();
            CloseModelIfOpened(ID);

            modelToRequest = initialRequestModel;
        } catch (err) {
            ErrorWrapper(err);
        }
    };
    export let budget;
    export let ID = "budget-remove-modal-";
    const internalID = ID;
    export let SuccessAction = async () => {};

    const P24Bank = "p24";
    const MonoBank = "mono";

    let initialRequestModel = {
        BudgetID: "",
        BankCredentialID: "",
    };
    let modelToRequest = initialRequestModel;

    let GetCreds = () => {
        var creds = [];
        if (ID.includes(P24Bank)) {
            creds = budget.bankCredentials.filter((e) => e.bankType == 0);
        } else if (ID.includes(MonoBank)) {
            creds = budget.bankCredentials.filter((e) => e.bankType == 1);
        }
        return creds;
    };
</script>

<input type="checkbox" id={internalID} class="modal-toggle" />
<label for={internalID} class="modal cursor-pointer">
    <div class="modal-box relative form-control">
        <div class="form-control">
            <control class="label">
                <span class="label-text">Select card to remove:</span>
            </control>
            <select
                class="select select-bordered"
                bind:value={modelToRequest.BankCredentialID}
            >
                {#each GetCreds() as budgetDetail}
                    <option value={budgetDetail.id}
                        >{budgetDetail.cardNumber} ({budgetDetail.merchantID})</option
                    >
                {/each}
            </select>
        </div>
        <br />
        <control class="btn btn-outline" on:click={toDelete}>Remove</control>
    </div>
</label>
