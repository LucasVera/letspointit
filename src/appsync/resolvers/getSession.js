import { util } from '@aws-appsync/utils';
import * as dynamodb from '@aws-appsync/utils/dynamodb';

export function request (ctx) {
  const { args, stash } = ctx;
  const {
    sessionId = stash.sessionId,
  } = args;

  if (!sessionId) util.error('No sessionId provided', 'GetSessionError', null, null);

  return dynamodb.query({
    query: {
      PK: {
        eq: `SESSION#${sessionId}`,
      },
      SK: {
        beginsWith: `SESSION#${sessionId}#`,
      },
    }
  });
}

export function response (ctx) {
  const {
    result,
    error,
  } = ctx;

  if (error) util.error(`Error querying session. ${JSON.stringify(error)}`, 'GetSessionError', error, error);
  if (!result) util.error('Session not found', 'GetSessionError', null, null);

  const { items } = result;
  const sessionDetails = items.find(item => item.SK === `SESSION#${item.sessionId}#DETAILS`);
  const sessionParticipants = items.filter(item => item.SK !== `SESSION#${item.sessionId}#DETAILS`);

  if (!sessionDetails) util.error('Session not found', 'GetSessionError', null, null);

  ctx.stash.session = sessionDetails;
  ctx.stash.sessionParticipants = sessionParticipants;

  return {
    sessionId: sessionDetails.sessionId,
    sessionStatus: sessionDetails.sessionStatus,
    createdAt: sessionDetails.createdAt,
    expirationTime: sessionDetails.expirationTime,
    participants: sessionParticipants.map(participant => ({
      email: participant.email,
      name: participant.name,
      sessionId: participant.sessionId,
      voteTime: participant.voteTime,
      isSessionCreator: participant.isSessionCreator,
      vote: null, // Mask vote so it's secret until reveal
    })),
  };
}
