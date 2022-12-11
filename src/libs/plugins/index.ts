import registerVant from './vant'


export default function registerPlugins() {
  return {
    install(app: any) {
      registerVant(app)
    }
  }
}
