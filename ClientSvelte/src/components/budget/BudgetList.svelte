<script>
    import {push} from "svelte-spa-router";
    import Dialog from "../Dialog.svelte";
    import Request from "../../services/RequestController";
    import {ErrorWrapper} from "../../services/RequestWrapper"

    export let budgets = [];

    const ActionToLeave = async ({id}) => {
        try {
            await Request.budget.leave({BudgetID: id});
            await UpdateBudgets();
        } catch (err) {
            ErrorWrapper(err);
        }
    }

    const UpdateBudgets=async ()=>{
        try {
            budgets = (await Request.budget.getList()).data;
        } catch (err){
            ErrorWrapper(err);
        }
    }

    const copyToClipboard = (data) => navigator.clipboard.writeText(data);
    const nullOrEmpty = (data) => data != null && data !== "" && data !== undefined;
</script>

<div>
    {#each budgets as budget}
        <Dialog ModalID="modal_leve_{budget.id}" ConfirmFunction={ActionToLeave} ConfirmFunctionParams={{id:budget.id}}>
            <h1>You really want to leave from <b>{budget.name}</b> budget?</h1>
        </Dialog>

        <div class="card w-96 bg-base-100 shadow card-bordered">
            <div class="card-body">
                <h2 class="card-title">
                    <div class="tooltip" data-tip="{budget.users?.length} user{budget.users?.length > 1 ? 's' : ''}">
                        <b>{budget.name}</b>
                    </div>
                    <div class="badge badge-outline">{budget.balance.currency}</div>
                </h2>

                <br/>

                <div class="card-actions justify-end">
                    <label class="btn btn-sm btn-error" for="modal_leve_{budget.id}">leave</label>
                    <div>
                        {#if nullOrEmpty(budget.inviteToken)}
                            <div class="tooltip" data-tip="Press to Copy!">
                                <button class="btn btn-sm btn-ghost btn-active"
                                        on:click={copyToClipboard(budget.inviteToken)}>
                                    Invite token
                                </button>
                            </div>
                        {:else}
                            <div>
                                <button class="btn btn-sm btn-ghost btn-active" disabled>
                                    Invite token
                                </button>
                            </div>
                        {/if}
                    </div>
                    <button class="btn btn-sm  btn-accent" on:click={async ()=>await push(`#/budget/${budget.id}`)}>
                        Open
                    </button>
                </div>
            </div>
        </div>
        <br/>
    {:else}
        <h1 class="text-center">Not contains budgets.</h1>
    {/each}
</div>
