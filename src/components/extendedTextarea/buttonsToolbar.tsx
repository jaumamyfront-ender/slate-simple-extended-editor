import React, { ReactNode, Ref, PropsWithChildren } from "react";
import ReactDOM from "react-dom";
import { cx, css } from "@emotion/css";
import "./styles.css";

interface BaseProps {
  className?: string; // Made optional
  [key: string]: any;
}

// Button component props interface
interface ButtonProps extends BaseProps {
  active?: boolean; // Made optional
  reversed?: boolean; // Made optional
}
interface EditorNode {
  text: string;
}

interface EditorDocument {
  nodes: {
    map: (fn: (node: EditorNode) => string) => {
      toArray: () => string[];
    };
  };
}
interface EditorValueProps extends BaseProps {
  value: {
    document: EditorDocument;
  };
}

export const Button = React.forwardRef<
  HTMLSpanElement,
  PropsWithChildren<ButtonProps>
>(({ className, active, reversed, ...props }, ref) => (
  <span {...props} ref={ref} className="buttonChildOrderStyle" />
));
Button.displayName = "Button";

export const EditorValue = React.forwardRef<
  HTMLDivElement,
  PropsWithChildren<EditorValueProps>
>(({ className, value, ...props }, ref) => {
  const textLines = value.document.nodes
    .map((node: any) => node.text)
    .toArray()
    .join("\n");
  return (
    <div
      ref={ref}
      {...props}
      className={cx(
        className,
        css`
          margin: 30px -20px 0;
        `
      )}
    >
      <div
        className={css`
          font-size: 14px;
          padding: 5px 20px;
          color: #404040;
          border-top: 2px solid #eeeeee;
          background: #f8f8f8;
        `}
      >
        {/* Slate's value as text */}
      </div>
      <div
        className={css`
          color: #404040;
          font: 12px monospace;
          white-space: pre-wrap;
          padding: 10px 20px;
          div {
            margin: 0 0 0.5em;
          }
        `}
      >
        {textLines}
      </div>
    </div>
  );
});
EditorValue.displayName = "EditorValue";

export const Icon = React.forwardRef<
  HTMLSpanElement,
  PropsWithChildren<BaseProps>
>(({ className, ...props }, ref) => (
  <span
    {...props}
    ref={ref}
    className={cx(
      "material-icons",
      className,
      css`
        font-size: 18px;
        vertical-align: text-bottom;
      `
    )}
  />
));
Icon.displayName = "Icon";

export const Instruction = React.forwardRef<
  HTMLDivElement,
  PropsWithChildren<BaseProps>
>(({ className, ...props }, ref) => (
  <div
    {...props}
    ref={ref}
    className={cx(
      className,
      css`
        white-space: pre-wrap;
        margin: 0 -20px 10px;
        padding: 10px 20px;
        font-size: 14px;
        background: #f8f8e8;
      `
    )}
  />
));
Instruction.displayName = "Instruction";

export const Menu = React.forwardRef<
  HTMLDivElement,
  PropsWithChildren<BaseProps>
>(({ className, ...props }, ref) => (
  <div
    {...props}
    data-test-id="menu"
    ref={ref}
    className={cx(
      className,
      css`
        align-content: center;
        justify-content: space-between;
      `
    )}
  />
));
Menu.displayName = "Menu";

export const Portal = ({ children }: { children?: ReactNode }) => {
  return typeof document === "object"
    ? ReactDOM.createPortal(children, document.body)
    : null;
};

export const Toolbar = React.forwardRef<
  HTMLDivElement,
  PropsWithChildren<BaseProps>
>(({ className, ...props }, ref) => (
  <Menu
    {...props}
    ref={ref}
    className={cx(
      className,
      css`
        width: 95%;
        background-color: rgb(72 76 82 / var(--tw-bg-opacity));
        border: 1px solid #4b5563;
        border-radius: 0.475rem;
        height: 3rem;
        min-height: 3rem;
        height: auto;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-bottom: 30px;
        padding: 0 20px;
        @media screen and (min-width: 200px) and (max-width: 470px) {
          min-height: 90px;
          max-height: 90px;
        }
      `
    )}
  />
));
Toolbar.displayName = "Toolbar";
