import loginImg from "../assets/login.jpg"
import Template from "../components/core/Auth/Template"

function Login() {
  return (
    <Template
      title="Welcome Back to HealthPlus"
      description1="Track your health and wellness journey."
      description2="Your partner in achieving a healthier lifestyle."
      image={loginImg}
      formType="login"
    />
  )
}

export default Login
