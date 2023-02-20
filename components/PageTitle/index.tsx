import { Col, Row } from "antd";
import styles from "./PageTitle.module.css";

interface propsType {
  pageTitle: string;
}

export default function PageTitle({ pageTitle }: propsType) {
  return (
    <Col span={24}>
      <Row>
        <Col span={24}>
          {pageTitle && <h3 className={styles.title}>{pageTitle}</h3>}
        </Col>
      </Row>
    </Col>
  );
}
