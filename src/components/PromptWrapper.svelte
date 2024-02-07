<script>
    import PromptInput from './PromptInput.svelte';
    
    export let prompt;
    export let level = 0; // Add a level prop
    export let updatePrompt;
</script>

<PromptInput 
    prompt={prompt} 
    level={level} 
    updatePrompt={updatePrompt} 
/>
