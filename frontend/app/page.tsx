import Navbar from "./componentes/Navbar";
import Landing from "./componentes/Landing";
import WhyDifferentSection from "./componentes/WhyDIfferent";

export default function Home() {
  return (
    <>
      <Navbar textcolor="text-yellow-50" />
      <Landing />
      <WhyDifferentSection />
    </>
  );
}