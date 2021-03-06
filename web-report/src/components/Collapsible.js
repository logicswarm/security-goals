/** @jsx jsx */
import React from "react";
import { jsx, css } from "@emotion/core";
import { theme, mediaQuery } from "../components/styles";
import { UpArrowCircle } from "../components/icons/UpArrowCircle";
import { MainDescription } from "./";
import { I18N } from "../components";

const collapse = css`
  display: none;
`;

const collapseIn = css`
  display: block;
`;

const arrowUp = css`
  svg {
    margin-bottom: -${theme.spacing.xxs};
    width: 1rem;
    height: 1rem;
    transform: rotate(180deg);
  }
`;

const arrowDown = css`
  svg {
    margin-bottom: -${theme.spacing.xxs};
    width: 1rem;
    height: 1rem;
  }
`;

const toggleContainer = css`
  cursor: pointer;
`;

const container = css`
  border: 1px solid ${theme.colour.grayOutline};
  background: ${theme.colour.white};
  padding: ${theme.spacing.lg};
  line-height: 1.6rem;
  h2[name="collapsible-h2"] {
    margin-top: 0;
    color: ${theme.colour.blackLight};
    margin-bottom: ${theme.spacing.md};
    width: 100%;
    font-size: ${theme.font.xl};
  }

  ${mediaQuery.sm(css`
    h2[name="collapsible-h2"] {
      font-size: ${theme.font.lg};
    }
  `)};
`;

const toggle = css`
  p {
    font-size: ${theme.font.md};
    margin: 0;
    margin-right: 10px;
    font-weight: 700;
    color: ${theme.colour.blackLight};
  }
  display: inline-flex;

  ${mediaQuery.sm(css`
    p {
      font-size: ${theme.font.sm};
      position: relative;
      top: 0.1rem;
    }
  `)}
`;

export class Collapsible extends React.Component {
  constructor() {
    super();

    // Initial state
    this.toggle = this.toggle.bind(this);
    this.keyHandler = this.keyHandler.bind(this);
    this.state = { open: false };
  }

  toggle() {
    this.setState({
      open: !this.state.open
    });
  }

  keyHandler(event) {
    if (event.key === "Enter") {
      this.setState({
        open: !this.state.open
      });

      setTimeout(function() {
        document.getElementById("main-description").focus();
      }, 100);
    }
  }

  render() {
    const { title, description = [], control } = this.props;
    var newDescription;

    if (description.length === 0) {
      newDescription =
        "The description seems to be missing. Sorry for the inconvenience, please try back at a later time if you are still looking for more information on the control in question.";
    }

    return (
      <div>
        <div css={container}>
          <div css={toggleContainer}>
            <h2 data-testid="collapsible-h2" name="collapsible-h2">
              {title}
            </h2>
            <div css={this.state.open ? collapseIn : collapse}>
              {description.length === 0 ? (
                <MainDescription
                  key="collapsible"
                  description={newDescription}
                />
              ) : null}

              {description.map(description => {
                return (
                  <MainDescription
                    key="collapsible"
                    description={description.description}
                  />
                );
              })}
            </div>

            {this.state.open ? (
              <div
                data-testid="toggle-hide"
                css={toggle}
                tabIndex="0"
                onKeyDown={this.keyHandler}
                onClick={this.toggle}
                aria-label={`The description for verification ${title} is expanded. Click or press 'Enter' to collapse the description`}
              >
                <p>
                  <I18N t="hide-the" /> {control} <I18N t="description" />
                </p>
                <span css={arrowDown}>
                  <UpArrowCircle />
                </span>
              </div>
            ) : (
              <div
                data-testid="toggle-read"
                css={toggle}
                tabIndex="0"
                onKeyDown={this.keyHandler}
                onClick={this.toggle}
                aria-label={`Verification ${title}. The description for this verification is collapsed. Click or press 'Enter' to expand the description`}
              >
                <p>
                  <I18N t="read-the" /> {control} <I18N t="description" />
                </p>
                <span css={arrowUp}>
                  <UpArrowCircle />
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
