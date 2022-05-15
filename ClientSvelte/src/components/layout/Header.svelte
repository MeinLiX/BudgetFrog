<script>
  import { push } from "svelte-spa-router";
  import { LocalStorage as LS , userDetails} from "../../stores";
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
  <div class="nb">
    <NavbarBrand href="/#/" style="font-size: 32px">BudgetFrog</NavbarBrand>
  </div>
  <NavbarToggler on:click={() => (isOpen = !isOpen)} />
  <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
    <Nav class="ms-auto" navbar>
      <NavItem>
        <NavLink
          href="https://github.com/MeinLiX/BudgetFrog"
          style="font-size: 28px"
        >
          GitHub
        </NavLink>
      </NavItem>
      <Dropdown nav inNavbar>
        <DropdownToggle nav caret style="font-size: 28px">
          {`${$userDetails.firstName} ${$userDetails.lastName}`}
        </DropdownToggle>
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
