<script>
    import {Card, Button, Icon} from "sveltestrap";
    //import Router, {push, location} from "svelte-spa-router";

    export let transactions = [];
    //style="color:{transaction.transactionDescriptionCategory?.color}"
</script>

<div>
    {#each transactions as transaction}
        <Card body>
            <h4 class="text-center" style="color:{transaction.transactionDescriptionCategory?.color}">
                {transaction.transactionDescriptionCategory?.name}
            </h4>
            <h3 class="text-center" style="color:{transaction.transactionDescriptionCategory?.income?'green':'red'}">
                {transaction.transactionDescriptionCategory?.income ? "+" : "-"}{transaction.balance?.amount}
                ({transaction.balance?.currency})
            </h3>
            <h4 class="text-center">{transaction?.notes}</h4>
        </Card>
        <br/>
    {:else}
        <h1 class="text-center">Not contains transactions.</h1>
    {/each}
</div>