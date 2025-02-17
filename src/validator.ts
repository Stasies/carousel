export function isInvalidBreakpoints(obj: any): string | boolean {
  if (typeof obj !== "object" || obj === null) {
    return `invalid value type. Breakpoints should be an object`;
  }

  for (const key in obj) {
    // Check if the key is a number
    if (isNaN(Number(key))) {
      return `Breakpoints should contain keys typeof number`;
    }

    // Check if the value is an object with the correct structure
    const value = obj[key];
    if (
      typeof value !== "object" ||
      value === null ||
      (value.slidesToShow && typeof value.slidesToShow !== "number") ||
      (value.slidesToScroll && typeof value.slidesToScroll !== "number")
    ) {
      return `invalid value type. Pass an object with keys itemsToShow and itemsToScroll and values typeof number`;
    }
  }

  return false;
}
export const ConfigValidator = {
  get(target: any, prop: string) {
    if (!target[prop]) return false;
    if (prop == "autoplay") {
      if (
        String(target[prop]?.value) !== "false" &&
        isNaN(+target[prop]?.value)
      ) {
        console.warn(
          "invalid autoplay value type. Pass a number to set interval or false to disable autoplay"
        );
        return false;
      } else {
        return +target[prop]?.value;
      }
    }
    if (prop == "wraparound") {
      if (!!String(target[prop].value).match(/true|false/)) {
        return target[prop];
      } else {
        console.warn(
          `invalid wraparound value type. Expected boolean. Set to default value.`
        );
        return false;
      }
    }
  },
};
