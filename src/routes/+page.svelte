<script>
    import { writable } from 'svelte/store';

    let inputData = writable('');
    let tasks = writable([]);

    function addTask() {
        $tasks = [...$tasks, { type: null, prompts: [] }];
    }

    // Function to handle changes in task type
    function updateTaskType(index, type) {
        $tasks[index].type = type;
    }
</script>

<form>
    <textarea bind:value={$inputData} placeholder="Enter article text here..."></textarea>

    <button type="button" on:click={addTask}>Add Task</button>

    {#each $tasks as task, index}
        <div>
            <select bind:value={task.type}>
                <option value="">Select Task Type</option>
                <option value="parallel">Parallel</option>
                <option value="combination">Combination</option>
                <option value="series">Series</option>
            </select>
            <textarea name="" id=""></textarea>
            <!-- More components to add prompts will go here -->
        </div>
    {/each}
    
    <!-- Buttons for Save and Submit will go here -->
</form>

<style>
    /* Add CSS styles here */
</style>
