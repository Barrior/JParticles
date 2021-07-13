import {
  defaultCanvasHeight,
  defaultCanvasWidth,
  doublePi,
  isIE8,
  isRuntimeSupported,
  orientationSupport,
  piBy180,
  regExp,
} from '@/src/common/constants'

test('piBy180', () => {
  expect(piBy180).toBe(Math.PI / 180)
})

test('doublePi', () => {
  expect(doublePi).toBe(Math.PI * 2)
})

test('default Canvas dimension', () => {
  expect(defaultCanvasWidth).toBe(485)
  expect(defaultCanvasHeight).toBe(300)
})

test('isIE8', () => {
  expect(isIE8).toBe(false)
})

test('isRuntimeSupported', () => {
  expect(isRuntimeSupported).toBe(true)
})

test('orientationSupport', () => {
  expect(orientationSupport).toBe(false)
})

test('regExp.trimAll', () => {
  function trimAll(str: string) {
    return str.replace(regExp.trimAll, '')
  }
  expect(trimAll(' a \f \n  \r\t\v b ')).toBe('ab')
})

test('regExp.http', () => {
  expect(regExp.http.test('http://')).toBeTruthy()
  expect(regExp.http.test('http://example.com')).toBeTruthy()
  expect(regExp.http.test('https://')).toBeTruthy()
  expect(regExp.http.test('https://example.com')).toBeTruthy()
  expect(regExp.http.test('//example.com')).toBeTruthy()

  expect(regExp.http.test('http:/')).toBeFalsy()
  expect(regExp.http.test('https:/')).toBeFalsy()
  expect(regExp.http.test('xhttp://')).toBeFalsy()
  expect(regExp.http.test('xhttps://')).toBeFalsy()
  expect(regExp.http.test('/example.com')).toBeFalsy()
})

test('regExp.shapeStar', () => {
  expect(regExp.shapeStar.test('star')).toBeTruthy()
  expect(regExp.shapeStar.test('star:5:0.5')).toBeTruthy()
  expect(regExp.shapeStar.test('star:50:50')).toBeTruthy()

  expect(regExp.shapeStar.test('xstar')).toBeFalsy()
  expect(regExp.shapeStar.test('start')).toBeFalsy()
  expect(regExp.shapeStar.test('star:')).toBeFalsy()
  expect(regExp.shapeStar.test('star:5')).toBeFalsy()
  expect(regExp.shapeStar.test('star:5:')).toBeFalsy()
  expect(regExp.shapeStar.test('star:5:0..05')).toBeFalsy()
  expect(regExp.shapeStar.test('star:5:0.5:')).toBeFalsy()
})

test('regExp.imageBase64', () => {
  expect(regExp.imageBase64.test('data:image/png;base64,')).toBeTruthy()
  expect(regExp.imageBase64.test('data:image/png;base64,')).toBeTruthy()
  expect(regExp.imageBase64.test('data:image/jpg;base64,i')).toBeTruthy()
  expect(regExp.imageBase64.test('data:image/jpeg;base64,i')).toBeTruthy()
  expect(regExp.imageBase64.test('data:image/gif;base64,i')).toBeTruthy()
  expect(regExp.imageBase64.test('data:image/svg+xml;base64,i')).toBeTruthy()

  expect(regExp.imageBase64.test('data:image/png;base64')).toBeFalsy()
  expect(regExp.imageBase64.test('xdata:image/png;base64,')).toBeFalsy()
})
