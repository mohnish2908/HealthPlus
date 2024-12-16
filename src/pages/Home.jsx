import React from 'react'
import {FaArrowRight} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import HighlightText from '../components/core/HomePage/HighlightText'
import Button from '../components/core/HomePage/Button'
import video from '../assets/video.mp4'
import {TypeAnimation} from 'react-type-animation'
import { useState } from "react";
import Cal from '../components/core/HomePage/Calculation'
import coach1 from '../assets/coach1.jpg';
import coach2 from '../assets/coach2.jpg';
import coach3 from '../assets/coach3.jpg';
const Home = () => {
  const [age, setage] = useState(null);
  const [weight, setweight] = useState(55);
  const [height, setheight] = useState(168);
  return (
    <div>
      {/* sectoin 1 */}
      <div className="relative mx-auto flex flex-col w-11/12 items-center text-white justify-between max-w-maxContent">
         
        <Link to={"/signup"}>
            <div className='group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit'>
                <div className='flex flex-row items-center gap- rounded-full px-10 py-[5px] group-hover:bg-richblack-900'>
                    <p>Become an Instructor</p>
                    <FaArrowRight />
                </div>
            </div>
        </Link>
        
        
        <div className='text-center text-4xl font-semibold mt-4'>
          Your journey to a 
          <HighlightText text={" healthier future "}></HighlightText>
          starts today
        </div>
        

        <div>
        {/* <TypeAnimation 
          sequence={[
            'With the help of our platform, transform your life in a healthier way. Track your daily calories effortlessly, and explore the latest courses to learn better habits for a healthy lifestyle.',
            5000,
          ]}
          wrapper="span"
          // speed={5}
          style={{ marginTop: '1rem', fontSize: '1.2rem', color: '#a4a4aa', fontWeight: '700', width:'90%', textAlign:'center' }} 
          // repeat={Infinity}
          /> */}

        </div>


        <div className='mt-4 w-[90%] text-center text-lg font-bold text-richblack-300'>
            With the help of our platform, transform your life in a healthier way. Track your daily calories effortlessly, and explore the latest courses to learn better habits for a healthy lifestyle.
        </div>

        <div className='flex flex-row gap-4 mt-8'>
          <Button text={"Learn More"}  active={true} linkto={"/signup"}>
            Learn More
          </Button>

          <Button text={"Book a Demo"} active={false} linkto={"/login"}>
            Book a demo
          </Button>
        </div>

        <div className='shadow-blue-200 w-3/4 mt-5'>
          <video 
          muted
          loop
          autoPlay >
            <source src={video} type="video/mp4"/>
          </video>
        </div>


      </div>
      {/* sectoin 2 */}
      
      
      {/* <div>
      <input type="range" className="custom-range" min="199" max="3999" 
       onChange={(event) => setRangeval(event.target.value)} />
      <h4 className="text-richblack-200">The range value is {rangeval}</h4>
      
      <h2 mo={rangeval}>{mo}</h2>
    </div> */}

     
      {/* sectoin 3  Bmi calculator*/}

      <div className='flex flex-col text-white items-center justify-between mt-10'>
        <div className='flex flex-col w-[50%] text-white items-center justify-between mt-10 border-2 rounded'>
      
          <p className='text-white text-4xl font-semibold mt-4'>Calculate your <HighlightText text={" BMI "}></HighlightText></p>
          <div className='flex flex-col w-1/4 gap-4 realative items-center justify-between mt-10'>
        
        
            <div className='flex flex-row text-white text-2xl'>
                <p>Weight</p>
                <input type='range' min='30' max='200' weight={weight} onChange={(e) => setweight(e.target.value)} />
                <p>{weight}</p>
            </div>
        
            <div className='flex flex-row text-white text-2xl'>
                <p>Height</p>
                <input type='range' min='100' max='250' height={height} onChange={(e) => setheight(e.target.value)} />  
                <p>{height}</p>
            </div>
        
            </div>
    
            <div className='mt-10 mb-4'>
              <Cal age={age} weight={weight} height={height} />
            </div>
          </div>
        </div>

              {/* sectoin 3 coaches */}
        <div className="bg-pure-greys-5 flex flex-col mt-10 pb-10">
          <div className="flex justify-center items-center mt-10">
            <p className='text-4xl font-semibold text-center'> Learn from the <HighlightText text={" Best Coaches "}/> worldwide</p>
          </div>
          <div className='mt-8 w-[90%] text-center text-lg font-bold translate-x-8 text-pure-greys-500'>
            Unlock your potential with personalized coaching from the best coaches worldwide. Gain expert guidance, tailored strategies, and support to achieve your fitness, wellness, and professional goals, no matter where you are.
          </div>

          <div className='flex flex-row w-[80%] justify-center items-center gap-8 translate-x-[15%] mt-8'>
            
            <div className='w-1/5 '>
              <img src={coach2} alt="coach2" className='rounded-lg'/>
            </div>
            <div className='w-1/4'>
            <img src={coach1} alt="coach1" className='rounded-lg'/>
            </div>
            <div className='w-1/5'>
              <img src={coach3} alt="coach3" className='rounded-lg'/>
            </div>
          
          </div>

          <div className="mt-8 w-[90%] text-center text-lg font-bold translate-x-8 ">
            Get your personalized coaching today:
            <div className="w-1/6 flex justify-center items-center translate-x-[250%] mt-5"><Button text={"Get Started"} active={false} linkto={"/signup"} /></div>
          </div>

          {/* login/signup/dashboard */}
          <div>
            
          </div>


        </div>
    </div>


  )
}

export default Home
