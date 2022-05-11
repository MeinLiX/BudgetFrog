<script>
    import { LocalStorage as LS } from "../../stores";
    import Request from "../../services/RequestController";
    import { Button, FormGroup, Input, Alert, Col, Row } from "sveltestrap";

    let user = {
        Email: "",
        Password: "",
        Firstname: "",
        Lastname: "",
    };

    let errorMessage = null;

    async function login() {
        if (!validateInput()) return;

        try {
            LS.Set("jwt", null);
            const res = await Request.user.register(user);
            LS.Set("jwt", res.data.token);
        } catch (error) {
            console.log(error)
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
    <h1>Sign Up</h1>
</div>
<form on:submit|preventDefault={login}>
    <Row>
        <Col>
            <FormGroup floating label="Firstname" size="lg">
                <Input
                    type="text"
                    placeholder="Firstname"
                    bind:value={user.Firstname}
                />
            </FormGroup>
        </Col>
        <Col>
            <FormGroup floating label="Lastname" size="lg">
                <Input
                    type="text"
                    placeholder="Lastname"
                    bind:value={user.Lastname}
                />
            </FormGroup>
        </Col>
    </Row>
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

    <Button block outline>Register</Button>
</form>
