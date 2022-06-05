<script>
    import {onMount} from "svelte";
    import Request from "../services/RequestController";
    import CategoryList from "../components/category/CategoryList.svelte"
    import {ErrorWrapper} from "../services/RequestWrapper";
    import ModalCreateCategory from "../components/category/ModalCreateCategory.svelte";


    const UpdateCategories = async () => {
        try {
            categories = (await Request.category.getList({BudgetID: params.budgetID})).data;
        } catch (err) {
            ErrorWrapper(err);
        }
    }

    onMount(async () => {
        await UpdateCategories();
    });

    //{budgetID}
    export let params = {}
    let categories = []
    const CreateCategoryModalID = "category-create-modal"
</script>

<ModalCreateCategory ID={CreateCategoryModalID} budgetID={params.budgetID} SuccessAction={UpdateCategories}/>

<div class="center_content">
    <CategoryList categories={categories} budgetID={params.budgetID}/>
</div>

<label class="fixed-btn btn-ghost btn-circle" for={CreateCategoryModalID}>
    <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 24 24">
        <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/>
    </svg>
</label>

<style>
    .fixed-btn {
        position: fixed;
        bottom: 20px;
        right: 30px;
    }
</style>