<script>
    import {push} from "svelte-spa-router";
    import Dialog from "../Dialog.svelte";
    import Request from "../../services/RequestController";
    import {ErrorWrapper} from "../../services/RequestWrapper"
    import ModalP24ChooseAction from "./ModalP24ChooseAction.svelte";

    export let budgets = [];

    const ActionToLeave = async ({id}) => {
        try {
            await Request.budget.leave({BudgetID: id});
            await UpdateBudgets();
        } catch (err) {
            ErrorWrapper(err);
        }
    }

    const UpdateBudgets = async () => {
        try {
            budgets = (await Request.budget.getList()).data;
        } catch (err) {
            ErrorWrapper(err);
        }
    }

    const copyToClipboard = async (data) => await navigator.clipboard.writeText(data);
    const nullOrEmpty = (data) => data != null && data !== "" && data !== undefined;

</script>

{#each budgets as budget}
    <Dialog ModalID="modal_leve_{budget.id}" ConfirmFunction={ActionToLeave} ConfirmFunctionParams={{id:budget.id}}>
        <h1>You really want to leave from <br/><b>{budget.name}</b> budget?</h1>
    </Dialog>

    <ModalP24ChooseAction ID="modal_p24_{budget.id}" SuccessAction={UpdateBudgets} budget={budget}/>

    <div class="card w-1/2 bg-base-100 shadow card-bordered">
        <div class="card-body">
            <h2 class="card-title flex">
                <div class="flex-1">
                    <div class="tooltip"
                         data-tip="{budget.users?.length} user{budget.users?.length > 1 ? 's' : ''}">
                        <b>{budget.name}</b>
                    </div>
                    <div class="badge badge-outline">{budget.balance.currency}</div>
                </div>
                <div class="flex-0">
                        <label class="w-6 cursor-pointer" for="modal_p24_{budget.id}">
                        {#if budget.privat24Credentials.length > 0}
                            <div class="tooltip"
                                 data-tip="{budget.privat24Credentials.length} card{budget.privat24Credentials.length > 1 ? 's' : ''}">
                                <img src="media/p24.png"/>
                            </div>
                        {:else}
                            <div class="tooltip"
                                 data-tip="0 cards">
                                <img src="media/p24_disabled.png"/>
                            </div>
                        {/if}
                        </label>
                </div>
            </h2>

            <br/>

            <div class="card-actions justify-end">
                <label class="btn btn-sm btn-error btn-outline" for="modal_leve_{budget.id}">leave</label>
                <div>
                    {#if nullOrEmpty(budget.inviteToken)}
                        <div class="tooltip" data-tip="Press to Copy!">
                            <button class="btn btn-sm btn-ghost btn-outline"
                                    on:click={copyToClipboard(budget.inviteToken)}>
                                Invite token
                            </button>
                        </div>
                    {:else}
                        <div>
                            <button class="btn btn-sm btn-ghost btn-outline" disabled>
                                Invite token
                            </button>
                        </div>
                    {/if}
                </div>
                <button class="btn btn-sm  btn-accent btn-outline"
                        on:click={async ()=>await push(`#/budget/${budget.id}`)}>
                    Open
                </button>
            </div>
        </div>
    </div>
    <br/>
{:else}
    <h1 class="text-center">No budgets</h1>
{/each}
