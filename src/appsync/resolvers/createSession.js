import { util } from '@aws-appsync/utils';

export function request (ctx) {
  const {
    args,
    env: {
      SESSIONS_TABLE_NAME
    }
  } = ctx;
  const {
    participant,
  } = args;

  const expiresInHours = 2;

  const sessionId = util.autoUlid();
  const now = util.time.nowEpochSeconds();
  const expiresAt = now + (60 * 60 * expiresInHours);

  return {
    operation: 'BatchPutItem',
    tables: {
      [SESSIONS_TABLE_NAME]: [
        util.dynamodb.toMapValues({
          PK: `SESSION#${sessionId}`,
          SK: `SESSION#${sessionId}#DETAILS`,
          createdByParticipant: participant,
          sessionId,
          sessionStatus: 'NOT_STARTED',
          createdAt: now,
          expirationTime: expiresAt,
        }),
        util.dynamodb.toMapValues({
          PK: `SESSION#${sessionId}`,
          SK: `SESSION#${sessionId}#PARTICIPANT#${participant.email}`,
          ...participant,
          sessionId,
          isSessionCreator: true,
          emailVerified: false,
          createdAt: now,
          expirationTime: expiresAt,
        })
      ]
    }
  };
}

export function response (ctx) {
  const {
    result: results,
    error,
    env: {
      SESSIONS_TABLE_NAME
    }
  } = ctx;

  console.log('results', results);
  console.log('error', error);

  if (error) util.error(`Error creating sessiong. ${JSON.stringify(error)}`, 'CreateSessionError', error, error);
  if (!results) util.error('Session not created', 'CreateSessionError', null, null);

  const {
    data: {
      [SESSIONS_TABLE_NAME]: [
        session,
        sessionParticipant
      ]
    }
  } = results;

  ctx.stash.session = session;
  ctx.stash.sessionParticipant = sessionParticipant;

  return {
    sessionId: session.sessionId,
    sessionStatus: session.sessionStatus,
    createdAt: session.createdAt,
    expirationTime: session.expirationTime,
    participants: [{
      email: sessionParticipant.email,
      name: sessionParticipant.name,
      sessionId: sessionParticipant.sessionId,
      voteTime: sessionParticipant.voteTime,
      isSessionCreator: sessionParticipant.isSessionCreator,
      vote: null, // Mask vote so it's secret until reveal
    }],
  };
}
