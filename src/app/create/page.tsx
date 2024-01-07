"use client";
import { useState } from "react";
import { generateImage, getImg } from "../common/client-network";
import { Playfair_Display } from "next/font/google";
import { StoryPage } from "../common/contracts";
import { PdfDownloadButton } from "./pdfgen2";
import {
  ArrowClockwise,
  FileArrowDown,
  PlusSquare,
} from "@phosphor-icons/react";

const storySerif = Playfair_Display({ subsets: ["latin"] });

// grid.register();

const defaultImageUrl = "/img/steamboat-willie.jpg";
export default function Create() {
  const [storyPages, setStoryPages] = useState<StoryPage[]>([
    {
      imgUrl: defaultImageUrl,
      text: "Once upon a time...",
    },
  ]);
  return (
    <div className="flex justify-center">
      <div>
        <div>
          {storyPages.map((storyPage, idx) => (
            <StoryPageComponent
              storyPage={storyPage}
              onImgChange={(newImgUrl: string) => {
                let newStoryPages = [...storyPages];
                newStoryPages[idx].imgUrl = newImgUrl;
                setStoryPages(newStoryPages);
              }}
              onTextChange={(newText: string) => {
                let newStoryPages = [...storyPages];
                newStoryPages[idx].text = newText;
                setStoryPages(newStoryPages);
              }}
              key={"storypage-" + idx}
            />
          ))}
        </div>
        <div className="mt-16 mb-8 flex justify-end">
          <button
            className="px-4 py-2 mx-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-xl flex items-center"
            onClick={() => {
              setStoryPages([
                ...storyPages,
                {
                  imgUrl: defaultImageUrl,
                  text: "",
                },
              ]);
            }}
          >
            <PlusSquare size={32} className="inline mr-1" />
            Add New Page
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded-xl flex items-center">
            <FileArrowDown size={32} className="inline mr-1" />
            {PdfDownloadButton(storyPages)}
          </button>
        </div>
      </div>
    </div>
  );
}

function StoryPageComponent(props: {
  storyPage: StoryPage;
  onImgChange: (newImgUrl: string) => void;
  onTextChange: (newText: string) => void;
}) {
  const [imgUrl, setImgUrl] = useState<string>(props.storyPage.imgUrl);
  const [predictionId, setPredictionId] = useState<string | undefined>("");
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [showImageEditor, setShowImageEditor] = useState<boolean>(false);
  const [pageDisplayText, setPageDisplayText] = useState<string>(
    props.storyPage.text
  );

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
            className="w-full p-1 rounded-md text-sm"
            placeholder={`eg: a mouse steering a steamboat`}
            onChange={(e) => {
              setUserPrompt(e.target.value);
              props.onTextChange(e.target.value);
            }}
          />
          <div className="flex justify-end">
            <button
              className="px-2 py-1 bg-yellow-400 hover:bg-yellow-500 rounded-lg "
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
                    props.onImgChange(getImgResponse.imgUrl);
                    setPredictionId(undefined);
                    clearInterval(interval);
                  }
                }, 1500);
              }}
            >
              <ArrowClockwise size={20} className="inline" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
