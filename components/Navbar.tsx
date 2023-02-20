import React, { useEffect } from "react";
import { Drawer, Button } from "antd";
import styles from "./Layout.module.css";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SmileFilled,
  CloseOutlined,
} from "@ant-design/icons";
import WindowDimension from "@/utils/resize";

interface propsType {
  menu: JSX.Element;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

function Navbar({ menu, visible, setVisible }: propsType) {
  const dimension = WindowDimension();

  useEffect(() => {
    if (dimension.width > 768) {
      setVisible(false);
    }
  });

  return (
    <nav className={styles.navbar}>
      <Button
        className={styles.menu}
        type="text"
        icon={visible ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setVisible(true)}
      />
      <Drawer
        title={
          <div className={styles["logo-mobile"]}>
            <div className={styles.logo}>
              <SmileFilled style={{ fontSize: "20px" }} />{" "}
              <p className={styles["logo-title"]}>SMILE</p>
            </div>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setVisible(false)}
            />
          </div>
        }
        placement="left"
        closable={false}
        onClose={() => setVisible(false)}
        open={visible}
        width={200}
      >
        <div style={{ margin: "-24px" }}>{menu}</div>
      </Drawer>
    </nav>
  );
}

export default Navbar;
