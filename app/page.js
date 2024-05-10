"use client";

import React, { useState } from "react";
import Link from "next/link";

const CSV_HEADERS = {
  components: [
    "Pack name",
    "Pack ID",
    "Component name",
    "Component ID",
    "Component DSL",
  ],
  ui: ["Pack name", "Pack ID", "Element name", "Element ID", "Element DSL"],
};

const downloadCSV = (filename, headers, dataArray) => {
  const csvContent = [
    headers,
    ...dataArray.map((item) => headers.map((key) => item[key])),
  ];
  const csvRows = csvContent.map((row) => row.join(","));
  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export default function Home() {
  const [data, setData] = useState();
  const [dataArray, setDataArray] = useState([]);
  const [type, setType] = useState("ui");

  const validateData = () => {
    try {
      const reqData = type === "components" ? data.componentsList : data.data;
      const mapData = reqData.map((each) => ({
        packname: each.component_pack_name || each.cp_name,
        packId: each.component_pack_id || each.cp_id,
        componentName: each.component_name || each.name,
        componentId: each.component_id || each.id,
        componentDsl: each.dsl || each.dslImageUrl,
      }));
      setDataArray((prevData) => [...prevData, ...mapData]);
      setData();
    } catch (error) {
      console.error("Error in extracting data:", error);
    }
  };

  const downloadCSVData = () => {
    const filename =
      type === "components" ? "components_data.csv" : "ui_elements_data.csv";
    const headers = CSV_HEADERS[type];
    downloadCSV(filename, headers, dataArray);
  };

  return (
    <div className="flex flex-col w-full min-h-screen justify-start gap-8 items-center bg-gray-900 text-white rounded-md p-4">
      <div>
        <div className="w-full flex mb-2 justify-end">
          <select
            className="bg-gray-600 text-gray-200 px-2 py-1 rounded-md"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
            }}
          >
            <option value="components">Components</option>
            <option value="ui">UI Elements</option>
          </select>
        </div>
        <textarea
          type="text"
          placeholder="Enter the JSON data here"
          value={JSON.stringify(data, null, 2)}
          className="w-[840px] h-[200px] border border-gray-600 p-4 bg-gray-800 text-gray-400 rounded-md"
          onChange={(e) => {
            try {
              const jsonData = JSON.parse(e.target.value);
              setData(jsonData);
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          }}
        />
      </div>
      <div className="flex justify-end gap-4 w-[840px]">
        <button
          className="border p-2 rounded-md hover:bg-white hover:text-gray-600 shadow-md"
          type="button"
          onClick={validateData}
        >
          Extract Data
        </button>
        <button
          className="border p-2 rounded-md hover:bg-red-500 hover: shadow-md"
          type="button"
          onClick={downloadCSVData}
        >
          {type === "components" ? "Download components" : "Download UI"}
        </button>
      </div>

      <div className="border rounded-xl w-[840px] p-4">
        <h1 className="font-bold">
          {type === "components" ? "Component Data" : "UI elements Data"}
        </h1>
        <h2>{`${
          type === "components" ? "Total components" : "Total elements"
        }: ${dataArray.length}`}</h2>
        <ul>
          {dataArray.map((each, index) => (
            <li
              key={index}
              className="border p-2 m-2 rounded-md space-y-2 overflow-hidden"
            >
              <p>
                <strong className="text-red-500">Pack name:</strong>
                {each.packname}
              </p>
              <p>
                <strong className="text-red-500">Pack ID:</strong> {each.packId}
              </p>
              <p>
                <strong className="text-red-500">Name:</strong>
                {each.componentName || each.elementName}
              </p>
              <p>
                <strong className="text-red-500">ID:</strong>
                {each.componentId || each.elementId}
              </p>
              <p>
                <strong className="text-red-500">DSL:</strong>
                <Link
                  target="__blank"
                  href={each.componentDsl || each.dslImage}
                >
                  {each.componentDsl || each.dslImage}
                </Link>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
