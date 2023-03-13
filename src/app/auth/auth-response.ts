export interface AuthResponse {
  access_token: string;
  expires_in: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
}
