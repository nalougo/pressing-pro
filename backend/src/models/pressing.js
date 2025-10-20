export default class Pressing {
    constructor(data) {
      this.id = data.id || null;
      this.name = data.name;
      this.phone = data.phone;
      this.email = data.email;
      this.password = data.password;
      this.address = data.address || null;
      this.city = data.city || null;
      this.rating = data.rating || 0;
      this.isActive = data.isActive !== undefined ? data.isActive : true;
      this.createdAt = data.createdAt || new Date().toISOString();
      this.updatedAt = data.updatedAt || new Date().toISOString();
    }
  
    toJSON() {
      return {
        id: this.id,
        name: this.name,
        phone: this.phone,
        email: this.email,
        address: this.address,
        city: this.city,
        rating: this.rating,
        isActive: this.isActive,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      };
    }
  
    toJSONWithPassword() {
      return {
        ...this.toJSON(),
        password: this.password,
      };
    }
  }