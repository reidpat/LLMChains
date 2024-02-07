<script>
    import { createEventDispatcher } from 'svelte';
    export let index;
    export let type;

    const dispatch = createEventDispatcher();

    function emitTypeChange(event) {
        dispatch('typeChange', event.target.value);
    }
</script>

<select on:change={emitTypeChange}>
    <option value="">Select Task Type</option>
    <option value="parallel">Parallel</option>
    <option value="combination">Combination</option>
    <option value="series">Series</option>
</select>

<style>
    /* Add CSS styles here */
</style>
