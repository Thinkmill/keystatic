import { ActionButton } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { refreshCwIcon } from '@keystar/ui/icon/icons/refreshCwIcon';
import { Flex, Box } from '@keystar/ui/layout';
import { containerQueries, css } from '@keystar/ui/style';
import { TextField } from '@keystar/ui/text-field';
import { Text } from '@keystar/ui/typography';
import { useContext, useState } from 'react';

import { FormFieldInputProps } from '../../api';
import { SlugFieldContext, PathContext } from '../text/path-slug-context';
import { validateText } from '../text/validateText';

const emptySet = new Set<string>();

export { default as slugify } from '@sindresorhus/slugify';

export function SlugFieldInput(
  props: FormFieldInputProps<{ name: string; slug: string }> & {
    defaultValue: { name: string; slug: string };
    args: Parameters<typeof import('./index').slug>[0];
    naiveGenerateSlug: (name: string) => string;
  }
) {
  const slugContext = useContext(SlugFieldContext);
  const path = useContext(PathContext);
  const slugInfo =
    path.length === 1 && path[0] === slugContext?.field
      ? slugContext
      : { slugs: emptySet, glob: '*' as const };

  const [blurredName, setBlurredName] = useState(false);
  const [blurredSlug, setBlurredSlug] = useState(false);

  const [shouldGenerateSlug, setShouldGenerateSlug] = useState(
    props.value === props.defaultValue
  );
  const generateSlug = (name: string) => {
    const generated = props.naiveGenerateSlug(name);
    if (slugInfo.slugs.has(generated)) {
      let i = 1;
      while (slugInfo.slugs.has(`${generated}-${i}`)) {
        i++;
      }
      return `${generated}-${i}`;
    }
    return generated;
  };

  const slugFieldLabel = props.args.slug?.label ?? 'Slug';
  const slugErrorMessage =
    props.forceValidation || blurredSlug
      ? validateText(
          props.value.slug,
          props.args.slug?.validation?.length?.min ?? 1,
          props.args.slug?.validation?.length?.max ?? Infinity,
          slugFieldLabel,
          slugInfo,
          props.args.slug?.validation?.pattern
        )
      : undefined;

  return (
    <Flex gap="xlarge" direction="column">
      <TextField
        label={props.args.name.label}
        description={props.args.name.description}
        autoFocus={props.autoFocus}
        value={props.value.name}
        isRequired={!!props.args.name.validation?.length?.min}
        onChange={name => {
          props.onChange({
            name,
            slug: shouldGenerateSlug ? generateSlug(name) : props.value.slug,
          });
        }}
        onBlur={() => setBlurredName(true)}
        errorMessage={
          props.forceValidation || blurredName
            ? validateText(
                props.value.name,
                props.args.name.validation?.length?.min ?? 0,
                props.args.name.validation?.length?.max ?? Infinity,
                props.args.name.label,
                undefined,
                props.args.name.validation?.pattern
              )
            : undefined
        }
      />
      <Flex gap="regular" alignItems="end">
        <TextField
          flex={1}
          label={slugFieldLabel}
          description={props.args.slug?.description}
          value={props.value.slug}
          onChange={slug => {
            setShouldGenerateSlug(false);
            props.onChange({ name: props.value.name, slug });
          }}
          onBlur={() => setBlurredSlug(true)}
          errorMessage={slugErrorMessage}
          isRequired
        />
        <Flex gap="regular" direction="column">
          <ActionButton
            aria-label="regenerate"
            onPress={() => {
              props.onChange({
                name: props.value.name,
                slug: generateSlug(props.value.name),
              });
            }}
          >
            <Icon
              src={refreshCwIcon}
              UNSAFE_className={css({
                [containerQueries.above.mobile]: { display: 'none' },
              })}
            />
            <Text
              UNSAFE_className={css({
                [containerQueries.below.tablet]: { display: 'none' },
              })}
            >
              Regenerate
            </Text>
          </ActionButton>
          {/* display shim to offset the error message */}
          {slugErrorMessage !== undefined && <Box height="element.xsmall" />}
        </Flex>
      </Flex>
    </Flex>
  );
}
