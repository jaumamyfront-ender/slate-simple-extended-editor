Simple version of Slate.js Rich Text Editor lib
just use without pain!;-)
how it lookas and how to start:
![Demo](./public/visualize.png)
Description:
A streamlined, TypeScript-friendly implementation of Slate.js editor with practical solutions to common issues and undocumented features for Next js latest version
This version prioritizes stability and ease of use over complex features, making it ideal for projects that need reliable rich text editing without the complexity of the full Slate.js ecosystem.
Key Features and Improvements:

- 1.added function that allows you click on button like switches and esy to customize them,just import you image version of button and thats it!
- 2.fix many typescript undocumented problems with typescript in next js
- 3.add missed serealization and deserealization(put data into editor and get edited data from editor):
  3.1 just put simple text or html and get converted automaticly all values inputs=>
  ![Demo](./public/data.png)
- 4.add mobile autohide and autoopen toolbar

  ===============
  note:
  Customization
  note:if you dont need some extra feature or customization or you wanna use it like code (not instaalnig lib) than go to my git and copy or fork repo =>https://github.com/jaumamyfront-ender/slate-simple-editor or copy source from node-modules =>slate-simple-editor=>src folder
  For additional features or modifications, refer to the official Slate.js documentation. This implementation focuses on common use cases while maintaining extensibility for specific needs.
  note:original lib/repo/author =>(all origin docs)https://docs.slatejs.org (orogin author and repo)https://github.com/ianstormtaylor/slate
  How to Fats-Start=>
  1.type in console yarn add slate-simple-editor
  2.when lib is installed then find library in node_modules ,path is=>node-modules=>slate-simple-editor=>public=>then copy folder customIcons to your public folder and then use this sdandart icons or add your own images
  2.then copy this code(dependece which framework you use react or next,see below down code)=>
  // when use React or something else
  //"use client";
  //import React from "react";
  // import SlateSimpleExtendedEditor from "slate/dist/extendedTextEditor";
  // const incommingdata =
  // "<h2><u><em><strong>Simple version of Slate.js Rich Text Editor lib</strong></em></u></h2>\n<h2><u><em><strong>just use without pain!;-)</strong></em></u></h2>\n<p><u><em>A streamlined, TypeScript-friendly implementation of Slate.js editor with practical solutions to common issues and undocumented features for Next js latest version</em></u></p>\n<p><strong>This version prioritizes stability and ease of use over complex features, making it ideal for projects that need reliable rich text editing without the complexity of the full Slate.js ecosystem.</strong></p>\n<p>Key Features and Improvements:</p>\n<p><em>- 1.added function that allows you click on button like switches and esy to customize them,just import you image version of button and that it!</em></p>\n<p><em>- 2.fix many typescript undocumented problems with typescript in next js</em></p>\n<p><em>- 3.add missed serealization and deserealization(put data into editor and get edited data from editor):</em></p>\n<p><em> 3.1 just put simple text or html and get converted automaticly all values inputs</em></p>\n<p><strong>note:</strong></p>\n<p><em>Customization</em></p>\n<ol><li><em>For additional features or modifications, refer to the official Slate.js documentation. This implementation focuses on common use cases while maintaining extensibility for specific needs.</em></li>\n<li><em><strong>note</strong></em><em>:original lib/repo/author =>(all origin docs)https://docs.slatejs.org (orogin author and repo)https://github.com/ianstormtaylor/slate</em></li>\n</ol>\n<ul><li><em>note:if you dont need some extra feature or customization or you wanna use it like code (not instaalnig lib) than go to my git =></em></li>\n</ul>\n";
  // export default function Home() {
  // return (
  // <div className="flex items-center justify-center pt-10 bg-slate-300 flex-col">
  // <div className="flex items-center flex-col bg-gray-500 p-3 rounded-xl min-w-[30%] max-w-[40%]">
  // <SlateSimpleExtendedEditor
  // incomingData={incommingdata}
  // outgoingData={(data) => console.log("(outgoingData)Saving:", data)}
  // />
  // </div>
  // <p className="pt-12 text-black">
  // see broweser console to see incomming data and exported ready to send
  // from editor{" "}
  // </p>
  // </div>
  // );
  // }

// when use next js
import { SlateEditorProps } from "editor/dist/extendedTextEditor";
import dynamic from "next/dynamic";
import React from "react";
const incommingdata =
"<h2><u><em><strong>Simple version of Slate.js Rich Text Editor lib</strong></em></u></h2>\n<h2><u><em><strong>just use without pain!;-)</strong></em></u></h2>\n<p><u><em>A streamlined, TypeScript-friendly implementation of Slate.js editor with practical solutions to common issues and undocumented features for Next js latest version</em></u></p>\n<p><strong>This version prioritizes stability and ease of use over complex features, making it ideal for projects that need reliable rich text editing without the complexity of the full Slate.js ecosystem.</strong></p>\n<p>Key Features and Improvements:</p>\n<p><em>- 1.added function that allows you click on button like switches and esy to customize them,just import you image version of button and that it!</em></p>\n<p><em>- 2.fix many typescript undocumented problems with typescript in next js</em></p>\n<p><em>- 3.add missed serealization and deserealization(put data into editor and get edited data from editor):</em></p>\n<p><em> 3.1 just put simple text or html and get converted automaticly all values inputs</em></p>\n<p><strong>note:</strong></p>\n<p><em>Customization</em></p>\n<ol><li><em>For additional features or modifications, refer to the official Slate.js documentation. This implementation focuses on common use cases while maintaining extensibility for specific needs.</em></li>\n<li><em><strong>note</strong></em><em>:original lib/repo/author =>(all origin docs)https://docs.slatejs.org (orogin author and repo)https://github.com/ianstormtaylor/slate</em></li>\n</ol>\n<ul><li><em>note:if you dont need some extra feature or customization or you wanna use it like code (not instaalnig lib) than go to my git =></em></li>\n</ul>\n";
const SlateSimpleEditor = dynamic(
() => import("editor/dist/extendedTextEditor"),
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
return (
<SlateSimpleEditor
isTurnOnImages
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
        activeIcons: {
          bold: "/customIcons/green/bold.svg",
          center: "/customIcons/green/center.svg",
          dots: "/customIcons/green/dots.svg",
          h1: "/customIcons/green/h1.svg",
          h2: "/customIcons/green/h2.svg",
          italic: "/customIcons/green/italic.svg",
          left: "/customIcons/green/left.svg",
          numbers: "/customIcons/green/numbers.svg",
          right: "/customIcons/green/right.svg",
          underline: "/customIcons/green/underline.svg",
        },
      }}
outgoingData={a}
incomingData={incommingdata}
/>
);
};

export default SlateSimpleEditorWrapper;
4.use it:)put your data and take alredy prepared html for send to backend
