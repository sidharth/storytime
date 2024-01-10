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
        version:
          "6244ebc4d96ffcc48fa1270d22a1f014addf79c41732fe205fb1ff638c409267",

        // This is the text prompt that will be submitted by a form on the frontend
        input: {
          prompt: generateRequest.userPrompt + ",watercolor painting",
          agree_to_research_only: true,
          width: 768,
          height: 768,
        },
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
