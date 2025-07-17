import Image from "next/image";
import Navigator from "./components/nav";
import Hero from "./components/hero";
import How from "./components/how-it-works";

export default function Home() {
  return (
    <div className="">
      <Hero />
      <How />
    </div>
  );
}
