import { injectable } from 'tsyringe';
import { User } from '../entities';
import { UserModel } from '../../../../infra/database/mongodb/models';
import { MongoRepository } from '../../../../infra/database/mongodb/repositories/mongo-repository';

@injectable()
export class UserRepository extends MongoRepository<User> {
  constructor() {
    super(UserModel);
  }
}
