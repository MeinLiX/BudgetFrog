<script>
    import Request from "../../services/RequestController";
    import {ErrorWrapper} from "../../services/RequestWrapper";
    import {avaliableCategories, avaliableCurrency, selectedBudget} from "../../stores";

    const create = async () => {
        try {
            modelToRequest.BudgetID = budgetID;
            await Request.transaction.create(modelToRequest);
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

    export let ID = "transaction-create-modal";
    export let budgetID;
    export let SuccessAction = () => {
    };
    const initialRequestModel = {
        BudgetID: "",
        Date: new Date().toISOString().split('T')[0],
        Amount: 100,
        Currency: $selectedBudget?.balance?.currency || "UAH",
        CategoryID: "Select category"
    };
    let modelToRequest = initialRequestModel;
</script>

<input type="checkbox" id={ID} class="modal-toggle"/>
<div class="modal">
    <div class="modal-box relative">
        <label for={ID} class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        <form on:submit|preventDefault={create}>
            <div class="form-control">
                <label class="label">
                    <span class="label-text">Select category</span>
                </label>
                <select class="select select-bordered" bind:value={modelToRequest.CategoryID}>
                    <option selected disabled>Select category</option>
                    {#each $avaliableCategories as category}
                        <option value={category.id}>{category.name}</option>
                    {/each}
                </select>
            </div>

            <div class="form-control">
                <label class="label">
                    <span class="label-text">Enter transaction balance</span>
                </label>
                <div class="flex w-full">
                    <div class="pr-1">
                        <input type="number" placeholder="amount" class="input input-bordered"
                               bind:value={modelToRequest.Amount}/>
                    </div>
                    <div class="flex-grow">
                        <select class="select select-bordered" bind:value={modelToRequest.Currency}>
                            {#each $avaliableCurrency as currency}
                                <option>{currency}</option>
                            {/each}
                        </select>
                    </div>
                    <div>
                        <input type="date" class="input select-bordered" bind:value={modelToRequest.Date}/>
                    </div>
                </div>
            </div>

            <br/>
            <div class="form-control">
                <button class="btn btn-primary">Create</button>
            </div>
        </form>
    </div>
</div>
