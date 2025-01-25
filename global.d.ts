declare module "*.svg" {
  const content: string;
  export default content;
}
import styledImport, { css as cssImport, CSSProp } from "styled-components";
import "twin.macro";

declare module "twin.macro" {
  // The styled and css imports
  const styled: typeof styledImport;
  const css: typeof cssImport;
}

declare module "react" {
  // The css prop
  interface HTMLAttributes<T> extends DOMAttributes<T> {
    css?: CSSProp;
  }
  interface Attributes {
    css?: CSSProp;
  }
  interface IntrinsicAttributes<T> extends DOMAttributes<T> {
    css?: CSSProp;
  }
  // The inline svg css prop
  interface SVGProps<T> extends SVGProps<SVGSVGElement> {
    css?: CSSProp;
  }
  interface InterpolationWithTheme<T> extends DOMAttributes<T> {
    css?: CSSProp;
  }
}

// The 'as' prop on styled components
declare global {
  namespace JSX {
    interface IntrinsicAttributes<T> extends DOMAttributes<T> {
      as?: string | Element;
      // css?: CSSProp
    }

    export type InterpolationWithTheme<Theme> =
      | Interpolation
      | ((theme: Theme) => Interpolation);
    // interface InterpolationWithTheme<T> extends DOMAttributes<T> {
    //   css?: CSSProp
    // }
  }
}
declare module "is-hotkey" {
  const isHotkey: (hotkey: string, event: KeyboardEvent) => boolean;
  export default isHotkey;
}
declare module "@emotion/css" {
  export const css: (template: TemplateStringsArray, ...args: any[]) => string;
  export const cx: (...args: (string | undefined | boolean)[]) => string;
}
// // types/svg.d.ts
// declare module "*.svg" {
//   import React from "react";

//   const content: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

//   export default content;
// }
// types/svg.d.ts

declare module "*.svg" {
  const content: StaticImageData;
  export default content;
}
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}
