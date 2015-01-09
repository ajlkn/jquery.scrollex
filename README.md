# Nifty scroll events for jQuery

Adds slick new scroll events to jQuery (like `enter` and `leave`) so you can drop scrolling effects like a boss. Requires jQuery 1.11+.

## Usage

Load up `jquery.scrollex.min.js` (after jQuery):

```html
<script src="http://code.jquery.com/jquery-1.11.2.min.js"></script>
<script src="jquery.scrollex.min.js"></script>
```

Then call `scrollex()` on a selector with a **configuration object**, which is where you'll associate handlers with the events you want to use and set various Scrollex options (see **Configuration Reference** below). For example, this uses the `enter` and `leave` events to change the background color of `#foobar` to green when we scroll within its boundaries (its _contact area_), then back again when we scroll out of it:

```js
$(function() {
  $('#foobar').scrollex({
    enter: function() {

      // Set #foobar's background color to green when we scroll into it.
        $(this).css('background-color', 'green');

    },
    leave: function() {

      // Reset #foobar's background color when we scroll out of it.
        $(this).css('background-color', '');

    }
  });
});
```

## Events

Scrollex supports the following events:

### `enter`
Triggered when the viewport enters an element's contact area. Behavior can be tweaked using the `mode`, `top`, and `bottom` options (see next section).

### `leave`
Triggered when the viewport leaves an element's contact area. Behavior can be tweaked using the `mode`, `top`, and `bottom` options (see next section).

### `initialize`
Triggered as soon as `scrollex()` is called on an element.

### `terminate`
Triggered as soon as `unscrollex()` is called on an element, which is used to gracefully undo a previous `scrollex()` call.

### `scroll`
Triggered as the viewport scrolls through an element. The handler associated with this event is called with a normalized value representing how far the viewport has scrolled through the element (between `0` and `1`, although values outside this range are possible if the viewport is above or below the element). For example:

```js
$(function() {
  $('#foobar').scrollex({
    scroll: function(progress) {

      // Progressively increase #foobar's opacity as we scroll through it.
        $(this).css('opacity', Math.max(0, Math.min(1, progress)));

    }
  });
});
```

## `mode`, `top`, and `bottom`

Events that depend on the viewport's position relative to an element's contact area (currently just `enter` and `leave`) can be further tweaked using the `mode`, `top`, and `bottom` options.

### `mode`

This determines the rules Scrollex uses to figure out when the viewport is considered "inside" or "outside" an element's contact area. Can be any of the following:

Value         | Behavior
--------------|-----------------------------------------------------------------
`default`     | Element's contact area must fall within the viewport.
`top`         | Top viewport edge must fall within the element's contact area.
`bottom`      | Bottom viewport edge must fall within the element's contact area.
`middle`      | Midpoint between top/bottom viewport edges must fall within the element's contact area.

### `top` and `bottom`

These let you "pad" the edges of an element's contact area using either a pixel value (`150`) a percentage of that element's height (`25%`), or a percentage of the viewport's height (`20vh`). Positive values work inward and shrink the contact area, while negative values work outward and expand the contact area. For example, this expands the contact area of `#foobar` by 20% of its height in both directions, resulting in `enter` triggering a bit earlier and `leave` a bit later:

```js
$(function() {
  $('#foobar').scrollex({
    top: '-20%',
    bottom: '-20%',
    enter: function() {
      $(this).css('background-color', 'green');

    },
    leave: function() {
      $(this).css('background-color', '');
    }
  });
});
```

## Configuration Reference

Name         | Type                | Default   | Description
-------------|---------------------|-----------|---------------------------
`enter`      | `function`          | `null`    | **Enter** event.
`leave`      | `function`          | `null`    | **Leave** event.
`initialize` | `function`          | `null`    | **Initialize** event.
`terminate`  | `function`          | `null`    | **Terminate** event.
`scroll`     | `function`          | `null`    | **Scroll** event.
`mode`       | `string`            | `default` | Mode (`default`, `top`, `bottom`, or `middle`).
`top`        | `integer`, `string` | `0`       | Top padding (in pixels, `%`, `vh`).
`bottom`     | `integer`, `string` | `0`       | Bottom padding (in pixels, `%`, or `vh`).
`delay`      | `integer`           | `0`       | Delay (in ms) between position checks.

## License

Scrollex is released under the MIT license, so go nuts.

Copyright © n33

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
