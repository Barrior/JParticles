function bind(selector, exec) {
  const effect = exec()
  const btnBox = document.querySelector(selector).querySelector('.btn-box')

  btnBox.querySelector('[data-open]').addEventListener('click', function () {
    effect.open()
  })

  btnBox.querySelector('[data-pause]').addEventListener('click', function () {
    effect.pause()
  })
}

window.bind = bind
