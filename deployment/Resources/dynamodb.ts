export default {
  SessionsTable: {
    Type: 'AWS::DynamoDB::Table',
    Properties: {
      AttributeDefinitions: [
        {
          AttributeName: 'PK',
          AttributeType: 'S',
        },
        {
          AttributeName: 'SK',
          AttributeType: 'S',
        },
      ],
      KeySchema: [
        {
          AttributeName: 'PK',
          KeyType: 'HASH',
        },
        {
          AttributeName: 'SK',
          KeyType: 'RANGE',
        },
      ],
      TableName: '${self:service}-${self:provider.stage}-sessions',
      TimeToLiveSpecification: {
        AttributeName: 'expirationTime',
        Enabled: true,
      },
      BillingMode: 'PAY_PER_REQUEST',
    },
  },
}
