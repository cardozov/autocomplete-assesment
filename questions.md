# Deel Frontend Test - Questions (from email) & Answers

## 1. What is the difference between Component and PureComponent? Give an example where it might break my app.

- **Component**: A regular component does not implement `shouldComponentUpdate()`. It always re-renders when state or props change.
- **PureComponent**: Implements `shouldComponentUpdate()` with shallow prop and state comparison to reduce unnecessary renders, thus improving performance.
  Important: Once React implements reactive flow pattern, PureComponents can predict side effects. So it's recommended to use PureComponents as default and regular Components for specific needs.

## 2. Context + ShouldComponentUpdate might be dangerous. Why is that?

- For some cases, the changes in context values may not trigger a re-render. This can cause data inconsistencies between the context and the component.

## 3. Describe 3 ways to pass information from a component to its PARENT.

- This can be done by multiple ways:
  1. Pass a callback function as a prop to the child component and call it from the child component.
  2. Use a state management library like Redux or Zustand.
  3. Use React's Context API.
  4. Controll the child by setting a ref to it.

## 4. Give 2 ways to prevent components from re-rendering.

- Define the data that should and should not trigger re-rendering by passing or omitting it from `useEffect()`'s dependency array.
- Use memoization to prevent re-rendering of components that receive the same props.
  - That can be done by using `React.memo()`, `useMemo()` or `useCallback`.

## 5. What is a fragment and why do we need it? Give an example where it might break my app.

- React Fragments let you group a list of children elements without adding extra nodes to the DOM. They are useful for wrapping multiple elements without introducing a DOM element, like a `<div>`.
- Fragments can break your app if you use some complex selector that is not expecting a fragment as a child. Depending on the way your app generates the css bundle, it can break the styling that way.

## 6. Give 3 examples of the HOC pattern.

```javascript
const withAuth = (Component) => {
  return (props) => {
    const { user } = useContext(UserContext)
    if (!user) return <Redirect to="/login" />
    return <Component {...props} />
  }
}

// Usage

const Profile = () => {
  return <div>Profile</div>
}

export default withAuth(Profile)
```

```javascript
const withLoading = (Component) => {
  return (props) => {
    const { isLoading } = useContext(LoadingContext) // Some global loading state
    if (isLoading) return <div>Loading...</div>
    return <Component {...props} />
  }
}

// Usage

const Profile = () => {
  return <div>Profile</div>
}

export default withLoading(Profile)
```

```javascript
const withTitle = (Component) => {
  return (props) => {
    cosnt title = `My App - ${[...window.location.pathname.split('/')].pop()}` // or some other way to get page title
    return (
      <>
        <h1>{title}</h1>
        <Component {...props} />
      </>
    )
  }
}

// Usage

const Profile = () => {
  return <div>Profile</div>
}

export default withTitle(Profile)
```

## 7. What's the difference in handling exceptions in promises, callbacks and async...await?

1. Promises are threadsafe and have a `.catch()` method to handle errors.

   ```javascript
   somePromiseMethod().catch((error) => {
     // Handle error
   })
   // the error is not gonna break outside the promise
   ```

2. Callbacks are the most trick ones. There's no known interface to handle errors on them and they're a really flexible structure. So, it's up to the developer to handle errors on them.

   ```javascript
   someCallbackMethod((error, result) => {
     if (error) {
       // Handle error
     }
     // Handle result
   })
   // if an execption is thrown inside the callback, it's gonna break outside that way
   ```

3. Async...await is a syntactic sugar for promises but it's not threadsafe. So, it's recommended to wrap it in a try...catch block.

   ```javascript
   try {
     const result = await someAsyncMethod()
     // Handle result
   } catch (error) {
     // Handle error
   }
   ```

## 8. How many arguments does setState take and why is it async.

It has two arguments, the new state (or predicator function) and a callback function. It's async because there's no guarantee that the state will be updated immediately after calling setState and React may batch multiple setState calls into a single update for performance.

## 9. List the steps needed to migrate a Class to Function Component.

There are some steps to migrate a Class Component to a Function Component:

- Change the main structure:

```jsx
// Before
class Xpto extends React.Component {
  // ...
}

// After
function Xpto(props) {
  // ...
}
// OR
const Xpto = (props) => {
  // ...
}
```

- Replace the state with `useState()` hook:

```jsx
// Before
state = { xpto: '' }

// After
const [xpto, setXpto] = useState('')
```

- Migrate the lifecycle methods to `useEffect()` hook:

```jsx
// Before
componentDidMount() {
  console.log('Xpto')
}

// After
useEffect(() => {
  console.log('Xpto')
}, [])
```

- Repalca internal methods with functions or const arrow functions:

```jsx
// Before
handleXpto = () => {
  console.log('Xpto')
}

// After
const handleXpto = () => {
  console.log('Xpto')
}
```

## 10. List a few ways styles can be used with components.

- Inline styles
- CSS Modules
- Styled Components
- CSS-in-JS
- CSS Preprocessors (SASS, LESS, etc)
- CSS Class Frameworks (Bootstrap, Tailwind, etc)
- CSS Component Frameworks (Material UI, Nextui, etc)

## 11. How to render an HTML string coming from the server.

That's not recommended, but it can be done by using `dangerouslySetInnerHTML` prop.

```jsx
const Xpto = () => {
  const html = '<div>Some HTML</div>'
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
```
