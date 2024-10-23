import { util } from '@aws-appsync/utils';
import * as dynamodb from '@aws-appsync/utils/dynamodb';

export function request (ctx) {
  const { stash } = ctx;
  const {
    session,
  } = stash;

  if (!session) util.error('No session found', 'EndSessionError', null, null);

  return dynamodb.remove({
    key: {
      PK: `SESSION#${session.sessionId}`,
      SK: `SESSION#${session.sessionId}#DETAILS`
    },
  });
}

export function response (ctx) {
  const {
    result: deletedSession,
    error,
  } = ctx;

  console.log('deletedSession', deletedSession);
  console.log('error', error);

  if (error) util.error(`Error removing session. ${JSON.stringify(error)}`, 'EndSessionError', error, error);

  return {
    sessionId: deletedSession?.sessionId,
    sessionStatus: deletedSession?.sessionStatus,
    createdAt: deletedSession?.createdAt,
    expirationTime: deletedSession?.expirationTime,
  };
}
