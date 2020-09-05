import { observable, action } from 'mobx'

const DEFAULT_USER_INFO = {
  login: false,
  username: '',
  userId: ''
}
class User {
 @observable userInfo = {
   ...DEFAULT_USER_INFO
 }
 @action
 logout () {
   this.userInfo = {
     ...DEFAULT_USER_INFO
   }
 }
 @action
 login (userInfo) {
   this.userInfo = {
     ...userInfo,
     login: true
   }
 }
}

const user = new User()
export default user
