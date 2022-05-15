<script>
    import {
        Button,
        Modal,
        ModalBody,
        ModalFooter,
        ModalHeader,
        FormGroup,
        Input,
    } from "sveltestrap";

    import Request from "../../services/RequestController";

    let modelToRequest = {
        InviteToken:""

    };

    const join = async () => {
        console.log("Budget Join");

        try {
            let res = await Request.budget.join(modelToRequest);
            console.log(res);
            toggle();
        } catch (err) {//todo
            console.error(err);
        }
    };

    export let open = false;
    export let toggle = () => (open = !open);
</script>

<Modal isOpen={open} {toggle}>
    <ModalHeader {toggle}>Create Budget</ModalHeader>
    <ModalBody>
        <FormGroup label="Enter invite token">
            <Input type="text" bind:value={modelToRequest.InviteToken} />
        </FormGroup>
    </ModalBody>
    <ModalFooter>
        <Button color="primary" on:click={join}>Join</Button>
    </ModalFooter>
</Modal>
