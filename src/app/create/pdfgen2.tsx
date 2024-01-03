"use client";
import { StoryPage } from "../common/contracts";
import React from "react";

import ReactPDF, {
  Page,
  Text,
  View,
  Image,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {},
  section: {
    margin: 10,
    padding: 10,
  },
});

function StoryPageDocument(storyPages: StoryPage[]) {
  return (
    <Document>
      {storyPages.map((storyPage, idx) => (
        <>
          <Page size={[1000, 1000]} style={styles.page}>
            <View style={styles.section}>
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
      fileName="somename.pdf"
    >
      Save to PDF.
    </PDFDownloadLink>
  );
}
