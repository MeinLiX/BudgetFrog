import {replace} from "svelte-spa-router";
import Root from "../views/Root.svelte";
import NotFound from "../views/NotFound.svelte";
import Profile from "../views/Profile.svelte";
import BudgetDetails from "../views/BudgetDetails.svelte"
import BudgetCategories from "../views/BudgetCategories.svelte"
import BudgetPlanned from "../views/PlannedBudget.svelte"

export default {
    "/budget/:budgetID/planned": BudgetPlanned,
    "/budget/:budgetID/category": BudgetCategories,
    "/budget/:budgetID": BudgetDetails,
    "/": Root,
    "/profile": Profile,
    "*": NotFound,
};

export const navigate = (path = "non-existence-path") => replace(`#/${path}`);