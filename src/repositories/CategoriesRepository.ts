import { EntityRepository, Repository, getRepository } from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  private repository: Repository<Category>;

  constructor() {
    super();

    this.repository = getRepository(Category);
  }

  public async createCategory(title: string): Promise<Category> {
    const category = await this.repository.create({
      title,
    });

    await this.repository.save(category);

    return category;
  }

  public async findByTitle(title: string): Promise<Category | undefined> {
    const category = await this.repository.findOne({
      title,
    });

    return category;
  }
}

export default CategoriesRepository;
