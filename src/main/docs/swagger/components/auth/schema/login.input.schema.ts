export const loginInputSchema = {
  LoginInput: {
    type: "object",
    properties: {
      email: {
        type: "string",
      },
      password: {
        type: "string",
      },
    },
  },
};
