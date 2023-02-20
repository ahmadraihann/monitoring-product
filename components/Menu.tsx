import React, { useState } from "react";
import { Menu } from "antd";
import { typePages } from "@/types";
import Link from "next/link";
import {
  ShopOutlined,
  ShoppingCartOutlined,
  DashboardOutlined,
} from "@ant-design/icons";

interface propsType {
  items: typePages[];
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  pathName: string;
}

const icon = [
  <DashboardOutlined />,
  <ShopOutlined />,
  <ShoppingCartOutlined />,
];

function MenuItem({ items, setVisible, pathName }: propsType) {
  const [selectedKey, setSelectedKey] = useState(
    pathName === "/" ? "dashboard" : pathName.split("/")[1]
  );
  const changeSelectedKey = (key: string) => {
    setSelectedKey(key);
  };

  return (
    <Menu
      style={{ borderInlineEnd: "none !important" }}
      mode="inline"
      selectedKeys={[selectedKey]}
    >
      {items.map((element, index) => {
        return (
          <Menu.Item
            key={element.key}
            icon={icon[index]}
            onClick={() => {
              setVisible(false);
              changeSelectedKey(element.key);
            }}
          >
            <Link href={element.link}>{element.title}</Link>
          </Menu.Item>
        );
      })}
    </Menu>
  );
}

export default MenuItem;
