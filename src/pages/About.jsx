import React from "react";

import FoundingStory from "../assets/FoundingStory.jpg";
import BannerImage1 from "../assets/aboutus1.jpg";
import BannerImage2 from "../assets/aboutus2.jpg";
import BannerImage3 from "../assets/aboutus3.jpg";
// import Footer from "../components/Common/Footer";
// import ReviewSlider from "../components/Common/ReviewSlider";//
import ContactFormSection from "../components/core/AboutPage/ContactFormSection";
import LearningGrid from "../components/core/AboutPage/LearningGrid";
import Quote from "../components/core/AboutPage/Quote";
import StatsComponent from "../components/core/AboutPage/Stats";
import HighlightText from "../components/core/HomePage/HighlightText";

const About = () => {
  return (
    <div>
      <section className="bg-richblack-700">
        <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-center text-white">
          <header className="mx-auto py-20 text-4xl font-semibold lg:w-[70%]">
            Empowering a Healthier Lifestyle for a
            <HighlightText text={"Brighter Future"} />
            <p className="mx-auto mt-3 text-center text-base font-medium text-richblack-300 lg:w-[95%]">
              HealthPlus is committed to enhancing your well-being by providing
              the tools and insights you need to make healthier choices. With
              our innovative tracking system, personalized insights, and
              community support, we aim to empower you to take control of your
              health journey.
            </p>
          </header>
          <div className="sm:h-[70px] lg:h-[150px]"></div>
          <div className="absolute bottom-0 left-[50%] grid w-[100%] translate-x-[-50%] translate-y-[30%] grid-cols-3 gap-3 lg:gap-5">
            <img src={BannerImage1} alt="" />
            <img src={BannerImage2} alt="" />
            <img src={BannerImage3} alt="" />
          </div>
        </div>
      </section>

      <section className="border-b border-richblack-700">
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500">
          <div className="h-[100px]"></div>
          <Quote />
        </div>
      </section>

      <section>
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500">
          <div className="flex flex-col items-center gap-10 lg:flex-row justify-between">
            <div className="my-24 flex lg:w-[50%] flex-col gap-10">
              <h1 className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%]">
                Our Journey
              </h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                HealthPlus was created by a team of health enthusiasts and
                technologists who saw the need for a better way to track
                nutrition and well-being. Our goal was to develop a platform
                that provides actionable insights, helping people make informed
                decisions about their daily food intake and lifestyle.
              </p>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                We wanted to simplify the journey to a healthier life by
                leveraging technology to provide easy access to nutrition
                tracking, daily health tips, and a supportive community. This
                vision drives every feature we add and every improvement we
                make.
              </p>
            </div>

            <div>
              <img
                src={FoundingStory}
                alt=""
                className="shadow-[0_0_20px_0] shadow-[#FC6767]"
              />
            </div>
          </div>
          <div className="flex flex-col items-center lg:gap-10 lg:flex-row justify-between">
            <div className="my-24 flex lg:w-[40%] flex-col gap-10">
              <h1 className="bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%]">
                Our Vision
              </h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                Our vision is to inspire a community where everyone has the
                resources and support to pursue a healthy lifestyle. Through
                personalized data and community support, HealthPlus helps you
                understand your unique needs and empowers you to achieve your
                health goals.
              </p>
            </div>
            <div className="my-24 flex lg:w-[40%] flex-col gap-10">
              <h1 className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text text-4xl font-semibold lg:w-[70%]">
                Our Mission
              </h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                HealthPlus aims to go beyond traditional tracking by offering
                meaningful insights, setting achievable goals, and fostering a
                supportive community. We believe that health is a continuous
                journey, and we’re here to support you every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      <StatsComponent />
      <section className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white">
        <LearningGrid />
        <ContactFormSection />
      </section>

      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        <h1 className="text-center text-4xl font-semibold mt-8">
          Success Stories from Our Users
        </h1>
        {/* <ReviewSlider /> */}
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default About;
