<script>
    import Request from "../../services/RequestController";
    import { ErrorWrapper } from "../../services/RequestWrapper";
    import { CloseModelIfOpened } from "../../services/Utils";

    const toAdd = async () => {
        try {
            modelToRequest.BudgetID = budget.id;
            modelToRequest.BankType = bankType();
            await Request.budget.bank.add(modelToRequest);

            await SuccessAction();
            CloseModelIfOpened(ID);

            modelToRequest = initialRequestModel;
        } catch (err) {
            ErrorWrapper(err);
        }
    };
    export let budget;
    export let ID = "modal-add-bank-budget-";
    export let SuccessAction = () => {};

    const P24Bank = "p24";
    const MonoBank = "mono";

    let bankType = () => {
        if (ID.includes(P24Bank)) {
            return 0;
        }
        if (ID.includes(MonoBank)) {
            return 1;
        }
    };
    let initialRequestModel = {
        BudgetID: "",
        MerchantID: "",
        MerchantPassword: "",
        CardNumber: "",
        BankType: bankType(),
    };

    let modelToRequest = initialRequestModel;
</script>

<input type="checkbox" id={ID} class="modal-toggle" />
<label for={ID} class="modal cursor-pointer">
    {#if bankType() == 0}
        <div class="modal-box relative form-control">
            <dix class="flex">
                <div class="flex-1" />
                <a
                    href="https://api.privatbank.ua/#p24/registration"
                    class="link link-neutral">How to get privat24 merchant?</a
                >
            </dix>
            <div class="form-control">
                <control class="label">
                    <span class="label-text">Merchant ID</span>
                </control>
                <input
                    type="text"
                    placeholder="id"
                    class="input input-bordered"
                    bind:value={modelToRequest.MerchantID}
                />
            </div>
            <div class="form-control mt-1">
                <control class="label">
                    <span class="label-text">Merchant password</span>
                </control>
                <input
                    type="text"
                    placeholder="password"
                    class="input input-bordered"
                    bind:value={modelToRequest.MerchantPassword}
                />
            </div>
            <div class="form-control mt-1">
                <control class="label">
                    <span class="label-text">CardNumber</span>
                </control>
                <input
                    type="text"
                    placeholder="CardNumber"
                    class="input input-bordered"
                    bind:value={modelToRequest.CardNumber}
                />
            </div>
            <br />
            <control class="btn btn-outline" on:click={toAdd}
                >Add privat24 merchant</control
            >
        </div>
    {:else if bankType() == 1}
        <div class="modal-box relative form-control">
            <dix class="flex">
                <div class="flex-1" />
                <a
                    href="https://api.monobank.ua/index.html"
                    class="link link-neutral">How to get monobank token?</a
                >
            </dix>
            <div class="form-control">
                <control class="label">
                    <span class="label-text">Token</span>
                </control>
                <input
                    type="text"
                    placeholder="id"
                    class="input input-bordered"
                    bind:value={modelToRequest.MerchantID}
                />
            </div>
            <div class="form-control mt-1">
                <control class="label">
                    <span class="label-text">Choose account</span>
                </control>
                <input
                    type="text"
                    placeholder="Default account"
                    class="input input-bordered"
                    bind:value={modelToRequest.CardNumber}
                />
            </div>
            <br />
            <control class="btn btn-outline" on:click={toAdd}
                >Add monobank token</control
            >
        </div>
    {/if}
</label>
