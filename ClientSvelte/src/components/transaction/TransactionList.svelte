<script>
    import Request from "../../services/RequestController";
    import {ErrorWrapper} from "../../services/RequestWrapper";


    export let UpdateTransactions = async () => {
        try {
            transactions = (await Request.transaction.getList({BudgetID: budgetID})).data;
        } catch (err) {
            ErrorWrapper(err);
        }
    }

    const toGroup= (transactionsArray)=>{
        return transactionsArray;
    }

    export let budgetID;
    export let transactions = [];
    $: groupedTransactions=toGroup(transactions);
</script>

<div>
    {#each transactions as transaction}
        <div class="card card-bordered w-96 bg-base-100 shadow">
            <h4 class="text-center" style="color:{transaction.transactionDescriptionCategory?.color}">
                {transaction.transactionDescriptionCategory?.name}
            </h4>
            <h3 class="text-center" style="color:{transaction.transactionDescriptionCategory?.income?'green':'red'}">
                {transaction.transactionDescriptionCategory?.income ? "+" : "-"}{transaction.balance?.amount}
                ({transaction.balance?.currency})
            </h3>
            <h4 class="text-center">{transaction?.notes}</h4>
        </div>
        <br/>
    {:else}
        <h1 class="text-center">Not contains transactions.</h1>
    {/each}
</div>