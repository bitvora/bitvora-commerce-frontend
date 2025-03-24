export interface User {
  id: string;
  name: string;
  profile_picture: string;
  bio: string;
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string;
    }
>;

export interface Session {
  user: {
    id: string;
    username: string;
  };
}

export interface AuthResult {
  type: string;
  message: string;
}

export interface SessionPayload {
  user: User;
  accessToken: string;
  expires: Date;
}
