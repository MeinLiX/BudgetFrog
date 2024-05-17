<script>
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import Request from "../services/RequestController";
    import TransactionList from "../components/transaction/TransactionList.svelte";
    import { ErrorWrapper } from "../services/RequestWrapper";
    import ModalCreateTransaction from "../components/transaction/ModalCreateTransaction.svelte";
    import {
        avaliableCategories,
        selectedBudget,
        LocalStorage as LS,
        Period,
    } from "../stores";
    import PeriodSelector from "../components/transaction/PeriodSelector.svelte";
    import Dialog from "../components/Dialog.svelte";

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
                await Request.transaction.getListPeriod({
                    BudgetID: params.budgetID,
                    Year: selectedYear,
                    Month: selectedMonth,
                })
            ).data;
            $selectedBudget = (
                await Request.budget.get({ BudgetID: params.budgetID })
            ).data;
        } catch (err) {
            ErrorWrapper(err);
        }
    };
    const UpdatePeriod = async (needUpdate) => {
        selectedMonth = Period.GetMonth();
        selectedYear = Period.GetYear();
        if (needUpdate) await UpdateTransactions();
    };

    const AnalyzeBankTransactions = async () => {
        try {
            aiAnalyze = "";
            aiAnalyze = (
                await Request.assistent.AnalysesTransactionPeriod({
                    BudgetID: params.budgetID,
                    Year: selectedYear,
                    Month: selectedMonth,
                    IncludeBanks: 2,
                })
            ).data;
        } catch (err) {
            ErrorWrapper(err);
        }
    };

    //{budgetID}
    let aiAnalyze = "";
    export let params = {};
    let transactions = [];
    const CreateTransactionModalID = "transaction-create-modal";
    let isNullOrEmpty = (text) =>
        text == null || text == undefined || text == "";
</script>

<ModalCreateTransaction
    ID={CreateTransactionModalID}
    SuccessAction={UpdateTransactions}
    budgetID={params.budgetID}
/>

<Dialog
    ModalID="modal-AI-Analyze"
    CancelButtonText="Okay"
    ConfirmButtonText=""
    XL="true"
>
    <div class="mb-5">
        {#if isNullOrEmpty(aiAnalyze)}
            <div class="m-12 inline-block h-8 w-8">
                <div class="loader"></div>
            </div>
        {:else}
            <span class="mb-5" style="white-space: pre-line">{aiAnalyze}</span>
        {/if}
    </div>
</Dialog>

<div class="center_content">
    <label
        class="btn btn-wide btn-outline mb-5 rounded-full"
        for={CreateTransactionModalID}>Add transaction</label
    >
    <PeriodSelector {UpdatePeriod} />

    <label
        class="btn mb-5 btn-ghost"
        on:click={AnalyzeBankTransactions}
        for="modal-AI-Analyze">Bank analysis</label
    >

    <TransactionList
        {transactions}
        budgetID={params.budgetID}
        {UpdateTransactions}
    />
</div>

<style>
    .loader {
        border: 4px solid #f3f3f3; /* Light grey */
        border-top: 4px solid #808080; /* Blue */
        border-radius: 50%;
        width: 32px;
        height: 32px;
        animation: spin 2s linear infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
