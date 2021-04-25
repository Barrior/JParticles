[![npm version](https://badge.fury.io/js/jparticles.svg)](https://badge.fury.io/js/jparticles)
[![dependencies](https://img.shields.io/badge/dependencies-none-brightgreen.svg)](https://www.npmjs.com/package/jparticles)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Barrior/JParticles/blob/master/LICENSE)


### Install

```bash
npm install jparticles --save
```

### Usage

```javascript
import JParticles from 'jparticles'
new JParticles.Particle('#demo')
```

### On-Demand Usage (Tree-shaking required, recommended)

```javascript
import { Particle, Snow } from 'jparticles'

new Particle('#demo')
new Snow('#demo-snow')
```

### On-Demand Usage

```javascript
import Particle from 'jparticles/lib/particle'
import Snow from 'jparticles/lib/snow'

new Particle('#demo')
new Snow('#demo-snow')
```

### Use in Vue project

```vue
<template>
  <div id="demo"></div>
</template>

<script>
import { Particle } from 'jparticles'

export default {
  mounted() {
    new Particle('#demo')
  }
}
</script>
```

### Use in React project

```jsx
import { Particle } from 'jparticles'

class Example extends React.Component {
  componentDidMount() {
    new Particle('#demo')
  }

  render() {
    return <div id="demo"></div>
  }
}
```

### Documentation
[See more details via the API documentation.](https://jparticles.js.org/)


### Introduction

JParticles(abbreviation for JavaScript particles) is a lightweight JavaScript library for build some cool particle effects in WEB page base on Canvas.


### Concept

The main Concept of API design are: `The Write Less, Do More` and `Keep It Simple And Stupid`. Hope the library is easy-to-use, high performance and easy-to-maintain.


### Compatibility

The library should work fine on the following browsers (because of [this compatibility table](./docs/compatibility_table.md)) :

- IE 9+
- Safari 6+
- Opera 15+
- Firefox 21+
- Chrome 23+

For not support browsers it will fail quietly.


### Communication

If you have any questions or ideas to help JParticles make progress, you are welcome to put forward your views to [issues](https://github.com/Barrior/JParticles/issues) or [discussions](https://github.com/Barrior/JParticles/discussions). Thanks.


### Changelog

Detailed changes for each release are documented in the [release notes](https://github.com/Barrior/JParticles/releases).


### License

[MIT](./LICENSE)

Copyright (c) 2016-present, Barrior Wei
