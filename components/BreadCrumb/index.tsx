import Link from "next/link";
import { Breadcrumb } from "antd";

interface arrayType {
  title: string;
  link: string;
}

interface propsType {
  item: arrayType[];
}

export default function BreadCrumb({ item }: propsType) {
  console.log("item", item);
  return (
    <Breadcrumb>
      {item.map((element) => {
        return <Breadcrumb.Item>{element.title}</Breadcrumb.Item>;
      })}
    </Breadcrumb>
  );
}
