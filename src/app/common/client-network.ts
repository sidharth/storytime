import {
  GenerateRequest,
  GenerateResponse,
  GetImgRequest,
  GetImgResponse,
} from "./contracts";

export async function generateImage(
  req: GenerateRequest
): Promise<GenerateResponse> {
  return fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return null;
    });
}

export async function getImg(req: GetImgRequest): Promise<GetImgResponse> {
  return fetch("/api/get-img", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error(err);
      return null;
    });
}
