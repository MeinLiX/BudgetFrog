<script>
    import {auth} from "../stores";
    import Budgets from "./Budgets.svelte";
    import SignIn from "../components/auth/SignIn.svelte";
    import SignUp from "../components/auth/SignUp.svelte";

    let registrationField = false;

    const switchRegField = () => (registrationField = !registrationField);
</script>

{#if !$auth}
    <div class="root">
        <div class="root__illustration"/>
        <div class="root__container">
            <div>
                {#if !registrationField}
                    <SignIn/>
                    <label on:click={switchRegField} class="label-text text-center mt-5" style="cursor: pointer"> Sign up for a new account </label>
                {:else}
                    <SignUp/>
                    <label on:click={switchRegField} class="label-text text-center mt-5" style="cursor: pointer"> Sign in already have account </label>
                {/if}
            </div>
        </div>
    </div>
{:else}
    <Budgets/>
{/if}

<style>
    .root {
        flex-grow: 1;

        height: 100vh;
        display: flex;
    }

    .root__illustration {
        flex: 3 1 0px;
        background-image: url("/budgetfrog.png");
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        padding: 50px 80px;
    }

    .root__container {
        flex: 2 1 0px;
        background: white;
        display: flex;
        padding: 50px 80px;
        justify-content: center;
        align-items: center;
    }

    .root__container div {
        max-width: 500px;
    }
</style>
