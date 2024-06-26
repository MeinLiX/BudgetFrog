<script>
    import Request from "../../services/RequestController";
    import { ErrorWrapper } from "../../services/RequestWrapper";
    import { ShowInfo, GetDescriptionMCC } from "../../services/Utils";
    import Dialog from "../Dialog.svelte";

    const ActionToRemove = async ({ id }) => {
        try {
            await Request.transaction.delete({
                BudgetID: budgetID,
                TransactionID: id,
            });
            await UpdateTransactions();
            ShowInfo("Transaction deleted.");
        } catch (err) {
            ErrorWrapper(err);
        }
    };

    const toGroup = (transactionsArray) => {
        let groups = []; // {date:transactions}[]

        transactionsArray.forEach((t) => {
            if (groups[new Date(t.date.split("T")[0])]) {
                groups[new Date(t.date.split("T")[0])].push(t);
            } else {
                groups[new Date(t.date.split("T")[0])] = [t];
            }
        });
        return Object.entries(groups).map(([key, value]) => {
            return {
                date: key,
                transactions: value,
                income: value.reduce(
                    (ps, t) =>
                        ps +
                        (t.transactionDescriptionCategory?.income
                            ? t.balance.amount
                            : 0),
                    0,
                ),
                outcome: value.reduce(
                    (ps, t) =>
                        ps +
                        (!t.transactionDescriptionCategory?.income
                            ? t.balance.amount
                            : 0),
                    0,
                ),
                currency: value[0].balance.currency,
            };
        });
    };

    export let UpdateTransactions = async () => {};
    export let budgetID;
    export let transactions = [];
    $: groupedTransactions = toGroup(transactions);
    const getModalIDRemove = (transaction) =>
        `modal_remove_t_${budgetID}_${transaction.id}`;
</script>

{#each groupedTransactions as groupedTransaction}
    <div class="pr-4 mb-5 w-1/2 bg-white rounded-lg border shadow-md sm:p-8">
        <div class="flex justify-between items-center mb-4">
            <h5 class="text-xl font-bold leading-none text-gray-900">
                {new Date(groupedTransaction.date).toDateString()}
            </h5>
            <div
                class="inline-flex text-xl items-center text-base font-semibold"
                style="color:
                {groupedTransaction.income - groupedTransaction.outcome > 0
                    ? 'green'
                    : 'red'}"
            >
                {groupedTransaction.income - groupedTransaction.outcome > 0
                    ? "+"
                    : ""}
                {groupedTransaction.income - groupedTransaction.outcome}
                <div class="badge badge-outline ml-1">
                    {groupedTransaction.currency}
                </div>
            </div>
        </div>
        <div class="flow-root">
            <ul class="divide-y divide-gray-200">
                {#each groupedTransaction.transactions as transaction}
                    <Dialog
                        ModalID={getModalIDRemove(transaction)}
                        ConfirmFunction={ActionToRemove}
                        ConfirmFunctionParams={{ id: transaction.id }}
                    >
                        <h1>You really want to remove transaction?</h1>
                        <br />
                        <div class="flex">
                            <div class="flex-0 min-w-0">
                                <p
                                    class="text-sm font-medium text-gray-900 truncate"
                                    style="color:{transaction
                                        .transactionDescriptionCategory?.color}"
                                >
                                    {transaction.transactionDescriptionCategory
                                        ?.name}
                                </p>
                                <p class="text-sm text-gray-500 truncate">
                                    {new Date(transaction.date)
                                        .toLocaleString()
                                        .split(",")[1]}
                                </p>
                            </div>
                            <div class="flex-1"></div>
                            <div
                                class="inline-flex text-xl items-center text-base font-semibold"
                                style="color: 
                                {transaction.transactionDescriptionCategory
                                    ?.income
                                    ? 'green'
                                    : 'red'}"
                            >
                                {transaction.transactionDescriptionCategory
                                    ?.income
                                    ? "+"
                                    : "-"}
                                {transaction.balance.amount}
                                <div class="badge badge-outline ml-1">
                                    {transaction.balance.currency}
                                </div>
                            </div>
                        </div>
                    </Dialog>
                    <li class="py-3 sm:py-4">
                        <div class="flex items-center space-x-4">
                            <div class="flex-0 min-w-0 w-32">
                                <p
                                    class="text-sm font-medium text-gray-900 truncate"
                                    style="color:{transaction
                                        .transactionDescriptionCategory?.color}"
                                >
                                    {transaction.transactionDescriptionCategory
                                        ?.name}
                                </p>
                                {#if transaction.transactionDescriptionCategory.mmc != null && transaction.transactionDescriptionCategory.mmc != 0}
                                    <div
                                        class="tooltip tooltip-left"
                                        data-tip={GetDescriptionMCC(
                                            transaction
                                                .transactionDescriptionCategory
                                                .mmc,
                                            false,
                                            "uk",
                                        )}
                                    >
                                        <p
                                            class="text-sm text-gray-500 truncate"
                                            style="color:{transaction
                                                .transactionDescriptionCategory
                                                ?.color}"
                                        >
                                            {GetDescriptionMCC(
                                                transaction
                                                    .transactionDescriptionCategory
                                                    .mmc,
                                                true,
                                                "uk",
                                            )}
                                        </p>
                                    </div>
                                {/if}
                                <p class="text-sm text-gray-500 truncate">
                                    {new Date(transaction.date)
                                        .toLocaleString()
                                        .split(",")[1]}
                                </p>
                            </div>
                            <div class="flex-1">
                                {#if transaction.notes}
                                    {#if transaction.notes.length > 20}
                                        <div
                                            class="tooltip"
                                            data-tip={transaction.notes}
                                        >
                                            <p
                                                class="text-sm text-gray-600 truncate pl-5"
                                            >
                                                {transaction.notes.substring(
                                                    0,
                                                    20,
                                                )}
                                                ...
                                            </p>
                                        </div>
                                    {:else}
                                        <p
                                            class="text-sm text-gray-600 truncate pl-5"
                                        >
                                            {transaction.notes}
                                        </p>
                                    {/if}
                                {/if}
                            </div>
                            <div class="flex-3"></div>
                            <div
                                class="inline-flex text-xl items-center text-base font-semibold"
                                style="color:{transaction
                                    .transactionDescriptionCategory?.income
                                    ? 'green'
                                    : 'red'}"
                            >
                                {transaction.transactionDescriptionCategory
                                    ?.income
                                    ? "+"
                                    : "-"}{transaction.balance.amount}
                                <div class="badge badge-outline ml-1">
                                    {transaction.balance.currency}
                                </div>
                            </div>
                            <div>
                                {#if transaction.autoGen}
                                    <span
                                        class="btn btn-sm btn-outline"
                                        disabled>remove</span
                                    >
                                {:else}
                                    <label
                                        for={getModalIDRemove(transaction)}
                                        class="label"
                                    >
                                        <span class="btn btn-sm btn-outline"
                                            >remove</span
                                        >
                                    </label>
                                {/if}
                            </div>
                        </div>
                    </li>
                {/each}
            </ul>
        </div>
    </div>
{:else}
    <h1 class="text-center">No transactions</h1>
{/each}
