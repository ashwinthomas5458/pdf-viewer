import React from "react";


const updateHash = (highlight) => {
  document.location.hash = `highlight-${highlight.id}`;
};

export function Sidebar({
  highlights,
  toggleDocument,
  resetHighlights,
  selectedHighlight,
  setSelectedHighlight
}) {
  return (
    <div className="e-sidebar d-flex position-fixed">
      <div className="e-annotations-wrapper">
        <div className="e-annotations-container d-flex flex-column">
          <div className="py-4 e-annotations-heading">
            <h3 className="mb-0 text-center">Annotations</h3>
          </div>
          {
            highlights&&highlights.length?
            <>
            {highlights.map((highlight, index) => (
              <div className={highlight.id===selectedHighlight?"e-annotation-active w-100 p-3 e-annotation text-truncate": "w-100 p-3 e-annotation text-truncate"} key={index} onClick={() => {
                updateHash(highlight);
                setSelectedHighlight(highlight.id);
              }}> 
              <h4>{highlight.comment.text? highlight.comment.text: `Annotation-${index+1}`}</h4>
              {highlight.content.text ?
              <p className="mb-0 text-truncate w-100">{highlight.content.text}</p>: null
              }
              <span className="e-page-number fw-bold d-flex w-100 justify-content-end">Page {highlight.position.pageNumber}</span>
            </div>
          ))}
            </>
            :
            <div className="text-center py-5">
              <span className="e-page-number fw-bold">No annotations found.</span>
            </div>
          }
          
          {/* <ul className="sidebar__highlights">
          {highlights.map((highlight, index) => (
            <li
              key={index}
              className="sidebar__highlight"
              onClick={() => {
                updateHash(highlight);
              }}
            >
              <div>
                <strong>{highlight.comment.text}</strong>
                {highlight.content.text ? (
                  <blockquote style={{ marginTop: "0.5rem" }}>
                    {`${highlight.content.text.slice(0, 90).trim()}…`}
                  </blockquote>
                ) : null}
                {highlight.content.image ? (
                  <div
                    className="highlight__image"
                    style={{ marginTop: "0.5rem" }}
                  >
                    <img src={highlight.content.image} alt={"Screenshot"} />
                  </div>
                ) : null}
              </div>
              <div className="highlight__location">
                Page {highlight.position.pageNumber}
              </div>
            </li>
          ))}
        </ul> */}
        </div>
      </div>
    </div>
  );
}
