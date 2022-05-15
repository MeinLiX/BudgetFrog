<script>
    import {onMount} from "svelte";
    import {userDetails} from "../stores";
    import Request from "../services/RequestController"

    import {
        Card,
        CardBody,
        CardFooter,
        CardHeader,
        CardSubtitle,
        CardText,
        CardTitle,
        Col,
        Input,
        FormGroup,
        Row,
    } from "sveltestrap";

    onMount(async () => {
        try {
            let reqMe = await Request.user.me();
            $userDetails = reqMe.data;
        } catch (err) {
            $userDetails = {};
        }
    });
</script>

<div class="profile">
    <Card class="mb-3">
        <CardHeader>
            <CardTitle style="text-align: center;">Profile details</CardTitle>
        </CardHeader>
        <CardBody>
            <CardText>
                <Row>
                    <Col>
                        <FormGroup floating label="Firstname" size="lg">
                            <Input
                                    type="text"
                                    placeholder="Firstname"
                                    bind:value={$userDetails.firstName}
                                    disabled
                            />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup floating label="Lastname" size="lg">
                            <Input
                                    type="text"
                                    placeholder="Lastname"
                                    bind:value={$userDetails.lastName}
                                    disabled
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col/>
                    <Col>
                        <FormGroup floating label="Email" size="lg">
                            <Input
                                    type="email"
                                    placeholder="Email"
                                    bind:value={$userDetails.email}
                                    disabled
                            />
                        </FormGroup>
                    </Col>
                </Row>
            </CardText>
        </CardBody>
    </Card>
</div>

<style>
    .profile {
        padding: 10px 20%;
    }
</style>
