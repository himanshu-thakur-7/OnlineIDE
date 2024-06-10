import React from "react";
import { DiJavascript1, DiCss3Full, DiHtml5, DiReact, DiPython, DiGo } from "react-icons/di";
import { VscJson } from "react-icons/vsc";
const FILE_ICONS = {
  js: <DiJavascript1 />,
  css: <DiCss3Full />,
  html: <DiHtml5 />,
  jsx: <DiReact />,
  py: <DiPython />,
  json: <VscJson />,
  go: <DiGo style={{ color: "#FEF9C3" }} />
};

export default FILE_ICONS;
