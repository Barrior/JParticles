// requestAnimationFrame
window.requestAnimationFrame = ((win) => {
  return (
    win.requestAnimationFrame ||
    win.webkitRequestAnimationFrame ||
    win.mozRequestAnimationFrame ||
    function (fn: TimerHandler) {
      return win.setTimeout(fn, 1000 / 60)
    }
  )
})(window)

// Math.hypot
if (!Math.hypot) {
  Math.hypot = function (...args: number[]) {
    let max = 0
    let s = 0
    let containsInfinity = false
    for (let i = 0; i < arguments.length; ++i) {
      const arg = Math.abs(Number(args[i]))
      if (arg === Infinity) containsInfinity = true
      if (arg > max) {
        s *= (max / arg) * (max / arg)
        max = arg
      }
      s += arg === 0 && max === 0 ? 0 : (arg / max) * (arg / max)
    }
    return containsInfinity
      ? Infinity
      : max === 1 / 0
      ? 1 / 0
      : max * Math.sqrt(s)
  }
}
