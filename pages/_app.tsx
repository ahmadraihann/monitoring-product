import "@/styles/globals.css";
import type { AppProps } from "next/app";
import MainLayout from "@/components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MainLayout>
      <Component {...pageProps} />
    </MainLayout>
  );
}

declare global {
  interface String {
    formatInput(label: string, precise: number): string;
  }
}

String.prototype.formatInput = function (label: string, precise: number) {
  let clearWordSymbol = this.replace(/[^0-9.]*/g, "");
  if (this.includes(".")) {
    const decimalCount = clearWordSymbol.split(".")[1].length;
    if (decimalCount > precise) {
      clearWordSymbol = Number.parseFloat(clearWordSymbol)
        .toFixed(precise)
        .toString();
    }
    const valSplit = clearWordSymbol.split(".");
    const beforeDot = valSplit[0];
    const afterDot = valSplit[1];
    const valWithComa = beforeDot.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${label}${valWithComa}.${afterDot}`;
  } else {
    return `${label}${clearWordSymbol.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  }
};
