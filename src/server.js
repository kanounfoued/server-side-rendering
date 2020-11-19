import express from "express";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducers from "./reducers";
import { StaticRouter } from "react-router";

import Html from "./components/Html";
import App from "./components/App";

const app = express();

app.use(express.static(path.join(__dirname)));

app.get("*", async (req, res) => {
  const scripts = ["vendor.js", "client.js"];

  const initialState = { initialText: "rendered on the server" };

  const store = createStore(reducers, initialState);

  let metas = [];
  if (req.url.includes("about")) {
    metas.push(<meta property="og:title" content="About page"></meta>);
    metas.push(
      <meta
        property="og:description"
        content="this is about page that describe what our company does."
      ></meta>
    );
    metas.push(
      <meta
        property="og:image"
        content={`${__dirname}/../assets/LD.png`}
      ></meta>
    );
    metas.push(<meta property="og:url" content={req.url}></meta>);
  } else {
    metas.push(<meta property="og:title" content="Home page"></meta>);
    metas.push(
      <meta
        property="og:description"
        content="this is home page that describe what our company sells."
      ></meta>
    );
    metas.push(
      <meta
        property="og:image"
        content={`${__dirname}/../assets/LDRedDot.png`}
      ></meta>
    );
    metas.push(<meta property="og:url" content={req.url}></meta>);
  }

  const appMarkup = ReactDOMServer.renderToString();
  const html = ReactDOMServer.renderToStaticMarkup(
    <Html
      children={appMarkup}
      scripts={scripts}
      initialState={initialState}
      metas={metas}
    />
  );

  res.send(`<!doctype html>${html}`);
});

app.listen(3000, () => console.log("Listening on localhost:3000"));
