/*
*使用customize-cra和react-app-rewired对webpack配置进行个性化扩展
*fixBabelImports：用于加载antd组件
*addDecoratorsLegacy：使用装饰器
*addLessLoader：使用Less的css语法
*/

const { 
    override,
    addLessLoader,
    fixBabelImports,
    addDecoratorsLegacy
 } = require('customize-cra')

//主题颜色配色方案
const modifyVars = require('./lessVars')

module.exports = override(
    addLessLoader({
        javascriptEnabled:true,
        modifyVars//配置主题颜色
    }),
    addDecoratorsLegacy(),
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
)