<script>
    import Request from "../../services/RequestController";
    import {avaliableCurrency} from "../../stores";
    import {ErrorWrapper} from "../../services/RequestWrapper";

    let modelToRequest = {
        Name: "",
        InviteToken: false,
        Currency: "UAH",
    };

    const create = async () => {
        try {
            let res = await Request.budget.create(modelToRequest);
            document.getElementById(ID).click(); //to close.
        } catch (err) {
            ErrorWrapper(err);
        }
    };
    export let ID = "budget-create-modal";
</script>

<input type="checkbox" id={ID} class="modal-toggle"/>
<div class="modal">
    <div class="modal-box relative">
        <label for={ID} class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        <form on:submit|preventDefault={create}>
            <div class="form-control">
                <label class="label">
                    <span class="label-text">Budget name</span>
                </label>
                <input type="text" placeholder="Budget name" class="input input-bordered"
                       bind:value={modelToRequest.Name}/>
            </div>

            <div class="form-control">
                <label class="label">
                    <span class="label-text">Select currency:</span>
                </label>
                <select class="select select-bordered" bind:value={modelToRequest.Currency}>
                    {#each $avaliableCurrency as currency}
                        <option>{currency}</option>
                    {/each}
                </select>
            </div>
            <div class="form-control">
                <label class="label cursor-pointer">
                    <span class="label-text">Generate `invite token`</span>
                    <input type="checkbox" class="toggle" bind:checked={modelToRequest.InviteToken}/>
                </label>
            </div>
            <br/>
            <div class="form-control">
                <button class="btn btn-primary">Create</button>
            </div>
        </form>
    </div>
</div>
