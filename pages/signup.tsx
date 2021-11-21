import Auth from '@components/Auth'
import { LoggedInUser } from '@state'
import { PresenterSignupForm } from '@types'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'

const SignUp: NextPage = () => {
  const router = useRouter()
  const [user, setUser] = useRecoilState(LoggedInUser)

  const onSubmit = async (values: PresenterSignupForm) => {
    const response = await fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify(values)
    })
    const json = await response.json()
    setUser(json.presenterId)

    router.replace('/preso')
  }

  return (
    <div className="h-screen w-screen bg-primary pt-4 pl-6">
      <h1 className="text-white text-6xl">Sign Up</h1>
      <Auth />
    </div>
  )
}

export default SignUp
