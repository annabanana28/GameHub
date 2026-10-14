import { strict as assert } from "node:assert";
import { matchesCategory } from "../src/utils/productFilters";
import type { Product } from "../src/model/Product";

const product: Product = {
  id: 1,
  name: "Minecraft",
  description: "Jogo de aventura",
  category: "Jogos",
  price: 100,
  stock: 10
};

assert.equal(matchesCategory(product, "Jogos"), true);
assert.equal(matchesCategory(product, "Acessórios"), false);
assert.equal(matchesCategory(product), true);

console.log("Testes de filtro por categoria passaram.");