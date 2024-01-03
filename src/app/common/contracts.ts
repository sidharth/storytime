export interface GenerateRequest {
  userPrompt: string;
}

export interface GenerateResponse {
  predictionId: string;
}

export interface GetImgRequest {
  predictionId: string;
}

export interface GetImgResponse {
  predictionStatus: string;
  imgUrl: string;
}

export interface Prediction {}

export interface StoryPage {
  imgUrl: string;
  text: string;
}
