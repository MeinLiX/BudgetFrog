<script>
    import Request from "../../services/RequestController";
    import {ErrorWrapper} from "../../services/RequestWrapper";

    let modelToRequest = {
        InviteToken: ""
    };

    const join = async () => {
        if (modelToRequest.InviteToken === "") {
            modelToRequest.InviteToken = "1";
        }
        try {
            await Request.budget.join(modelToRequest);
            await SuccessAction();
            try {
                document.getElementById(ID).click(); //to close.
            } catch {
            }
        } catch (err) {
            ErrorWrapper(err);
        }
        modelToRequest.InviteToken = "";
    };

    export let ID = "budget-join-modal"
    export let SuccessAction = () => {
    };
</script>

<input type="checkbox" id="{ID}" class="modal-toggle"/>
<label for="{ID}" class="modal cursor-pointer">
    <div class="modal-box relative form-control">
        <input type="text" placeholder="invite token" class="input input-bordered input-lg"
               bind:value={modelToRequest.InviteToken}/>
        <br/>
        <label for="{ID}" class="btn btn-outline btn-secondary" on:click={join}>Join</label>
    </div>
</label>
