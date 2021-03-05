export interface User {
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  fullname: string;
  email: string;
  active: string;
  role: string;
  roles: any[];
  token?: string;
  acr: string;
  isDP: string;
}
