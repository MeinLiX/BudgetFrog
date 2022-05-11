<script>
    import { LocalStorage as LS } from "../../stores";
    import Request from "../../services/RequestController";
    import { Button, FormGroup, Input, Alert } from "sveltestrap";

    let user = {
        Email: "testtest2@test.test",
        Password: "testtest",
        Firstname: "",
        Lastname: "",
    };

    let errorMessage = null;

    async function login() {
        if (!validateInput()) return;

        try {
            LS.Set("jwt", null);
            const res = await Request.user.login(user);
            LS.Set("jwt", res.data.token);
        } catch (error) {
            errorMessage = error.Exception;
        }
    }

    function validateInput() {
        if (user.Email.length == 0) {
            errorMessage = "Email can't be left blank!";
            return false;
        }

        if (user.Password.length == 0) {
            errorMessage = "Please enter the Password.";
            return false;
        }

        return true;
    }
</script>

<div>
    <h1>Sign In</h1>
</div>
<form on:submit|preventDefault={login}>
    <FormGroup floating label="Email" size="lg">
        <Input type="email" placeholder="Email" bind:value={user.Email} />
    </FormGroup>

    <FormGroup floating label="Password" size="lg">
        <Input
            type="password"
            placeholder="Password"
            bind:value={user.Password}
        />
    </FormGroup>

    <Alert
        color="danger"
        isOpen={errorMessage != null}
        toggle={() => (errorMessage = null)}
    >
        {errorMessage}
    </Alert>

    <Button block outline>Login</Button>
</form>
