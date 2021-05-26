export class User {
  // tslint:disable-next-line:variable-name
  first_name: string;
  // tslint:disable-next-line:variable-name
  last_name: string;
  email: string;
  password: string;
  token: string;
  constructor() {
    this.first_name = null;
    this.last_name = null;
    this.email = null;
    this.password = null;
    this.token = null;
  }
}
