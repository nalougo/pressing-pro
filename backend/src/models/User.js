export default class User {
  constructor(data) {
    this.id = data.id || null;
    this.name = data.name;
    this.phone = data.phone;
    this.password = data.password;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      phone: this.phone,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  toJSONWithPassword() {
    return {
      id: this.id,
      name: this.name,
      phone: this.phone,
      password: this.password,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
