// 这个配置文件其实就是一个 JS 文件，通过 Node 中的模块操作向外暴露了一个配置对象
module.exports = {
  // 在配置文件中，需要指定入口和出口
  entry: path.join(__dirname, './src/main.js'), //入口：表示要使用 webpack 打包哪个文件
  output: { //输出文件的相关配置
    path: path.join(__dirname, './dist'),//指定打包好的文件输出到哪个目录中去
    filename: 'bundle.js'//这是指定输出文件的名称
  }
}

// 当我们在控制台输入 webpack 的时候，webpack 做了一下几步：
// 1、首先，webpack 发现，我们并没有通过命令的形式给他指定入口和出口
// 2、webpack 就会去项目的根目录中查找一个叫 webpack.config.js 的配置文件
// 3、当找到配置文件之后，webpack 会去解析这个配置文件，当解析执行完配置文件后，就得到了配置文件中导出的配置对象
// 4、当 webpack 拿到配置对象后，就拿到了配置对象中的指定的入口和出口，然后进行打包构建