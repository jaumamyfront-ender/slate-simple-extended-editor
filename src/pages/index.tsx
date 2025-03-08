"use client";
import dynamic from "next/dynamic";
import { SlateEditorProps } from "../components/extendedTextarea/extendedTextEditor";
import React, { useEffect, useState } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
interface LengthHintProps {
  maxLength?: number;
  valueLength: number;
}
interface FieldTooltipErrorProps {
  error?: any;
  className?: string;
  isAbsolute?: boolean;
  minLength?: number;
  maxLength?: number;
}
export interface Error {
  message: string;
  type: "maxLength" | "minLength" | "dontUseLinksinDescription";
}
interface ValidationResult {
  length: number;
  error: Error | undefined;
}
const incommingdata =
  "<h2><u><em><strong>Simple version of Slate.js Rich Text Editor lib</strong></em></u></h2>\n<h2><u><em><strong>just use without pain!;-)</strong></em></u></h2>\n<p><u><em>A streamlined, TypeScript-friendly implementation of Slate.js editor with practical solutions to common issues and undocumented features for Next js latest version</em></u></p>\n<p><strong>This version prioritizes stability and ease of use over complex features, making it ideal for projects that need reliable rich text editing without the complexity of the full Slate.js ecosystem.</strong></p>\n<p>Key Features and Improvements:</p>\n<p><em>- 1.added function that allows you click on button like switches and esy to customize them,just import you image version of button and that it!</em></p>\n<p><em>- 2.fix many typescript undocumented problems with typescript in next js</em></p>\n<p><em>- 3.add missed serealization and deserealization(put data into editor and get edited data from editor):</em></p>\n<p><em>  3.1 just put simple text or html and get converted automaticly all values inputs</em></p>\n<p><strong>note:</strong></p>\n<p><em>Customization</em></p>\n<ol><li><em>For additional features or modifications, refer to the official Slate.js documentation. This implementation focuses on common use cases while maintaining extensibility for specific needs.</em></li>\n<li><em><strong>note</strong></em><em>:original lib/repo/author =>(all origin docs)https://docs.slatejs.org (orogin author and repo)https://github.com/ianstormtaylor/slate</em></li>\n</ol>\n<ul><li><em>note:if you dont need some extra feature or customization or you wanna use it like code (not instaalnig lib) than go to my git =></em></li>\n</ul>\n";
const productsData = [
  { id: 1, name: "Apple", description: "Fresh and juicy apple" },
  { id: 2, name: "Banana", description: "Ripe and sweet banana" },
  { id: 3, name: "Orange", description: "Juicy citrus orange" },
  { id: 4, name: "Marshmallow", description: "Soft and fluffy marshmallow" },
  { id: 5, name: "Slate Editor E", description: incommingdata },
];

const SlateSimpleEditor = dynamic(
  () => import("../components/extendedTextarea/extendedTextEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[200px] bg-[rgb(72,76,82)] border border-gray-600 rounded-lg flex items-center justify-center flex-col self-center" />
    ),
  }
);
const a = (value: any) => {
  console.log("exportedData", value);
};

