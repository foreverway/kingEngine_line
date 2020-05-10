import Cookies from 'js-cookie'

// App
const sidebarStatusKey = 'sidebar_status'
export const getSidebarStatus = () => Cookies.get(sidebarStatusKey)
export const setSidebarStatus = (sidebarStatus: string) => Cookies.set(sidebarStatusKey, sidebarStatus)

// User
const tokenKey = 'kingdom_access_token'
const userIdKey = 'userId'
export const getToken = () => Cookies.get(tokenKey)
export const getUserId = () => Number(Cookies.get(userIdKey) || '0')
export const setToken = (token: string) => Cookies.set(tokenKey, token)
export const setUserId = (userId: number) => Cookies.set(userIdKey, String(userId))
export const removeToken = () => Cookies.remove(tokenKey)
export const removeUserId = () => Cookies.remove(userIdKey)
