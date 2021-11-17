import { NextPage } from 'next'
import SignUpForm from '@components/SignupForm'

const SignUp: NextPage = () => {
  return (
    <div className="h-screen w-screen bg-primary pt-4 pl-6">
      <h1 className="text-white text-6xl">Sign Up</h1>
      <SignUpForm />
    </div>
  )
}

export default SignUp
