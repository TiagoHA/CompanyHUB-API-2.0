export const signInResultSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'number',
    },
    name: {
      type: 'string',
    },
    administrator: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    token: {
      type: 'string',
    },
  },
}
