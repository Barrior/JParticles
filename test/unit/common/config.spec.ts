import config from '@/src/common/config'

test('common config', () => {
  expect(JSON.stringify(config)).toBe(
    JSON.stringify({
      opacity: 1,
      color: [],
      resize: true,
    })
  )
})
