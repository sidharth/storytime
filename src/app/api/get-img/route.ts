import { GetImgRequest, GetImgResponse } from "@/app/common/contracts";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let getImgRequest: GetImgRequest = (await req.json()) as GetImgRequest;
  let predictionId = getImgRequest.predictionId;

  console.log("received get image request for prediction id: " + predictionId);

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
      console.log("error getting prediction");
      console.error(err);
    });

  let getImgResponse: GetImgResponse = {
    predictionStatus: replicatePrediction.status,
    imgUrl:
      replicatePrediction.status == "succeeded"
        ? replicatePrediction.output[0]
        : "",
  };

  console.log("status: " + getImgResponse.predictionStatus);

  return NextResponse.json(getImgResponse, { status: 200 });
}
