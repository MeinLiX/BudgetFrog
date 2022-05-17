<script>
    import {onMount} from "svelte";
    import {push, location} from "svelte-spa-router";

    import Request from "../../services/RequestController";
    import {selectedBudget} from "../../stores";

    onMount(async () => {
        location.subscribe(async (newLocation) => {
            if (newLocation.includes("budget")) {
                newLocation += "/";
                let BudgetID = newLocation.substring(
                    newLocation.indexOf("/", 1) + 1,
                    newLocation.indexOf("/", 8)
                );
                try {
                    $selectedBudget = (await Request.budget.get({BudgetID})).data;
                } catch (e) {
                }
            }
        });
    });
    let isOpen = false;

    function handleUpdate(event) {
        isOpen = event.detail.isOpen;
    }
</script>

<div class="navbar bg-yellow-100">
    <div class="navbar-start">
        <a class="btn btn-ghost normal-case" href="/#/budget/{$selectedBudget.id}">
            Budget: <b>{$selectedBudget.name}</b>
            <div class="badge badge-outline">
                {$selectedBudget.balance?.amount} : {$selectedBudget.balance?.currency}
            </div>
        </a>
    </div>
    <div class="navbar-end">
        <a class="btn btn-ghost normal-case" href="#/budget/{$selectedBudget.id}/planned">
            Planned
        </a>
        <a class="btn btn-ghost normal-case" href="#/budget/{$selectedBudget.id}/category">
            Categories
        </a>
    </div>
</div>

