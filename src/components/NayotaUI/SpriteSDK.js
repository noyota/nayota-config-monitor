export default function SpriteSDK(data = {}, template) {
  let temp = JSON.parse(JSON.stringify(data))
  const watchData = data
  this.data = data
  this.watchFn = new Map()
  this.update = function() {
    for (const [key, fn] of this.watchFn) {
      const val = key.split('.').reduce((v, item) => v[item], watchData)
      const oldVal = key.split('.').reduce((v, item) => v[item], temp)
      if (val !== oldVal) {
        fn(val, oldVal)
      }
    }
    temp = JSON.parse(JSON.stringify(data))
  }

  const { Scene, Sprite, Label, Group } = spritejs /*global spritejs*/
  this.Scene = Scene
  this.Sprite = Sprite
  this.Label = Label
  this.Group = Group

  this.scene = new Scene('#spritejs', { viewport: [template.width * template.width.pcScale, template.height * template.width.pcScale], resolution: [template.width, template.height] })

  this.init = async() => {
    await this.scene.preload([template.image, template.json])
  }

  this.close = () => {

  }

  this.action = () => {

  }

  /**
   * 按钮动画1 点击后缩小
   * @param btn
   * @constructor
   */
  this.BtnAnimation1 = (btn) => {
    btn.on('touchstart', () => {
      btn.attr({
        scale: 0.9,
        filter: {
          blur: '1px',
          dropShadow: [2, 2, 10, '#FF6040']
        }
      })
    }).on('touchend', () => {
      btn.attr({
        scale: 1.0,
        filter: {}
      })
    }).on('mousedown', () => {
      btn.attr({
        scale: 0.9,
        filter: {
          blur: '1px',
          dropShadow: [2, 2, 10, '#FF6040']
        }
      })
    }).on('mouseup', () => {
      btn.attr({
        scale: 1.0,
        filter: {}
      })
    }).on('mouseleave', () => {
      btn.attr({
        scale: 1.0,
        filter: {}
      })
    })
  }

  this.clickAnimation1 = (layer) => {
    layer.on('mousedown', async(evt) => {
      const r = Math.round(255 * Math.random())
      const g = Math.round(255 * Math.random())
      const b = Math.round(255 * Math.random())
      const bgcolor = `rgb(${r},${g},${b})`
      const bubble = new Sprite()
      bubble.attr({
        anchor: 0.5,
        bgcolor,
        size: [50, 50],
        x: evt.x,
        y: evt.y,
        borderRadius: 25
      })

      layer.append(bubble)
      await bubble.transition(0.5).attr({
        scale: [2.0, 2.0],
        opacity: 0
      })
      bubble.remove()
    })
  }

  // 转圈动画
  this.turnAroundAnimation = (layer) => {
    return layer.animate([
      { rotate: 0 },
      { rotate: 360 }
    ], {
      duration: 2000,
      iterations: Infinity
    })
  }
}
