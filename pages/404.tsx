// import Image from "next/image";
import { Image } from "antd";
import styles from "@/styles/Home.module.css";

export default function NotFound() {
  return (
    <div className={styles.notfound}>
      <Image
        src="/images/NotFound.png"
        alt="Not Found"
        width={700}
        preview={false}
      />
    </div>
  );
}
