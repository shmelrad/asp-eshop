import { BaseApi } from './base'

interface LoginDto {
  username: string
  password: string
}

interface LoginResponse {
  token: string
}

class AuthApi extends BaseApi {
  constructor() {
    super('/api/account')
  }

  login(data: LoginDto) {
    return this.post<LoginResponse>('/login', data)
  }
}

export const authApi = new AuthApi() 