import request from "@/utils/axios";
import { responseCart, typeCart, typeProductCart, names } from "@/types";

const getCart = async () => {
  return new Promise<responseCart>(async (resolve, reject) => {
    const data = await request({
      method: "get",
      url: "/carts",
      params: {
        limit: 100,
      },
    });

    if (data.status === 201 || data.status === 200) {
      const dataCarts = data.data.carts;
      const newDataCarts: typeCart[] = [];
      dataCarts.map((item: typeCart, index: number) => {
        const name = names.find((element) => element.id === item.userId);
        const data = {
          ...item,
          key: index,
          name: name !== undefined ? name.name : "",
        };
        newDataCarts.push(data);
      });

      const dataResponse = {
        ...data.data,
        carts: newDataCarts,
      };
      resolve(dataResponse);
    } else {
      reject(data);
    }
  });
};

const getSingleCartByUser = async (value: string) => {
  return new Promise<responseCart>(async (resolve, reject) => {
    const data = await request({
      method: "get",
      url: `/carts/user/${value}`,
    });

    if (data.status === 201 || data.status === 200) {
      const dataCarts = data.data.carts;
      const newDataCarts: typeCart[] = [];
      dataCarts.map((item: typeCart, index: number) => {
        const name = names.find((element) => element.id === item.userId);
        const data = {
          ...item,
          key: index,
          name: name !== undefined ? name.name : "",
        };
        newDataCarts.push(data);
      });

      const dataResponse = {
        ...data.data,
        carts: newDataCarts,
      };
      resolve(dataResponse);
    } else {
      reject(data);
    }
  });
};

export default { getCart, getSingleCartByUser };
