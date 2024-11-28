import Pocket from "../HomeComponents/Pocket";
import News from "../HomeComponents/News";
import Unique from "../HomeComponents/Unique";
import Happiness from "../HomeComponents/Happiness";
import Values from "../HomeComponents/Values";
import Ourwebs from "../HomeComponents/Ourwebs";
import FooterItem from "../HomeComponents/FooterItem";
import "react-responsive-carousel/lib/styles/carousel.min.css";

function Home() {
  return (
    <>
      <Unique />
      <News />
      <Happiness />
      <Pocket />
      <Values />
      <Ourwebs />
      <FooterItem />
    </>
  );
}

export default Home;
