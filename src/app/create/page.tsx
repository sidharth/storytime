"use client";
import { useState } from "react";
import { generateImage, getImg } from "../common/client-network";
import { Playfair_Display } from "next/font/google";
import { StoryPage } from "../common/contracts";
import { PdfDownloadButton } from "./pdfgen2";

const storySerif = Playfair_Display({ subsets: ["latin"] });

// grid.register();

export default function Create() {
  const [storyPages, setStoryPages] = useState<StoryPage[]>([
    {
      imgUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Steamboat_Willie_1928_Poster.png/410px-Steamboat_Willie_1928_Poster.png",
      text: "Once upon a time...",
    },
  ]);
  return (
    <div className="flex justify-center">
      <div>
        <div>
          {storyPages.map((storyPage, idx) => (
            <StoryPageComponent {...storyPage} key={"storypage-" + idx} />
          ))}
        </div>
        <div className="flex justify-end">
          <span className="text-right">
            <button
              className="underline"
              onClick={() => {
                setStoryPages([
                  ...storyPages,
                  {
                    imgUrl:
                      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Steamboat_Willie_1928_Poster.png/410px-Steamboat_Willie_1928_Poster.png",
                    text: "",
                  },
                ]);
              }}
            >
              Add New Page
            </button>
            <br />
            {/* <button
              className="underline"
              onClick={async () => {
                let pdf = await getPdf(storyPages);
                // console.log("recieved story pages:" + pdf.length);
              }}
            >
              Save PDF
            </button> */}
            {PdfDownloadButton(storyPages)}
          </span>
        </div>
      </div>
    </div>
  );
}

function StoryPageComponent({ imgUrl: image, text }: StoryPage) {
  const [imgUrl, setImgUrl] = useState<string>(image);
  const [predictionId, setPredictionId] = useState<string | undefined>("");
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [showImageEditor, setShowImageEditor] = useState<boolean>(false);
  const [pageDisplayText, setPageDisplayText] = useState<string>(text);

  return (
    <div className="mt-8">
      <div className="flex flex-row">
        <div className="flex flex-row rounded-xl overflow-hidden">
          <div className="w-64 h-64 bg-white overflow-hidden flex justify-center items-center">
            {predictionId ? ( // Default values shown
              <div></div>
            ) : (
              // <l-grid size="60" speed="1.5" color="black"></l-grid>

              <img className="" src={imgUrl} />
            )}
          </div>
          <div
            className={[
              "w-64 h-64 py-8 px-4 bg-white text-2xl",
              storySerif.className,
            ].join(" ")}
            contentEditable
          >
            {pageDisplayText}
          </div>
        </div>
      </div>

      <div>
        <div className="w-64 my-2 rounded-xl p-2 bg-yellow-200">
          <textarea
            className="w-full p-1 rounded-md"
            placeholder="Image prompt"
            onChange={(e) => {
              setUserPrompt(e.target.value);
            }}
          />
          <button
            className="underline"
            onClick={async () => {
              setPredictionId(undefined);
              let generateResponse = await generateImage({
                userPrompt: userPrompt,
              });

              let predictionId = generateResponse.predictionId;
              setPredictionId(predictionId);

              // Check every 5 seconds if the image is ready.
              let interval = setInterval(async () => {
                let getImgResponse = await getImg({
                  predictionId: predictionId,
                });
                if (
                  getImgResponse.predictionStatus === "succeeded" ||
                  getImgResponse.predictionStatus === "failed"
                ) {
                  setImgUrl(getImgResponse.imgUrl);
                  setPredictionId(undefined);
                  clearInterval(interval);
                }
              }, 5000);
            }}
          >
            Recreate Image
          </button>{" "}
          <br />
        </div>
      </div>
    </div>
  );
}