const SlateSimpleEditorWrapper: React.FC<SlateEditorProps> = () => {
  const methods = useForm({
    defaultValues: {
      selectedProduct: "",
      products: productsData,
    },
  });
  const { watch, setValue } = methods;
  const [selectedProductIndex, setSelectedProductIndex] = useState(-1);
  const ProductSelect = ({ setSelectedIndex }: any) => {
    const { watch, setValue } = useFormContext();
    const selectedProductId = watch("selectedProduct");

    return (
      <div className="space-y-4 flex flex-col p-4 border rounded-md mb-6">
        <strong className="">
          exmaple-new products/description from api or new from user{" "}
        </strong>
        <select
          className="border rounded-md p-2bg-white text-black text-right "
          value={selectedProductId}
          onChange={(e) => {
            setValue("selectedProduct", e.target.value);
            setSelectedIndex(
              productsData.findIndex((p) => p.id.toString() === e.target.value)
            );
            setDecscription(e.target.value);
          }}
        >
          <option value="" className="text-gray-700 bg-gray-100 self-end">
            🔽 Change The Product
          </option>
          {productsData.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const description =
    watch(`products.${selectedProductIndex}.description`) || "";
  console.log("setted description after editor", description);

  function parseDescription(value: any) {
    try {
      const parsedForUI = JSON.parse(value);
      return parsedForUI;
    } catch (error) {
      return value;
    }
  }

  const parseIncommingForEditor = JSON.stringify(parseDescription(description));
  const parsedForUI = parseDescription(description);

  const setDecscription = (data: any) => {
    const convertedToStringAllData = JSON.stringify(data);
    setValue(
      `products.${selectedProductIndex}.description`,
      convertedToStringAllData
    );
    return;
  };

  //=======================================================================================
  //validation
  const [length, setlength] = useState<any>();
  const [error, setError] = useState<any>();
  const takeValidationResult = (value: ValidationResult) => {
    setlength(value.length);
    setError(value.error);
    console.log("valueresultvalidation", value);
  };
  console.log(error);

  const LengthHint: React.FC<LengthHintProps> = ({
    maxLength,
    valueLength,
  }) => {
    if (!maxLength) return null;

    return (
      <span className="absolute bottom-100 top-[450px] right-[290px] text-gray-200 text-2xs">
        {`${valueLength}/${maxLength}`}
      </span>
    );
  };
  //validation
  //=======================================================================================

  //example filter color
  const activeFilterBlue =
    "invert(23%) sepia(94%) saturate(1740%) hue-rotate(200deg) brightness(90%) contrast(85%)";
  const activeFilterGreen =
    "invert(31%) sepia(92%) saturate(666%) hue-rotate(100deg)";
  //example filter color

  return (
    <FormProvider {...methods}>
      <div className="flex items-center content-center flex-col bg-gray-400 justify-between min-h-[500px] w-[100%]  ">
        <ProductSelect setSelectedIndex={setSelectedProductIndex} />

        <div className="flex items-center justify-center pt-10 bg-slate-300 flex-col w-[100%]">
          <div className="flex items-center flex-col bg-gray-500 p-3 rounded-xl min-w-[50%] max-w-[40%]">
            <SlateSimpleEditor
              incomingData={parseIncommingForEditor}
              outgoingData={(data) => {
                console.log("(outgoingData)Saving:", data);
                setDecscription(data);
              }}
              staticImages={{
                staticIcons: {
                  bold: "/customIcons/white/bold.svg",
                  center: "/customIcons/white/center.svg",
                  dots: "/customIcons/white/dots.svg",
                  h1: "/customIcons/white/h1.svg",
                  h2: "/customIcons/white/h2.svg",
                  italic: "/customIcons/white/italic.svg",
                  left: "/customIcons/white/left.svg",
                  numbers: "/customIcons/white/numbers.svg",
                  right: "/customIcons/white/right.svg",
                  underline: "/customIcons/white/underline.svg",
                },
              }}
              colorOnClick={activeFilterBlue}
              onValidate={(value) => takeValidationResult(value)}
              enableValidation
              checkUrls
              minLength={5}
              maxLength={100}
              childrenLengthHint={
                <LengthHint maxLength={1000} valueLength={length} />
              }
              childrenErrorHint={<ErrorHint error={error} />}
            />
          </div>
          <p className="pt-12 text-black">
            see broweser console to see incomming data and exported ready to
            send from editor{" "}
          </p>
        </div>
        <div className="p-4 border rounded-md  flex flex-col mt-6">
          <strong>
            Description / how generated html text looks on other side of page :
          </strong>{" "}
          <strong>
            {" "}
            Note: don't forget to add default styles to ul/ol/li el because next
            js nullifies these default html styles.See example in globals.css!
          </strong>
          {true &&
            (() => {
              if (parsedForUI) {
                const containsHTML = /<\/?[a-z][\s\S]*>/i.test(parsedForUI);
                let cleanedHtml = parsedForUI
                  ?.replace(/^"(.*)"$/, "$1")
                  .replace(/\\r\\n/g, "\n")
                  .replace(/\\n/g, "\n")
                  .replace(/\\n/g, "\n")
                  .replace(/^"(.*)"$/, "$1")
                  .replace(/\\r\\n/g, "\n")
                  .replace(/\\n/g, "\n")
                  .replace(/\\"/g, '"')
                  .trim();

                return containsHTML ? (
                  <span dangerouslySetInnerHTML={{ __html: cleanedHtml }} />
                ) : (
                  <span>{parsedForUI}</span>
                );
              }
            })()}
        </div>
      </div>
    </FormProvider>
  );
};
export default SlateSimpleEditorWrapper;
const ErrorHint = ({ error, className }: FieldTooltipErrorProps) => {
  if (!error) return null;

  return (
    <div className="flex flex-row items-center absolute top-[450px] right-120 ">
      <FontAwesomeIcon icon={faCircleExclamation} className={className} />
      <div className="flex ml-2">
        <div className="flex ml-1">{error.message}</div>
      </div>
    </div>
  );
};
