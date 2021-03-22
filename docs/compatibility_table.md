### The API compatibility list used by source code.
> more reference by caniuse.com

Canvas:

	IE9+  Safari 4+  Opera 10+  Chrome 4+  Firefox 3.6+

Object.defineProperty for pure object:

	IE9+  Safari 6+  Opera 15+  Chrome 23+  Firefox 21+

Object.create:

	IE9+  Safari 5+  Opera 11.6+  Chrome 5+  Firefox 4+

DOMNodeRemoved:

	IE9+  Safari 4+  Opera 15+  Chrome 15+  Firefox 6+

Date.now:

	IE9+  Safari 4+  Opera 10.5+  Chrome 5+  Firefox 3.0+

Array.isArray:

	IE9+  Safari 5+  Opera 10.5+  Chrome 5+  Firefox 4+

So, the library should work fine on the following browsers.

- IE9+              `2011.3.14`
- Safari 6+			`2012.7.25`
- Opera 15+			`2013.7.2`
- Chrome 23+		`2012.9.25`
- Firefox 21+		`2013.4.2`

For not support browsers it will fail quietly.
