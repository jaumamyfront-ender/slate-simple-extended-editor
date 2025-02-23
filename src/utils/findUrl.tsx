const rgxEmail =
  // eslint-disable-next-line no-control-regex
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const rgxPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;
const rgxPhone = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/;
const rgxFormLink = /<a href="#LINK#">(.+)<\/a>/;
const rgxName = /^[A-ża-ż\d_]+(?:[- ](?:[()]|[A-ża-ż\d_]|-)+)*[.-]?$/;
const isUrlRegex =
  /\b((?:https?|ftp):\/\/)?((?:[\w-]+\.)*[\w-]+)(\.[a-z]{2,})(?:\/\S*)?\b/gi;
const rgxWholeNumber = /^\d+$/;
const rgxFindUrls =
  /\b(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]{2,256}\.[a-z]{2,6}\b(?:\/[^\s]*)?/;
const relaxedUrlRegex = /\bhttps?:\/\/[^\s<>"']+|www\.[^\s<>"']+\.[a-z]{2,}/gi;

export {
  isUrlRegex,
  rgxEmail,
  rgxFindUrls,
  rgxFormLink,
  rgxName,
  rgxPassword,
  rgxPhone,
  rgxWholeNumber,
  relaxedUrlRegex,
};
