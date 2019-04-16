class User {
  constructor(firstName, lastName, email, homeAddress, roles, id) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.homeAddress = homeAddress;
    this.roles = roles;
    this.id = id;
    this.roleMap = User.serializeRoleMap(roles);
  }

  static serializeRoleMap(roles) {
    const roleMap = {};
    roles.forEach((role) => {
      roleMap[role.name] = true;
    });
    return roleMap;
  }

  getHomeZipCode() {
    return this.homeAddress.zipCode;
  }

  hasRole(role) {
    return Boolean(this.roleMap[role]);
  }
}

export default User;
