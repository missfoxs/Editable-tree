import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import data from "./data/index";
import EditableTree from "./editable-tree";
import "antd/dist/antd.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="App">
      <EditableTree
        canEdit
        treeData={data}
        fieldNames={{
          key: "productCatagoryId",
          title: "name",
          children: "subs",
        }}
      />
    </div>
  </React.StrictMode>
);
