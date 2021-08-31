import models from '../models/models';

class UserService {
  private userModel = models.users;
  constructor() {}

  public async getAllUsers() {
    const result = await this.userModel.getAllUsers();
    return result;
  }

  public async getUserById(id: string) {
    const user = await this.userModel.getUserById(id);
    if (!user) {
      return { error: { message: 'User not found' } }
    }
    return user;
  }

  public async registerUser(userData: IUserData) {
    const { email, name, birthdate, password } = userData;
    const newUserData = { email, name, birthdate, password };
    const { insertedId } = await this.userModel.registerUser(newUserData);
    const newUser = await this.userModel.getUserById(insertedId.toString())
    return newUser;
  }

  public async updateUser(id: string, newUserData: IUserData) {
    await this.userModel.updateUser(id, newUserData);
    const updatedUser = await this.userModel.getUserById(id);
    return updatedUser;
  }

  public async deleteUser(id: string) {
    await this.userModel.deleteUser(id);
    return { message: 'User deleted!' }
  }

}

export default UserService;
