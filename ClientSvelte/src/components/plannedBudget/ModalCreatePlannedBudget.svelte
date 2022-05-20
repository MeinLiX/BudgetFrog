<script>
    import Request from "../../services/RequestController";
    import {ErrorWrapper} from "../../services/RequestWrapper";
    import {avaliableCategories, avaliableCurrency, selectedBudget} from "../../stores";

    const create = async () => {
        try {
            modelToRequest.BudgetID = budgetID;
            await Request.plannedBudget.create(modelToRequest);
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

    export let ID = "planned-budget-create-modal";
    export let budgetID;
    export let SuccessAction = () => {
    };
    const initialRequestModel = {
        BudgetID: "",
        DateStart: new Date().toISOString().split('T')[0],
        DateEnd: new Date(new Date().getTime() + 86400000 * 7).toISOString().split('T')[0],
        Title: "",
        Desctiption: "",
        PlannedAmount: 100,
        Currency: $selectedBudget?.balance?.currency || "UAH",
        CategoryID: null
    };
    let modelToRequest = initialRequestModel;
    let CategoryNull = true;
</script>

<input type="checkbox" id={ID} class="modal-toggle"/>
<div class="modal">
    <div class="modal-box relative">
        <label for={ID} class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        <form on:submit|preventDefault={create}>
            <div class="form-control">
                <label class="label">
                    <span class="label-text">Planned budget title:</span>
                </label>
                <input type="text" placeholder="Title" class="input input-bordered"
                       bind:value={modelToRequest.Title}/>
            </div>

            <div class="form-control my-4">
                <textarea class="textarea textarea-bordered" placeholder="Descriptions"
                          bind:value={modelToRequest.Desctiption}></textarea>
            </div>

            <div class="form-control">
                <div class="flex w-full">
                    <div class="flex w-full p-2">
                        <label class="label">
                            <span class="label-text">Start:</span>
                        </label>
                        <input type="date" class="input" bind:value={modelToRequest.DateStart}/>
                    </div>
                    <div class="flex w-full p-2">
                        <label class="label">
                            <span class="label-text">Close:</span>
                        </label>
                        <input type="date" class="input" bind:value={modelToRequest.DateEnd}/>
                    </div>
                </div>
            </div>

            <div class="form-control">
                <label class="label">
                    <span class="label-text">Enter planned balance:</span>
                </label>
                <div class="flex w-full">
                    <div class="pr-5">
                        <input type="number" placeholder="amount" class="input input-bordered"
                               bind:value={modelToRequest.PlannedAmount}/>
                    </div>
                    <div class="flex-grow">
                        <select class="select select-bordered" bind:value={modelToRequest.Currency}>
                            {#each $avaliableCurrency as currency}
                                <option>{currency}</option>
                            {/each}
                        </select>
                    </div>
                </div>
            </div>

            <div class="form-control">
                <label class="label">
                    <span class="label-text">Select category</span>
                </label>
                <label class="input-group">
                    <select class="select select-bordered btn-wide" disabled={CategoryNull}
                            bind:value={modelToRequest.CategoryID}>
                        {#each $avaliableCategories as category}
                            <option value={category.id}>{category.name}</option>
                        {/each}
                    </select>
                    <span>
                        <input type="checkbox" class="toggle toggle-md" bind:checked={CategoryNull}
                               on:change={()=>{if(CategoryNull)modelToRequest.CategoryID=null}}/>
                    </span>
                </label>

            </div>

            <br/>

            <div class="form-control">
                <button class="btn btn-primary">Create</button>
            </div>
        </form>
    </div>
</div>