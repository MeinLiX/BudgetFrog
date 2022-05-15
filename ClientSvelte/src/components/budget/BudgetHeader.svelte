<script>
    import {onMount} from "svelte";
    import {push, location} from "svelte-spa-router";
    import {
        Collapse,
        Navbar,
        Button,
        NavbarToggler,
        NavbarBrand,
        ButtonGroup,
        Nav,
        NavItem,
        NavLink,
        Dropdown,
        DropdownToggle,
        DropdownMenu,
        DropdownItem,
    } from "sveltestrap";
    import Request from "../../services/RequestController";
    import {selectedBudget} from "../../stores";

    onMount(async () => {
        location.subscribe(async (newLocation) => {
            if (newLocation.includes("budget")) {
                newLocation += "/";
                let BudgetID = newLocation.substring(
                    newLocation.indexOf("/", 1) + 1,
                    newLocation.indexOf("/", 8)
                );
                try {
                    $selectedBudget = (await Request.budget.get({BudgetID})).data;
                } catch (e) {
                }
            }
        });
    });
    let isOpen = false;

    function handleUpdate(event) {
        isOpen = event.detail.isOpen;
    }
</script>

<Navbar color="light" light expand="md">
    <NavbarBrand href="/#/budget/{$selectedBudget.id}" style="font-size: 22px">
        Budget: {$selectedBudget.name} <b>({$selectedBudget.balance?.amount} : {$selectedBudget.balance?.currency})</b>
    </NavbarBrand>
    <NavbarToggler on:click={() => (isOpen = !isOpen)}/>
    <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
        <Nav class="ms-auto" navbar>
            <NavItem>
                <NavLink href="#/budget/{$selectedBudget.id}/planned" style="font-size: 18px">Planned</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="#/budget/{$selectedBudget.id}/categories" style="font-size: 18px">Categories
                </NavLink>
            </NavItem>
        </Nav>
    </Collapse>
</Navbar>
