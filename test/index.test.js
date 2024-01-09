// ! Dont change this code
const {
  fetchProductsData,
  setProductsCards,
  convertToRupiah,
  countDiscount,
} = require("../src/index.js");
const cartData = require("../src/data/cart.js");

// @ Write your code here
describe("Product API Testing", () => {
// Asyncronous Testing
// https://jestjs.io/docs/asynchronous
  // Test Case 1: should return product data with id 1
  test("should return product data with id 1", async () => {
    const productData = await fetchProductsData(1);
    expect(productData.id).toBe(1);
    expect(productData.title).toBe("iPhone 9");
  });

  // Test Case 2: should check products.length with limit
  test("should check products.length with limit", async () => {
    const productsData = await fetchProductsData();
    const productsCards = setProductsCards(productsData.products);
    const limit = productsData.limit;
    expect(productsCards.length).toBe(limit);
  });

  // Test Case 3: should validate product discount calculation with different values
  test("should validate product discount calculation", () => {
    const price1 = 200;
    const discountPercentage1 = 15;
    const discountedPrice1 = countDiscount(price1, discountPercentage1);
    expect(discountedPrice1).toBe(170);

    const price2 = 50;
    const discountPercentage2 = 5;
    const discountedPrice2 = countDiscount(price2, discountPercentage2);
    expect(discountedPrice2).toBe(47.5);
  });
});

// Mocking
// https://jestjs.io/docs/mock-functions
const { fetchCartsData } = require("../src/dataService");

jest.mock("../src/dataservice", () => {
  const originalModule = jest.requireActual("../src/dataservice");
  return {
    ...originalModule,
    __esModule: true,
    fetchCartsData: jest.fn(),
  };
});

describe("Cart API Testing", () => {
  // Test case 1
  test("should compare total cart items with length of fetched data", async () => {
    fetchCartsData.mockResolvedValue(cartData.carts);
    const cartsData = await fetchCartsData();
    const totalItems = cartsData.length;
    const expectedTotal = cartData.total;
    expect(totalItems).toBe(expectedTotal);
  });

  // Test case 2: additional test case with different data
  test("should compare total length of carts data with total", async () => {
    fetchCartsData.mockResolvedValue([
      { id: 1, productId: 1, quantity: 1 },
      { id: 2, productId: 2, quantity: 2 },
      { id: 3, productId: 3, quantity: 1 },
    ]);
    const cartsData = await fetchCartsData();
    const totalLength = cartsData.reduce((acc, cart) => acc + cart.quantity, 0);
    expect(totalLength).toBe(4);
  });
});

// Setup & Teardown
// https://jestjs.io/docs/setup-teardown
let productsData; // Variabel untuk menyimpan data produk dari API

// Fetch data produk sebelum menjalankan test suite
beforeAll(async () => {
  productsData = await fetchProductsData();
});

describe("Product Utility Testing", () => {
  let convertedPrice1;
  let convertedPrice2;

  // Setup: Mengambil data produk dari API
  beforeAll(async () => {
    productsData = await fetchProductsData();
  });

  // Test case 1: Convert 200 dollars into rupiah
  test("should convert 200 dollars into rupiah", () => {
    convertedPrice1 = convertToRupiah(200);
    expect(convertedPrice1).toMatch(/Rp\s3\.087\.200,\d{2}/);
    expect(typeof convertedPrice1).toBe("string");
  });

  // Test case 2: Convert 500 dollars into rupiah
  test("should convert 500 dollars into rupiah", () => {
    convertedPrice2 = convertToRupiah(500);
    expect(convertedPrice2).toMatch(/Rp\s7\.718\.000,\d{2}/);
  });

  // Test case 3: Calculate discount for 150000 with 25%
  test("should calculate discount correctly for 150000 with 25%", () => {
    const discountedPrice = countDiscount(150000, 25);
    expect(discountedPrice).toBe(112500);
  });

  // Test case 4: Check key in setProductsCards result
  test("should return an array of products with specific keys", () => {
    const productsCards = setProductsCards(productsData.products);
    const firstProductKeys = Object.keys(productsCards[0]);
    const expectedKeys = ["price", "after_discount", "image"];
    expect(firstProductKeys).toEqual(expect.arrayContaining(expectedKeys));
  });
});