import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify"

const refreshAccessToken = async (token) => {
  try {

    spotifyApi.setAccessToken(token.accessToken)
    spotifyApi.setRefreshToken(token.refreshToken)

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
    console.log("Refreshed token is", refreshedToken)

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000, // = 1 hr as 3600 returns from spotify API
      refreshToken: refreshedToken.refresh_token ?? token.refresh_token,
      // Replace if new one came back else fall back the previous refresh token

    }

  } catch (error) {
    console.error(error)

    return {
      ...token,
      error: "RefreshAccessTokenError"
    }

  }
}


export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, account, user }) {

      if (account && user) {
        return {
          ...token,

          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000,
          
        }

      }
      //Return previous token if access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        console.log('ACCESS TOKEN IS VALID')
        return token;
      }
      // Access token has expired refresh the token
      console.log('ACCESS TOKEN HAS EXPIRED')
      return await refreshAccessToken(token)
    },


    async session({ session, token }) {

      session.user.accessToken = token.accessToken;
      session.user.username = token.username;
      session.user.refreshToken = token.refreshToken;
      return session
    }

  }

})
// session.user.accessToken = token.accessToken;
// session.user.refreshToken = token.refreshToken;
// session.user.username = token.username;
// session.user = token.user
// session.accessToken = token.accessToken
// session.error = token.error


