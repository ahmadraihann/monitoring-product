import { Spin } from "antd";
import styles from "./SplashScreen.module.css";
import { SmileFilled } from "@ant-design/icons";

export default function SplashScreen() {
  return (
    <div className={styles["splash-screen"]}>
      <Spin size="large" />
      <div className={styles["wrapper-logo"]}>
        <SmileFilled style={{ fontSize: "25px" }} />
        <div style={{ fontWeight: "600", fontSize: "20px" }}>SMILE</div>
      </div>
    </div>
  );
}
