import { describe, expect, it } from "vitest";

describe("ordenação de produtos por preço", () => {
  it("deve ordenar os preços numericamente, do menor para o maior", () => {
    const products = [
      { name: "Produto de 100 reais", price: 100 },
      { name: "Produto de 20 reais", price: 20 },
      { name: "Produto de 9 reais", price: 9 }
    ];

    const sorted = [...products].sort((a, b) => a.price - b.price);

    expect(sorted.map((product) => product.price)).toEqual([9, 20, 100]);
  });
});