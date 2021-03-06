import React from "react";
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { cleanup, render, wait} from "@testing-library/react";
import { data } from "../../__mocks__/mockDataIndex.js";
import "jest-dom/extend-expect";
import { releaseStatus, minMaxDates } from "../../../api/index";
import { MemoryRouter } from 'react-router-dom';

jest.mock("../../../api/index", () => ({
  releaseStatus: jest.fn(),
  minMaxDates: function() {
    return {releasesMinMax: {
    min: 0,
    max: 0
    }}
  }
}));

jest.mock("../../../src/config", () => ({
  runtimeConfig: {relative_path: "", pdf_report_url: "https://foo"}
}));

const ReleasesPage = require("../../pages/HomePage").default;

afterEach(cleanup); // <-- add this

test("Renders ReleasesPage Boxes (w/ Data)", async () => {
  releaseStatus.mockReturnValue(data)

  const { getByTestId, getAllByTestId } = render(<MemoryRouter><ReleasesPage data={data} /></MemoryRouter>);
  
  await wait(() => {
    const releaseLinks = getAllByTestId("release-box-link");
    expect(getByTestId("main-header-h1")).toHaveTextContent(
      "Are we meeting our security goals?"
    );

    expect(getByTestId("print-message")).toHaveTextContent(
      "Print this page (PDF)"
    );

    expect(getByTestId("print-link")).toHaveAttribute("href", "https://foo");

    expect(getByTestId("cds-logo")).toHaveAttribute(
      "id",
      "CDS Logo White Outline"
    );

    expect(getByTestId("index-h1")).toHaveTextContent("Latest Releases:");
    expect(getByTestId("release-list"));
    expect(releaseLinks).toHaveLength(4);

    expect(getByTestId("back-to-top")).toHaveTextContent("Back To Top of Page");
    expect(getByTestId("back-to-top")).toHaveAttribute(
      "aria-label",
      "click or press 'Enter' on this link to navigate to the top of the page"
    );
  });
});
