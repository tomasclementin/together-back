export const gameConfigResponseSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'number',
      example: 5,
    },
    configType: {
      type: 'string',
      example: 'WrittenWishesConfig',
    },
    gameName: {
      type: 'string',
      example: 'Written wishes',
    },
    title: {
      type: 'string',
      example: 'Written wishes test 2',
    },
    wishesAmount: {
      type: 'string',
      example: 3,
    },
  },
};
