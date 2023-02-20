import { Layout } from "antd";
import styles from "./Layout.module.css";
import { SmileFilled } from "@ant-design/icons";

const { Sider } = Layout;

interface propsType {
  collapsed: boolean;
  menu: JSX.Element;
}

export default function Sidebar({ collapsed, menu }: propsType) {
  return (
    <Sider
      className={styles.sidebar}
      breakpoint={"lg"}
      theme="light"
      //   collapsedWidth={0}
      trigger={null}
      collapsible
      collapsed={collapsed}
    >
      <div className={styles.logo}>
        <SmileFilled style={{ fontSize: "25px" }} />{" "}
        {!collapsed ? <p className={styles["logo-title"]}>SMILE</p> : null}
      </div>
      {menu}
    </Sider>
  );
}
