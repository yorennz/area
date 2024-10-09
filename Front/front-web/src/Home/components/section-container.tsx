import { SectionIdEnum } from "../types";

export type SectionContainerProps = {
  children: React.ReactNode;
  sectionId: SectionIdEnum;
};

export const SectionContainer: React.FC<SectionContainerProps> = ({
  children,
  sectionId,
}) => {
  return (
    <div id={sectionId} key={sectionId}>
      <div style={{ height: "100vh" }}>{children}</div>
    </div>
  );
};
