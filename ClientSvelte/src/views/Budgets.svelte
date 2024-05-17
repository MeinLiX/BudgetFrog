<script>
    import { onMount } from "svelte";
    import ModalCreateBudget from "../components/budget/ModalCreateBudget.svelte";
    import ModalJoinBudget from "../components/budget/ModalJoinBudget.svelte";
    import BudgetList from "../components/budget/BudgetList.svelte";
    import Request from "../services/RequestController";
    import { ErrorWrapper } from "../services/RequestWrapper";
    import { writable } from "svelte/store";

    const budgets = writable([]);

    onMount(async () => {
        await UpdateBudgets();
    });

    const UpdateBudgets = async () => {
        try {
            let res = (await Request.budget.getList()).data;
            $budgets = [];
            $budgets = res;
        } catch (err) {
            ErrorWrapper(err);
        }
    };

    const JoinBudgetModalID = "budget-join-modal";
    const CreateBudgetModalID = "budget-create-modal";
</script>

<ModalJoinBudget ID={JoinBudgetModalID} SuccessAction={UpdateBudgets} />
<ModalCreateBudget ID={CreateBudgetModalID} SuccessAction={UpdateBudgets} />

<div class="center_content">
    <div class="btn-group mb-3">
        <label class="btn btn-wide" for={JoinBudgetModalID}>Join Budget</label>
        <label class="btn btn-wide" for={CreateBudgetModalID}
            >Create Budget</label
        >
    </div>
    <BudgetList {budgets} {UpdateBudgets} />
</div>
