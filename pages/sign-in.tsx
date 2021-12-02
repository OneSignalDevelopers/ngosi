import Auth from '@components/Auth'
import { NextPage } from 'next'

const SignIn: NextPage = () => {
  return (
    <div className="h-screen w-screen bg-primary pt-4 pl-6">
      <div className="">
        <Auth />
      </div>
    </div>
  )
}

export default SignIn
