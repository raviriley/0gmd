import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Get API key from server environment
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.error("OPENROUTER_API_KEY not configured");
      return NextResponse.json(
        { error: "API configuration error" },
        { status: 500 }
      );
    }

    // Call OpenRouter API with Gemini model
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-exp:free",
          messages: messages,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", response.status, errorText);
      return NextResponse.json(
        { error: `API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in chat API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
