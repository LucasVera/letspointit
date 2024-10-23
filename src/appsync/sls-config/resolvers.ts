export default {
  resolvers: {
    'Query.getSession': {
      functions: [
        'getSession'
      ]
    },
    'Mutation.createSession': {
      functions: [
        'validateParticipantEmail',
        'createSession'
      ]
    },
    'Mutation.addParticipant': {
      functions: [
        'getSession',
        'addSessionParticipant',
      ]
    },
    'Mutation.removeParticipant': {
      functions: [
        'getSession',
        'removeSessionParticipant',
      ]
    },
    'Mutation.endSession': {
      functions: [
        'getSession',
        'endSession',
      ]
    },
  }
}