import PageTitle from "@/components/PageTitle";
import BreadCrumb from "@/components/BreadCrumb";
import React from "react";
import { Card, Table, Row, Col, Select, Input, Button } from "antd";
import WindowDimension from "@/utils/resize";
import { useEffect, useState } from "react";
import { typeCart, responseCart, typeMeta } from "@/types";
import ApiCart from "@/pages/api/cart";
import type { TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import { debounce } from "lodash";
import { EyeOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

const itemBreadcrumb = [
  {
    title: "Cart",
    link: "/cart",
  },
];

function cart() {
  const router = useRouter();
  const dimension = WindowDimension();
  const [meta, setMeta] = useState<typeMeta>({
    limit: 10,
    page: 1,
    skip: 0,
    total: 0,
  });
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [dataTable, setDataTable] = useState<typeCart[]>([]);
  const [dataAllCart, setDataAllCart] = useState<typeCart[]>([]);
  const [valueSearch, setValueSearch] = useState("");

  useEffect(() => {
    handleGetDataCart(meta);
  }, []);

  const handleGetDataCart = async (payload: typeMeta) => {
    setIsLoadingTable(true);
    await ApiCart.getCart()
      .then((res) => {
        processDatatable(res, payload);
      })
      .catch(() => {
        setDataTable([]);
        setIsLoadingTable(false);
      });
  };

  const processDatatable = (response: responseCart, valueMeta: typeMeta) => {
    const arr = response.carts;
    setDataAllCart(arr);
    setDataTable(arr);
    setMeta({
      limit: valueMeta.limit,
      page: valueMeta.page,
      skip: valueMeta.skip,
      total: response.total,
    });
    setIsLoadingTable(false);
  };

  const handleSearch = (value: string) => {
    setIsLoadingTable(true);
    setValueSearch(value);
    handleChangeSearch(value, dataAllCart);
  };

  const handleChangeSearch = React.useRef(
    debounce(async (value: string, dataAllCart: typeCart[]) => {
      setDataTable(
        dataAllCart.filter((item) =>
          item.name.toLowerCase().includes(value.toLowerCase())
        )
      );
      setIsLoadingTable(false);
    }, 500)
  ).current;

  const handleLimit = (value: number) => {
    setIsLoadingTable(true);
    const data = {
      ...meta,
      limit: value,
      page: 1,
      skip: 0,
    };
    setMeta(data);

    const currentPage = (meta.page - 1) * value;
    const arrPage = dataAllCart.slice(currentPage, currentPage + value);
    setDataTable(arrPage);

    setIsLoadingTable(false);
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

    let arrPage: typeCart[] = dataAllCart;

    let arrSort: typeCart[] = [];
    if (sorter.order === "ascend") {
      switch (sorter.field) {
        case "name":
          arrSort = arrPage.sort((a, b) => {
            if (a.name.toLowerCase() < b.name.toLowerCase()) {
              return -1;
            }
            if (a.name.toLowerCase() > b.name.toLowerCase()) {
              return 1;
            }
            return 0;
          });
          break;
        case "totalProducts":
          arrSort = arrPage.sort((a, b) => {
            if (a.totalProducts < b.totalProducts) {
              return -1;
            }
            if (a.totalProducts > b.totalProducts) {
              return 1;
            }
            return 0;
          });
          break;
        case "totalQuantity":
          arrSort = arrPage.sort((a, b) => {
            if (a.totalQuantity < b.totalQuantity) {
              return -1;
            }
            if (a.totalQuantity > b.totalQuantity) {
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
      }
    } else if (sorter.order === "descend") {
      switch (sorter.field) {
        case "name":
          arrSort = arrPage.sort((a, b) => {
            if (a.name.toLowerCase() > b.name.toLowerCase()) {
              return -1;
            }
            if (a.name.toLowerCase() > b.name.toLowerCase()) {
              return 1;
            }
            return 0;
          });
          break;
        case "totalProducts":
          arrSort = arrPage.sort((a, b) => {
            if (a.totalProducts > b.totalProducts) {
              return -1;
            }
            if (a.totalProducts < b.totalProducts) {
              return 1;
            }
            return 0;
          });
          break;
        case "totalQuantity":
          arrSort = arrPage.sort((a, b) => {
            if (a.totalQuantity > b.totalQuantity) {
              return -1;
            }
            if (a.totalQuantity < b.totalQuantity) {
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
      }
    } else {
      arrSort = arrPage;
    }

    const currentPage = (current - 1) * pageSize;
    const arrTable = arrSort.slice(currentPage, currentPage + pageSize);

    setDataTable(arrTable);
    setIsLoadingTable(false);
  };

  const fieldColumns = [
    {
      title: "User Name",
      dataIndex: "name",
      sorter: true,
      key: "name",
    },
    {
      title: "Total Product",
      dataIndex: "totalProducts",
      sorter: true,
      key: "totalProduct",
    },
    {
      title: "Total Quantity",
      dataIndex: "totalQuantity",
      sorter: true,
      key: "totalQuantity",
    },
    {
      title: "Total Price",
      dataIndex: "total",
      render: (_: string, record: typeCart) => {
        return record.total.toString().formatInput("Rp", 2);
      },
      sorter: true,
      key: "total",
    },
    {
      title: (
        <div style={{ display: "flex", justifyContent: "center" }}>Action</div>
      ),
      dataIndex: "action",
      render: (_: string, record: typeCart) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => {
                router.push(`/cart/${record.userId}`);
              }}
            >
              Detail
            </Button>
          </div>
        );
      },
      key: "action",
    },
  ];

  return (
    <div style={{ height: isLoadingTable ? "100vh" : "100%" }}>
      <PageTitle pageTitle="Cart" />
      <div style={{ margin: "10px 0" }}>
        <BreadCrumb item={itemBreadcrumb} />
      </div>

      <Card>
        <Row justify="end" gutter={[10, 10]} style={{ marginBottom: "30px" }}>
          <Col span={8} md={4} xl={2}>
            <Select
              defaultValue={10}
              onChange={(e) => {
                handleLimit(e);
              }}
              style={{
                float: "right",
                width: dimension.width < 769 ? "100%" : "unset",
              }}
            >
              <Select.Option value={10}>10</Select.Option>
              <Select.Option value={20}>20</Select.Option>
              <Select.Option value={50}>50</Select.Option>
              <Select.Option value={100}>100</Select.Option>
            </Select>
          </Col>
          <Col span={16} md={8}>
            <Input
              value={valueSearch}
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
              placeholder="Search"
            />
          </Col>
        </Row>

        <Table
          columns={fieldColumns}
          dataSource={dataTable}
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

export default cart;
