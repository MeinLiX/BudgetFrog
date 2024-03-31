<script>
    import {avaliableCurrency, LocalStorage as LS, userDetails} from "../../stores";
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
            LS.Set("jwt", (await Request.user.register(user)).data.token);
            $userDetails = (await Request.user.me()).data;
            $avaliableCurrency = (await Request.exchange.avaliableCurrency()).data.currencies;
        } catch (err) {
            ErrorWrapper(err);
        }
    }
</script>

<div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
    <div class="card-body">
        <form on:submit|preventDefault={register}>
            <div class="form-control">
                <div class="flex w-full">
                    <div class="flex w-full pr-2">
                        <div class="">
                            <control class="label">
                                <span class="label-text">Firstname:</span>
                            </control>
                            <input type="text" placeholder="Firstname" class="input input-bordered input-sm w-32"
                                   bind:value={user.Firstname}/>
                        </div>
                    </div>
                    <div class="flex w-full pl-2">
                        <div class="">
                            <control class="label">
                                <span class="label-text">Lastname:</span>
                            </control>
                            <input type="text" placeholder="Lastname" class="input input-bordered input-sm w-32"
                                   bind:value={user.Lastname}/>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-control mt-2">
                <control class="label">
                    <span class="label-text">Email</span>
                </control>
                <input type="email" placeholder="email" class="input input-bordered" bind:value={user.Email}/>
            </div>
            <div class="form-control mt-2">
                <control class="label">
                    <span class="label-text">Password</span>
                </control>
                <input type="password" placeholder="password" class="input input-bordered" bind:value={user.Password}/>
            </div>
            <div class="form-control mt-8">
                <button class="btn btn-primary">Register</button>
            </div>
        </form>
    </div>
</div>
