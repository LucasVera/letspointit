export default {
  pipelineFunctions: {
    getSession: {
      dataSource: 'sessionsTable',
      description: 'Get a session by ID',
      code: 'src/appsync/resolvers/getSession.js',
    },
    createSession: {
      dataSource: 'sessionsTable',
      description: 'Create a new session',
      code: 'src/appsync/resolvers/createSession.js',
    },
    validateParticipantEmail: {
      dataSource: 'verifyEmailApi',
      description: 'Validate participant email',
      code: 'src/appsync/resolvers/validateParticipantEmail.js',
    },
    addSessionParticipant: {
      dataSource: 'sessionsTable',
      description: 'Add a participant to a session',
      code: 'src/appsync/resolvers/addSessionParticipant.js',
    },
    removeSessionParticipant: {
      dataSource: 'sessionsTable',
      description: 'Remove a participant from a session',
      code: 'src/appsync/resolvers/removeSessionParticipant.js',
    },
    endSession: {
      dataSource: 'sessionsTable',
      description: 'End a session',
      code: 'src/appsync/resolvers/endSession.js',
    },
  }
}