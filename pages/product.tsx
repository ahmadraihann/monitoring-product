import React from "react";
import PageTitle from "@/components/PageTitle";
import BreadCrumb from "@/components/BreadCrumb";
import { Card, Table, Row, Col, Select, Input, Button } from "antd";
import WindowDimension from "@/utils/resize";
import { useEffect, useState } from "react";
import ApiProduct from "@/pages/api/product";
import { typeProduct, responseProduct, typeMeta } from "@/types";
import type { TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import { debounce } from "lodash";

const itemBreadcrumb = [
  {
    title: "Product",
    link: "/",
  },
];

interface typeCategory {
  name: string;
  id: number;
  key: string;
}

interface typeBrand {
  name: string;
  id: number;
}

interface typeProductName {
  name: string;
  id: number;
}

interface typePrice {
  valueMin: string;
  valueMax: string;
}
interface typeFilter {
  valueBrand: string | null;
  valueCategory: string | null;
  valueProductName: string | null;
  valueMin: number | null;
  valueMax: number | null;
}

export default function product() {
  const dimension = WindowDimension();
  const [meta, setMeta] = useState<typeMeta>({
    limit: 10,
    page: 1,
    skip: 0,
    total: 0,
  });
  const [valueSearch, setValueSearch] = useState("");
  const [dataAllProduct, setAllDataproduct] = useState<typeProduct[]>([]);
  const [dataAllProductFilter, setAllDataproductFilter] = useState<
    typeProduct[]
  >([]);
  const [dataTable, setDataTable] = useState<typeProduct[]>([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [dataCategory, setDataCategory] = useState<typeCategory[]>([]);
  const [dataBrand, setDataBrand] = useState<typeBrand[]>([]);
  const [dataProductName, setDataProductName] = useState<typeProductName[]>([]);
  const [dataAllCategory, setDataAllCategory] = useState<typeCategory[]>([]);
  const [dataAllBrand, setDataAllBrand] = useState<typeBrand[]>([]);
  const [dataAllProductName, setDataAllProductName] = useState<
    typeProductName[]
  >([]);
  const [valueFilter, setValueFilter] = useState<typeFilter>({
    valueBrand: null,
    valueCategory: null,
    valueProductName: null,
    valueMin: null,
    valueMax: null,
  });
  const [valuePrice, setValuePrice] = useState<typePrice>({
    valueMax: "",
    valueMin: "",
  });
  const [isApply, setIsApply] = useState(false);

  useEffect(() => {
    handleGetDataProduct(meta);
    handleGetDataCategory();
  }, []);

  const handleGetDataProduct = async (payload: typeMeta) => {
    setIsLoadingTable(true);
    await ApiProduct.getProduct()
      .then((res) => {
        handleGetProductBrand(res);
        processDatatable(res, payload);
      })
      .catch(() => {
        setDataTable([]);
        setIsLoadingTable(false);
      });
  };

  const handleGetDataCategory = async () => {
    await ApiProduct.getCategory()
      .then((res) => {
        const array: typeCategory[] = [];
        res.forEach((item, index) => {
          let name = "";
          if (item.includes("-")) {
            name = item
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
              .join(" ");
          } else {
            name = item.charAt(0).toUpperCase() + item.substring(1);
          }

          const data = {
            name: name,
            key: item,
            id: index,
          };
          array.push(data);
        });

        const sortCategory = array.sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
          }
          if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
          }
          return 0;
        });
        setDataCategory(sortCategory);
        setDataAllCategory(sortCategory);
      })
      .catch(() => {});
  };

  const handleGetProductBrand = (response: responseProduct) => {
    const brand: typeBrand[] = [];
    const product: typeProductName[] = [];

    response.products.forEach((item, index) => {
      const findItemBrand = brand.find(
        (element) => element.name === item.brand
      );
      if (!findItemBrand) {
        const objBrand = {
          name: item.brand,
          id: index,
        };
        brand.push(objBrand);
      }

      const findItemProduct = brand.find(
        (element) => element.name === item.title
      );
      if (!findItemProduct) {
        const objProduct = {
          name: item.title,
          id: index,
        };
        product.push(objProduct);
      }
    });

    const sortBrand = brand.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }
      return 0;
    });

    const sortProduct = product.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }
      return 0;
    });

    setDataBrand(sortBrand);
    setDataAllBrand(sortBrand);

    setDataProductName(sortProduct);
    setDataAllProductName(sortProduct);
  };

  const processDatatable = (response: responseProduct, valueMeta: typeMeta) => {
    const arr = response.products;
    setAllDataproduct(arr);
    setDataTable(arr);
    setMeta({
      limit: valueMeta.limit,
      page: valueMeta.page,
      skip: valueMeta.skip,
      total: response.total,
    });
    setIsLoadingTable(false);
  };

  const onChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<typeProduct>
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

    let arrPage: typeProduct[] = [];
    if (
      valueFilter.valueBrand !== null &&
      valueFilter.valueCategory !== null &&
      valueFilter.valueProductName !== null &&
      valueFilter.valueMin !== null &&
      valueFilter.valueMax !== null
    ) {
      arrPage = dataAllProductFilter;
    } else {
      arrPage = dataAllProduct;
    }

    let arrSort: typeProduct[] = [];
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
        case "brand":
          arrSort = arrPage.sort((a, b) => {
            if (a.brand.toLowerCase() < b.brand.toLowerCase()) {
              return -1;
            }
            if (a.brand.toLowerCase() > b.brand.toLowerCase()) {
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
        case "stock":
          arrSort = arrPage.sort((a, b) => {
            if (a.stock < b.stock) {
              return -1;
            }
            if (a.stock > b.stock) {
              return 1;
            }
            return 0;
          });
          break;
        case "category":
          arrSort = arrPage.sort((a, b) => {
            if (a.category.toLowerCase() < b.category.toLowerCase()) {
              return -1;
            }
            if (a.category.toLowerCase() > b.category.toLowerCase()) {
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
        case "brand":
          arrSort = arrPage.sort((a, b) => {
            if (a.brand.toLowerCase() > b.brand.toLowerCase()) {
              return -1;
            }
            if (a.brand.toLowerCase() < b.brand.toLowerCase()) {
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
        case "stock":
          arrSort = arrPage.sort((a, b) => {
            if (a.stock > b.stock) {
              return -1;
            }
            if (a.stock < b.stock) {
              return 1;
            }
            return 0;
          });
          break;
        case "category":
          arrSort = arrPage.sort((a, b) => {
            if (a.category.toLowerCase() > b.category.toLowerCase()) {
              return -1;
            }
            if (a.category.toLowerCase() < b.category.toLowerCase()) {
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
    const arrPage = dataAllProduct.slice(currentPage, currentPage + value);
    setDataTable(arrPage);

    setIsLoadingTable(false);
  };

  const handleSearch = (value: string) => {
    setIsLoadingTable(true);
    setValueSearch(value);
    handleChangeSearch(value);
  };

  const handleChangeSearch = React.useRef(
    debounce(async (value: string) => {
      ApiProduct.searchProduct(value)
        .then((res) => processDatatable(res, meta))
        .catch(() => {});
    }, 500)
  ).current;

  const handleSearchProduct = (value: string) => {
    setDataProductName(
      dataAllProductName.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleSearchBrand = (value: string) => {
    setDataBrand(
      dataAllBrand.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleSearchCategory = (value: string) => {
    setDataCategory(
      dataAllCategory.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleFilter = (payload: typeFilter) => {
    setValueFilter({
      valueBrand: payload.valueBrand,
      valueCategory: payload.valueCategory,
      valueProductName: payload.valueProductName,
      valueMin: payload.valueMin,
      valueMax: payload.valueMax,
    });

    let arrCategory = [];
    if (typeof payload.valueCategory === "string") {
      arrCategory = dataAllProduct.filter(
        (item) => item.category === payload.valueCategory
      );
    } else {
      arrCategory = dataAllProduct;
    }

    let arrBrand = [];
    if (typeof payload.valueBrand === "string") {
      arrBrand = arrCategory.filter(
        (item) => item.brand === payload.valueBrand
      );
    } else {
      arrBrand = arrCategory;
    }

    let arrProduct = [];
    if (typeof payload.valueProductName === "string") {
      arrProduct = arrBrand.filter(
        (item) => item.title === payload.valueProductName
      );
    } else {
      arrProduct = arrBrand;
    }

    const min = payload.valueMin === null ? 0 : payload.valueMin;
    const max = payload.valueMax === null ? 0 : payload.valueMax;
    let arrPrice = [];
    if (min === 0 && max === 0) {
      arrPrice = arrProduct;
    } else {
      arrPrice = arrProduct.filter(
        (item) => item.price >= min && item.price <= max
      );
    }

    setMeta({
      limit: 10,
      skip: 0,
      page: 1,
      total: arrPrice.length,
    });
    setDataTable(arrPrice);
    setAllDataproductFilter(arrPrice);
  };

  const fieldColumns = [
    {
      title: "Product Name",
      dataIndex: "title",
      sorter: true,
      key: "product",
    },
    {
      title: "Brand",
      dataIndex: "brand",
      sorter: true,
      key: "brand",
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (_: string, record: typeProduct) => {
        return record.price.toString().formatInput("Rp", 2);
      },
      sorter: true,
      key: "price",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      sorter: true,
      key: "stock",
    },
    {
      title: "Category",
      dataIndex: "category",
      sorter: true,
      key: "category",
    },
  ];

  return (
    <div style={{ height: isLoadingTable ? "100vh" : "100%" }}>
      <PageTitle pageTitle="Product" />
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
              placeholder="Search Product"
              // style={{
              //   maxWidth: dimension.width < 768 ? "100%" : "250px",
              //   float: "right",
              // }}
            />
          </Col>
        </Row>

        <Row gutter={[30, 10]} style={{ marginBottom: "20px" }}>
          <Col span={24} lg={12}>
            <Row>
              <Col span={24}>
                <Row gutter={[10, 10]}>
                  <Col span={24} md={9} lg={9}>
                    <Input
                      value={valuePrice.valueMin}
                      onChange={(e) => {
                        setIsApply(false);
                        setValuePrice({
                          ...valuePrice,
                          valueMin: e.target.value.formatInput("", 2),
                        });
                      }}
                      placeholder="Min"
                    />
                  </Col>
                  <Col span={24} md={9} lg={9}>
                    <Input
                      value={valuePrice.valueMax}
                      onChange={(e) => {
                        setIsApply(false);
                        setValuePrice({
                          ...valuePrice,
                          valueMax: e.target.value.formatInput("", 2),
                        });
                      }}
                      placeholder="Max"
                    />
                  </Col>
                  <Col span={24} md={6} lg={6}>
                    <Button
                      type="primary"
                      danger={isApply ? true : false}
                      onClick={() => {
                        if (!isApply) {
                          const data = {
                            ...valueFilter,
                            valueMin:
                              valuePrice.valueMin === ""
                                ? 0
                                : parseInt(
                                    valuePrice.valueMin.split(",").join("")
                                  ),
                            valueMax:
                              valuePrice.valueMax === ""
                                ? 0
                                : parseInt(
                                    valuePrice.valueMax.split(",").join("")
                                  ),
                          };
                          handleFilter(data);
                        } else {
                          setValuePrice({ valueMin: "", valueMax: "" });
                          const data = {
                            ...valueFilter,
                            valueMin: 0,
                            valueMax: 0,
                          };
                          handleFilter(data);
                        }
                        setIsApply(!isApply);
                      }}
                      style={{ width: "100%" }}
                      disabled={
                        valuePrice.valueMin === "" || valuePrice.valueMax === ""
                          ? true
                          : false
                      }
                    >
                      {isApply ? "Cancel" : "Apply"}
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col span={24} lg={12}>
            <Row gutter={[10, 10]}>
              <Col span={24} sm={8} md={8} lg={8}>
                <Select
                  value={
                    valueFilter === undefined ? null : valueFilter.valueBrand
                  }
                  onChange={(e) => {
                    const data = {
                      ...valueFilter,
                      valueBrand: e === undefined ? null : e,
                    };
                    handleFilter(data);
                  }}
                  onSearch={(e) => {
                    handleSearchBrand(e);
                  }}
                  placeholder="Brand"
                  allowClear
                  style={{ width: "100%" }}
                  showSearch
                  filterOption={false}
                >
                  {dataBrand.map((item, index) => {
                    return (
                      <Select.Option key={index} value={item.name}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Col>
              <Col span={24} sm={8} md={8} lg={8}>
                <Select
                  value={
                    valueFilter === undefined
                      ? null
                      : valueFilter.valueProductName
                  }
                  onChange={(e) => {
                    const data = {
                      ...valueFilter,
                      valueProductName: e === undefined ? null : e,
                    };
                    handleFilter(data);
                  }}
                  onSearch={(e) => {
                    handleSearchProduct(e);
                  }}
                  placeholder="Product"
                  allowClear
                  style={{ width: "100%" }}
                  showSearch
                  filterOption={false}
                >
                  {dataProductName.map((item, index) => {
                    return (
                      <Select.Option key={index} value={item.name}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Col>
              <Col span={24} sm={8} md={8} lg={8}>
                <Select
                  value={
                    valueFilter === undefined ? null : valueFilter.valueCategory
                  }
                  onChange={(e) => {
                    const data = {
                      ...valueFilter,
                      valueCategory: e === undefined ? null : e,
                    };
                    handleFilter(data);
                  }}
                  onSearch={(e) => {
                    handleSearchCategory(e);
                  }}
                  placeholder="Category"
                  allowClear
                  style={{ width: "100%" }}
                  showSearch
                  filterOption={false}
                >
                  {dataCategory.map((item, index) => {
                    return (
                      <Select.Option key={index} value={item.key}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Col>
            </Row>
          </Col>
        </Row>

        <Table
          columns={fieldColumns}
          dataSource={dataTable}
          onChange={(pagination, filter, sorter) => {
            onChange(pagination, filter, sorter as SorterResult<typeProduct>);
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
