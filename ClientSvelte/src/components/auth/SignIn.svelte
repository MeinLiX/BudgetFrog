<script>
    import {avaliableCurrency, LocalStorage as LS, userDetails} from "../../stores";
    import Request from "../../services/RequestController";
    import {ErrorWrapper} from "../../services/RequestWrapper";

    let user = {
        Email: "testtest2@test.test",
        Password: "testtest",
        Firstname: "",
        Lastname: "",
    };

    async function login() {
        try {
            LS.Set("jwt", null);
            const res = await Request.user.login(user);
            LS.Set("jwt", res.data.token);
            $userDetails = (await Request.user.me()).data;
            $avaliableCurrency = (await Request.exchange.avaliableCurrency()).data.currencies;
        } catch (err) {
            console.log(err)
            ErrorWrapper(err);
        }
    }

</script>

<div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
    <div class="card-body">
        <form on:submit|preventDefault={login}>
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
                <input type="password" placeholder="password" class="input input-bordered" bind:value={user.Password}/>
                <label class="label">
                    <a href="#todo" class="label-text-alt link link-hover">Forgot password?</a>
                </label>
            </div>
            <div class="form-control mt-6">
                <button class="btn btn-primary">Login</button>
            </div>
        </form>
    </div>
</div>
