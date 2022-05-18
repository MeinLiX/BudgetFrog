<script>
    import Request from "../../services/RequestController";
    import {ErrorWrapper} from "../../services/RequestWrapper";
    import {ShowInfo} from "../../services/Utils";
    import Dialog from "../Dialog.svelte";
    import ModalCreatePlannedBudget from "./ModalCreatePlannedBudget.svelte";

    const ActionToRemove = async ({id}) => {
        try {
            await Request.plannedBudget.delete({BudgetID: budgetID, PlannedBudgetID: id});
            await UpdatePlannedBudgets();
            ShowInfo("Planned budget deleted.");
        } catch (err) {
            ErrorWrapper(err);
        }
    }

    export let UpdatePlannedBudgets = async () => {
        try {
            plannedBudgets = (await Request.plannedBudget.getList({BudgetID: params.budgetID})).data;
        } catch (err) {
            ErrorWrapper(err);
        }
    }

    const SaveAction = async (PlannedBudgetID, PlannedAmount) => {
        try {
            await Request.plannedBudget.setAmount({BudgetID: budgetID, PlannedBudgetID, PlannedAmount});
            ShowInfo("Planned budget saved.");
        } catch (err) {
            ErrorWrapper(err);
        }
    }

    const style = {
        bgColor: (plannedBudget) => {
            if (Date.now() > Date.parse(plannedBudget.dateEnd) &&
                plannedBudget.realizeBalance.amount < plannedBudget.plannedBalance.amount)
                return 'bg-red-100';
            else if (Date.now() > Date.parse(plannedBudget.dateEnd) &&
                plannedBudget.realizeBalance.amount >= plannedBudget.plannedBalance.amount) {
                return 'bg-green-100';
            }
            return '';
        }
    }

    export let plannedBudgets = [];
    export let budgetID;
    const CreatePlannedBudgetModalID = "planned-budget-create-modal"
</script>

<ModalCreatePlannedBudget ID={CreatePlannedBudgetModalID} budgetID={budgetID} SuccessAction={UpdatePlannedBudgets}/>

<div class="overflow-x-auto">
    <table class="table w-full">
        <thead>
        <tr>
            <th class="text-center">Title</th>
            <th class="text-center">Description</th>
            <th class="text-center">Start</th>
            <th class="text-center">Close</th>
            <th class="text-center">Currency</th>
            <th class="text-center">Completed</th>
            <th class="text-center">Progress</th>
            <th class="text-center">Planned</th>
            <th class="text-center">Category</th>
            <th class="text-center">
                <label for={CreatePlannedBudgetModalID} class="btn btn-sm btn-outline">Add</label>
            </th>
        </tr>
        </thead>
        <tbody>
        <!--TODO: trouble with reactivity (not update after update list)-->
        {#each plannedBudgets as plannedBudget}
            <Dialog ModalID="modal_remove_PB_{plannedBudget.id}" ConfirmFunction={ActionToRemove}
                    ConfirmFunctionParams={{id:plannedBudget.id}}>
                <h1>You really want to delete <br/><b>{plannedBudget.title}</b> planned budget?</h1>
            </Dialog>
            <tr>
                <td class="text-center {style.bgColor(plannedBudget)}">
                    <label><b>{plannedBudget.title}</b></label>
                </td>
                <td class="text-center {style.bgColor(plannedBudget)}">
                    {plannedBudget.desctiption}
                </td>
                <td class="text-center {style.bgColor(plannedBudget)}">
                    {plannedBudget.dateStart.split("T")[0]}
                </td>
                <td class="text-center {style.bgColor(plannedBudget)}">
                    {plannedBudget.dateEnd.split("T")[0]}
                </td>
                <td class="text-center {style.bgColor(plannedBudget)}">
                    {plannedBudget.plannedBalance.currency}
                </td>
                {#if plannedBudget.transactionDescriptionCategory}
                    <td class="text-center {style.bgColor(plannedBudget)}">
                        {plannedBudget.realizeBalance.amount}
                    </td>
                    <td class="text-center {style.bgColor(plannedBudget)}">
                        <div class="ml-2 mr-2">
                            <input type="range" min="0" max="{plannedBudget.plannedBalance.amount}"
                                   value="{plannedBudget.realizeBalance.amount}"
                                   class="range range-sm range-accent"
                                   disabled/>
                        </div>
                    </td>
                    <td class="text-center {style.bgColor(plannedBudget)}">
                        {plannedBudget.plannedBalance.amount}
                    </td>
                    <td class="text-center {style.bgColor(plannedBudget)}"
                        style="color:{plannedBudget.transactionDescriptionCategory.color}">
                        {plannedBudget.transactionDescriptionCategory.name}
                    </td>
                    <td class="{style.bgColor(plannedBudget)}">
                        <label for="modal_remove_PB_{plannedBudget.id}" class="btn btn-ghost btn-xs">
                            Delete
                        </label>
                    </td>
                {:else}
                    <td class="text-center {style.bgColor(plannedBudget)}">
                        <input class="input input-sm" bind:value={plannedBudget.realizeBalance.amount}/>
                    </td>
                    <td class="text-center {style.bgColor(plannedBudget)}">
                        <div class="ml-2 mr-2">
                            <input type="range" min="0" max="{plannedBudget.plannedBalance.amount}"
                                   bind:value={plannedBudget.realizeBalance.amount}
                                   class="range range-sm range-accent"/>
                        </div>
                    </td>
                    <td class="text-center {style.bgColor(plannedBudget)}">
                        {plannedBudget.plannedBalance.amount}
                    </td>
                    <td class="text-center {style.bgColor(plannedBudget)}">Not bound.</td>
                    <td class="{style.bgColor(plannedBudget)}">
                        <label for="modal_remove_PB_{plannedBudget.id}" class="btn btn-ghost btn-xs">
                            Delete
                        </label>
                        <button class="btn btn-ghost btn-xs"
                                on:click={SaveAction(plannedBudget.id,plannedBudget.realizeBalance.amount)}>Save
                        </button>
                    </td>
                {/if}
            </tr>
        {:else}
            <h1 class="text-center">Not contains categories.</h1>
        {/each}
        </tbody>
    </table>
</div>
