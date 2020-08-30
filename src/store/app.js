import { observable } from 'mobx'

class App {
 @observable collapsed = false
}

const app = new App()
export default app
