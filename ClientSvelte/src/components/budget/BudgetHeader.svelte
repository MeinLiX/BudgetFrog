<script>
    import {onMount} from "svelte";
    import {location} from "svelte-spa-router";
    import {ErrorWrapper} from "../../services/RequestWrapper"
    import Request from "../../services/RequestController";
    import {selectedBudget} from "../../stores";

    onMount(async () => {
        location.subscribe(async (newLocation) => {
            if (newLocation.includes("budget")) {
                newLocation += "/";
                let BudgetID = newLocation.substring(newLocation.indexOf("/", 1) + 1, newLocation.indexOf("/", 8));
                try {
                    $selectedBudget = (await Request.budget.get({BudgetID})).data;
                } catch (err) {
                    ErrorWrapper(err);
                }
            }
        });
    });
</script>

<div class="navbar bg-yellow-100 ">
    <div class="navbar-start">
        <a class="btn btn-ghost normal-case text-xl" href="/#/budget/{$selectedBudget.id}">
            <b>{$selectedBudget.name}</b>
        </a>
        <a class="btn btn-ghost normal-case" href="/#/budget/{$selectedBudget.id}/statistic/">
            Statistic
        </a>
    </div>
    <div class="navbar-center">
        <div class="text-xl indicator p-1 mt-3">
            <span class="indicator-item badge badge-outline">
                 {$selectedBudget.balance?.currency}
            </span>
            <b>{$selectedBudget.balance?.amount}</b>
        </div>
    </div>
    <div class="navbar-end">
        <a class="btn btn-ghost normal-case" href="/#/budget/{$selectedBudget.id}/planned/">
            Planned
        </a>
        <a class="btn btn-ghost normal-case" href="/#/budget/{$selectedBudget.id}/category/">
            Categories
        </a>
    </div>
</div>

