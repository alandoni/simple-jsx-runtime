function jsxs(type, config) {
  return jsx(type, config);
}

function jsx(type, config) {
  if (!type) {
    return config.children;
  }
  if (type.prototype && type.prototype.render) {
    return new type(config).render();
  }
  if (typeof type === "function") {
    return type(config);
  }

  const { children = [], ...props } = config;
  const childrenProps = [].concat(children);
  return {
    type,
    props: {
      ...props,
      children: childrenProps.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

const createFragment = (props, ...children) => {
	return children
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function render(element, container) {
  if (!element) {
    return;
  }
  const dom =
    element.type === "TEXT_ELEMENT"
      ? container.ownerDocument.createTextNode("")
      : container.ownerDocument.createElement(element.type);

  if (!element.props && element.length > 0) {
    element.forEach((el) => {
      render(el, container);
    });
    return;
  }

  const isProperty = (key) => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = element.props[name];
    });

  element.props.children.forEach((child) => render(child, dom));
  container.appendChild(dom);
}
export { jsx, jsxs, render };