import { util } from '@aws-appsync/utils';
import * as dynamodb from '@aws-appsync/utils/dynamodb';

export function request (ctx) {
  const { args, stash } = ctx;
  const {
    participant,
  } = args;

  const {
    session,
    sessionParticipants,
  } = stash;

  if (!session) util.error('No session found', 'CreateSessionParticipantError', null, null);
  if (!sessionParticipants) util.error('No session participants found', 'CreateSessionParticipantError', null, null);

  const participantAlreadyExists = sessionParticipants.find(sessionParticipant => sessionParticipant.email === participant.email);
  if (participantAlreadyExists) util.error('Participant already exists', 'CreateSessionParticipantError', null, null);

  const now = util.time.nowEpochSeconds();

  return dynamodb.put({
    key: {
      PK: `SESSION#${session.sessionId}`,
      SK: `SESSION#${session.sessionId}#PARTICIPANT#${participant.email}`
    },
    item: {
      ...participant,
      sessionId: session.sessionId,
      isSessionCreator: false,
      emailVerified: false,
      vote: null,
      voteTime: null,
      createdAt: now,
      expirationTime: session.expirationTime,
    }
  });
}

export function response (ctx) {
  const {
    result: sessionParticipant,
    error,
  } = ctx;

  console.log('sessionParticipant', sessionParticipant);
  console.log('error', error);

  if (error) util.error(`Error creating session participant. ${JSON.stringify(error)}`, 'CreateSessionParticipantError', error, error);
  if (!sessionParticipant) util.error('Session Participant not created', 'CreateSessionParticipantError', null, null);

  ctx.stash.sessionParticipant = sessionParticipant;

  return {
    email: sessionParticipant.email,
    name: sessionParticipant.name,
    sessionId: sessionParticipant.sessionId,
    isSessionCreator: sessionParticipant.isSessionCreator,
  };
}
