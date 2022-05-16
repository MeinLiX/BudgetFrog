<script>
    import {onMount} from "svelte";
    import {userDetails} from "../stores";
    import Request from "../services/RequestController"

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
    <div class="card w-96 glass">
        <figure><img src="https://random.imagecdn.app/250/250" alt="Avatar"></figure>
        <div class="card-body">
            <p class="card-title">{$userDetails.firstName}</p>
            <p class="card-title">{$userDetails.lastName}</p>
            <p class="card-title">{$userDetails.email}</p>
        </div>
    </div>
</div>
