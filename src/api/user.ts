import request from '@/utils/request'

export const getUserInfo = (id: number) =>
  request({
    url: 'pmi/user/' + id,
    method: 'get'
  })

export const login = (data: any) =>
  request({
    url: 'pmi/user/login',
    method: 'post',
    data
  })

export const logout = () =>
  request({
    url: '/user/logout',
    method: 'post'
  })
