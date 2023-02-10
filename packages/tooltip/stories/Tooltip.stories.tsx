import { storiesOf } from '@voussoir/storybook';
import { Flex } from '@voussoir/layout';
import { Kbd, Numeral, Text } from '@voussoir/typography';

import { Tooltip } from '../src';
import { TooltipContext } from '../src/context';

const placements = ['start', 'end', 'right', 'left', 'top', 'bottom'] as const;

storiesOf('Components/Tooltip', module)
  .add('default', () => <OpenTooltip>Tooltip</OpenTooltip>)
  .add('placement', () => (
    <Flex alignItems="start" gap="large" wrap>
      {placements.map(p => (
        <TooltipContext.Provider value={{ placement: p }} key={p}>
          <OpenTooltip>{p}</OpenTooltip>
        </TooltipContext.Provider>
      ))}
    </Flex>
  ))
  .add('long content', () => (
    <OpenTooltip>
      <Flex direction="column" gap="medium">
        <Text>
          Cupcake ipsum dolor sit amet <strong>tootsie roll</strong> marzipan
          danish marshmallow. Tiramisu chupa chups pie shortbread muffin.
        </Text>
        <Text>
          Apple pie muffin cookie <em>icing sugar</em> plum halvah chocolate
          cake cookie.
        </Text>
      </Flex>
    </OpenTooltip>
  ))
  .add('complex content', () => (
    <Flex gap="medium" alignItems="start">
      <OpenTooltip>
        <Numeral value={1234} abbreviate />
      </OpenTooltip>
      <OpenTooltip>
        <Text>Copy</Text>
        <Kbd meta>C</Kbd>
      </OpenTooltip>
    </Flex>
  ));

function OpenTooltip(props: any) {
  return <Tooltip isOpen UNSAFE_style={{ position: 'static' }} {...props} />;
}
