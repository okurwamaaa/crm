export interface IBaseRepository<T> {
  findById(id: string | number): Promise<T | null>;
  findAll(): Promise<T[]>;
  findOne(filter: Partial<T>): Promise<T | null>;
  findMany(filter: Partial<T>): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: string | number, data: Partial<T>): Promise<T>;
  delete(id: string | number): Promise<boolean>;
  exists(id: string | number): Promise<boolean>;
  count(filter?: Partial<T>): Promise<number>;
}
export interface IPaginatedRepository<T> extends IBaseRepository<T> {
  findPaginated(
    page: number,
    limit: number,
    filter?: Partial<T>,
    sort?: { field: keyof T; direction: 'ASC' | 'DESC' }
  ): Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
}
export interface ISearchableRepository<T> extends IBaseRepository<T> {
  search(query: string, fields: (keyof T)[]): Promise<T[]>;
} 
