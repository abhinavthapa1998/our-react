const React = {
  createElement: (tag, props, ...children) => {
    if (typeof tag === "function") {
      try {
        return tag(props);
      } catch ({ promise, key }) {
        promise.then((data) => {
          promiseCache.set(key, data);
          rerender();
        });
        return { tag: "div", props: { children: ["I AM LOADING"] } };
      }
    }
    const element = { tag, props: { ...props, children } };
    return element;
  },
};

const states = [];
let stateCursor = 0;

const useState = (initialState) => {
  const newCursor = stateCursor;
  states[newCursor] = states[newCursor] || initialState;
  let setState = (newState) => {
    states[newCursor] = newState;
    rerender();
  };
  stateCursor++;
  return [states[newCursor], setState];
};
const promiseCache = new Map();
const createResource = (promiseReturner, key) => {
  if (promiseCache.has(key)) {
    return promiseCache.get(key);
  }
  throw { promise: promiseReturner(), key };
};

const App = () => {
  const [name, setName] = useState("Person");
  const [count, setCount] = useState(0);
  const dogPhotoUrl = createResource(
    fetch("https://dog.ceo/api/breeds/image/random")
      .then((response) => response.json())
      .then((payload) => payload.message),
    "dogPhoto"
  );
  return (
    <div className="react-2020">
      <h1>Hello, {name}!</h1>
      <input
        value={name}
        onchange={(e) => setName(e.target.value)}
        type="text"
        placeholder="name"
      />
      <h2>The count is:{count}</h2>
      <img alt="good boi" src={dogPhotoUrl} />
      <button onclick={() => setCount(count + 1)}>+</button>
      <button onclick={() => setCount(count - 1)}>-</button>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum,
        assumenda eligendi. Dicta, voluptate atque. Ea impedit rem incidunt
        eveniet dolores? Provident nisi numquam autem ipsa vel ullam. Nesciunt,
        pariatur enim!
      </p>
    </div>
  );
};
const render = (reactElementOrStringOrNumber, container) => {
  if (["string", "number"].includes(typeof reactElementOrStringOrNumber)) {
    container.appendChild(
      document.createTextNode(String(reactElementOrStringOrNumber))
    );
    return;
  }
  const actualDOMElement = document.createElement(
    reactElementOrStringOrNumber.tag
  );
  if (reactElementOrStringOrNumber.props) {
    Object.keys(reactElementOrStringOrNumber.props)
      .filter((p) => p !== "children")
      .forEach(
        (p) => (actualDOMElement[p] = reactElementOrStringOrNumber.props[p])
      );
  }
  if (reactElementOrStringOrNumber.props.children) {
    reactElementOrStringOrNumber.props.children.forEach((child) =>
      render(child, actualDOMElement)
    );
  }
  container.appendChild(actualDOMElement);
};

const rerender = () => {
  stateCursor = 0;
  document.querySelector("#app").firstChild.remove();
  render(<App />, document.querySelector("#app"));
};

render(<App />, document.querySelector("#app"));
