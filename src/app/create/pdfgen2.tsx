"use client";
import { StoryPage } from "../common/contracts";
import React from "react";
import {
  Page,
  Text,
  View,
  Image,
  Document,
  StyleSheet,
  Font,
  PDFDownloadLink,
} from "@react-pdf/renderer";

Font.register({
  family: "Playfair Display",
  src: "/PlayfairDisplay-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    fontFamily: "Playfair Display",
    fontSize: 96,
  },
  section: {
    marginVertical: 80,
    marginHorizontal: 32,
    padding: 20,
  },
});

function StoryPageDocument(storyPages: StoryPage[]) {
  return (
    <Document>
      {storyPages.map((storyPage, idx) => (
        <>
          <Page size={[1000, 1000]} style={styles.page}>
            <View>
              <Image src={storyPage.imgUrl} />
            </View>
          </Page>
          <Page size={[1000, 1000]} style={styles.page}>
            <View style={styles.section}>
              <Text>{storyPage.text}</Text>
            </View>
          </Page>
        </>
      ))}
    </Document>
  );
}

export function PdfDownloadButton(storyPages: StoryPage[]) {
  console.log("storypages: ", storyPages);
  return (
    <PDFDownloadLink
      document={StoryPageDocument(storyPages)}
      fileName="StoryTime.pdf"
    >
      Save to PDF
    </PDFDownloadLink>
  );
}
