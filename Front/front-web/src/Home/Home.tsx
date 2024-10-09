import "./Home.css";
import MainLayout from "./components/main-layout/main-layout";
import { SectionIdEnum } from "./types";
import Intro from "./Section/Intro";
import Service from "./Section/Service";
import About from "./Section/About";
import { SectionContainer } from "./components/section-container";

const sections = [
  {
    sectionId: SectionIdEnum.home,
    component: <Intro />,
  },
  {
    sectionId: SectionIdEnum.service,
    component: <Service />,
  },
  {
    sectionId: SectionIdEnum.about,
    component: <About />,
  },
];

const Home = () => {
  return (
    <MainLayout>
      {sections.map(({ component, sectionId }) => {
        return (
          <SectionContainer sectionId={sectionId} key={sectionId}>
            {component}
          </SectionContainer>
        );
      })}
    </MainLayout>
  );
};

export default Home;
