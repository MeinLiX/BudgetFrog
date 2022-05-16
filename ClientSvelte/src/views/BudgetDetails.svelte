<script>
    import {onMount} from "svelte";
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

<div class="center_content">
   <TransactionList transactions={transactions}/>
</div>
