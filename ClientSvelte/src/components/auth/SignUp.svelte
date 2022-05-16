<script>
    import {LocalStorage as LS, userDetails} from "../../stores";
    import Request from "../../services/RequestController";
    import {ErrorWrapper} from "../../services/RequestWrapper";

    let user = {
        Email: "",
        Password: "",
        Firstname: "",
        Lastname: "",
    };

    async function register() {
        try {
            LS.Set("jwt", null);
            const res = await Request.user.register(user);
            LS.Set("jwt", res.data.token);
            $userDetails = (await Request.user.me()).data;
        } catch (err) {
            ErrorWrapper(err);
        }
    }

</script>

<div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
    <div class="card-body">
        <form on:submit|preventDefault={register}>
                <div class="justify-end">
                    <div class="">
                        <input type="text" placeholder="Firstname" class="input input-bordered input-sm " bind:value={user.Firstname}/>
                    </div>
                    <div class="">
                        <input type="text" placeholder="Lastname" class="input input-bordered input-sm" bind:value={user.Lastname}/>
                    </div>
                </div>
            <div class="form-control">
                <label class="label">
                    <span class="label-text">Email</span>
                </label>
                <input type="email" placeholder="email" class="input input-bordered" bind:value={user.Email}/>
            </div>
            <div class="form-control">
                <label class="label">
                    <span class="label-text">Password</span>
                </label>
                <input type="text" placeholder="password" class="input input-bordered" bind:value={user.Password}/>
                <label class="label">
                    <a href="#todo" class="label-text-alt link link-hover">Forgot password?</a>
                </label>
            </div>
            <div class="form-control mt-6">
                <button class="btn btn-primary">Register</button>
            </div>
        </form>
    </div>
</div>
