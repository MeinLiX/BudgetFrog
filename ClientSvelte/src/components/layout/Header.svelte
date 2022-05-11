<script>
  import { push } from "svelte-spa-router";
  import { LocalStorage as LS } from "../../stores";
  import { navigate } from "../../routes";
  import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
  } from "sveltestrap";

  function logout() {
    LS.Set("jwt", null);
    push("/");
  }

  let isOpen = false;

  function handleUpdate(event) {
    isOpen = event.detail.isOpen;
  }
</script>

<Navbar color="light" light expand="md">
  <NavbarBrand href="/#/">BudgetFrog</NavbarBrand>
  <NavbarToggler on:click={() => (isOpen = !isOpen)} />
  <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
    <Nav class="ms-auto" navbar>
      <NavItem>
        <NavLink href="https://github.com/MeinLiX/BudgetFrog">GitHub</NavLink>
      </NavItem>
      <Dropdown nav inNavbar>
        <DropdownToggle nav caret>UserName</DropdownToggle>
        <DropdownMenu end>
          <DropdownItem on:click={() => navigate("profile")}>
            Profile
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem on:click={logout}>Logout</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </Nav>
  </Collapse>
</Navbar>
