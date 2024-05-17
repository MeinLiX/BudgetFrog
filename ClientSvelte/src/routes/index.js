import {replace} from "svelte-spa-router";
import Root from "../views/Root.svelte";
import NotFound from "../views/NotFound.svelte";
import Profile from "../views/Profile.svelte";
import BudgetTransactions from "../views/BudgetTransactions.svelte"
import BudgetCategories from "../views/BudgetCategories.svelte"
import BudgetPlanned from "../views/PlannedBudget.svelte"
import Statistic from "../views/Statistic.svelte"
import Assistant from "../views/Assistant.svelte"

export default {
    "/budget/:budgetID/assistant" : Assistant,
    "/budget/:budgetID/statistic": Statistic,
    "/budget/:budgetID/planned": BudgetPlanned,
    "/budget/:budgetID/category": BudgetCategories,
    "/budget/:budgetID": BudgetTransactions,
    "/": Root,
    "/profile": Profile,
    "*": NotFound,
};

export const navigate = (path = "non-existence-path") => replace(`#/${path}`);