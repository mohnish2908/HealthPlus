import React, { useState, useEffect } from 'react';

const Calculation = ({ age, weight, height }) => {
  const [bmiCategory, setBmiCategory] = useState("Normal");
  const [color, setColor] = useState("green");
  const BMI = weight /(height * height) * 10000;

  useEffect(() => {
    if (BMI < 16) {
        setBmiCategory("Severely underweight");
        setColor("red");
    } else if (BMI >= 16 && BMI < 18.5) {
        setBmiCategory("Underweight");
        setColor("yellow");
    } else if (BMI >= 18.5 && BMI < 25) {
        setBmiCategory("Normal");
        setColor("green");
    } else if (BMI >= 25 && BMI < 30) {
        setBmiCategory("Overweight");
        setColor("yellow");
    } else if (BMI >= 30 && BMI < 35) {
        setBmiCategory("Obese Class 1");
        setColor("orange");
    } else if (BMI >= 35 && BMI < 40) {
        setBmiCategory("Obese Class 2");
        setColor("red");
    } else if (BMI >= 40) {
        setBmiCategory("Obese Class 3");
        setColor("red");
    }
  }, [BMI]); // Dependency array to rerun the effect when BMR changes

  return (
    <div className='flex flex-row gap-4 items-cente justify-center'>
       
      <p className='text-black text-center text-[13px] px-6 py-3 rounded-md font-bold bg-yellow-50 	'>BMI: {BMI.toFixed(2)}</p>
      <p className='text-black text-center text-[13px] px-6 py-3 rounded-md font-bold' style={{ backgroundColor: color }}>Category: {bmiCategory}</p>

      {/* <p className={`text-black text-center text-[13px] px-6 py-3 rounded-md font-bold bg-yellow-50`} >Category: {bmiCategory}</p> */}
    </div>
  );
};

export default Calculation;
