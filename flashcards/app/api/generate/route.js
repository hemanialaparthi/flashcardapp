import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
You are a flashcard creator. You will take in text and create multiple flashcards from it. Make sure to create 5 flashcards from it.
Front and back of card should be one sentence long

You should return the flashcards in the following json format:
{
    "flashcards": [
        {
            "front": "Front of the card",
            "back": "Back of the card"
        }
    ]
}
`;

export async function POST(req) {
    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENAI_API_KEY
    });

    const data = await req.text();

    const completion = await openai.chat.completions.create({
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: data }
        ],
        model: "gpt-3.5-turbo",
        response_format: {type: 'json_object'},
    });

    const flashcards = JSON.parse(completion.choices[0].message.content)

    return NextResponse.json(flashcards.flashcards);
}
