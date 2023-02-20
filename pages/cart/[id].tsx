import React, { useEffect, useState } from "react";
import PageTitle from "@/components/PageTitle";
import BreadCrumb from "@/components/BreadCrumb";
import { Card, Table, Row, Col, Select, Input, Button, Skeleton } from "antd";
import { useRouter } from "next/router";
import WindowDimension from "@/utils/resize";
import ApiCart from "@/pages/api/cart";
import {
  typeCart,
  responseCart,
  typeProductCart,
  typeMeta,
  names,
} from "@/types";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";

function CartDetail() {
  // const router = useRouter();
  const dimension = WindowDimension();
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  // const { id } = router.query;
  // console.log(id);
  const [dataCart, setDataCart] = useState<typeCart>();
  const [dataProductCart, setDataProductCart] = useState<typeProductCart[]>([]);
  const [dataAllProductCart, setAllProductDataCart] = useState<
    typeProductCart[]
  >([]);
  const [userName, setUserName] = useState("");
  const [meta, setMeta] = useState<typeMeta>({
    limit: 5,
    page: 1,
    skip: 0,
    total: 0,
  });

  useEffect(() => {
    const url = window.location.href;
    const split = url.split("cart/");
    handleGetDataCart(split[1]);
  }, []);

  const handleGetDataCart = async (value: string) => {
    setIsLoadingTable(true);
    console.log(value);
    await ApiCart.getSingleCartByUser(value)
      .then((res) => {
        console.log("response", res);
        const user = names.find((item) => item.id === res.carts[0].userId);
        setUserName(user === undefined ? "" : user.name);

        setMeta({
          limit: meta.limit,
          page: meta.page,
          skip: meta.skip,
          total: res.carts[0].products.length,
        });

        setDataCart(res.carts[0]);
        setDataProductCart(res.carts[0].products);
        setAllProductDataCart(res.carts[0].products);
        setIsLoadingTable(false);
      })
      .catch(() => {
        // setDataTable([]);
        setIsLoadingTable(false);
      });
  };

  const onChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<typeCart>
  ) => {
    setIsLoadingTable(true);

    const current: number =
      pagination.current === undefined ? 0 : pagination.current;
    const pageSize: number =
      pagination.pageSize === undefined ? 0 : pagination.pageSize;

    const data = {
      limit: pageSize,
      skip: current * 10 - 10,
      page: current,
      total: meta.total,
    };
    setMeta(data);

    let arrPage: typeProductCart[] = dataAllProductCart;

    let arrSort: typeProductCart[] = [];
    if (sorter.order === "ascend") {
      switch (sorter.field) {
        case "title":
          arrSort = arrPage.sort((a, b) => {
            if (a.title.toLowerCase() < b.title.toLowerCase()) {
              return -1;
            }
            if (a.title.toLowerCase() > b.title.toLowerCase()) {
              return 1;
            }
            return 0;
          });
          break;
        case "price":
          arrSort = arrPage.sort((a, b) => {
            if (a.price < b.price) {
              return -1;
            }
            if (a.price > b.price) {
              return 1;
            }
            return 0;
          });
          break;
        case "quantity":
          arrSort = arrPage.sort((a, b) => {
            if (a.quantity < b.quantity) {
              return -1;
            }
            if (a.quantity > b.quantity) {
              return 1;
            }
            return 0;
          });
          break;
        case "total":
          arrSort = arrPage.sort((a, b) => {
            if (a.total < b.total) {
              return -1;
            }
            if (a.total > b.total) {
              return 1;
            }
            return 0;
          });
          break;
        case "discountPercentage":
          arrSort = arrPage.sort((a, b) => {
            if (a.discountPercentage < b.discountPercentage) {
              return -1;
            }
            if (a.discountPercentage > b.discountPercentage) {
              return 1;
            }
            return 0;
          });
          break;
        case "discountedPrice":
          arrSort = arrPage.sort((a, b) => {
            if (a.discountedPrice < b.discountedPrice) {
              return -1;
            }
            if (a.discountedPrice > b.discountedPrice) {
              return 1;
            }
            return 0;
          });
          break;
      }
    } else if (sorter.order === "descend") {
      switch (sorter.field) {
        case "title":
          arrSort = arrPage.sort((a, b) => {
            if (a.title.toLowerCase() > b.title.toLowerCase()) {
              return -1;
            }
            if (a.title.toLowerCase() > b.title.toLowerCase()) {
              return 1;
            }
            return 0;
          });
          break;
        case "price":
          arrSort = arrPage.sort((a, b) => {
            if (a.price > b.price) {
              return -1;
            }
            if (a.price < b.price) {
              return 1;
            }
            return 0;
          });
          break;
        case "quantity":
          arrSort = arrPage.sort((a, b) => {
            if (a.quantity > b.quantity) {
              return -1;
            }
            if (a.quantity < b.quantity) {
              return 1;
            }
            return 0;
          });
          break;
        case "total":
          arrSort = arrPage.sort((a, b) => {
            if (a.total > b.total) {
              return -1;
            }
            if (a.total < b.total) {
              return 1;
            }
            return 0;
          });
          break;
        case "discountPercentage":
          arrSort = arrPage.sort((a, b) => {
            if (a.discountPercentage > b.discountPercentage) {
              return -1;
            }
            if (a.discountPercentage < b.discountPercentage) {
              return 1;
            }
            return 0;
          });
          break;
        case "discountedPrice":
          arrSort = arrPage.sort((a, b) => {
            if (a.discountedPrice > b.discountedPrice) {
              return -1;
            }
            if (a.discountedPrice < b.discountedPrice) {
              return 1;
            }
            return 0;
          });
          break;
      }
    } else {
      arrSort = arrPage;
    }

    const currentPage = (current - 1) * pageSize;
    const arrTable = arrSort.slice(currentPage, currentPage + pageSize);

    setDataProductCart(arrTable);
    setIsLoadingTable(false);
  };

  const itemBreadcrumb = [
    {
      title: "Cart",
      link: "/cart",
    },
    {
      title: `${userName}`,
      link: `/cart/[id]`,
    },
  ];

  const fieldColumns = [
    // {
    //   title: "No",
    //   render: (_, record, index) => {
    //     return (
    //       parseInt(valueLimitShow) * (parseInt(currentPage) - 1) + index + 1
    //     );
    //   },
    //   width: "70px",
    // },
    {
      title: "Name Product",
      dataIndex: "title",
      sorter: true,
      key: "title",
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (_: string, record: typeProductCart) => {
        return record.price.toString().formatInput("Rp", 2);
      },
      sorter: true,
      key: "price",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (_: string, record: typeProductCart) => {
        return record.quantity.toString().formatInput("", 2);
      },
      sorter: true,
      key: "quantity",
    },
    {
      title: "Total",
      dataIndex: "total",
      render: (_: string, record: typeProductCart) => {
        return record.total.toString().formatInput("Rp", 2);
      },
      sorter: true,
      key: "total",
    },
    {
      title: "Discount",
      dataIndex: "discountPercentage",
      render: (_: string, record: typeProductCart) => {
        return record.discountPercentage + "%";
      },
      sorter: true,
      key: "discountPercentage",
    },
    {
      title: "Total Discount",
      dataIndex: "discountedPrice",
      render: (_: string, record: typeProductCart) => {
        return record.discountedPrice.toString().formatInput("Rp", 2);
      },
      sorter: true,
      key: "discountedPrice",
    },
  ];

  return (
    <div>
      <PageTitle pageTitle="Cart Details" />
      <div style={{ margin: "10px 0" }}>
        <BreadCrumb item={itemBreadcrumb} />
      </div>

      <Card>
        <Row justify="space-between" style={{ marginBottom: "20px" }}>
          <Col>
            <div
              style={{
                fontWeight: "600",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                height: "100%",
              }}
            >
              Details
            </div>
          </Col>
          <Col>
            <Button type="primary" onClick={() => window.history.back()}>
              Back
            </Button>
          </Col>
        </Row>
        <Card style={{ marginBottom: "30px" }}>
          {isLoadingTable ? (
            <Skeleton active />
          ) : (
            <Row gutter={[20, 20]}>
              <Col span={24} sm={12}>
                <Row>
                  <Col span={13} sm={11} md={14} lg={10} xl={6}>
                    User
                  </Col>
                  <Col span={11} sm={13} md={10} lg={14} xl={18}>
                    : {userName}
                  </Col>
                </Row>
              </Col>
              <Col span={24} sm={12}>
                <Row>
                  <Col span={13} sm={11} md={14} lg={10} xl={6}>
                    Total Products
                  </Col>
                  <Col span={11} sm={13} md={10} lg={14} xl={18}>
                    : {dataCart?.totalProducts.toString().formatInput("", 2)}
                  </Col>
                </Row>
              </Col>
              <Col span={24} sm={12}>
                <Row>
                  <Col span={13} sm={11} md={14} lg={10} xl={6}>
                    Total Quantity
                  </Col>
                  <Col span={11} sm={13} md={10} lg={14} xl={18}>
                    : {dataCart?.totalQuantity.toString().formatInput("", 2)}
                  </Col>
                </Row>
              </Col>
              <Col span={24} sm={12}>
                <Row>
                  <Col span={13} sm={11} md={14} lg={10} xl={6}>
                    Total
                  </Col>
                  <Col span={11} sm={13} md={10} lg={14} xl={18}>
                    : {dataCart?.total.toString().formatInput("Rp", 2)}
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
        </Card>

        <Table
          columns={fieldColumns}
          dataSource={dataProductCart}
          onChange={(pagination, filter, sorter) => {
            onChange(pagination, filter, sorter as SorterResult<typeCart>);
          }}
          loading={isLoadingTable}
          pagination={{
            total: meta.total,
            pageSize: meta.limit,
            current: meta.page,
            showSizeChanger: false,
            responsive: true,
          }}
          scroll={{
            x:
              dimension.width *
              (dimension.width < 1200
                ? dimension.width < 900
                  ? dimension.width < 600
                    ? dimension.width < 400
                      ? 4.7
                      : 3.7
                    : 2.7
                  : 1.7
                : 0.7),
          }}
        />
      </Card>
    </div>
  );
}

export default CartDetail;
