import { atom } from 'recoil'

export const LoggedInUser = atom<string | null>({
  key: 'loggedInUser',
  default: null
})
