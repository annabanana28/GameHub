
import { db } from "../database/db";
import type { CreateProductDTO } from "../../src/dto/CreateProductDTO";
import type { Product } from "../../src/model/Product";

export interface ProductFilters {
  search?: string;
  category?: string;
  sort?: string;
}

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: Number(row.id),
    name: String(row.name),
    description: String(row.description),
    category: String(row.category),
    price: Number(row.price),
    stock: Number(row.stock)
  };
}

export class ProductRepository {
  async findAll(filters: ProductFilters): Promise<Product[]> {
    const conditions: string[] = [];
    const values: unknown[] = [];

    if (filters.search) {
      values.push(`%${filters.search}%`);
      const parameter = `$${values.length}`;
      conditions.push(`(name ILIKE ${parameter} OR description ILIKE ${parameter})`);
    }

    if (filters.category) {
      values.push(filters.category);
      conditions.push(`category = $${values.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const orderBy = filters.sort === "price" ? "price ASC" : "name ASC";
    const sql = `SELECT id, name, description, category, price, stock FROM products ${where} ORDER BY ${orderBy}`;

    const startedAt = performance.now();
    const result = await db.query(sql, values);

    console.info(
      `[SQL] listagem: ${result.rowCount ?? 0} linhas em ${(performance.now() - startedAt).toFixed(2)} ms`
    );

    return result.rows.map(mapProduct);
  }

  async create(input: CreateProductDTO): Promise<Product> {
    const result = await db.query(
      `INSERT INTO products (name, description, category, price, stock)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, description, category, price, stock`,
      [input.name, input.description, input.category, input.price, input.stock]
    );
    return mapProduct(result.rows[0]);
  }

  async delete(id: number): Promise<void> {
    await db.query("DELETE FROM products WHERE id = $1", [id]);
  }

  async getDashboard() {
    const dashboardStartedAt = performance.now();

    const result = await db.query(
      `SELECT
         COUNT(*) AS total_products,
         COUNT(*) FILTER (WHERE stock <= 5) AS low_stock,
         COALESCE(SUM(price * stock), 0) AS inventory_value,
         COUNT(DISTINCT category) AS categories
       FROM products`
    );

    console.info(
      `[SQL] dashboard: 1 consulta em ${(performance.now() - dashboardStartedAt).toFixed(2)} ms`
    );

    const dashboard = result.rows[0];

    return {
      totalProducts: Number(dashboard.total_products),
      lowStock: Number(dashboard.low_stock),
      inventoryValue: Number(dashboard.inventory_value),
      categories: Number(dashboard.categories)
    };
  }
}
