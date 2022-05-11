import { replace } from "svelte-spa-router";
import Root from "../views/Root.svelte";
import NotFound from "../views/NotFound.svelte";
import Profile from "../views/Profile.svelte";

export default {
    "/": Root,
    "/profile": Profile,
    "*": NotFound,
};

export const navigate = (path = "non-existence-path") => replace(`#/${path}`);