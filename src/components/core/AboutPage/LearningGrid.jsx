import React from "react";
import HighlightText from "../../../components/core/HomePage/HighlightText";
import CTAButton from "../../../components/core/HomePage/Button";

const LearningGridArray = [
  {
    order: -1,
    heading: "Empowering Health for",
    highliteText: "Everyone, Everywhere",
    description:
      "Our platform collaborates with top health and wellness experts to bring accessible, affordable, and personalized health guidance to individuals around the world.",
    BtnText: "Discover More",
    BtnLink: "/",
  },
  {
    order: 1,
    heading: "Tailored Plans to Meet Your Goals",
    description:
      "Save time and stay on track! Our health programs are designed to be easy to follow and are crafted to suit individual health needs and goals.",
  },
  {
    order: 2,
    heading: "Our Approach to Wellness",
    description:
      "Combining the latest health insights with expert guidance, we offer structured and dynamic plans for every stage of your fitness journey.",
  },
  {
    order: 3,
    heading: "Track Your Progress",
    description:
      "Our tools allow you to monitor your daily intake, activity, and milestones, helping you stay informed and motivated along the way.",
  },
  {
    order: 4,
    heading: "Automatic Calorie Calculation",
    description:
      "Get accurate and personalized calorie tracking with our smart, automated system that adjusts to your daily inputs.",
  },
  {
    order: 5,
    heading: "Prepared for a Healthier You",
    description:
      "Our platform is ready to guide you on the path to improved wellness, helping you make lasting changes for a healthier lifestyle.",
  },
];

const LearningGrid = () => {
  return (
    <div className="grid mx-auto w-[350px] xl:w-fit grid-cols-1 xl:grid-cols-4 mb-12">
      {LearningGridArray.map((card, i) => {
        return (
          <div
            key={i}
            className={`${i === 0 && "xl:col-span-2 xl:h-[294px]"}  ${
              card.order % 2 === 1
                ? "bg-richblack-700 h-[294px]"
                : card.order % 2 === 0
                ? "bg-richblack-800 h-[294px]"
                : "bg-transparent"
            } ${card.order === 3 && "xl:col-start-2"}  `}
          >
            {card.order < 0 ? (
              <div className="xl:w-[90%] flex flex-col gap-3 pb-10 xl:pb-0">
                <div className="text-4xl font-semibold ">
                  {card.heading}
                  <HighlightText text={card.highliteText} />
                </div>
                <p className="text-richblack-300 font-medium">
                  {card.description}
                </p>

                <div className="w-fit mt-2">
                  <CTAButton active={true} linkto={card.BtnLink}>
                    {card.BtnText}
                  </CTAButton>
                </div>
              </div>
            ) : (
              <div className="p-8 flex flex-col gap-8">
                <h1 className="text-richblack-5 text-lg">{card.heading}</h1>

                <p className="text-richblack-300 font-medium">
                  {card.description}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LearningGrid;
