import { NextResponse } from "next/server";

const systemPrompt = `You are a flashcard creator. Create 20 flashcards based on the input text.

The output should be formatted as follows:
[
   {
       front: 'Front of the card',
       back: 'Back of the card'
   }
]
`;

export async function POST(req) {
    const data = await req.json();

    // Fetch the response from the Gemini API using built-in fetch
    const response = await fetch("https://api.gemini.com/v1/flashcards/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`
        },
        body: JSON.stringify({
            prompt: systemPrompt,
            input: data // Adjust based on how your input is structured
        })
    });

    const result = await response.json();

    const flashcards = result.data;  // Adjust based on the response structure from Gemini

    return NextResponse.json(flashcards);
}
