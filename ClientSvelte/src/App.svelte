<script>
    import {onMount} from "svelte";
    import { fade } from 'svelte/transition';
    import Router, {push, location} from "svelte-spa-router";
    import routes from "./routes";
    import Header from "./components/layout/Header.svelte";
    import BudgetHeader from "./components/budget/BudgetHeader.svelte";
    import Request from "./services/RequestController";
    import {
        auth,
        userDetails,
        avaliableCurrency,
        errorMSG,
        infoMSG
    } from "./stores";

    onMount(async () => {
        try {
            $userDetails = (await Request.user.me()).data;
            $auth = true;
            $avaliableCurrency = (await Request.exchange.avaliableCurrency()).data.currencies;
        } catch {
            $userDetails = {};
            $auth = false;
        }
        if (!$auth) {
            await push("#/");
        } else {


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

    <div class="fixed w-96" style="z-index: 999">
        {#each $errorMSG as message}
            <label class="label" transition:fade>
                <div class="alert alert-error">
                    <span>{message}</span>
                </div>
            </label>
        {/each}
        {#each $infoMSG as message}
            <label class="label" transition:fade>
                <div class="alert shadow-lg">
                    <span>{message}</span>
                </div>
            </label>
        {/each}
    </div>

    <Router {routes}/>
</div>

<style global>
    #app {
        min-height: 80vh;
    }
    a {
        text-decoration: none !important;
    }
</style>
