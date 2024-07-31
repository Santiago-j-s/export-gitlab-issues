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
  providers: [
    {
      id: 'gitlab',
      name: 'Gitlab',
      type: 'oidc',
      issuer,
      token: `${issuer}/oauth/token`,
      clientId: process.env.GITLAB_CLIENT_ID,
      clientSecret: process.env.GITLAB_CLIENT_SECRET,
      userinfo: `${issuer}/api/v4/user`,
    },
  ]
});
