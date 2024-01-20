import { SECRET_OPENAI_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

let bearer = 'Bearer ' + SECRET_OPENAI_KEY;


/*
Data structures
- Prompt Request
    - List of (prompt & settings)

- Action
    - Type info
        - Prompt Request OR
        - Code

- Workflow
    - List of actions
*/



async function handleWorkflow(data) {
    const inputText = data.input;
    let finalResult = '';

    for (const task of data.tasks) {
        let taskResult = '';

        switch (task.type) {
            case 'parallel':
                taskResult = await handleParallel(task.prompts, inputText);
                break;
            case 'combination':
                taskResult = await handleCombination(task.prompts, inputText);
                break;
            case 'series':
                taskResult = await handleSeries(task.prompts, inputText);
                break;
            default:
                console.error('Unknown task type:', task.type);
                break;
        }

        finalResult += taskResult;
    }

    return finalResult;
}

async function handleParallel(prompts, inputText) {
    const parallelPromises = prompts.map(prompt => {
        switch (prompt.type) {
            case 'combination':
                return handleCombination(prompt.prompts, inputText);
            case 'series':
                return handleSeries(prompt.prompts, inputText);
            default:
                return makeApiRequest(prompt.system, inputText);
        }
    });

    const results = await Promise.all(parallelPromises);
    return results.join(' '); // Concatenate all results into a single string
}

async function handleCombination(prompts, inputText) {
    let combinedSystemInstruction = prompts.map(prompt => prompt.system).join(' ');
    return makeApiRequest(combinedSystemInstruction, inputText);
}

async function handleSeries(prompts, inputText) {
    let result = inputText;
    for (const prompt of prompts) {
        result += await makeApiRequest(prompt.system, result);
    }
    return result;
}


async function handlePrompt(prompt, results){
    let res = await makeOpenAIRequest(prompt, results);
    return(res.choices[0].message.content)
}

async function makeApiRequest(prompt, input){
    console.log(prompt, input);
    let res =  await makeOpenAIRequest(prompt, input)
    // console.log(res);
    return(res.choices[0].message.content)
}


async function makeOpenAIRequest(prompt, input) {
    console.log("Calling GPT3", "prompt:" + prompt, "input:" + input);
    var url = "https://api.openai.com/v1/chat/completions";
    try {
        let res = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "model": "gpt-4-1106-preview",
                "messages": [
                    {
                        "role": "system",
                        "content": prompt,
                    },
                    {
                        "role": "user",
                        "content": input,
                    }
                ]
            })    
        });
        let jsonRes = await res.json();
        return jsonRes;
    } catch (error) {
        console.error("Error during fetch:", error);
        return error;
    }
}

export function GET(){
    return json({text: "response"})
}
 
export async function POST(requestEvent) {
    const {request} = requestEvent;
    let req = await request.json();

	const responseBody = await handleWorkflow(req);
    console.log(responseBody);
	return new Response(JSON.stringify(responseBody), {status: 200});

	// return new Response(JSON.stringify(responseBody), {
	// 	status: 200,
	// 	headers: { 'Content-Type': 'application/json' }
	// });
}