import React, { Component } from "react";

import {
  PdfLoader,
  PdfHighlighter,
  Tip,
  Highlight,
  Popup,
  AreaHighlight
} from "react-pdf-highlighter";
import { Sidebar } from "./Sidebar";

// import { Spinner } from "./Spinner";
// import { Sidebar } from "./Sidebar";

// import "./style/App.css";


const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
}

const HighlightPopup = (comment) =>
  comment.text ? (
  <div className="Highlight__popup">
      {comment.emoji} {comment.text}
    </div>) : null;

const PRIMARY_PDF_URL = "https://arxiv.org/pdf/1708.08021.pdf";
const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480.pdf";

const searchParams = new URLSearchParams(document.location.search);

const initialUrl = searchParams.get("url") || PRIMARY_PDF_URL;

class Test extends Component{
  state = {
    url: initialUrl,
    highlights: [],
    selectedHighlight:"",
    width: 50
  };

  resetHighlights = () => {
    this.setState({
      highlights: [],
    });
  };

  toggleDocument = () => {
    const newUrl =
      this.state.url === PRIMARY_PDF_URL ? SECONDARY_PDF_URL : PRIMARY_PDF_URL;

    this.setState({
      url: newUrl,
      highlights: [],
    });
  };

  zoom(type){
    let width = this.state.width
    if(type===-1 && width> 25){
      width = width-25;
    }
    else if(type===1 && width<75){
      width = width+25;
    }
    this.setState({width});
  }

  scrollViewerTo = (highlight) => {};

  scrollToHighlightFromHash = () => {
    const highlight = this.getHighlightById(parseIdFromHash());

    if (highlight) {
      this.scrollViewerTo(highlight);
    }
  };

  componentDidMount() {
    window.addEventListener(
      "hashchange",
      this.scrollToHighlightFromHash,
      false
    );
  }

  getHighlightById(id) {
    const { highlights } = this.state;

    return highlights.find((highlight) => highlight.id === id);
  }

  addHighlight(highlight) {
    const { highlights } = this.state;

    console.log("Saving highlight", highlight);

    this.setState({
      highlights: [{ ...highlight, id: getNextId() }, ...highlights],
    });
  }

  updateHighlight(highlightId, position, content) {
    console.log("Updating highlight", highlightId, position, content);

    this.setState({
      highlights: this.state.highlights.map((h) => {
        const {
          id,
          position: originalPosition,
          content: originalContent,
          ...rest
        } = h;
        return id === highlightId
          ? {
              id,
              position: { ...originalPosition, ...position },
              content: { ...originalContent, ...content },
              ...rest,
            }
          : h;
      }),
    });
  }

  render() {
    const { url, highlights } = this.state;

    return (
      <>
      <div className="Test">
        <Sidebar
          highlights={highlights}
          resetHighlights={this.resetHighlights}
          toggleDocument={this.toggleDocument}
          selectedHighlight={this.state.selectedHighlight}
          setSelectedHighlight={id=>this.setState({selectedHighlight: id})}
        />
        <div
          style={{
            height: "100vh",
            width: `${this.state.width}vw`,
            position: "relative",
          }}
        >
          <PdfLoader url={url} beforeLoad={"Loading."}>
            {(pdfDocument) => (
              <PdfHighlighter
                pdfDocument={pdfDocument}
                enableAreaSelection={(event) => event.altKey}
                onScrollChange={resetHash}
                pdfScaleValue="page-width"
                scrollRef={(scrollTo) => {
                  this.scrollViewerTo = scrollTo;

                  this.scrollToHighlightFromHash();
                }}
                onSelectionFinished={(
                  position,
                  content,
                  hideTipAndSelection,
                  transformSelection
                ) => (
                  <Tip
                    onOpen={transformSelection}
                    onConfirm={(comment) => {
                      this.addHighlight({ content, position, comment });

                      hideTipAndSelection();
                    }}
                  />
                )}
                highlightTransform={(
                  highlight,
                  index,
                  setTip,
                  hideTip,
                  viewportToScaled,
                  screenshot,
                  isScrolledTo
                ) => {
                  const isTextHighlight = !Boolean(
                    highlight.content && highlight.content.image
                  );

                  const component = isTextHighlight ? (
                    <Highlight
                      isScrolledTo={isScrolledTo}
                      position={highlight.position}
                      comment={highlight.comment}
                      onClick={()=>this.setState({selectedHighlight: highlight.id})}
                    />
                  ) : (
                    <AreaHighlight
                      isScrolledTo={isScrolledTo}
                      highlight={highlight}
                      onChange={(boundingRect) => {
                        this.updateHighlight(
                          highlight.id,
                          { boundingRect: viewportToScaled(boundingRect) },
                          { image: screenshot(boundingRect) }
                        );
                      }}
                    />
                  );

                  return (
                    <Popup
                      popupContent={<HighlightPopup {...highlight} />}
                      onMouseOver={(popupContent) =>
                        setTip(highlight, (highlight) => popupContent)
                      }
                      onMouseOut={hideTip}
                      key={index}
                      children={component}
                    />
                  );
                }}
                highlights={highlights}
              />
            )}
          </PdfLoader>
        </div>
      </div>
      <div className="e-zoom-container position-fixed d-flex justify-content-center">
        <div className="e-zoom-controls d-flex">
          <div className="e-zoom-button p-4" onClick={()=>this.zoom(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.577 20L10.81 14.234C8.65382 15.6564 5.77101 15.2164 4.13733 13.2156C2.50364 11.2147 2.64909 8.30214 4.474 6.474C6.30181 4.6484 9.21471 4.50231 11.216 6.13589C13.2173 7.76946 13.6575 10.6526 12.235 12.809L18 18.576L16.577 20ZM8.034 7.014C6.59325 7.01309 5.35248 8.03002 5.07049 9.44291C4.78849 10.8558 5.54381 12.2711 6.87453 12.8234C8.20524 13.3756 9.74074 12.9109 10.542 11.7135C11.3432 10.5161 11.1871 8.91947 10.169 7.9C9.60425 7.33135 8.83544 7.0123 8.034 7.014ZM21 9H15V7H21V9Z" fill="#2E3A59"/>
          </svg>
          </div>
          <div className="e-border"></div>
          <div className="e-zoom-button p-4" onClick={()=>this.zoom(1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.577 20L10.81 14.234C8.65382 15.6564 5.77101 15.2164 4.13733 13.2155C2.50364 11.2147 2.64909 8.30213 4.474 6.474C6.30181 4.64839 9.21471 4.50231 11.216 6.13588C13.2173 7.76946 13.6575 10.6526 12.235 12.809L18 18.576L16.577 20ZM8.034 7.01399C6.59325 7.01308 5.35248 8.03002 5.07049 9.4429C4.78849 10.8558 5.54381 12.2711 6.87453 12.8234C8.20524 13.3756 9.74074 12.9109 10.542 11.7135C11.3432 10.5161 11.1871 8.91946 10.169 7.9C9.60425 7.33134 8.83544 7.0123 8.034 7.01399ZM19 11H17V9H15V7H17V5H19V7H21V9H19V11Z" fill="#2E3A59"/>
            </svg>
          </div>
        </div>
      </div>
      </>
    );
  }
}

export default Test;
