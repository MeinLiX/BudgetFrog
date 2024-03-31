<script>
    import { onMount } from "svelte";
    import { LocalStorage as LS, Period } from "../../stores";

    const avaliableMonths = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const avaliableSelectYear = 2022;
    const avaliableYears = 3;

    onMount(() => {});
    let firstLoad = true;
    $: {
        LS.Set(Period.MonthKeyStoreConst, selectedMonth);
        LS.Set(Period.YearKeyStoreConst, selectedYear);

        UpdatePeriod(!firstLoad);

        if (firstLoad) {
            //except first UpdatePeriod Invoke
            firstLoad = false;
        }
    }

    const unFocus = () => {
        periodSelectorBaseComponent.focus();
    };

    let periodSelectorBaseComponent;
    let selectedMonth = Period.GetMonth();
    let selectedYear = Period.GetYear();

    export let UpdatePeriod = (needUpdate) => {};
</script>

<div
    class=" mb-2 w-1/7 bg-white rounded-lg border shadow-md sm:p-2"
    bind:this={periodSelectorBaseComponent}
>
    <select
        class="select select-ghost max-w-xs"
        bind:value={selectedMonth}
        on:change={unFocus}
    >
        {#each avaliableMonths as months, index (index)}
            {#if index == new Date().getMonth()}
                <option style="font-weight: 700;" value={index + 1}
                    >{months}</option
                >
            {:else}
                <option value={index + 1}>{months}</option>
            {/if}
        {/each}
    </select>
    <select
        class="select select-ghost max-w-xs"
        bind:value={selectedYear}
        on:change={unFocus}
    >
        {#each Array(avaliableYears) as _, index (index)}
            {#if index + avaliableSelectYear == new Date().getFullYear()}
                <option style="font-weight: 700;"
                    >{index + avaliableSelectYear}</option
                >
            {:else}
                <option>{index + avaliableSelectYear}</option>
            {/if}
        {/each}
    </select>
</div>
