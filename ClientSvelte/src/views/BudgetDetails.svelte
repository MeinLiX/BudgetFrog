<script>
    import {onMount} from "svelte";
    import {Button, Container} from "sveltestrap";
    import Request from "../services/RequestController";
    import TransactionList from "../components/transaction/TransactionList.svelte"

    //{budgetID}
    export let params = {}

    let transactions = []

    onMount(async () => {
        try {
            const BudgetID = params.budgetID;
            transactions = (await Request.transaction.getList({BudgetID})).data;
        } catch {}
    });
</script>

<div class="page">
   <TransactionList transactions={transactions}/>
</div>

<style>
    .page {
        padding: 10px 20%;
    }
</style>