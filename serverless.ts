import type { AWS } from '@serverless/typescript'
import Resources from './deployment/Resources'
import { dataSources, pipelineFunctions, resolvers } from 'src/appsync/sls-config/index'
import * as functions from 'src/functions'

const serverlessConfiguration: AWS & { appSync: any } = {
  service: 'letspointit',
  frameworkVersion: '3',
  plugins: ['serverless-appsync-plugin', 'serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    timeout: 29,
    logRetentionInDays: 120,
    memorySize: 512,
    architecture: 'arm64',
    stage: '${opt:stage, "dev"}',
    region: '${opt:region, "us-west-2"}' as any,
  },
  // import the function via paths
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node20',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  appSync: {
    name: '${self:service}-${self:provider.stage}-appsync',
    authentication: {
      type: 'API_KEY',
    },
    apiKeys: [{ name: 'letspointit-api-key', description: 'API Key for Let\'s Point It' }],
    logging: { level: 'ALL' },
    environment: {
      SESSIONS_TABLE_NAME: '${self:service}-${self:provider.stage}-sessions',
      VERIFY_EMAIL_API_KEY: '${ssm:/letspointit/prd/verify-email-api-key}',
      VERIFY_EMAIL_ENABLED: 'false',
    },
    ...dataSources,
    ...pipelineFunctions,
    ...resolvers,
  },
  functions,
  resources: { Resources },
}

module.exports = serverlessConfiguration
