const MIN_DARK_COLOR = "#1f1f1f";

export const getRandomHex = () => {
  let hex = "#";

  while (hex < MIN_DARK_COLOR) {
    hex = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }

  return hex;
};

export const getTextColor = (hex: string) => {
  const hexColor = hex.replace("#", "");
  const r = parseInt(hexColor.slice(0, 2), 16);
  const g = parseInt(hexColor.slice(2, 4), 16);
  const b = parseInt(hexColor.slice(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000000" : "#ffffff";
};
