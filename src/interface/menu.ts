export default interface IMenu {
  isUser: boolean// 当前用户是否有路由访问权限
  path: string// 路由地址
  btns: string[]// 用户对此路由按钮权限集合
}
