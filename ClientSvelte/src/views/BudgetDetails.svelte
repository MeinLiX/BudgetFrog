<script>
    import {onMount} from "svelte";
    import Request from "../services/RequestController";
    import TransactionList from "../components/transaction/TransactionList.svelte"
    import {ErrorWrapper} from "../services/RequestWrapper";

    //{budgetID}
    export let params = {}

    let transactions = []

    onMount(async () => {
        try {
            const BudgetID = params.budgetID;
            transactions = (await Request.transaction.getList({BudgetID})).data;
        } catch (err){
           ErrorWrapper(err);
        }
    });
</script>

<div class="center_content">
   <TransactionList transactions={transactions}/>
</div>
