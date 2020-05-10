import request from '@/utils/request'

export const findRolesByPage = (data: any) =>
  request({
    url: '/role/findRolesByPage',
    method: 'post',
    data
  })
