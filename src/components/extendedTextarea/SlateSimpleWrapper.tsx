import dynamic from "next/dynamic";
import React from "react";
import { SlateEditorProps } from "./extendedTextEditor";

const SlateSimpleEditor = dynamic(() => import("./extendedTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[200px] bg-[rgb(72,76,82)] border border-gray-600 rounded-lg" />
  ),
});

const SlateSimpleEditorWrapper: React.FC<SlateEditorProps> = (props) => {
  return <SlateSimpleEditor {...props} />;
};

export default SlateSimpleEditorWrapper;
