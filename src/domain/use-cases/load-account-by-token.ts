import { AccountModel } from '../models/account'
import { Role } from '../models/role'

export interface LoadAccountByToken {
  load: (accessToken: string, role?: Role) => Promise<AccountModel | null>
}
