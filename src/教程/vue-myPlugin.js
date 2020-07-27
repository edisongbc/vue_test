/**
 * vue的插件库
 */
(function () {
  // 向外暴露的插件对象
  const MyPlugin = {}
  // 插件方法必须有一个install()方法
  MyPlugin.install = function (Vue, options) {
    // 1. 添加全局方法或 property
    Vue.myGlobalMethod = function () {
       console.log('Vue添加全局方法Vue.myGlobalMethod')
    }
    Vue.myProperty = 'Vue添加全局属性myProperty'

    // 2. 添加全局资源（指令）
    Vue.directive('my-directive', function (el, binding) {
      el.textContent = binding.value.toUpperCase()
    })

    // 3. 注入组件选项
    Vue.mixin({
      created: function () {
        // 逻辑...
      }
    })

    // 4. 添加实例方法
    Vue.prototype.$myMethod = function (value) {
      const res = 'Vue添加实例方法$myMethod：【' + value + '】'
      console.log(res)
      return res
    }
  }
  // 向外暴露
  window.MyPlugin = MyPlugin
})()
