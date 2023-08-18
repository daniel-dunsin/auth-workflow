import settings from "../constants/settings";
import jwt from "jsonwebtoken";
import { UnAuthorizedError } from "../handlers/error-responses.handler";
import { logger } from "../configs/logger.config";

class JWTHelpers {
  constructor() {}

  private readkeys = async (key: string): Promise<string> => {
    return await Buffer.from(key, "base64").toString("ascii");
  };

  public sign_access_token = async (user_id: string): Promise<string> => {
    const key = await this.readkeys(
      settings.secret_keys.access_token as string
    );

    const TEN_MINUTES = "10m";

    const token = await jwt.sign({ user_id: user_id }, key, {
      expiresIn: TEN_MINUTES,
    });

    return token;
  };

  public sign_refresh_token = async (session_id: string): Promise<string> => {
    const key = await this.readkeys(
      settings.secret_keys.refresh_token as string
    );

    const ONE_YEAR = 1000 * 60 * 60 * 24 * 365;

    const token = await jwt.sign({ session_id }, key, { expiresIn: ONE_YEAR });

    return token;
  };

  public verify_refresh_token = async (refresh_token: string): Promise<any> => {
    try {
      const key = await this.readkeys(
        settings.secret_keys.refresh_token as string
      );

      type return_type = { session_id: string };

      let token: return_type | undefined;

      await jwt.verify(refresh_token, key, (err, user) => {
        if (err) {
          logger.error(err);
          return;
        }

        token = user as return_type;
      });

      return token;
    } catch (error: any) {
      logger.error(error.message);
      throw new UnAuthorizedError(error.message);
    }
  };

  public verify_access_token = async (access_token: string): Promise<any> => {
    try {
      const key = await this.readkeys(
        settings.secret_keys.access_token as string
      );

      type return_type = { user_id: string };

      let token: return_type | undefined;

      await jwt.verify(access_token, key, (err, user) => {
        if (err) {
          logger.error(err);
          return;
        }

        token = user as return_type;
      });

      return token;
    } catch (error: any) {
      logger.error(error.message);
      throw new UnAuthorizedError(error.message);
    }
  };
}

const Jwt_Helpers = new JWTHelpers();

export default Jwt_Helpers;
