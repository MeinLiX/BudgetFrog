import { writable } from "svelte/store";

export const auth = writable(false);
export const errorMSG = writable([]);
export const infoMSG = writable([]);
export const selectedBudget = writable([]);
export const avaliableCategories = writable([]);
export const avaliableCurrency = writable([]);
export const userDetails = writable({});

export const Period = {
    MonthKeyStoreConst: "MonthBudgetPeriod",
    YearKeyStoreConst: "YearBudgetPeriod",
    GetMonth: () => {
        let monthFromLS = +LocalStorage.Get(Period.MonthKeyStoreConst);
        if (monthFromLS == undefined || monthFromLS == null) {
            monthFromLS = new Date().getMonth() + 1;
        }
        return monthFromLS;
    },

    GetYear: () => {
        let yearFromLS = +LocalStorage.Get(Period.YearKeyStoreConst);
        if (yearFromLS == undefined || yearFromLS == null) {
            yearFromLS = new Date().getFullYear();
        }
        return yearFromLS;
    }
}

export const LocalStorage = {
    Get: (key) => {
        const item = localStorage.getItem(key);
        if (item) {
            return item;
        } else {
            if (key == "jwt") {
                auth.set(false);
            }
            return null;
        }
    },
    Set: (key, value) => {
        localStorage.setItem(key, value);
        if (key == "jwt") {
            auth.set(value != null);
        }
    },
    
}
