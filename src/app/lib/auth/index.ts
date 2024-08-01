import NextAuth from "next-auth";

if (!process.env.GITLAB_CLIENT_ID) {
  throw new Error("GITLAB_CLIENT_ID is not set")
}

if (!process.env.GITLAB_CLIENT_SECRET) {
  throw new Error("GITLAB_CLIENT_SECRET is not set")
}

if (!process.env.GITLAB_AUTH_URL) {
  throw new Error("GITLAB_AUTH_URL is not set")
}

const issuer = process.env.GITLAB_AUTH_URL;

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  secret: process.env.SECRET,
  callbacks: {
    jwt: ({ token, account }) => {
      if (account?.access_token) {
        token.accessToken = account.access_token
      }
      return token;
    },
    session: ({ session, token }) => {
      if (typeof token.accessToken !== 'string') {
        throw new Error('accessToken is not a string');
      }
      session.accessToken = token.accessToken;
      return session;
    },
  },
  providers: [
    {
      id: 'gitlab',
      name: 'Gitlab',
      type: 'oidc',
      issuer,
      token: `${issuer}/oauth/token`,
      authorization: {
        url: `${issuer}/oauth/authorize`,
        params: { scope: 'openid api' },
      },
      clientId: process.env.GITLAB_CLIENT_ID,
      clientSecret: process.env.GITLAB_CLIENT_SECRET,
      userinfo: `${issuer}/api/v4/user`,
    },
  ]
});
