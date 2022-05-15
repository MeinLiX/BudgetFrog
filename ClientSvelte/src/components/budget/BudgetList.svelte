<script>
    import {Card, CardHeader, CardBody, Button, Popover} from "sveltestrap";
    import Router, {push, location} from "svelte-spa-router";

    export let budgets = [];

    const copyToClipboard = (data) => navigator.clipboard.writeText(data);

    const nullOrEmpty = (data) =>
        data != null && data != "" && data != undefined;
</script>

<div>
    {#each budgets as budget}
        <Card class="d-flex flex-row-reverse">
            <CardHeader>
                <p class="text-center">
                    {budget.users?.length} user{budget.users?.length > 1
                    ? "s"
                    : ""}
                </p>
                <br/><br/><br/>
                <Button size="lg" on:click={async ()=>await push(`#/budget/${budget.id}`)} outline block>Open</Button>
            </CardHeader>
            <CardBody>
                <h2 class="text-center"><b>{budget.name}</b></h2>
                <h4 class="text-center">({budget.balance.currency})</h4>
                <br/>
                <Popover dismissible target={`btn-invite-${budget.id}`}>
                    Copied!
                </Popover>
                <Button
                        id={`btn-invite-${budget.id}`}
                        disabled={!nullOrEmpty(budget.inviteToken)}
                        on:click={copyToClipboard(budget.inviteToken)}
                        outline
                >
                    Copy invite token
                </Button>
            </CardBody>
        </Card>
        <br/>
    {:else}
        <h1 class="text-center">Not contains budgets.</h1>
    {/each}
</div>
