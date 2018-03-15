# react-amplitude

A React component library for easy product analytics instrumentation.

## Work In Progress

Please note this library is a work-in-progress. Its API will likely change in future versions.

## The problems with traditional, imperative event-based logging

- Contextual event information (i.e. "event properties") often require lots of plumbing to the code path where the events are logged, requiring more code and breaking encapsulation.
- Similarly, it can be difficult to provide contextual information to events fired in low-level, reusable components (e.g. Buttons, Dropdowns, Links, etc.).
- Traditional event-based analytics logging often use imperative APIs, which can sometimes require more code and be more painful when writing declarative React components.

## The problems with "autotrack" solutions

- Autotrack solutions can be unreliable, as they may depend on attributes that engineers may unintentionally change (like CSS selectors).
- Autotrack solutions may unintentionally track sensitive user data.
- Autotrack can't capture all kinds of events, so you may end up requiring to implement manual event logging.

## The solution

react-amplitude has a modern, declarative API to make it easy to instrument new events and properties with Amplitude. It takes advantage of core React features to propagate contextual information down through the component hierarchy. This makes it far less painful to add new event properties to existing events.

Unlike "autotrack" solutions, react-amplitude does require _some_ code changes in order to start sending data to Amplitude. However, it aims to minimize the amount of code required to start collecting data and make instrumentation seem less like a chore.

If you use common reusable components in your React application like Buttons, Dropdowns, Links, etc., you should be able to achieve "autotrack"-like instrumentation with just a few lines of code. And from there, it can be really simple to instrument new properties and context throughout your application, giving you the same flexibility as manual event logging.

## Usage

This example renders an "app" with a single button. When the button is clicked, it will log an Amplitude event that looks like:

```
{
  "event_type": "button click",
  "event_properties": {
    "scope": ["root", "home view", "button"]
  }
  ...
}
```

```jsx
import React from 'react';
import { render } from 'react-dom';
import amplitude from 'amplitude-js';
import { AmplitudeProvider, Amplitude } from '@amplitude/react-amplitude';

function Button(props) {
  return (
    <Amplitude
      eventProperties={inheritedProperties => ({
        scope: [...inheritedProperties.scope, 'button'],
      })}
    >
      {({ instrument }) =>
        <button
          onClick={instrument('button click', props.onClick)}
        >
          {props.children}
        </button>
      }
    </Amplitude>
  )
}

function HomeView() {
  return (
    <Amplitude
      mountEventType="viewed home view"
      eventProperties={inheritedProperties => ({
        scope: [...inheritedProperties.scope, 'home view'],
      })}
    >
      <Button
        onClick={() => alert('Hi!')}
      >
        Click Me
      </Button>
    </Amplitude>
  )
}

function App({ userId }) {
  return (
    <AmplitudeProvider
      amplitudeInstance={amplitude.getInstance()}
      apiKey={AMPLITUDE_KEY}
      userId={userId}
    >
      <Amplitude
        eventProperties={{
          scope: ['root'],
        }}
      >
        <HomeView />
      </Amplitude>
    </AmplitudeProvider>
  )
}

render(<App />, document.getElementById('root'));
```

## Installation

With npm:

```
npm install --save @amplitude/react-amplitude
```

With yarn:

```
yarn add @amplitude/react-amplitude
```

react-amplitude does not come with its own copy of the Amplitude JavaScript SDK. You can either install the Amplitude SDK via npm or with a JavaScript snippet.

## API

### AmplitudeProvider Props

#### amplitudeInstance

A required prop. You should be providing an Amplitude instance returned from the Amplitude JS SDK's [`getInstance`](https://amplitude.zendesk.com/hc/en-us/articles/115002889587-JavaScript-SDK-Reference#amplitudeclient) method.

#### apiKey

An optional prop that can be used to initialize the Amplitude instance with the provided key.

#### userId

An optional prop that can be used to attribute all events to a specific user.

### Amplitude Props

#### children

If can pass a function as the children prop, it will be called with a single object parameter, and the return value of that function will be used for rendering the actual React subtree.

The single object parameter has two useful fields: `logEvent` and `instrument`.

`logEvent` is a function that can be used to imperatively log events. All event properties from this component's `eventProperties` prop and any inherited properties will be included in these events.

Example:

```jsx
function Button(props) {
  return (
    <Amplitude>
      {({ logEvent }) =>
        <button
          onClick={() => {
            logEvent('button click');
            props.onClick();
          }}
        >
          {props.children}
        </button>
      }
    </Amplitude>
  )
}
```

`instrument` is a function that can be used to declaratively log events. If you have pre-existing event handlers, just wrap the functions with an `instrument`, and events will fire every time your normal event handlers are executed. `instrument` takes two parameters, the event type and the function to proxy.

`instrument` is also useful if you would like to prevent re-rendering via shouldComponentUpdate optimizations like PureComponent. It memoizes its arguments and returns the same function instance across re-renders. For this reason, it's not recommended to use `instrument` for functions that change on every render (i.e. inlined or "arrow" functions in `render`).

Example:

```jsx
function Button(props) {
  return (
    <Amplitude>
      {({ instrument }) =>
        <button
          onClick={instrument('button click', props.onClick)}
        >
          {props.children}
        </button>
      }
    </Amplitude>
  )
}
```

#### eventProperties

If an object is provided, the object will be merged with event properties higher-up in the component hierarchy and included in all events logged in this component or any components in its subtree.

If a function is provided, it will be called with a single parameter, `inheritedProperties`, that contains all of the event properties from components higher in the React component hierarchy. The return value from this function will be used for all logged events in this component or other components in its subtree.

####  debounceInterval

If provided, events logged by the component will be debounced by this amount, in milliseconds.

#### mountEventType

If provided, when this component mounts, it will log an event with this value as the event type.

#### userProperties

An optional object that if provided, will trigger updates to the current user's "user properties."

## License

MIT
