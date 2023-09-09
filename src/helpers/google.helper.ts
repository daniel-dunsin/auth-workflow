/**
 * Get consent screen link
 * Get id & access token with code from redirect uri
 * Get user info with access token & id token
 */

import QueryString from "qs";
import settings from "../constants/settings";
import { logger } from "../configs/logger.config";
import { BadRequestError } from "../handlers/error-responses.handler";
import axios from "axios";

enum GoogleScopes {
  enum = "https://www.googleapis.com/auth/userinfo.email",
  profile = "https://www.googleapis.com/auth/userinfo.profile",
}

export const getConsentScreenLink = (): string => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const query = {
    scope: [GoogleScopes.enum, GoogleScopes.profile].join(" "),
    response_type: "code",
    prompt: "consent",
    access_type: "offline",
    redirect_uri: `${settings.frontend_url}/api/auth/google/authenticate`,
    client_id: settings.google.client_id,
  };

  const stringifiedQuery = QueryString.stringify(query);

  const link = `${rootUrl}?${stringifiedQuery}`;

  return link;
};

interface GoogleTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: Date;
  scope: string;
  token_type: string;
  id_token: string;
}

export const getGoogleAuthTokens = async (
  code: string
): Promise<GoogleTokenResponse> => {
  try {
    const rootUrl = "https://oauth2.googleapis.com/token";

    const query = {
      code,
      client_id: settings.google.client_id,
      client_secret: settings.google.secret,
      redirect_uri: `${settings.frontend_url}/api/auth/google/authenticate`,
      grant_type: "authorization_code",
    };

    const stringifiedQuery = QueryString.stringify(query);

    const headers = {
      "Content-Type": "application-type/x-www-form-urlencoded",
    };

    const response = await axios.post<GoogleTokenResponse>(
      `${rootUrl}?${stringifiedQuery}`,
      {},
      { headers }
    );

    return response.data;
  } catch (error: any) {
    logger.error("Unable to get google token: " + error);
    throw new BadRequestError(error);
  }
};

export interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

export const getGoogleUserInfo = async (
  body: Partial<GoogleTokenResponse>
): Promise<GoogleUserInfo> => {
  try {
    const { id_token, access_token } = body;

    const rootUrl = "https://www.googleapis.com/oauth2/v2/userinfo";

    const options = { headers: { Authorization: `Bearer ${access_token}` } };

    const response = await axios.get<GoogleUserInfo>(rootUrl, options);

    return response.data;
  } catch (error: any) {
    logger.error(`Unable to get user info: ${error}`);
    throw new BadRequestError(error);
  }
};
