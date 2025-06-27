export type Identificator = string | number | unknown;

export class Entity {
  public id?: Identificator;
  public createdAt?: Date;
  public updatedAt?: Date;
}
