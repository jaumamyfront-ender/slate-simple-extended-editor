import { useEffect, useState } from "react";

type KeyScreenValues =
  | "isScreenMobile"
  | "isScreenSm"
  | "isScreenMd"
  | "isScreenLg"
  | "isScreenXl"
  | "isScreen2xl"
  | "isScreenFullHd";

type ScreenValuesType = Record<KeyScreenValues, boolean>;

const queries = [
  ["isScreenMobile", "(max-width: 640px)"],
  ["isScreenSm", "(min-width: 640px)"],
  ["isScreenMd", "(min-width: 768px)"],
  ["isScreenLg", "(min-width: 1024px)"],
  ["isScreenXl", "(min-width: 1280px)"],
  ["isScreen2xl", "(min-width: 1536px)"],
  ["isScreenFullHd", "(min-width: 1920px)"],
];

const mediaQueryLists: [string, MediaQueryList][] = queries.map((q) => [
  q[0],
  window.matchMedia(q[1]),
]);

const getValue = (): ScreenValuesType =>
  Object.fromEntries(
    mediaQueryLists.map((item) => [item[0], item[1].matches])
  ) as ScreenValuesType;

const useMediaQuery = (): ScreenValuesType => {
  const [value, setValue] = useState(getValue);

  useEffect(() => {
    const handler = () => setValue(getValue);
    mediaQueryLists.forEach((mql) =>
      mql[1].addEventListener("change", handler)
    );
    return () =>
      mediaQueryLists.forEach((mql) =>
        mql[1].removeEventListener("change", handler)
      );
  }, []);

  return value;
};

export { useMediaQuery };
