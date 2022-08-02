const React = {
  createElement: (tag, props, ...children) => {
    if (typeof tag === "function") {
      return tag(props);
    }
    const element = { tag, props: { ...props, children } };
    return element;
  }
};

const App = () => (
  <div className="react-2020">
    <h1>Hello, person!</h1>
    <p>
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum, assumenda
      eligendi. Dicta, voluptate atque. Ea impedit rem incidunt eveniet dolores?
      Provident nisi numquam autem ipsa vel ullam. Nesciunt, pariatur enim!
    </p>
  </div>
);
<App />;
