<script>
    import {onMount} from "svelte";
    import Router, {push, location} from "svelte-spa-router";
    import routes from "./routes";
    import Header from "./components/layout/Header.svelte";
    import BudgetHeader from "./components/budget/BudgetHeader.svelte";
    import Request from "./services/RequestController";
    import {
        auth,
        userDetails,
        avaliableCurrency,
    } from "./stores";

    onMount(async () => {

        try {
            $userDetails = (await Request.user.me()).data;
            $auth = true;
        } catch {
            $userDetails = {};
            $auth = false;
        }

        if (!$auth) {
            await push("#/");
        } else {
            try {
                $avaliableCurrency = (await Request.exchange.avaliableCurrency()).data.currencies;
            } catch {
            }
        }
    });
</script>

<div id="app">
    {#if $auth}
        <Header/>
        {#if $location.includes("budget")}
            <BudgetHeader/>
        {/if}
    {/if}
    <Router {routes}/>
</div>

<style>
    @import "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css";

    #app {
        min-height: 80vh;
    }
</style>
