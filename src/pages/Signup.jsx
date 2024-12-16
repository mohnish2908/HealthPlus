import signupImg from "../assets/signup.jpg"
import Template from "../components/core/Auth/Template"

function Signup() {
  
  return (
    <Template
      title="Join HealthPlus Today!"
      description1="Empower yourself with the best health practices."
      description2="Your journey to a healthier life starts here."
      image={signupImg}
      formType="signup"
    />
  )
}

export default Signup
