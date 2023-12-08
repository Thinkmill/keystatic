import { css } from '@emotion/css';
import { Button } from '@keystar/ui/button';
import { DialogContainer, Dialog } from '@keystar/ui/dialog';
import { Box, Flex } from '@keystar/ui/layout';
import { Heading } from '@keystar/ui/typography';
import { MarkSpec } from 'prosemirror-model';
import { useState } from 'react';
import { getInitialPropsValue } from '../../../initial-values';
import { FormValue } from './FormValue';
import { insertNode } from './commands/misc';
import { useEditorDispatchCommand } from './editor-view';
import { EditorNodeSpec } from './schema';
import { classes } from './utils';
import { ContentComponent } from '../../../../content-components';

export function getCustomNodeSpecs(
  components: Record<string, ContentComponent>
) {
  return Object.fromEntries(
    Object.entries(components).flatMap(([name, component]) => {
      let spec: EditorNodeSpec | undefined;
      const schema = {
        kind: 'object' as const,
        fields: component.schema,
      };
      if (component.kind === 'block') {
        spec = {
          group: 'block',
          defining: true,
          attrs: { props: { default: getInitialPropsValue(schema) } },
          reactNodeView: {
            component: function Block(props) {
              const [isOpen, setIsOpen] = useState(false);
              const runCommand = useEditorDispatchCommand();
              return (
                <>
                  <Box
                    data-component={name}
                    data-props={JSON.stringify(props.node.attrs.props)}
                    className={`${classes.blockParent} ${css({
                      marginBlock: '1em',
                    })}`}
                    border={
                      props.hasNodeSelection
                        ? 'color.alias.borderSelected'
                        : 'color.alias.borderIdle'
                    }
                    borderRadius="regular"
                  >
                    <Flex justifyContent="space-between">
                      {name}
                      {!!Object.keys(component.schema).length && (
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
                  </Box>
                  <DialogContainer
                    onDismiss={() => {
                      setIsOpen(false);
                    }}
                  >
                    {isOpen && (
                      <Dialog>
                        <Heading>Edit {name}</Heading>
                        <FormValue
                          schema={schema}
                          value={props.node.attrs.props}
                          onSave={value => {
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
                        />
                      </Dialog>
                    )}
                  </DialogContainer>
                </>
              );
            },
            rendersOwnContent: false,
          },
          parseDOM: [
            {
              tag: `div[data-component="${name}"]`,
              getAttrs(node) {
                console.log(node);
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
          insertMenu: {
            label: name,
            command: insertNode,
            forToolbar: true,
          },
        };
      } else if (component.kind === 'wrapper') {
        spec = {
          group: 'block',
          content: 'block+',
          defining: true,
          attrs: { props: { default: getInitialPropsValue(schema) } },
          reactNodeView: {
            component: function Block(props) {
              const [isOpen, setIsOpen] = useState(false);
              const runCommand = useEditorDispatchCommand();
              return (
                <>
                  <Box
                    data-component={name}
                    data-props={JSON.stringify(props.node.attrs.props)}
                    className={`${classes.blockParent} ${css({
                      marginBlock: '1em',
                    })}`}
                    border={
                      props.hasNodeSelection
                        ? 'color.alias.borderSelected'
                        : 'color.alias.borderIdle'
                    }
                    borderRadius="regular"
                  >
                    <Flex
                      justifyContent="space-between"
                      borderBottom={
                        props.hasNodeSelection
                          ? 'color.alias.borderSelected'
                          : 'color.alias.borderIdle'
                      }
                      contentEditable={false}
                    >
                      {name}
                      {!!Object.keys(component.schema).length && (
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
                        <Heading>Edit {name}</Heading>
                        <FormValue
                          schema={schema}
                          value={props.node.attrs.props}
                          onSave={value => {
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
                        />
                      </Dialog>
                    )}
                  </DialogContainer>
                </>
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
                console.log(node);
                if (typeof node === 'string') return false;
                const props = node.dataset.props;
                if (!props) return false;
                return {
                  props: JSON.parse(props),
                };
              },
            },
          ],
          insertMenu: {
            label: name,
            command: insertNode,
            forToolbar: true,
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
            label: name,
            command: insertNode,
            forToolbar: true,
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
          return [
            tag,
            {
              'data-component': name,
              'data-props': JSON.stringify(mark.attrs.props),
              class: className(mark.attrs.props),
              style: style(mark.attrs.props),
            },
          ];
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
