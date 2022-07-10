const PASSWORD_HAS_ANY_SPACE_REGEX = /([ ]+)/g;

export const hasPasswordAnyEmptySpace = (password: string): boolean => {
  return PASSWORD_HAS_ANY_SPACE_REGEX.test(password);
};
