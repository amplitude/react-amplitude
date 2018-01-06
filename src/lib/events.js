/**
 * Code copied and modified from react, which is licensed under the MIT license,
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * https://github.com/facebook/react/blob/48833f698dc28a9af09819ba731a2e94d5bf9da7/packages/react-dom/src/events/SimpleEventPlugin.js
 */

const eventDescriptors = [
  'abort',
  'animationEnd',
  'animationIteration',
  'animationStart',
  'blur',
  'cancel',
  'canPlay',
  'canPlayThrough',
  'click',
  'close',
  'contextMenu',
  'copy',
  'cut',
  'doubleClick',
  'drag',
  'dragEnd',
  'dragEnter',
  'dragExit',
  'dragLeave',
  'dragOver',
  'dragStart',
  'drop',
  'durationChange',
  'emptied',
  'encrypted',
  'ended',
  'error',
  'focus',
  'input',
  'invalid',
  'keyDown',
  'keyPress',
  'keyUp',
  'load',
  'loadedData',
  'loadedMetadata',
  'loadStart',
  'mouseDown',
  'mouseMove',
  'mouseOut',
  'mouseOver',
  'mouseUp',
  'paste',
  'pause',
  'play',
  'playing',
  'progress',
  'rateChange',
  'reset',
  'scroll',
  'seeked',
  'seeking',
  'stalled',
  'submit',
  'suspend',
  'timeUpdate',
  'toggle',
  'touchCancel',
  'touchEnd',
  'touchMove',
  'touchStart',
  'transitionEnd',
  'volumeChange',
  'waiting',
  'wheel',
].reduce((accum, eventType) => {
  const capitalizedEvent = eventType[0].toUpperCase() + eventType.slice(1);
  const onEvent = `on${capitalizedEvent}`;

  accum.push({
    eventType,
    propName: onEvent,
  });

  accum.push({
    eventType,
    propName: `${onEvent}Capture`,
  });

  return accum;
}, []);

export default eventDescriptors;
