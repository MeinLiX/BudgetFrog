<script>
    import ModalAddBank from "./ModalAddBank.svelte";
    import ModalRemoveBank from "./ModalRemoveBank.svelte";

    const CloseModal = () => {
        try {
            document.getElementById(ID).click(); //to close.
        } catch {}
    };

    export let budget = [];
    export let ID = "budget-choose-action-bank-modal";
    export let SuccessAction = () => {};

    const P24Bank = "p24";
    const MonoBank = "mono";

    let GetHeaderText = () => {
        var len = GetCreds().length;
        if (ID.includes(P24Bank)) {
            return `PrivatBank cards: ${len == 0 ? "empty" : +len}`;
        }
        if (ID.includes(MonoBank)) {
            return `MonoBank cards: ${len == 0 ? "empty" : +len}`;
        }
    };
    let GetCreds = () => {
        var creds = [];
        if (ID.includes(P24Bank)) {
            creds = budget.bankCredentials.filter((e) => e.bankType == 0);
        } else if (ID.includes(MonoBank)) {
            creds = budget.bankCredentials.filter((e) => e.bankType == 1);
        }
        return creds;
    };
</script>

<ModalAddBank ID={ID + "-add"} {budget} {SuccessAction} />

{#if GetCreds().length > 0}
    <ModalRemoveBank ID={ID + "-remove"} {budget} {SuccessAction} />
{/if}

<input type="checkbox" id={ID} class="modal-toggle" />
<label for={ID} class="modal cursor-pointer">
    <div class="modal-box relative form-control">
        <div class="flex justify-between items-center mb-4">
            <h5 class="text-xl font-bold leading-none text-gray-900">
                {GetHeaderText()}
            </h5>
        </div>
        <label
            class="btn btn-outline m-1"
            for={ID + "-add"}
            on:click={CloseModal}
        >
            <span>Add</span>
        </label>
        {#if GetCreds().length > 0}
            <label
                class="btn btn-outline m-1"
                for={ID + "-remove"}
                on:click={CloseModal}
            >
                <span>Remove</span>
            </label>
        {/if}
    </div>
</label>
