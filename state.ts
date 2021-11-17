import { atom } from 'recoil'

export const LoggedInUser = atom<string | null>({
  key: 'loggedInUser',
  default: 'ckw2xp8y90002ldbgcifj1f80'
})
