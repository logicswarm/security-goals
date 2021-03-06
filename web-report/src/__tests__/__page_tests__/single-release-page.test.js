import React from "react";
import { cleanup, render, wait } from "@testing-library/react";
import "jest-dom/extend-expect";
import { data } from "../../__mocks__/mockDataSingleRelease.js";
import { controlStatus } from "../../../api/index";
import { MemoryRouter } from 'react-router-dom';

jest.mock("../../../api/index", () => ({
  controlStatus: jest.fn()
}));

jest.mock("../../../src/config", () => ({
  runtimeConfig: {github_repo: "cra-alpha", relative_path: "", pdf_report_url: "https://foo/"}
}));

const ReleasePage = require("../../pages/ReleasePage").default;

afterEach(cleanup); // <-- add this

test("Renders Single Release Page with status bar and control boxes (w/ data)", async () => {
  controlStatus.mockReturnValue(data)

  const { getByTestId, getAllByTestId } = render(
    <MemoryRouter>
      <ReleasePage data={data} releaseParam="abcd-1546522884800" match={{params: {releaseId: "abcd-1546522884800"}}} />
     </MemoryRouter>
  );
  await wait(() => {
  const controlBoxes = getAllByTestId("control-box");
  const controlBoxTitles = getAllByTestId("control-box-title");
  const controlBoxTimestamps = getAllByTestId("control-box-timestamp");

  expect(getByTestId("main-header-h1")).toHaveTextContent(
    "Are we meeting our security goals?"
  );
  
  expect(getByTestId("print-message")).toHaveTextContent(
    "Print this page (PDF)"
  );
  expect(getByTestId("print-link")).toHaveAttribute(
    "href",
    "https://foo/abcd-1546522884800"
  );
  
  expect(getByTestId("release-button")).toHaveAttribute(
    "href",
    "https://github.com/cra-alpha/commit/abcd"
  );

  expect(getByTestId("cds-logo")).toHaveAttribute(
    "id",
    "CDS Logo White Outline"
  );

  expect(getByTestId("status-text")).toHaveTextContent(
    "Some checks have failed"
  );
  expect(getByTestId("total")).toHaveTextContent("22 of 28 passing");

  expect(getByTestId("control-list"));
  expect(controlBoxes).toHaveLength(29);

  expect(controlBoxTitles).toHaveLength(29);
  expect(controlBoxTitles[0]).toHaveTextContent("AU-6");

  expect(controlBoxTimestamps).toHaveLength(29);

  expect(getByTestId("back-to-top")).toHaveTextContent("Back To Top of Page");
  expect(getByTestId("back-to-top")).toHaveAttribute(
    "aria-label",
    "click or press 'Enter' on this link to navigate to the top of the page"
  );
  })  
});
