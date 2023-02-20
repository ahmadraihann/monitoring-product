import React, { ReactNode, useState, Dispatch, SetStateAction } from "react";
import { Layout, Menu, theme, Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import Sidebar from "./Sidebar";
import MenuItem from "./Menu";
import Navbar from "./Navbar";
import pages from "./pages";
import styles from "./Layout.module.css";
import { useRouter } from "next/router";
import WindowDimension from "@/utils/resize";

const { Header, Content } = Layout;

interface LayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
  const dimension = WindowDimension();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const Menu = (
    <MenuItem
      pathName={router.pathname}
      setVisible={setVisible}
      items={pages}
    />
  );

  return (
    <Layout style={{ height: "100%" }}>
      <Navbar visible={visible} setVisible={setVisible} menu={Menu} />
      <Layout hasSider>
        <Sidebar collapsed={collapsed} menu={Menu} />
        <Layout
          className={styles["wrapper-content"]}
          style={{
            marginLeft: dimension.width > 767 ? (collapsed ? 80 : 200) : 0,
          }}
        >
          <Header
            className={styles["button-sider"]}
            style={{
              padding: "0 0 0 20px",
              background: colorBgContainer,
              position: "fixed",
              width: "100%",
              zIndex: 99,
            }}
          >
            {/* <Button
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            /> */}
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                onClick: () => setCollapsed(!collapsed),
              }
            )}
          </Header>
          <Content className={styles.content}>{children}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
