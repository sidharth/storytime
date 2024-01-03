import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let getImgRequest: GetImgRequest = (await req.json()) as GetImgRequest;
  let predictionId = getImgRequest.predictionId;

  // Get a prediction from Replicate.
  const replicatePrediction = await fetch(
    "https://api.replicate.com/v1/predictions/" + predictionId,
    {
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
    });

  let getImgResponse: GetImgResponse = {
    predictionStatus: replicatePrediction.status,
    imgUrl:
      replicatePrediction.status == "succeeded"
        ? replicatePrediction.output[0]
        : "",
  };

  return NextResponse.json(getImgResponse, { status: 200 });
}
