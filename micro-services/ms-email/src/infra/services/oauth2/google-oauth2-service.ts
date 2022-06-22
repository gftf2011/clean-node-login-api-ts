/**
 * Use Cases
 */
import { OAuth2Service } from '../../../use-cases/ports'

/**
 * Driver
 */
import { google } from 'googleapis'

export class GoogleOAuth2Service implements OAuth2Service {
  async getAccessToken(
    clientId: string,
    clientSecret: string,
    redirectUri: string,
    refreshToken: string
  ): Promise<string> {
    const oAuth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    )

    oAuth2Client.setCredentials({
      refresh_token: refreshToken,
    })

    const accessToken = await oAuth2Client.getAccessToken()

    return accessToken.token
  }
}
