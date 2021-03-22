/**
 * 效果公共默认配置参数
 */
export default {
  // 画布全局透明度 {number}
  // 取值范围：[0, 1]
  opacity: 1,

  // 粒子颜色 {string|array}
  // 1、空数组表示随机取色。
  // 2、在特定颜色的数组里随机取色，如：['red', 'blue', 'green']。
  // 3、当为 string 类型时，如：'red'，则表示粒子都填充为红色。
  color: [],

  // 自适应窗口尺寸变化 {boolean}
  resize: true,
}
