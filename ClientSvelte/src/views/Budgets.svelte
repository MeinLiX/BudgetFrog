<script>
    import {onMount} from "svelte";
    import ModalCreateBudget from "../components/budget/ModalCreateBudget.svelte";
    import ModalJoinBudget from "../components/budget/ModalJoinBudget.svelte";
    import BudgetList from "../components/budget/BudgetList.svelte";
    import Request from "../services/RequestController";
    import {ErrorWrapper} from "../services/RequestWrapper";

    let budgets = [];

    onMount(async () => {
        await UpdateBudgets();
    });

    const UpdateBudgets = async () => {
        try {
            budgets = (await Request.budget.getList()).data;
        } catch (err) {
            ErrorWrapper(err);
        }
    }

    const JoinBudgetModalID = "budget-join-modal"
    const CreateBudgetModalID = "budget-create-modal"
</script>

<ModalJoinBudget ID={JoinBudgetModalID} SuccessAction={UpdateBudgets}/>
<ModalCreateBudget ID={CreateBudgetModalID} SuccessAction={UpdateBudgets}/>

<div class="center_content">
    <div class="btn-group">
        <label class="btn btn-wide" for={JoinBudgetModalID}>Join Budget</label>
        <label class="btn btn-wide" for={CreateBudgetModalID}>Create Budget</label>
    </div>
    <br/>
    <BudgetList budgets={budgets}/>
</div>
