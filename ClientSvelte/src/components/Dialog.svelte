<script>
    import { CloseModelIfOpened } from "../services/Utils";
    const ConfirmAction = async () => {
        await ConfirmFunction(ConfirmFunctionParams);
        CloseModelIfOpened(ModalID);
    };
    const CancelAction = async () => {
        await CancelFunction(CancelFunctionParams);
        CloseModelIfOpened(ModalID);
    };

    export let ModalID = "Modal";
    export let ConfirmButtonText = "Yes, I'm sure";
    export let CancelButtonText = "Cancel";
    export let ConfirmFunctionParams = {};
    export let ConfirmFunction = async (ConfirmFunctionParams) => {};
    export let CancelFunctionParams = {};
    export let CancelFunction = async (CancelFunctionParams) => {};
    export let XL = false;
    let needBtn = (name) => name != null && name != "";
    let style = ()=>XL?"max-w-xl":"max-w-xs";
</script>

<input type="checkbox" id={ModalID} class="modal-toggle" />
<div class="modal" for={ModalID}>
    <div class="modal-box relative {style}">
        <div class="p-2 text-center">
            <slot />
            <br />
            <div class="modal-bottom">
                {#if needBtn(ConfirmButtonText)}
                <button
                    on:click={ConfirmAction}
                    type="button"
                    class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                >
                    {ConfirmButtonText}
                </button>
                {/if}
                {#if needBtn(CancelButtonText)}
                    <button
                        on:click={CancelAction}
                        type="button"
                        class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                    >
                        {CancelButtonText}
                    </button>
                {/if}
            </div>
        </div>
    </div>
</div>
