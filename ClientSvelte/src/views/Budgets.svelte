<script>
    import {onMount} from "svelte";
    import ModalCreateBudget from "../components/budget/ModalCreateBudget.svelte";
    import ModalJoinBudget from "../components/budget/ModalJoinBudget.svelte";
    import BudgetList from "../components/budget/BudgetList.svelte";
    import Request from "../services/RequestController";

    let modals = {
        CreateBudget: {
            isOpen: false,
            toggle: () => {
                modals.CreateBudget.isOpen = !modals.CreateBudget.isOpen;
            },
        },
        JoinBudget: {
            isOpen: false,
            toggle: () => {
                modals.JoinBudget.isOpen = !modals.JoinBudget.isOpen;
            },
        },
    };

    let budgets = [];

    onMount(async () => {
        try {
            let reqBudgets = await Request.budget.getList();
            budgets = reqBudgets.data;
        } catch {
        }
    });


    const JoinBudgetModalID="budget-join-modal"
    const CreateBudgetModalID="budget-create-modal"
</script>

<ModalJoinBudget ID={JoinBudgetModalID} />
<ModalCreateBudget ID={CreateBudgetModalID} />


<div class="center_content">
    <div class="btn-group">
        <label class="btn btn-wide" for={JoinBudgetModalID} >Join Budget</label>
        <label class="btn btn-wide" for={CreateBudgetModalID} >Create Budget</label>
    </div>
    <br/>
    <BudgetList budgets={budgets}/>
</div>
