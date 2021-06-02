function jsxs(type, config) {
  return jsx(type, config);
}

function jsx(type, config) {
  const { children = [], ...props } = config;
  const childrenProps = [].concat(children);

  if (!type) {
    return {
      type: "FRAGMENT",
      props: {
        ...props,
        children: childrenProps.map((child) =>
          typeof child === "object" ? child : createTextElement(child)
        ),
      }
    };
  }
  if (type.prototype && type.prototype.render) {
    return new type(config).render();
  }
  if (typeof type === "function") {
    return type(config);
  }

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
  return children;
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
  let dom = null;
  if (element.type === "TEXT_ELEMENT") {
    dom = container.ownerDocument.createTextNode("")
  } else if (element.type === "FRAGMENT") {
    element.props.children.forEach((child) => render(child, container));
    return;
  } else {
    dom = container.ownerDocument.createElement(element.type);
  }

  if (!element.props && Array.isArray(element)) {
    element.forEach((el) => {
      render(el, container);
    });
    return;
  }
  if (!element.props) {
    const textDom = container.ownerDocument.createTextNode(element);
    container.appendChild(textDom);
    return;
  }

  const isProperty = (key) => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = element.props[name];
    });

  if (element.props.children && Array.isArray(element.props.children)) {
    element.props.children.forEach((child) => render(child, dom));
  } else {
    console.log(element);
  }
  container.appendChild(dom);
}
export { jsx, jsxs, render, createFragment };