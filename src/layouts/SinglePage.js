import React from "react";
import { Link } from "react-router-dom";
const SinglePage = (props) => {
  const { children, pageTitle, backLink } = props;
  return (
    <>
      <header className="single-page-header px-4">
        <div>{pageTitle}</div>
        <div>
          <Link className="btn btn-primary" to={backLink}>
            x
          </Link>
        </div>
      </header>
      <section className="app-content">{children}</section>
    </>
  );
};

export default SinglePage;
