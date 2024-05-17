<script>
    import Request from "../../services/RequestController";
    import { ErrorWrapper } from "../../services/RequestWrapper";
    import { CloseModelIfOpened } from "../../services/Utils";

    const create = async () => {
        try {
            modelToRequest.BudgetID = budgetID;
            await Request.category.create(modelToRequest);
            await SuccessAction();
            CloseModelIfOpened(ID);
        } catch (err) {
            ErrorWrapper(err);
        }
    };
    export let ID = "budget-create-modal";
    export let budgetID;
    export let SuccessAction = () => {};
    let modelToRequest = {
        BudgetID: "",
        Name: "",
        Income: false,
        Color: "#000000",
    };
</script>

<input type="checkbox" id={ID} class="modal-toggle" />
<div class="modal">
    <div class="modal-box relative">
        <label for={ID} class="btn btn-sm btn-circle absolute right-2 top-2"
            >✕</label
        >
        <form on:submit|preventDefault={create}>
            <div class="form-control">
                <control class="label">
                    <span class="label-text">Category name</span>
                </control>
                <input
                    type="text"
                    placeholder="Category name"
                    class="input input-bordered"
                    bind:value={modelToRequest.Name}
                />
            </div>
            <div class="form-control">
                <control class="label">
                    <span class="label-text">Input color (hex):</span>
                </control>
                <div class="flex w-full">
                    <div class="join m-1">
                        <input
                        type="color"
                        class="join-item"
                        bind:value={modelToRequest.Color}
                        style="height: 50px;"
                    />
                    <input
                        type="text"
                        placeholder="#FFFFFF"
                        class="input input-bordered join-item"
                        bind:value={modelToRequest.Color}
                    />
                    </div>
                    <div class="flex-grow">
                        <label class="label cursor-pointer p-3">
                            <span
                                class="label-text text-lg"
                                style="color: {modelToRequest.Income
                                    ? 'green'
                                    : 'red'}"
                            >
                                {modelToRequest.Income ? "income " : "outcome "}
                            </span>
                            <input
                                type="checkbox"
                                class="toggle p-2"
                                bind:checked={modelToRequest.Income}
                            />
                        </label>
                    </div>
                </div>
            </div>
            <br />
            <div class="form-control">
                <button class="btn btn-primary">Create</button>
            </div>
        </form>
    </div>
</div>
