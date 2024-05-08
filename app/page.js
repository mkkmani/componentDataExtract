"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [data, setData] = useState();
  const [dataArray, setDataArray] = useState([]);
  const [type, setType] = useState("components");

  const validateData = () => {
    try {
      const reqData = data.componentsList.map((each) => each.document);
      const mapData = reqData.map((each) => ({
        packname: each.component_pack_name,
        packId: each.component_pack_id,
        componentName: each.component_name,
        componentId: each.component_id,
        componentDsl: each.dsl,
      }));
      setDataArray([...dataArray, ...mapData]);
      setData();
    } catch (error) {
      console.error("Error in extracting data:", error);
    }
  };

  const validateUiElements = () => {
    try {
      const reqData = data.data.map((each) => each.document);

      const mapData = reqData.data.map((ui) => ({
        packname: ui.cp_name,
        packId: ui.cp_id,
        elementName: ui.name,
        elementId: ui.id,
        dslImage: ui.dslImageUrl,
      }));
    } catch (error) {
      console.log("error in extracting data", error);
    }

    setDataArray([...dataArray, ...mapData]);
  };

  const downloadComponentCSV = () => {
    const headers = [
      "Pack name",
      "Pack ID",
      "Component name",
      "Component ID",
      "Component DSL",
    ];
    const csvContent = [
      headers,
      ...dataArray.map((item) => [
        item.packname,
        item.packId,
        item.componentName,
        item.componentId,
        item.componentDsl,
      ]),
    ];
    const csvRows = csvContent.map((row) => row.join(","));
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "components_data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const downloadUiCSV = () => {
    const headers = [
      "Pack name",
      "Pack ID",
      "Element name",
      "Element ID",
      "Element DSL",
    ];
    const csvContent = [
      headers,
      ...dataArray.map((item) => [
        item.packname,
        item.packId,
        item.elementName,
        item.elementId,
        item.dslImage,
      ]),
    ];
    const csvRows = csvContent.map((row) => row.join(","));
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "components_data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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
          onClick={type === "components" ? downloadComponentCSV : downloadUiCSV}
        >
          {type === "components" ? "Download components" : "Download UI"}
        </button>
      </div>

      <div className="border rounded-xl w-[840px] p-4">
        <h1 className="font-bold">
          {type === "components" ? "Component Data" : "UI elements Data"}
        </h1>
        <h2>{`${type === "components" ? "Total components" : "Total elements"
          }: ${dataArray.length}`}</h2>
        <ul>
          {type === 'components' ?
            dataArray.map((each, index) => (
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
                  <strong className="text-red-500">Component name:</strong>
                  {each.componentName}
                </p>
                <p>
                  <strong className="text-red-500">Component Id:</strong>
                  {each.componentId}
                </p>
                <p>
                  <strong className="text-red-500">DSL:</strong>
                  <Link target="__blank" href={each.componentDsl}>
                    {each.componentDsl}
                  </Link>
                </p>
              </li>
            ))
            :
            dataArray.map((each, index) => (
              <li
                key={index}
                className="border p-2 m-2 rounded-md space-y-2 overflow-hidden"
              >
                <p>
                  <strong className="text-red-500">Pack name:</strong>{" "}
                  {each.packname}
                </p>
                <p>
                  <strong className="text-red-500">Pack ID:</strong> {each.packId}
                </p>
                <p>
                  <strong className="text-red-500">Element name:</strong>{" "}
                  {each.elementName}
                </p>
                <p>
                  <strong className="text-red-500">Element Id:</strong>{" "}
                  {each.elementId}
                </p>
                <p>
                  <strong className="text-red-500">DSL:</strong>{" "}
                  <Link target="__blank" href={each.dslImage}>
                    {each.dslImage}
                  </Link>
                </p>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  );
}
