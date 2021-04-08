window.bind = function (selector, exec) {
  const effect = exec()
  const btnBox = document.querySelector(selector).querySelector('.btn-box')

  btnBox.querySelector('[data-open]').addEventListener('click', function () {
    effect.open()
  })

  btnBox.querySelector('[data-pause]').addEventListener('click', function () {
    effect.pause()
  })
}

window.loadImage = function ({ src, width, height }, callback) {
  const image = new Image(width, height)
  image.addEventListener('load', () => callback(image))
  image.src = src
}
