import { GenerateRequest, GenerateResponse } from "@/app/common/contracts";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("received generation image request");
  const generateRequest = (await req.json()) as GenerateRequest;

  // Get a prediction from Replicate.
  const predictionResponse = await fetch(
    "https://api.replicate.com/v1/predictions",
    {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Pinned to a specific version of Stable Diffusion
        // See https://replicate.com/stability-ai/sdxl
        version:
          "2b017d9b67edd2ee1401238df49d75da53c523f36e363881e057f5dc3ed3c5b2",

        // This is the text prompt that will be submitted by a form on the frontend
        input: { prompt: generateRequest.userPrompt },
      }),
    }
  );

  // Log if there were any errors.
  if (predictionResponse.status !== 201) {
    console.error(await predictionResponse.text());
    return NextResponse.json({ error: "Prediction failed" }, { status: 500 });
  }

  // Return the prediction ID to the frontend.
  const generateResponse: GenerateResponse = {
    predictionId: (await predictionResponse.json()).id,
  };

  return NextResponse.json(generateResponse);
}
