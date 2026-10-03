/**
 * Guards against NoSQL operator injection (e.g. { "userId": { "$ne": null } }).
 * Anything that reaches a query filter must be a plain string, never an object.
 */
const isString = (value) => typeof value === "string";

const isNonEmptyString = (value) => isString(value) && value.trim() !== "";

module.exports = { isString, isNonEmptyString };
