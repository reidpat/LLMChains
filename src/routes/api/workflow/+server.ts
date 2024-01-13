import { SECRET_OPENAI_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

let bearer = 'Bearer ' + SECRET_OPENAI_KEY;

async function makeOpenAIRequest({prompt: {system, user}}) {
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
                        "content": system,
                    },
                    {
                        "role": "user",
                        "content": user,
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

export function GET(){
    return json({text: "response"})
}
 
export async function POST(requestEvent) {
    const {request} = requestEvent;
    let {system, user} = await request.json();

	const responseBody = await makeOpenAIRequest({prompt: {system, user}});
    console.log(responseBody);
	return new Response(JSON.stringify(responseBody), {status: 200});

	// return new Response(JSON.stringify(responseBody), {
	// 	status: 200,
	// 	headers: { 'Content-Type': 'application/json' }
	// });
}