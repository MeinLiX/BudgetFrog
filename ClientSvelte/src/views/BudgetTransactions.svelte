<script>
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import Request from "../services/RequestController";
    import TransactionList from "../components/transaction/TransactionList.svelte";
    import { ErrorWrapper } from "../services/RequestWrapper";
    import ModalCreateTransaction from "../components/transaction/ModalCreateTransaction.svelte";
    import { avaliableCategories, selectedBudget,LocalStorage as LS, Period } from "../stores";
    import PeriodSelector from "../components/transaction/PeriodSelector.svelte";

    let selectedMonth;
    let selectedYear;
    

    onMount(async () => {
        UpdatePeriod(false);
        UpdateTransactions();
        try {
            $avaliableCategories = (
                await Request.category.getList({ BudgetID: params.budgetID })
            ).data;
        } catch (err) {
            ErrorWrapper(err);
        }
    });

    const UpdateTransactions = async () => {
        try {
            transactions = (
                await Request.transaction.getListPeriod({ BudgetID: params.budgetID, Year: selectedYear, Month: selectedMonth })
            ).data;
            $selectedBudget = (
                await Request.budget.get({ BudgetID: params.budgetID })
            ).data;
        } catch (err) {
            ErrorWrapper(err);
        }
    };
    const UpdatePeriod = async(needUpdate) => {
        selectedMonth = Period.GetMonth();
        selectedYear = Period.GetYear();
        if(needUpdate)
            await UpdateTransactions();
    };

    //{budgetID}
    export let params = {};
    let transactions = [];
    const CreateTransactionModalID = "transaction-create-modal";
</script>

<ModalCreateTransaction
    ID={CreateTransactionModalID}
    SuccessAction={UpdateTransactions}
    budgetID={params.budgetID}
/>

<div class="center_content">
    <label
        class="btn btn-wide btn-outline mb-5 rounded-full"
        for={CreateTransactionModalID}>Add transaction</label
    >
    <PeriodSelector {UpdatePeriod} />
    <TransactionList
        {transactions}
        budgetID={params.budgetID}
        {UpdateTransactions}
    />
</div>
