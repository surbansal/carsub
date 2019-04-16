import User from '../../models/User';

class UserService {
  constructor(api) {
    this.api = api;
  }

  getLoggedInUser() {
    if (this.user) {
      return Promise.resolve(this.user);
    }
    return this.api.get('/auth/user').then((response) => {
      this.user = new User(response.firstName, response.lastName, response.email, response.homeAddress, response.roles, response.id);
      return this.user;
    }).catch(() => {
      return null;
    });
  }

  login(username, password) {
    return this.api.login({username, password}).then(() => {
      return this.getLoggedInUser();
    });
  }

  logout() {
    return this.api.post('/logout', {}).then(() => {
      this.user = null;
      return null;
    });
  }
}

export default UserService;
