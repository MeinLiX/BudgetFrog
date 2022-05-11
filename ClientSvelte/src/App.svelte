<script>
	import { onMount } from "svelte";
	import Router, { push,location } from "svelte-spa-router";
	import routes from "./routes";
	import Header from "./components/layout/Header.svelte";
	import Request from "./services/RequestController";
	import { auth } from "./stores";

	onMount(async () => {
		try {
			await Request.status.status();
			$auth=true;
		} catch {
			$auth=false;
		}
		
		if (!$auth) {
			await push("#/");
		}
	});
</script>

<div id="app">
	{#if $auth}
		<Header />
	{/if}
	<Router {routes} />
</div>

<style>
	@import "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css";
	#app {
		min-height: 80vh;
	}
</style>
