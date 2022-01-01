import Auth from '@components/Auth'
import { NextPage } from 'next'

const SignIn: NextPage = () => {
  return (
    <div className="bg-primary">
      <Auth />
    </div>
  )
}

export default SignIn
