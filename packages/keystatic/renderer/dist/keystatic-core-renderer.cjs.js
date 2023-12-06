'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var jsxRuntime = require('react/jsx-runtime');

const defaultRenderers = {
  inline: {
    bold: 'strong',
    code: 'code',
    keyboard: 'kbd',
    strikethrough: 's',
    italic: 'em',
    link: 'a',
    subscript: 'sub',
    superscript: 'sup',
    underline: 'u'
  },
  block: {
    image({
      src,
      alt,
      title
    }) {
      return /*#__PURE__*/jsxRuntime.jsx("img", {
        src: src,
        alt: alt,
        title: title
      });
    },
    block: 'div',
    blockquote: 'blockquote',
    paragraph: ({
      children,
      textAlign
    }) => {
      return /*#__PURE__*/jsxRuntime.jsx("p", {
        style: {
          textAlign
        },
        children: children
      });
    },
    divider: 'hr',
    heading: ({
      level,
      children,
      textAlign
    }) => {
      let Heading = `h${level}`;
      return /*#__PURE__*/jsxRuntime.jsx(Heading, {
        style: {
          textAlign
        },
        children: children
      });
    },
    code({
      children
    }) {
      return /*#__PURE__*/jsxRuntime.jsx("pre", {
        children: /*#__PURE__*/jsxRuntime.jsx("code", {
          children: children
        })
      });
    },
    list: ({
      children,
      type
    }) => {
      const List = type === 'ordered' ? 'ol' : 'ul';
      return /*#__PURE__*/jsxRuntime.jsx(List, {
        children: children.map((x, i) => /*#__PURE__*/jsxRuntime.jsx("li", {
          children: x
        }, i))
      });
    },
    layout: ({
      children,
      layout
    }) => {
      return /*#__PURE__*/jsxRuntime.jsx("div", {
        style: {
          display: 'grid',
          gridTemplateColumns: layout.map(x => `${x}fr`).join(' ')
        },
        children: children.map((element, i) => /*#__PURE__*/jsxRuntime.jsx("div", {
          children: element
        }, i))
      });
    },
    table: ({
      head,
      body
    }) => {
      return /*#__PURE__*/jsxRuntime.jsxs("table", {
        children: [head && /*#__PURE__*/jsxRuntime.jsx("thead", {
          children: /*#__PURE__*/jsxRuntime.jsx("tr", {
            children: head.map((x, i) => /*#__PURE__*/jsxRuntime.jsx("th", {
              colSpan: x.colSpan,
              rowSpan: x.rowSpan,
              children: x.children
            }, i))
          })
        }), /*#__PURE__*/jsxRuntime.jsx("tbody", {
          children: body.map((row, i) => /*#__PURE__*/jsxRuntime.jsx("tr", {
            children: row.map((x, j) => /*#__PURE__*/jsxRuntime.jsx("td", {
              colSpan: x.colSpan,
              rowSpan: x.rowSpan,
              children: x.children
            }, j))
          }, i))
        })]
      });
    }
  }
};
function DocumentNode({
  node: _node,
  componentBlocks,
  renderers
}) {
  if (typeof _node.text === 'string') {
    let child = /*#__PURE__*/jsxRuntime.jsx(React.Fragment, {
      children: _node.text
    });
    Object.keys(renderers.inline).forEach(markName => {
      if (markName !== 'link' && _node[markName]) {
        const Mark = renderers.inline[markName];
        child = /*#__PURE__*/jsxRuntime.jsx(Mark, {
          children: child
        });
      }
    });
    return child;
  }
  const node = _node;
  const children = node.children.map((x, i) => /*#__PURE__*/jsxRuntime.jsx(DocumentNode, {
    node: x,
    componentBlocks: componentBlocks,
    renderers: renderers
  }, i));
  switch (node.type) {
    case 'blockquote':
      {
        return /*#__PURE__*/jsxRuntime.jsx(renderers.block.blockquote, {
          children: children
        });
      }
    case 'paragraph':
      {
        return /*#__PURE__*/jsxRuntime.jsx(renderers.block.paragraph, {
          textAlign: node.textAlign,
          children: children
        });
      }
    case 'code':
      {
        if (node.children.length === 1 && node.children[0] && typeof node.children[0].text === 'string') {
          const {
            type,
            children,
            ...rest
          } = node;
          return /*#__PURE__*/jsxRuntime.jsx(renderers.block.code, {
            ...rest,
            children: node.children[0].text
          });
        }
        break;
      }
    case 'layout':
      {
        return /*#__PURE__*/jsxRuntime.jsx(renderers.block.layout, {
          layout: node.layout,
          children: children
        });
      }
    case 'divider':
      {
        return /*#__PURE__*/jsxRuntime.jsx(renderers.block.divider, {});
      }
    case 'heading':
      {
        const {
          type,
          children: _children,
          ...rest
        } = node;
        return /*#__PURE__*/jsxRuntime.jsx(renderers.block.heading, {
          ...rest,
          children: children
        });
      }
    case 'component-block':
      {
        const Comp = componentBlocks[node.component];
        if (Comp) {
          const props = createComponentBlockProps(node, children);
          return /*#__PURE__*/jsxRuntime.jsx(renderers.block.block, {
            children: /*#__PURE__*/jsxRuntime.jsx(Comp, {
              ...props
            })
          });
        }
        break;
      }
    case 'ordered-list':
    case 'unordered-list':
      {
        return /*#__PURE__*/jsxRuntime.jsx(renderers.block.list, {
          children: children,
          type: node.type === 'ordered-list' ? 'ordered' : 'unordered'
        });
      }
    case 'link':
      {
        return /*#__PURE__*/jsxRuntime.jsx(renderers.inline.link, {
          href: node.href,
          children: children
        });
      }
    case 'image':
      {
        return /*#__PURE__*/jsxRuntime.jsx(renderers.block.image, {
          src: node.src,
          alt: node.alt,
          title: node.title
        });
      }
    case 'table':
      {
        const first = node.children[0];
        const second = node.children[1];
        const body = second || first;
        const head = second ? first : undefined;
        return /*#__PURE__*/jsxRuntime.jsx(renderers.block.table, {
          head: head ? head.children[0].children.map(cell => ({
            children: cell.children.map((x, i) => /*#__PURE__*/jsxRuntime.jsx(DocumentNode, {
              node: x,
              componentBlocks: componentBlocks,
              renderers: renderers
            }, i))
          })) : undefined,
          body: body.children.map(row => row.children.map(cell => ({
            children: cell.children.map((x, i) => /*#__PURE__*/jsxRuntime.jsx(DocumentNode, {
              node: x,
              componentBlocks: componentBlocks,
              renderers: renderers
            }, i))
          })))
        });
      }
  }
  return /*#__PURE__*/jsxRuntime.jsx(React.Fragment, {
    children: children
  });
}
function set(obj, propPath, value) {
  if (propPath.length === 1) {
    obj[propPath[0]] = value;
  } else {
    let firstElement = propPath.shift();
    set(obj[firstElement], propPath, value);
  }
}
function createComponentBlockProps(node, children) {
  const formProps = JSON.parse(JSON.stringify(node.props));
  node.children.forEach((child, i) => {
    if (child.propPath) {
      const propPath = [...child.propPath];
      set(formProps, propPath, children[i]);
    }
  });
  return formProps;
}
function DocumentRenderer(props) {
  var _props$renderers, _props$renderers2;
  const renderers = {
    inline: {
      ...defaultRenderers.inline,
      ...((_props$renderers = props.renderers) === null || _props$renderers === void 0 ? void 0 : _props$renderers.inline)
    },
    block: {
      ...defaultRenderers.block,
      ...((_props$renderers2 = props.renderers) === null || _props$renderers2 === void 0 ? void 0 : _props$renderers2.block)
    }
  };
  const componentBlocks = props.componentBlocks || {};
  return /*#__PURE__*/jsxRuntime.jsx(React.Fragment, {
    children: props.document.map((x, i) => /*#__PURE__*/jsxRuntime.jsx(DocumentNode, {
      node: x,
      componentBlocks: componentBlocks,
      renderers: renderers
    }, i))
  });
}

exports.DocumentRenderer = DocumentRenderer;
exports.defaultRenderers = defaultRenderers;
