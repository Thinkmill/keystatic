import { css } from '@emotion/css';
import { Button } from '@keystar/ui/button';
import { DialogContainer, Dialog } from '@keystar/ui/dialog';
import { Box, Flex } from '@keystar/ui/layout';
import { Heading } from '@keystar/ui/typography';
import { MarkSpec, Node } from 'prosemirror-model';
import { ReactNode, useMemo, useState } from 'react';
import { getInitialPropsValue } from '../../../initial-values';
import { FormValue } from './FormValue';
import { insertNode } from './commands/misc';
import { useEditorDispatchCommand } from './editor-view';
import { EditorNodeSpec } from './schema';
import { classes } from './utils';
import { ContentComponent } from '../../../../content-components';
import { NodeSelection } from 'prosemirror-state';
import { tokenSchema } from '@keystar/ui/style';
import { Item, Menu, MenuTrigger } from '@keystar/ui/menu';

function BlockDataWrapper(props: { node: Node; children: ReactNode }) {
  return (
    <div
      data-component={props.node.type.name}
      data-props={JSON.stringify(props.node.attrs.props)}
    >
      {props.children}
    </div>
  );
}

function BlockWrapper(props: {
  node: Node;
  hasNodeSelection: boolean;
  component: ContentComponent;
  children: ReactNode;
  pos: number;
  toolbar?: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const runCommand = useEditorDispatchCommand();
  const schema = useMemo(
    () => ({ kind: 'object' as const, fields: props.component.schema }),
    [props.component.schema]
  );
  return (
    <>
      <Box
        UNSAFE_className={`${classes.blockParent} ${css({
          marginBlock: '1em',
          position: 'relative',
          ...(props.hasNodeSelection
            ? {
                '&::after': {
                  backgroundColor: tokenSchema.color.alias.backgroundSelected,
                  borderRadius: tokenSchema.size.radius.regular,
                  content: "''",
                  inset: 0,
                  pointerEvents: 'none',
                  position: 'absolute',
                },
              }
            : {}),
        })}${props.hasNodeSelection ? ` ${classes.hideselection}` : ''}`}
        border={
          props.hasNodeSelection
            ? 'color.alias.borderSelected'
            : 'color.alias.borderIdle'
        }
        borderRadius="regular"
      >
        <Flex
          borderBottom={
            props.hasNodeSelection
              ? 'color.alias.borderSelected'
              : 'color.alias.borderIdle'
          }
          contentEditable={false}
        >
          <Box
            flex={1}
            // this onClick is on a div because it's purely for mouse usage
            // the node can be selected with a keyboard via arrow keys
            onClick={() => {
              runCommand((state, dispatch) => {
                if (dispatch) {
                  dispatch(
                    state.tr.setSelection(
                      NodeSelection.create(state.doc, props.pos)
                    )
                  );
                }
                return true;
              });
            }}
          >
            {props.component.label}
          </Box>
          {props.toolbar}
          {!!Object.keys(props.component.schema).length && (
            <Button
              prominence="low"
              onPress={() => {
                setIsOpen(true);
              }}
            >
              Edit
            </Button>
          )}
        </Flex>
        {props.children}
      </Box>
      <DialogContainer
        onDismiss={() => {
          setIsOpen(false);
        }}
      >
        {isOpen && (
          <Dialog>
            <Heading>Edit {props.component.label}</Heading>
            <FormValue
              schema={schema}
              value={props.node.attrs.props}
              onSave={value => {
                runCommand((state, dispatch) => {
                  if (dispatch) {
                    dispatch(
                      state.tr.setNodeAttribute(props.pos, 'props', value)
                    );
                  }
                  return true;
                });
              }}
            />
          </Dialog>
        )}
      </DialogContainer>
    </>
  );
}

export function getCustomNodeSpecs(
  components: Record<string, ContentComponent>
) {
  const componentNames = new Map(
    Object.keys(components).map((name, i) => [name, `component${i}`])
  );
  return Object.fromEntries(
    Object.entries(components).flatMap(([name, component]) => {
      let spec: EditorNodeSpec | undefined;
      const schema = {
        kind: 'object' as const,
        fields: component.schema,
      };
      if (component.kind === 'block') {
        spec = {
          group: `${
            component.forSpecificLocations ? '' : 'block '
          }${componentNames.get(name)}`,
          defining: true,
          attrs: { props: { default: getInitialPropsValue(schema) } },
          reactNodeView: {
            component: function Block(props) {
              const runCommand = useEditorDispatchCommand();
              return (
                <BlockDataWrapper node={props.node}>
                  {'NodeView' in component && component.NodeView ? (
                    <component.NodeView
                      isSelected={
                        props.hasNodeSelection ||
                        props.isNodeCompletelyWithinSelection
                      }
                      onRemove={() => {
                        runCommand((state, dispatch) => {
                          if (dispatch) {
                            dispatch(
                              state.tr.delete(
                                props.pos,
                                props.pos + props.node.nodeSize
                              )
                            );
                          }
                          return true;
                        });
                      }}
                      onChange={value => {
                        runCommand((state, dispatch) => {
                          if (dispatch) {
                            dispatch(
                              state.tr.setNodeAttribute(
                                props.pos,
                                'props',
                                value
                              )
                            );
                          }
                          return true;
                        });
                      }}
                      value={props.node.attrs.props}
                    />
                  ) : (
                    <BlockWrapper
                      node={props.node}
                      hasNodeSelection={
                        props.hasNodeSelection ||
                        props.isNodeCompletelyWithinSelection
                      }
                      component={component}
                      pos={props.pos}
                    >
                      {'ContentView' in component && component.ContentView && (
                        <component.ContentView value={props.node.attrs.props} />
                      )}
                    </BlockWrapper>
                  )}
                </BlockDataWrapper>
              );
            },
            rendersOwnContent: false,
          },
          parseDOM: [
            {
              tag: `div[data-component="${name}"]`,
              getAttrs(node) {
                if (typeof node === 'string') return false;
                const props = node.dataset.props;
                if (!props) return false;
                return {
                  props: JSON.parse(props),
                };
              },
            },
          ],
          toDOM(node) {
            return [
              'div',
              {
                'data-component': name,
                'data-props': JSON.stringify(node.attrs.props),
              },
            ];
          },
          insertMenu: component.forSpecificLocations
            ? undefined
            : {
                label: component.label,
                command: insertNode,
                forToolbar: true,
                description: component.description,
                icon: component.icon,
              },
        };
      } else if (component.kind === 'wrapper') {
        spec = {
          group: `${
            component.forSpecificLocations ? '' : 'block '
          }${componentNames.get(name)}`,
          content: 'block+',
          defining: true,
          attrs: { props: { default: getInitialPropsValue(schema) } },
          reactNodeView: {
            component: function Block(props) {
              const runCommand = useEditorDispatchCommand();
              return (
                <BlockDataWrapper node={props.node}>
                  {'NodeView' in component && component.NodeView ? (
                    <component.NodeView
                      isSelected={
                        props.hasNodeSelection ||
                        props.isNodeCompletelyWithinSelection
                      }
                      onRemove={() => {
                        runCommand((state, dispatch) => {
                          if (dispatch) {
                            dispatch(
                              state.tr.delete(
                                props.pos,
                                props.pos + props.node.nodeSize
                              )
                            );
                          }
                          return true;
                        });
                      }}
                      onChange={value => {
                        runCommand((state, dispatch) => {
                          if (dispatch) {
                            dispatch(
                              state.tr.setNodeAttribute(
                                props.pos,
                                'props',
                                value
                              )
                            );
                          }
                          return true;
                        });
                      }}
                      value={props.node.attrs.props}
                    >
                      {props.children}
                    </component.NodeView>
                  ) : (
                    <BlockWrapper
                      node={props.node}
                      hasNodeSelection={
                        props.hasNodeSelection ||
                        props.isNodeCompletelyWithinSelection
                      }
                      component={component}
                      pos={props.pos}
                    >
                      {'ContentView' in component && component.ContentView ? (
                        <component.ContentView value={props.node.attrs.props}>
                          {props.children}
                        </component.ContentView>
                      ) : (
                        props.children
                      )}
                    </BlockWrapper>
                  )}
                </BlockDataWrapper>
              );
            },
            rendersOwnContent: false,
          },
          toDOM(node) {
            return [
              'div',
              {
                'data-component': name,
                'data-props': JSON.stringify(node.attrs.props),
              },
              0,
            ];
          },
          parseDOM: [
            {
              tag: `div[data-component="${name}"]`,
              getAttrs(node) {
                if (typeof node === 'string') return false;
                const props = node.dataset.props;
                if (!props) return false;
                return {
                  props: JSON.parse(props),
                };
              },
            },
          ],
          insertMenu: component.forSpecificLocations
            ? undefined
            : {
                label: component.label,
                command: insertNode,
                forToolbar: true,
                description: component.description,
                icon: component.icon,
              },
        };
      } else if (component.kind === 'inline') {
        spec = {
          group: 'inline inline_component',
          inline: true,
          attrs: { props: { default: getInitialPropsValue(schema) } },
          toDOM: node => [
            'span',
            {
              'data-component': name,
              'data-props': JSON.stringify(node.attrs.props),
            },
          ],
          parseDOM: [
            {
              tag: `span[data-component="${name}"]`,
              getAttrs(node) {
                if (typeof node === 'string') return false;
                const props = node.getAttribute('data-props');
                if (!props) return false;
                return {
                  props: JSON.parse(props),
                };
              },
            },
          ],
          reactNodeView: {
            component(props) {
              return (
                <Box
                  elementType="span"
                  border={
                    props.hasNodeSelection
                      ? 'color.alias.borderSelected'
                      : 'color.alias.borderIdle'
                  }
                  borderRadius="regular"
                  data-props={JSON.stringify(props.node.attrs.props)}
                  data-component={name}
                  UNSAFE_className={css({
                    '::after': {
                      content: 'attr(data-component)',
                    },
                  })}
                />
              );
            },
            rendersOwnContent: false,
          },
          insertMenu: {
            label: component.label,
            command: insertNode,
            forToolbar: true,
            description: component.description,
            icon: component.icon,
          },
        };
      } else if (component.kind === 'repeating') {
        const items = component.children.map(x => ({
          key: x,
          label: components[x].label,
        }));
        spec = {
          group: `${
            component.forSpecificLocations ? '' : 'block '
          }${componentNames.get(name)}`,
          content: `(${component.children
            .map(x => componentNames.get(x))
            .join(' | ')}){${component.validation.children.min},${
            component.validation.children.max === Infinity
              ? ''
              : component.validation.children.max
          }}`,
          defining: true,
          attrs: { props: { default: getInitialPropsValue(schema) } },
          reactNodeView: {
            component: function Block(props) {
              const runCommand = useEditorDispatchCommand();
              return (
                <BlockDataWrapper node={props.node}>
                  {'NodeView' in component && component.NodeView ? (
                    <component.NodeView
                      isSelected={
                        props.hasNodeSelection ||
                        props.isNodeCompletelyWithinSelection
                      }
                      onRemove={() => {
                        runCommand((state, dispatch) => {
                          if (dispatch) {
                            dispatch(
                              state.tr.delete(
                                props.pos,
                                props.pos + props.node.nodeSize
                              )
                            );
                          }
                          return true;
                        });
                      }}
                      onChange={value => {
                        runCommand((state, dispatch) => {
                          if (dispatch) {
                            dispatch(
                              state.tr.setNodeAttribute(
                                props.pos,
                                'props',
                                value
                              )
                            );
                          }
                          return true;
                        });
                      }}
                      value={props.node.attrs.props}
                    >
                      {props.children}
                    </component.NodeView>
                  ) : (
                    <BlockWrapper
                      node={props.node}
                      hasNodeSelection={
                        props.hasNodeSelection ||
                        props.isNodeCompletelyWithinSelection
                      }
                      component={component}
                      pos={props.pos}
                      toolbar={
                        component.children.length === 1 ? (
                          <Button
                            onPress={() => {
                              runCommand((state, dispatch) => {
                                if (dispatch) {
                                  dispatch(
                                    state.tr.insert(
                                      props.pos + props.node.nodeSize - 1,
                                      state.schema.nodes[
                                        component.children[0]
                                      ].createAndFill()!
                                    )
                                  );
                                }
                                return true;
                              });
                            }}
                          >
                            Insert
                          </Button>
                        ) : (
                          <MenuTrigger>
                            <Button>Insert</Button>
                            <Menu
                              onAction={key => {
                                runCommand((state, dispatch) => {
                                  if (dispatch) {
                                    dispatch(
                                      state.tr.insert(
                                        props.pos + props.node.nodeSize - 1,
                                        state.schema.nodes[key].createAndFill()!
                                      )
                                    );
                                  }
                                  return true;
                                });
                              }}
                              items={items}
                            >
                              {item => <Item key={item.key}>{item.label}</Item>}
                            </Menu>
                          </MenuTrigger>
                        )
                      }
                    >
                      {'ContentView' in component && component.ContentView ? (
                        <component.ContentView value={props.node.attrs.props}>
                          {props.children}
                        </component.ContentView>
                      ) : (
                        props.children
                      )}
                    </BlockWrapper>
                  )}
                </BlockDataWrapper>
              );
            },
            rendersOwnContent: false,
          },
          toDOM(node) {
            return [
              'div',
              {
                'data-component': name,
                'data-props': JSON.stringify(node.attrs.props),
              },
              0,
            ];
          },
          parseDOM: [
            {
              tag: `div[data-component="${name}"]`,
              getAttrs(node) {
                if (typeof node === 'string') return false;
                const props = node.dataset.props;
                if (!props) return false;
                return {
                  props: JSON.parse(props),
                };
              },
            },
          ],
          insertMenu: component.forSpecificLocations
            ? undefined
            : {
                label: component.label,
                command: insertNode,
                forToolbar: true,
                description: component.description,
                icon: component.icon,
              },
        };
      }
      if (spec) {
        return [[name, spec]];
      }
      return [];
    })
  );
}

export function getCustomMarkSpecs(
  components: Record<string, ContentComponent>
) {
  return Object.fromEntries(
    Object.entries(components).flatMap(([name, component]) => {
      if (component.kind !== 'mark') return [];
      const schema = {
        kind: 'object' as const,
        fields: component.schema,
      };
      const tag = component.tag ?? 'span';
      const className =
        typeof component.className === 'function'
          ? component.className
          : () => component.className;
      const style =
        typeof component.style === 'function'
          ? component.style
          : () => component.style;

      const spec: MarkSpec = {
        attrs: { props: { default: getInitialPropsValue(schema) } },
        toDOM(mark) {
          const element = document.createElement(tag);
          element.setAttribute('data-component', name);
          element.setAttribute('data-props', JSON.stringify(mark.attrs.props));
          const computedClassName = className({ value: mark.attrs.props });
          if (computedClassName) {
            // TODO: this cast shouldn't be necessary
            element.className = computedClassName as string;
          }
          Object.assign(
            element.style,
            style({
              value: mark.attrs.props,
            })
          );
          return element;
        },
        parseDOM: [
          {
            tag: `${tag}[data-component="${name}"]`,
            getAttrs(node) {
              if (typeof node === 'string') return false;
              const props = node.getAttribute('data-props');
              if (!props) return false;
              return {
                props: JSON.parse(props),
              };
            },
          },
        ],
      };

      return [[name, spec]];
    })
  );
}
