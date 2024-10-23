import { util } from '@aws-appsync/utils';

export function request (ctx) {
  const {
    args,
    env: {
      VERIFY_EMAIL_API_KEY = null,
      VERIFY_EMAIL_ENABLED = 'true',
    }
  } = ctx;

  if (VERIFY_EMAIL_ENABLED !== 'true') runtime.earlyReturn({ isValid: true, message: 'Email verification is disabled' });

  if (!VERIFY_EMAIL_API_KEY) util.error('No email verification api key provided', 'ValidateEmailError', null, null);

  const email = args?.participant?.email;
  if (typeof email !== 'string' || !email) util.error('No email provided', 'ValidateEmailError', null, null);

  return {
    method: 'GET',
    params: {
      query: {
        email,
        apikey: VERIFY_EMAIL_API_KEY,
      }
    },
    resourcePath: `/v2/verify`
  };
}

export function response (ctx) {
  const {
    result,
    error,
  } = ctx;

  if (error) util.error(`Error validating email. ${JSON.stringify(error)}`, 'ValidateEmailError', error, error);

  const { body: bodyJson } = result;
  if (!bodyJson) util.error('No response body', 'ValidateEmailError', null, null);
  console.log('bodyJson', bodyJson);
  const body = JSON.parse(bodyJson);
  console.log('body', body);

  if (!body.success) util.error('Email verification failed', 'ValidateEmailError', null, null);
  if (body.disposable) util.error('Email is not accepted', 'ValidateEmailError', null, null);
  if (body.result !== 'deliverable') util.error('Email is not deliverable', 'ValidateEmailError', null, null);


  return {
    isValid: true,
    message: 'Email verified with api',
  };
}
