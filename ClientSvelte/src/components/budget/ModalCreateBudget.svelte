<script>
    import {
        Button,
        Modal,
        ModalBody,
        ModalFooter,
        ModalHeader,
        FormGroup,
        Input,
        Row,
        Col,
    } from "sveltestrap";

    import Request from "../../services/RequestController";
    import { avaliableCurrency } from "../../stores";

    let modelToRequest = {
        Name: "",
        InviteToken: false,
        Currency: "UAH",
    };

    const create = async () => {
        console.log("Budget create");
        console.log(modelToRequest);

        try {
            let res = await Request.budget.create(modelToRequest);
            console.log(res);
            toggle();
        } catch (err) {
            console.log(err);
        }
    };

    export let open = false;
    export let toggle = () => (open = !open);
</script>

<Modal isOpen={open} {toggle}>
    <ModalHeader {toggle}>Create Budget</ModalHeader>
    <ModalBody>
        <Row>
            <Col>
                <FormGroup floating label="Budget name">
                    <Input type="text" bind:value={modelToRequest.Name} />
                </FormGroup>
            </Col>
        </Row>
        <Row>
            <Col>
                <FormGroup>
                    <Input type="select" bind:value={modelToRequest.Currency}>
                        {#each $avaliableCurrency as currency}
                            <option>{currency}</option>
                        {/each}
                    </Input>
                </FormGroup>
            </Col>
            <Col>
                <FormGroup>
                    <Input
                        type="switch"
                        label="Generate Invitetoken"
                        bind:checked={modelToRequest.InviteToken}
                    />
                </FormGroup>
            </Col>
        </Row>
    </ModalBody>
    <ModalFooter>
        <Button color="primary" on:click={create}>Create</Button>
    </ModalFooter>
</Modal>
