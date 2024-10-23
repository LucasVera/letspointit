export default {
  dataSources: {
    sessionsTable: {
      type: 'AMAZON_DYNAMODB',
      name: '${self:service}-${self:provider.stage}-sessions',
      description: 'Table to store sessions',
      config: {
        tableName: '${self:service}-${self:provider.stage}-sessions',
        region: '${self:provider.region}',
      },
    },

    verifyEmailApi: {
      type: 'HTTP',
      config: {
        endpoint: 'https://api.kickbox.com',
      }
    }
  }
}
