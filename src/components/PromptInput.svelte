<script>
    export let prompt;
    export let updatePrompt;
    export let level = 0; // Ensure level is an exported prop
    import PromptWrapper from "./PromptWrapper.svelte";

    function addNestedPrompt() {
        if (!prompt.prompts) prompt.prompts = [];
        prompt.prompts.push({ type: "", system: "", prompts: [] });
        updatePrompt(prompt);
    }

    function updateNestedPrompt(index, updatedPrompt) {
        prompt.prompts[index] = updatedPrompt;
        updatePrompt(prompt);
    }

    function removeNestedPrompt(index) {
        prompt.prompts.splice(index, 1);
        updatePrompt(prompt);
    }
</script>

<div>
    <input type="text" bind:value={prompt.type} placeholder="Prompt Type" />
    <input
        type="text"
        bind:value={prompt.system}
        placeholder="System Instruction"
    />

    {#if prompt.prompts}
        {#each prompt.prompts as nestedPrompt, index}
            <div class="nested-prompt">
                <PromptWrapper
                    prompt={nestedPrompt}
                    level={level + 1}
                    updatePrompt={(updated) =>
                        updateNestedPrompt(index, updated)}
                />
                <button on:click={() => removeNestedPrompt(index)}
                    >Remove Prompt</button
                >
            </div>
        {/each}
    {/if}

    <button on:click={addNestedPrompt}>Add Nested Prompt</button>
</div>

<style>
    .nested-prompt {
        margin-left: 20px; /* Adjust as needed for desired indentation */
    }
</style>
