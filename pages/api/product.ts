import request from "@/utils/axios";
import { responseProduct, typeProduct } from "@/types";

const getProduct = async () => {
  return new Promise<responseProduct>(async (resolve, reject) => {
    const data = await request({
      method: "get",
      url: "/products",
      params: {
        limit: 100,
      },
    });

    if (data.status === 201 || data.status === 200) {
      const dataProducts = data.data.products;
      const newDataProducts: typeProduct[] = [];
      dataProducts.map((item: typeProduct, index: number) => {
        const data = {
          ...item,
          key: index,
        };
        newDataProducts.push(data);
      });

      const dataResponse = {
        ...data.data,
        products: newDataProducts,
      };
      resolve(dataResponse);
    } else {
      reject(data);
    }
  });
};

const searchProduct = async (value: string) => {
  return new Promise<responseProduct>(async (resolve, reject) => {
    const data = await request({
      method: "get",
      url: "/products/search",
      params: {
        q: value,
      },
    });

    if (data.status === 201 || data.status === 200) {
      const dataProducts = data.data.products;
      const newDataProducts: typeProduct[] = [];
      dataProducts.map((item: typeProduct, index: number) => {
        const data = {
          ...item,
          key: index,
        };
        newDataProducts.push(data);
      });

      const dataResponse = {
        ...data.data,
        products: newDataProducts,
      };
      resolve(dataResponse);
    } else {
      reject(data);
    }
  });
};

const getCategory = async () => {
  return new Promise<string[]>(async (resolve, reject) => {
    const data = await request({
      method: "get",
      url: "/products/categories",
    });

    if (data.status === 201 || data.status === 200) {
      resolve(data.data);
    } else {
      reject(data);
    }
  });
};

export default { getCategory, getProduct, searchProduct };
