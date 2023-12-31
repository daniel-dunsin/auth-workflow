import { BadRequestError } from "../handlers/error-responses.handler";
import { ISession } from "../interfaces/models/user.interface";
import Session from "../models/session.model";
import UserService from "./user.service";

export default class SessionService {
  private readonly user_service: UserService;

  constructor() {
    this.user_service = new UserService();
  }

  public create_session = async (user: string): Promise<ISession> => {
    const session = await Session.findOne({ user });

    let result: ISession | undefined;

    if (session) {
      session.live = true;
      result = await session.save();
    } else {
      result = await Session.create({ user });
    }

    return result;
  };

  public update_session = async (
    session_id: string
  ): Promise<ISession | undefined> => {
    const session = await Session.findById(session_id);

    let result: ISession | undefined;

    if (session) {
      session.live = true;
      result = await session.save();

      return result;
    }
  };

  public logout_session = async (
    user: string
  ): Promise<ISession | undefined> => {
    const session = await Session.findOne({ user });

    let result: ISession | undefined;

    if (session) {
      session.live = false;
      result = await session.save();

      return result;
    }
  };
}
