import { util } from '@aws-appsync/utils';
import * as dynamodb from '@aws-appsync/utils/dynamodb';

export function request (ctx) {
  const { args, stash } = ctx;
  const {
    participantEmail,
  } = args;

  const {
    session,
    sessionParticipants,
  } = stash;

  if (!session) util.error('No session found', 'RemoveSessionParticipantError', null, null);
  if (!sessionParticipants) util.error('No session participants found', 'RemoveSessionParticipantError', null, null);

  return dynamodb.remove({
    key: {
      PK: `SESSION#${session.sessionId}`,
      SK: `SESSION#${session.sessionId}#PARTICIPANT#${participantEmail}`
    },
    condition: {
      isSessionCreator: { eq: false },
      PK: { eq: `SESSION#${session.sessionId}` },
      SK: { eq: `SESSION#${session.sessionId}#PARTICIPANT#${participantEmail}` }
    }
  });
}

export function response (ctx) {
  const {
    result: deletedParticipant,
    error,
  } = ctx;

  if (error) util.error(`Error removing session participant. ${JSON.stringify(error)}`, 'RemoveSessionParticipantError', error, error);

  return {
    email: deletedParticipant.email,
    name: deletedParticipant.name,
    sessionId: deletedParticipant.sessionId,
  };
}
