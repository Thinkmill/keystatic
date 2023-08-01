/**
 * checks if all required properties exist on token
 * @param object - tokenValue
 * @param array - property names
 * @returns void or throws error
 */
export const checkRequiredTokenProperties = (
  tokenValue: Record<string, unknown>,
  requiredProperties: readonly string[]
) => {
  for (const prop of requiredProperties) {
    if (prop in tokenValue === false) {
      throw new Error(
        `Missing property: ${prop} on token with value ${JSON.stringify(
          tokenValue
        )}`
      );
    }
  }
};
