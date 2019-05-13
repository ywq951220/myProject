//这个 main.js 是我们项目的 js 入口文件

// 1、在 node_modules 里面导入 jQuery 包，jquery表示加载包的名称，$表示接收的变量
// import *** from *** 是 ES6 中导入模块的方式
// 由于ES6的代码太高级了，浏览器解析不了，所以这一行代码会报错
import $ from 'jquery'

$(function () {
  $('li:odd').css('backgroundColor', 'lightblue')
  $('li:even').css('backgroundColor', function () {
    return '#' + 'D97634'
  })
})

// webpack的作用，所能做的事情
// 1、webpack 能够处理 JS 文件的相互依赖关系
// 2、webpack 能够处理 JS 的兼容性，把高级的浏览器不能识别的语法转换为低级的浏览器能够识别的依法
// 处理语法：webpack  要打包的文件的路径  打包好的输出的文件的路径
