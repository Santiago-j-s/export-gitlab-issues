if (!process.env.GITLAB_AUTH_URL) {
  throw new Error('GITLAB_AUTH_URL is not defined');
}


export const BASE_GITLAB_API = `${process.env.GITLAB_AUTH_URL}/api/v4`;