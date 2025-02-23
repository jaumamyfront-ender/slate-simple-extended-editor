import isHotkey from "is-hotkey";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BaseEditor,
  createEditor,
  Descendant,
  Editor,
  Element as SlateElement,
  Transforms,
} from "slate";
import { HistoryEditor, withHistory } from "slate-history";
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  useSlate,
  withReact,
} from "slate-react";
import { Button, Toolbar } from "./buttonsToolbar";

import { useMediaQuery } from "./useMediaQuery";
import { Node, Text } from "slate";
import { EditableProps } from "slate-react/dist/components/editable";
import { relaxedUrlRegex } from "../../utils/findUrl";

interface ImageSet {
  bold: string;
  center: string;
  dots: string;
  h1: string;
  h2: string;
  italic: string;
  left: string;
  numbers: string;
  right: string;
  underline: string;
}
interface ValidatorProps {
  minLength?: number;
  maxLength?: number;
  checkUrls?: boolean;
  enableValidation?: boolean;
  minLengthDecription?: string;
  maxLengthDecription?: string;
  checkUrlsDecription?: string;
}
interface ValidatorConfig {
  enableValidation?: boolean;
  minLength?: number;
  maxLength?: number;
  checkUrls?: boolean;
}

export interface Error {
  message: string;
  type: "maxLength" | "minLength" | "dontUseLinksinDescription";
}
interface ValidationResult {
  length: number;
  error: Error | undefined;
}

interface StaticImages {
  staticIcons: ImageSet;
}
type CustomElement = {
  type: string;
  align?: string;
  children: Descendant[];
  [key: string]: any;
};
type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
};

type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;
declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement & CustomElement;
    Text: CustomText;
  }
}
interface BlockButtonProps {
  format: string;
  icon: string;
  formatIndex?: string;
}

type EditablePropsWithoutRef = Omit<EditableProps, "ref">;

interface CustomSlateProps extends ValidatorProps {
  incomingData?: string;
  outgoingData?: (data: string) => void;
  staticImages: StaticImages;
  childrenErrorHint?: React.ReactNode;
  childrenLengthHint?: React.ReactNode;
  onValidate?: (result: ValidationResult) => void;
}

export type SlateEditorProps = EditablePropsWithoutRef & CustomSlateProps;

type ButtonStateKey =
  | "bold"
  | "italic"
  | "underline"
  | "h1"
  | "h2"
  | "number"
  | "dots"
  | "left"
  | "center"
  | "right";

type ButtonStates = {
  [K in ButtonStateKey]: boolean;
};

const HOTKEYS: { [key: string]: string } = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

