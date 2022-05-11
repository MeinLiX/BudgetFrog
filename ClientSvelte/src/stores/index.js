import { writable } from "svelte/store";

export const auth = writable(true);

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
    }
}