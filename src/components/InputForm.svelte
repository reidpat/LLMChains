<script>
    import { writable } from "svelte/store";
    import TaskTypeSelector from "./TaskTypeSelector.svelte";
    import PromptInput from "./PromptInput.svelte";

    let inputData = writable("");
    let tasks = writable([]);

    function addTask() {
        $tasks = [...$tasks, { type: null, prompts: [] }];
    }

    // Function to handle changes in task type
    function updateTaskType(index, type) {
        $tasks[index].type = type;
    }

    function updateTaskPrompt(taskIndex, updatedPrompt) {
        $tasks[taskIndex] = updatedPrompt;
        tasks = $tasks; // reassign to trigger reactivity
    }
</script>

<form>
    <textarea bind:value={$inputData} placeholder="Enter article text here..."
    ></textarea>

    <button type="button" on:click={addTask}>Add Task</button>

    {#each $tasks as task, index}
        <div>
            <TaskTypeSelector
                {index}
                on:typeChange={(e) => updateTaskType(index, e.detail)}
            />
            <PromptInput
                prompt={task}
                level={0}
                updatePrompt={(updatedPrompt) =>
                    updateTaskPrompt(index, updatedPrompt)}
            />
            <!-- More components to add prompts will go here -->
        </div>
    {/each}

    <!-- Buttons for Save and Submit will go here -->
</form>

<style>
    /* Add CSS styles here */
</style>
