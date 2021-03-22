import { Selector } from 'testcafe'

fixture`particle`.page`../../samples/particle.html`

test(`Canvas width and height should equal to the container`, async t => {
  const demo = Selector('#instance1 .demo')
  const canvas = Selector('#instance1 .demo canvas')
  const open = Selector('#instance1 .btn-primary')
  const pasue = Selector('#instance1 .btn-danger')

  async function testWH() {
    // eslint-disable-next-line
    const dw: string = await demo
      .getStyleProperty('width')
      .then(value => value)
    const dh: string = await demo
      .getStyleProperty('height')
      .then(value => value)
    const cw: string = await canvas
      .getStyleProperty('width')
      .then(value => value)
    const ch: string = await canvas
      .getStyleProperty('height')
      .then(value => value)

    await t.expect(parseInt(cw)).eql(parseInt(dw))
    await t.expect(parseInt(ch)).eql(parseInt(dh))
  }

  await testWH()
  await t.resizeWindow(1000, 400)
  await testWH()

  await t.click(open).click(pasue)
})
