<script>
    import {onMount} from "svelte";
    import PlannedBudgetList from "../components/plannedBudget/PlannedBudgetList.svelte";
    import Request from "../services/RequestController";
    import {ErrorWrapper} from "../services/RequestWrapper";
    import {avaliableCategories} from "../stores"

    const UpdatePlannedBudgets = async () => {
        try {
            plannedBudgets = (await Request.plannedBudget.getList({BudgetID: params.budgetID})).data;
        } catch (err) {
            ErrorWrapper(err);
        }
    }

    onMount(async () => {
        await UpdatePlannedBudgets();
        try{
            $avaliableCategories=(await Request.category.getList({BudgetID: params.budgetID})).data
        }catch (err) {
            ErrorWrapper(err);
        }
    });

    //{budgetID}
    export let params = {}
    let plannedBudgets = []
    const CreatePlannedBudgetsModalID = "category-planned-budget-modal"
</script>

<div class="center_content">
    <PlannedBudgetList plannedBudgets={plannedBudgets} budgetID={params.budgetID} UpdatePlannedBudgets={UpdatePlannedBudgets}/>
</div>
