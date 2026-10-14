import { describe, expect, it } from "vitest";
import { sortProducts } from "../utils/sortProducts";
import type { ProductDTO } from "../dto/ProductDTO";

describe("ordenação de produtos", () => {
  const products = [
    { id: 1, name: "Produto de 100 reais", description: "Teste", category: "Jogos", price: 100, stock: 1 },
    { id: 2, name: "Produto de 20 reais", description: "Teste", category: "Jogos", price: 20, stock: 1 },
    { id: 3, name: "Produto de 9 reais", description: "Teste", category: "Jogos", price: 9, stock: 1 }
  ] as ProductDTO[];

  it("deve ordenar os preços numericamente, do menor para o maior", () => {
    const sorted = sortProducts(products, "price");

    expect(sorted.map((product) => product.price)).toEqual([9, 20, 100]);
  });

  it("deve ordenar pelo nome quando essa opção for selecionada", () => {
    const items = [
      { ...products[0], name: "Zelda" },
      { ...products[1], name: "Astro" }
    ];

    const sorted = sortProducts(items, "name");

    expect(sorted.map((product) => product.name)).toEqual(["Astro", "Zelda"]);
  });

  it("não deve modificar o array original", () => {
    const original = [...products];

    sortProducts(products, "price");

    expect(products).toEqual(original);
  });
});