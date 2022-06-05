<script>
    import Request from "../../services/RequestController";
    import {ErrorWrapper} from "../../services/RequestWrapper";


    const toAdd = async () => {
        try {
            modelToRequest.BudgetID = budget.id;
            await Request.budget.privat24.add(modelToRequest);
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
    export let ID = "budget-add-p24-modal"
    export let SuccessAction = () => {
    };
    let initialRequestModel = {
        BudgetID: "",
        MerchantID: "",
        MerchantPassword: "",
        CardNumber: "",
        StartDate: new Date().toISOString().split('T')[0]
    }
    let modelToRequest = initialRequestModel;
</script>

<input type="checkbox" id="{ID}" class="modal-toggle"/>
<label for="{ID}" class="modal cursor-pointer">
    <div class="modal-box relative form-control">
        <dix class="flex">
            <div class="flex-1"/>
            <a href="https://api.privatbank.ua/#p24/registration" class="link link-neutral">How to merchant
                registration?</a>

        </dix>
        <div class="form-control">
            <label class="label">
                <span class="label-text">Merchant ID</span>
            </label>
            <input type="text" placeholder="id" class="input input-bordered"
                   bind:value={modelToRequest.MerchantID}/>
        </div>
        <div class="form-control mt-1">
            <label class="label">
                <span class="label-text">Merchant password</span>
            </label>
            <input type="text" placeholder="password" class="input input-bordered"
                   bind:value={modelToRequest.MerchantPassword}/>
        </div>
        <div class="form-control mt-1">
            <label class="label">
                <span class="label-text">CardNumber</span>
            </label>
            <input type="text" placeholder="CardNumber" class="input input-bordered"
                   bind:value={modelToRequest.CardNumber}/>
        </div>
        <div class="form-control mt-1">
            <label class="label">
                <span class="label-text">Start sync time</span>
            </label>
            <input type="date" class="input" bind:value={modelToRequest.StartDate}/>
        </div>
        <br/>
        <label class="btn btn-outline" on:click={toAdd}>Add privat24 merchant</label>
    </div>
</label>