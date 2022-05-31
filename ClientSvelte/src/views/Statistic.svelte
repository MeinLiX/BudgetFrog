<script>
    import chartjs from 'chart.js';
    import {onMount} from 'svelte';
    import Request from "../services/RequestController";
    import {ErrorWrapper} from "../services/RequestWrapper";

    const rgbaFromHEX = (hex, alpha = 1) => {
        const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
        return `rgba(${r},${g},${b},${alpha})`;
    };
    const updateUsedCurrencies = (transactionsArray) => {
        usedCurrencies = [];
        transactionsArray.forEach(t => {
            if (!usedCurrencies.includes(t.balance.currency)) {
                usedCurrencies.push(t.balance.currency);
            }
        });
    }
    const UpdateCharts = async () => {
            loading = true;
            let transactionsYearSorted = transactions.filter(transaction => new Date(transaction.date).toString().includes(selectedYear));
            updateUsedCurrencies(transactionsYearSorted);
            new chartjs(chartTransactionsCanvas.getContext('2d'), {
                type: 'line',
                data: {
                    labels: months,
                    datasets:
                        categories.map(category => {
                            return {
                                label: category.name,
                                backgroundColor: rgbaFromHEX(category.color, 0.2),
                                borderColor: category.color,
                                data: months.map(month =>
                                    transactionsYearSorted.filter(transaction =>
                                        transaction.transactionDescriptionCategory.id === category.id &&
                                        new Date(transaction.date).toString().includes(month)
                                    ).length
                                )
                            }
                        })
                }
            });
            new chartjs(radarCurrenciesCanvas.getContext('2d'), {
                type: 'radar',
                data: {
                    labels: categories.map(category => category.name),
                    datasets: usedCurrencies.map(currency => {
                        let CurrencyColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
                        return {
                            label: currency,
                            backgroundColor: rgbaFromHEX(CurrencyColor, 0.2),
                            borderColor: CurrencyColor,
                            data: categories.map(category =>
                                transactionsYearSorted.filter(transaction =>
                                    transaction.transactionDescriptionCategory.id === category.id &&
                                    transaction.balance.currency === currency
                                ).length
                            )
                        }
                    })
                }
            });
            loading = false;
    }

    onMount(async () => {
        try {
            transactions = (await Request.transaction.getList({BudgetID: params.budgetID})).data;
            categories = (await Request.category.getList({BudgetID: params.budgetID})).data;
        } catch (err) {
            ErrorWrapper(err);
        }
        await UpdateCharts();
    });

    //{budgetID}
    export let params = {};
    let selectedYear = 2022;
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let chartTransactionsCanvas;
    let radarCurrenciesCanvas;
    let loading = false;
    let usedCurrencies = [];
    let categories = [];
    let transactions = [];
</script>

<div class="center_content form-control p-4">
    <input class="input input-bordered text-center" type="number" bind:value={selectedYear} on:blur={UpdateCharts}>
</div>
{#if loading}
    <div class="text-center">
        <span class="text-xl">Loading...</span>
    </div>
{/if}
<div class="px-20 pt-4 pb-8">
    <canvas bind:this={chartTransactionsCanvas} id="TransactionsChart"></canvas>
</div>
<div class="px-20 pt-4 pb-8">
    <canvas bind:this={radarCurrenciesCanvas} id="radarCurrenciesCanvas"></canvas>
</div>