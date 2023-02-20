// import Head from "next/head";
// import Image from "next/image";
import styles from "@/styles/Home.module.css";
import React from "react";
import PageTitle from "@/components/PageTitle";
import { Card } from "antd";
import { useEffect, useState } from "react";
import ApiProduct from "@/pages/api/product";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface typeDataChart {
  name: string;
  value: number;
}

export default function Home() {
  const [dataChart, setDataChart] = useState<typeDataChart[]>([]);

  useEffect(() => {
    handleGetDataChart();
  }, []);

  const handleGetDataChart = async () => {
    await ApiProduct.getProduct()
      .then((res) => {
        const arrChart: typeDataChart[] = [];
        res.products.forEach((item) => {
          const findIndex = arrChart.findIndex(
            (element) => element.name === item.brand
          );

          if (findIndex === -1) {
            const data = {
              name: item.brand,
              value: 1,
            };
            arrChart.push(data);
          } else {
            const data = {
              name: item.brand,
              value: arrChart[findIndex].value + 1,
            };
            arrChart[findIndex] = data;
          }
        });
        setDataChart(arrChart);
      })
      .catch(() => {});
  };

  return (
    <div>
      <PageTitle pageTitle="Dashboard" />

      <Card title="Brands Overview" style={{ margin: "10px 0 0 0" }}>
        <div className={styles["chart-container"]}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={dataChart}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4DB3FF" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
