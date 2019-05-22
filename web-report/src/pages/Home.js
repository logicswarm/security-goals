/** @jsx jsx */
import { jsx, css } from "@emotion/core";

import React from "react";

import "./Home.css";

const red = css`
  color: #ff0000;
`;

class Home extends React.Component {
  render() {
    return (
      <div className="Home">
        <div className="Home-header">
          <h2 css={red}>Welcome to Razzles</h2>
        </div>
      </div>
    );
  }
}

export default Home;
