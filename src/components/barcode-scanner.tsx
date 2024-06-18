import dynamic from "next/dynamic";

const BarcodeScanner = dynamic(
  () => {
    import("react-barcode-scanner/polyfill");
    return import("react-barcode-scanner").then((mod) => mod.BarcodeScanner);
  },
  { ssr: false },
);

const BarcodeScannerWrapper = (props: any) => {
  const options = { formats: ["ean_13"] };
  return <BarcodeScanner {...props} options={options} />;
};

export default BarcodeScannerWrapper;
