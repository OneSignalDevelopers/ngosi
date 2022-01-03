import Auth from '@components/Auth'
import { NextPage } from 'next'

const SignIn: NextPage = () => {
  return (
    <div className="bg-red-400">
      <Auth />
    </div>
  )
}

export default SignIn
