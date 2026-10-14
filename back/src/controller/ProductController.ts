
import type { Request, Response } from "express";
import { createProductSchema } from "../dto/CreateProductDTO";
import { ProductService } from "../../infra/services/ProductService";

export class ProductController {
  constructor(private readonly service = new ProductService()) {}

  list = async (request: Request, response: Response) => {
    const pageParam = Number(request.query.page ?? 1);
    const limitParam = Number(request.query.limit ?? 20);

    const products = await this.service.list({
      search: String(request.query.search ?? ""),
      category: String(request.query.category ?? ""),
      sort: String(request.query.sort ?? "name"),
      page: Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1,
      limit: Number.isInteger(limitParam) && limitParam > 0 ? limitParam : 20
    });

    response.json(products);
  };

  create = async (request: Request, response: Response) => {
    const parsed = createProductSchema.safeParse(request.body);

    if (!parsed.success) {
      response.status(400).json({
        message: "Dados inválidos.",
        errors: parsed.error.flatten().fieldErrors
      });
      return;
    }

    const product = await this.service.create(parsed.data);
    response.status(201).json(product);
  };

  remove = async (request: Request, response: Response) => {
    await this.service.remove(Number(request.params.id));
    response.json({ message: "Produto excluído com sucesso." });
  };

  dashboard = async (_request: Request, response: Response) => {
    response.json(await this.service.dashboard());
  };
}
