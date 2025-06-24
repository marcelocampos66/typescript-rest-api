import { injectable } from 'tsyringe';
import { UserModel } from '../models';
import { MongoBaseRepository } from '../../../../infra/database/mongodb/repositories/mongo-base-repository';
import { User } from '../entities';

@injectable()
export class UserRepository extends MongoBaseRepository<User> {
  constructor() {
    super(UserModel);
  }
}