const SlateSimpleExtendedEditor: React.FC<SlateEditorProps> = ({
  incomingData,
  staticImages,
  checkUrls,
  enableValidation,
  maxLength,
  minLength,
  minLengthDecription,
  maxLengthDecription,
  checkUrlsDecription,
  childrenErrorHint,
  childrenLengthHint,
  onValidate,
  ...editableProps
}) => {
  const staticIcons = staticImages.staticIcons;

  const deserializeHtml = (html: string): Descendant[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const extractAlignment = (element: HTMLElement): string | undefined => {
      const styleAttr = element.getAttribute("style");
      if (!styleAttr) return undefined;

      const match = styleAttr.match(/text-align:\s*(left|center|right)/);
      return match ? match[1] : undefined;
    };

    const isEmptyNode = (node: globalThis.Node): boolean => {
      if (node instanceof globalThis.Text) {
        return !node.textContent || node.textContent.trim() === "";
      }

      if (node instanceof HTMLElement) {
        return Array.from(node.childNodes).every((child) => isEmptyNode(child));
      }

      return true;
    };

    const isSlateNodeEmpty = (node: Descendant): boolean => {
      if (Text.isText(node)) {
        return !node.text || node.text.trim() === "";
      }
      if (SlateElement.isElement(node)) {
        return (
          !node.children.length ||
          node.children.every((child) => isSlateNodeEmpty(child))
        );
      }
      return true;
    };

    const deserialize = (el: globalThis.Node): Descendant[] => {
      if (el instanceof globalThis.Text) {
        const text = el.textContent || "";
        return text.trim() ? [{ text }] : [];
      }

      const childNodes = Array.from(el.childNodes)
        .flatMap((n) => deserialize(n))
        .filter((node) => !isSlateNodeEmpty(node));

      if (!(el instanceof HTMLElement)) {
        return childNodes;
      }

      if (el.nodeName === "P" && isEmptyNode(el)) {
        return [];
      }

      if (childNodes.length === 0) {
        if (el.nodeName === "P" || el.nodeName === "LI") {
          return [];
        }

        childNodes.push({ text: "" });
      }

      const applyFormat = (nodes: Descendant[]): Descendant[] => {
        return nodes.map((node) => {
          if (!Text.isText(node)) return node;

          const formats: Partial<CustomText> = {
            text: node.text,
            bold: node.bold,
            italic: node.italic,
            underline: node.underline,
          };

          if (el.nodeName === "STRONG" || el.nodeName === "B")
            formats.bold = true;
          if (el.nodeName === "EM" || el.nodeName === "I")
            formats.italic = true;
          if (el.nodeName === "U") formats.underline = true;

          return formats as CustomText;
        });
      };

      const createElement = (
        type: string,
        children: Descendant[],
        defaultAlign?: string
      ): CustomElement => {
        const element: CustomElement = {
          type,
          children: applyFormat(children),
        };
        const alignment = extractAlignment(el);
        if (alignment) {
          element.align = alignment;
        }

        return element;
      };

      switch (el.nodeName) {
        case "BODY":
          return childNodes;

        case "P":
          return childNodes.length
            ? [createElement("paragraph", childNodes)]
            : [];

        case "H1":
          return childNodes.length
            ? [createElement("heading-one", childNodes)]
            : [];

        case "H2":
          return childNodes.length
            ? [createElement("heading-two", childNodes)]
            : [];

        case "UL":
          return childNodes.length
            ? [
                {
                  type: "bulleted-list",
                  children: childNodes,
                },
              ]
            : [];

        case "OL":
          return childNodes.length
            ? [
                {
                  type: "numbered-list",
                  children: childNodes,
                },
              ]
            : [];

        case "LI":
          return childNodes.length
            ? [
                {
                  type: "list-item",
                  children: applyFormat(childNodes),
                },
              ]
            : [];

        case "DIV":
          return childNodes.length
            ? [createElement("paragraph", childNodes)]
            : [];

        case "STRONG":
        case "B":
        case "EM":
        case "I":
        case "U":
          return applyFormat(childNodes);

        default:
          return childNodes;
      }
    };

    return deserialize(doc.body).filter((node) => !isSlateNodeEmpty(node));
  };

  const initialValueFromProps = (text: string | undefined): Descendant[] => {
    if (!text) {
      return [{ type: "paragraph", children: [{ text: "" }] }];
    }

    try {
      let content = text;

      try {
        const parsed = JSON.parse(text);
        content = typeof parsed === "string" ? parsed : text;
      } catch (e) {
        console.warn("JSON parse failed, using raw text");
        content = text;
      }

      content = content.replace(/^"(.*)"$/, "$1");

      if (content.includes("<") && content.includes(">")) {
        // console.log("Deserializing HTML:", content);

        content = content.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n");

        const result = deserializeHtml(content);
        // console.log("Deserialized result:", result);

        if (
          !result ||
          result.length === 0 ||
          !result.some((node) => "children" in node)
        ) {
          return [
            {
              type: "paragraph",
              children: [{ text: content }],
            },
          ];
        }

        return result;
      }

      return content.split(/\n\s*\n/).map((paragraph) => ({
        type: "paragraph",
        children: [{ text: paragraph.trim() || "" }],
      }));
    } catch (e) {
      console.error("Error processing content:", e);
      return [
        {
          type: "paragraph",
          children: [{ text: text || "" }],
        },
      ];
    }
  };

  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [openToolbarOnMobile, setopenToolbarOnMobile] =
    useState<boolean>(false);
  const [error, setError] = useState<any>();

  const [editorValue, setEditorValue] = useState<Descendant[]>(() =>
    initialValueFromProps(incomingData)
  );

  const validateText = useCallback(
    (content: string, config: ValidatorConfig): ValidationResult => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;
      const cleanText = tempDiv.textContent || tempDiv.innerText || "";
      const textLength = cleanText.length;

      let errorMessage: Error | undefined;
      if (config.enableValidation) {
        if (config.minLength && textLength < config.minLength) {
          errorMessage = {
            message: `Minimum characters required: ${config.minLength}`,
            type: "minLength",
          };
        }

        if (config.maxLength && textLength > config.maxLength) {
          errorMessage = {
            message: `Maximum characters allowed: ${config.maxLength}`,
            type: "maxLength",
          };
        }

        if (config.checkUrls && relaxedUrlRegex.test(cleanText)) {
          errorMessage = {
            message: "Links are not allowed.",
            type: "dontUseLinksinDescription",
          };
        }
      }

      setError(errorMessage);
      return { length: textLength, error: errorMessage };
    },
    []
  );

  const handleEditorChange = (value: Descendant[]) => {
    setEditorValue(value);
    const html = serializeToHtml(value);
    const result = validateText(html, {
      enableValidation: enableValidation,
      checkUrls: checkUrls,
      maxLength: maxLength,
      minLength: minLength,
    });
    onValidate(result);
  };

  useEffect(() => {
    if (incomingData !== undefined) {
      setEditorValue(initialValueFromProps(incomingData));
    }
  }, [incomingData]);

  const serializeToHtml = (nodes: Node[]): string => {
    return nodes
      .map((node) => {
        if (Text.isText(node)) {
          let text = node.text;

          if (node.bold) {
            text = `<strong>${text}</strong>`;
          }
          if (node.italic) {
            text = `<em>${text}</em>`;
          }
          if (node.underline) {
            text = `<u>${text}</u>`;
          }
          return text;
        }

        if (!SlateElement.isElement(node)) {
          return "";
        }

        const element = node as CustomElement;
        const children = element.children
          .map((n) => serializeToHtml([n]))
          .join("");
        const alignStyle = element.align
          ? ` style="text-align: ${element.align}"`
          : "";

        switch (element.type) {
          case "paragraph":
            return `<p${alignStyle}>${children}</p>\n`;
          case "heading-one":
            return `<h1${alignStyle}>${children}</h1>\n`;
          case "heading-two":
            return `<h2${alignStyle}>${children}</h2>\n`;
          case "bulleted-list":
            return `<ul>${children}</ul>\n`;
          case "numbered-list":
            return `<ol>${children}</ol>\n`;
          case "list-item":
            return `<li>${children}</li>\n`;
          default:
            return children;
        }
      })
      .join("");
  };

  const outgoingData = useCallback(() => {
    const html = serializeToHtml(editorValue);
    const stringified = JSON.stringify(html);
    editableProps.outgoingData?.(stringified);
    return stringified;
  }, [editorValue, editableProps.outgoingData]);

  const { isScreenMobile, isScreenSm } = useMediaQuery();
  const isMobile = isScreenMobile;
  const isDesktop = isScreenSm;

  const renderToolbar = () => {
    return (
      <Toolbar>
        <MarkButton format="bold" icon={staticIcons.bold} />
        <MarkButton format="italic" icon={staticIcons.italic} />
        <MarkButton format="underline" icon={staticIcons.underline} />
        <BlockButton format="heading-one" icon={staticIcons.h1} />
        <BlockButton format="heading-two" icon={staticIcons.h2} />
        <BlockButton format="numbered-list" icon={staticIcons.numbers} />
        <BlockButton format="bulleted-list" icon={staticIcons.dots} />
        <BlockButton format="left" icon={staticIcons.left} />
        <BlockButton format="center" icon={staticIcons.center} />
        <BlockButton format="right" icon={staticIcons.right} />
      </Toolbar>
    );
  };

  return (
    <Slate
      editor={editor}
      initialValue={editorValue}
      onChange={handleEditorChange}
    >
      {isDesktop && !isMobile && renderToolbar()}

      <Editable
        {...editableProps}
        onBlur={() => {
          outgoingData(), isMobile && setopenToolbarOnMobile(false);
        }}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        onKeyDown={(event) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event as any)) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey];
              toggleMark(editor, mark);
            }
          }
        }}
        disableDefaultStyles={true}
        style={{
          padding: "0 10px",
          marginBottom: 10,
          height: "200px",
          width: "95%",
          backgroundColor: "rgb(72, 76, 82)",
          border: "1px solid #4b5563",
          borderRadius: "0.475rem",
          fontSize: "initial",
          fontWeight: "initial",
          overflow: "scroll",
          wordWrap: "break-word",
          wordBreak: "break-all",
          position: "relative",
        }}
        onFocus={() => {
          isMobile && setopenToolbarOnMobile(true);
        }}
      />
      {childrenLengthHint}
      {error && childrenErrorHint}
      {isMobile && openToolbarOnMobile && renderToolbar()}
    </Slate>
  );
};

