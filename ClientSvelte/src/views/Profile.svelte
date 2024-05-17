<script>
    import { onMount } from "svelte";
    import { userDetails } from "../stores";
    import Request from "../services/RequestController";

    onMount(async () => {
        try {
            let reqMe = await Request.user.me();
            $userDetails = reqMe.data;
        } catch (err) {
            $userDetails = {};
        }
    });
</script>

<div class="center_content">
    <div class="card card-side bg-base-100 shadow-xl">
        <figure>
            <img src="https://random.imagecdn.app/250/250" alt="Avatar" />
        </figure>
        <div class="card-body">
            <kbd class="kbd kbd-lg">{$userDetails.firstName}</kbd>
            <kbd class="kbd kbd-lg">{$userDetails.lastName}</kbd>
            <kbd class="kbd kbd-lg">{$userDetails.email}</kbd>
        </div>
    </div>
</div>
