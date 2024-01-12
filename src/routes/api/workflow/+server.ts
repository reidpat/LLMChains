import { SECRET_OPENAI_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

let bearer = 'Bearer ' + SECRET_OPENAI_KEY;

async function makeOpenAIRequest() {
    console.log("Calling GPT3");
    var url = "https://api.openai.com/v1/chat/completions";
    try {
        let res = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a helpful assistant."
                    },
                    {
                        "role": "user",
                        "content": "Hello!"
                    }
                ]
            })    
        });
        let jsonRes = await res.json();
        console.log(jsonRes);
        return jsonRes;
    } catch (error) {
        console.error("Error during fetch:", error);
        return error;
    }
}
 
export async function GET() {
	const responseBody = await makeOpenAIRequest();
    console.log(responseBody);
	return json(responseBody);

	// return new Response(JSON.stringify(responseBody), {
	// 	status: 200,
	// 	headers: { 'Content-Type': 'application/json' }
	// });
}