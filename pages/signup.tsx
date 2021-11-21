import SignUpForm from '@components/SignupForm'
import { LoggedInUser } from '@state'
import { Presenter, PresenterSignupForm } from '@types'
import { NextPage } from 'next'
import { useRecoilState } from 'recoil'
import { useRouter } from 'next/router'

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
      <SignUpForm onSubmit={onSubmit} />
    </div>
  )
}

export default SignUp
