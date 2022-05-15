<script>
    import { onMount } from "svelte";
    import { Button, Container } from "sveltestrap";
    import ModalCreateBudget from "../components/budget/ModalCreateBudget.svelte";
    import ModalJoinBudget from "../components/budget/ModalJoinBudget.svelte";
    import BudgetList from "../components/budget/BudgetList.svelte";
    import Request from "../services/RequestController";

    let modals = {
        CreateBudget: {
            isOpen: false,
            toggle: () => {
                modals.CreateBudget.isOpen = !modals.CreateBudget.isOpen;
            },
        },
        JoinBudget: {
            isOpen: false,
            toggle: () => {
                modals.JoinBudget.isOpen = !modals.JoinBudget.isOpen;
            },
        },
    };

    let budgets = [];

    onMount(async () => {
        try {
            let reqBudgets = await Request.budget.getList();
            budgets = reqBudgets.data;
        } catch {}
    });
</script>

<div class="page">
    <ModalCreateBudget
        open={modals.CreateBudget.isOpen}
        toggle={modals.CreateBudget.toggle}
    />
    <ModalJoinBudget
        open={modals.JoinBudget.isOpen}
        toggle={modals.JoinBudget.toggle}
    />

    <Container>
        <Button
            color="secondary"
            on:click={modals.JoinBudget.toggle}
            outline
            size="lg"
            block
        >
            Join Budget
        </Button>
        <br />
        <Button
            color="secondary"
            on:click={modals.CreateBudget.toggle}
            outline
            size="lg"
            block
        >
            Create Budget
        </Button>
        <br />

        <BudgetList budgets={budgets}/>

    </Container>
</div>

<style>
    .page {
        padding: 10px 20%;
    }
</style>