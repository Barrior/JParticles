import { loadImage, merge } from '@src/utils/misc'

test('merge', () => {
  const a1 = {
    a: 0,
    b: {
      c: 1,
      d: 2,
    },
    e: [1, 2, 3],
  }
  const b1 = {
    a: 3,
    b: {
      c: 4,
    },
    e: [4, 5],
  }
  const obj = merge(a1, b1)

  expect(obj).toBe(a1)
  expect(JSON.stringify(obj)).toBe(
    JSON.stringify({
      a: 3,
      b: {
        c: 4,
        d: 2,
      },
      // 数组合并采用替换方式
      e: [4, 5, 3],
    })
  )
})

test.skip('loadImage', (done) => {
  loadImage(
    'https://raw.githubusercontent.com/Barrior/assets/main/chrome-logo.svg',
    (image) => {
      expect(image.width).toBe(1000)
      done()
    },
    done
  )
})
