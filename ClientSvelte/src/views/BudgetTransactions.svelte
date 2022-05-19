<script>
    import {onMount} from "svelte";
    import Request from "../services/RequestController";
    import TransactionList from "../components/transaction/TransactionList.svelte"
    import {ErrorWrapper} from "../services/RequestWrapper";
    import ModalCreateTransaction from "../components/transaction/ModalCreateTransaction.svelte";
    import {avaliableCategories, selectedBudget} from "../stores";

    onMount(async () => {
        await UpdateTransactions();
        try {
            $avaliableCategories = (await Request.category.getList({BudgetID: params.budgetID})).data;
        } catch (err) {
            ErrorWrapper(err);
        }
    });

    const UpdateTransactions = async () => {
        try {
            transactions = (await Request.transaction.getList({BudgetID: params.budgetID})).data;
            $selectedBudget = (await Request.budget.get({BudgetID: params.budgetID})).data;
        } catch (err) {
            ErrorWrapper(err);
        }
    }

    //{budgetID}
    export let params = {}

    let transactions = []
    const CreateTransactionModalID = "transaction-create-modal"
</script>

<ModalCreateTransaction ID={CreateTransactionModalID} SuccessAction={UpdateTransactions} budgetID={params.budgetID}/>

<div class="center_content">
    <label class="btn btn-wide btn-outline mb-5 rounded-full" for={CreateTransactionModalID}>Add transaction</label>
    <TransactionList transactions={transactions} budgetID={params.budgetID}/>
</div>