const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: Editor, format: string, blockType = "type") => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  );

  return !!match;
};

const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? (marks as Record<string, boolean>)[format] === true : false;
};

const Element: React.FC<RenderElementProps> = ({
  attributes,
  children,
  element,
}) => {
  const baseStyle: React.CSSProperties = {
    textAlign: element.align as React.CSSProperties["textAlign"],
    color: "#fff",
    margin: "0.5em 0",
  };

  const elementStyles: Record<string, React.CSSProperties> = {
    "heading-one": {
      fontSize: "1.7em",
      fontWeight: "bold",
      margin: "0.37em 0",
      lineHeight: "1.2",
    },
    "heading-two": {
      fontSize: "1.4em",
      fontWeight: "bold",
      margin: "0.33em 0",
      lineHeight: "1.2",
    },
    "numbered-list": {
      listStyleType: "decimal",
    },
    "bulleted-list": {
      listStyleType: "disc",
    },
    "list-item": {
      display: "list-item",
      marginLeft: "1em",
      margin: "0px",
    },
    paragraph: {
      margin: "0em",
      lineHeight: "1.5",
    },
  };

  switch (element.type) {
    case "heading-one":
      return (
        <h1
          style={{ ...baseStyle, ...elementStyles["heading-one"] }}
          {...attributes}
        >
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2
          style={{ ...baseStyle, ...elementStyles["heading-two"] }}
          {...attributes}
        >
          {children}
        </h2>
      );
    case "numbered-list":
      return (
        <ol
          style={{ ...baseStyle, ...elementStyles["numbered-list"] }}
          {...attributes}
        >
          {children}
        </ol>
      );
    case "bulleted-list":
      return (
        <ul
          style={{ ...baseStyle, ...elementStyles["bulleted-list"] }}
          {...attributes}
        >
          {children}
        </ul>
      );
    case "list-item":
      return (
        <li
          style={{ ...baseStyle, ...elementStyles["list-item"] }}
          {...attributes}
        >
          {children}
        </li>
      );
    default:
      return (
        <p
          style={{ ...baseStyle, ...elementStyles["paragraph"] }}
          {...attributes}
        >
          {children}
        </p>
      );
  }
};

const Leaf: React.FC<RenderLeafProps> = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const FORMAT_MAPPING = {
  h1: "heading-one",
  h2: "heading-two",
  number: "numbered-list",
  dots: "bulleted-list",
  left: "left",
  center: "center",
  right: "right",
};

const BlockButton: React.FC<BlockButtonProps> = ({
  format,
  icon,
  formatIndex,
}) => {
  const editor = useSlate();
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
  );

  return (
    <Button
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
      )}
      onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          filter: isActive
            ? "invert(31%) sepia(92%) saturate(666%) hue-rotate(100deg)"
            : "none",
        }}
      >
        <img src={icon} alt="" style={{ objectFit: "cover" }} />
      </div>
    </Button>
  );
};

const MarkButton: React.FC<BlockButtonProps> = ({ format, icon }) => {
  const editor = useSlate();
  const isActive = isMarkActive(editor, format);

  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          filter: isActive
            ? "invert(31%) sepia(92%) saturate(666%) hue-rotate(100deg)"
            : "none",
        }}
      >
        <img src={icon} alt="" style={{ objectFit: "cover" }} />
      </div>
    </Button>
  );
};

export default SlateSimpleExtendedEditor;
