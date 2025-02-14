function isInvalidBreakpoints(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return `invalid value type. Breakpoints should be an object`;
    }
    for (const key in obj) {
        // Check if the key is a number
        if (isNaN(Number(key))) {
            return `Breakpoints should contain keys typeof number`;
        }
        // Check if the value is an object with the correct structure
        const value = obj[key];
        if (typeof value !== 'object' ||
            value === null ||
            (value.itemsToShow && typeof value.itemsToShow !== 'number') ||
            (value.itemsToScroll && typeof value.itemsToScroll !== 'number')) {
            return `invalid value type. Pass an object with keys itemsToShow and itemsToScroll and values typeof number`;
        }
    }
    return false;
}
export const ConfigValidator = {
    get(target, prop) {
        if (!target[prop])
            return false;
        if (prop == 'autoplay') {
            if (String(target[prop]?.value) !== 'false' && isNaN(+target[prop]?.value)) {
                console.warn('invalid autoplay value type. Pass a number to set interval or false to disable autoplay');
                return false;
            }
            else {
                return +target[prop]?.value;
            }
        }
        if (prop == 'breakpoints') {
            let error = isInvalidBreakpoints(target[prop]);
            if (error) {
                console.warn(`Error in ${prop}. ${error}`);
                return {
                    0: {
                        itemsToShow: 1,
                        itemsToScroll: 1
                    },
                };
            }
            else {
                return target[prop];
            }
        }
        if (prop == 'wrapAround') {
            if (!!String(target[prop].value).match(/true|false/)) {
                return target[prop];
            }
            else {
                console.warn(`invalid wrapAround value type. Expected boolean. Set to default value.`);
                return false;
            }
        }
    }
};
