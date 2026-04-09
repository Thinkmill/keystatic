import { createElement } from 'react';
import { useProvider } from '@keystar/ui/core';
import { useMediaQuery } from '@keystar/ui/style';

import { serializeRepoConfig } from '../repo-config';
import { useConfig } from './context';

export function useBrand() {
  let { colorScheme } = useProvider();
  let config = useConfig();
  let prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  let resolvedColorScheme =
    colorScheme === 'auto' ? (prefersDark ? 'dark' : 'light') : colorScheme;

  let brandMark = <AnimatedBrandMark colorScheme={resolvedColorScheme} />;
  let brandName = 'Keystatic';

  if (config.ui?.brand?.mark) {
    let BrandMark = config.ui.brand.mark;
    brandMark = <BrandMark colorScheme={resolvedColorScheme} />;
  }

  if ('repo' in config.storage) {
    brandName = serializeRepoConfig(config.storage.repo);
  }
  if (config.cloud) {
    brandName = config.cloud.project;
  }
  if (config.ui?.brand?.name) {
    brandName = config.ui.brand.name;
  }

  return { brandMark, brandName };
}

function AnimatedBrandMark({ colorScheme }: { colorScheme: 'light' | 'dark' }) {
  const darkFill = colorScheme === 'dark' ? '#e5e7eb' : '#0a122b';

  return createElement(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      xmlnsXlink: 'http://www.w3.org/1999/xlink',
      viewBox: '0 0 1131 507.89',
      style: {
        width: '40px',
        height: '18px',
      },
    },
    createElement('defs', null, [
      createElement('style', null, `.cls-1{fill:none;}.cls-2{fill:${darkFill};}.cls-3{opacity:0.2;}.cls-4{clip-path:url(#clip-path);}.cls-5{fill:#0069fe;}.cls-6{opacity:0.4;}.cls-7{clip-path:url(#clip-path-2);}.cls-8{opacity:0.7;}.cls-9{clip-path:url(#clip-path-3);}`),
      createElement(
        'clipPath',
        { id: 'clip-path' },
        createElement('rect', {
          className: 'cls-1',
          x: '0.15',
          y: '5.7',
          width: '464.26',
          height: '401.16',
        })
      ),
      createElement(
        'clipPath',
        { id: 'clip-path-2' },
        createElement('rect', {
          className: 'cls-1',
          x: '0.49',
          y: '118.8',
          width: '359.61',
          height: '339.71',
        })
      ),
      createElement(
        'clipPath',
        { id: 'clip-path-3' },
        createElement('rect', {
          className: 'cls-1',
          y: '218.77',
          width: '262.34',
          height: '289.12',
        })
      ),
    ]),
    createElement('g', { id: 'Layer_2', 'data-name': 'Layer 2' }, [
      createElement('g', { id: 'Layer_1-2', 'data-name': 'Layer 1', key: 'main-content' }, [
        createElement('path', {
          key: 'path-1',
          className: 'cls-2',
          d: 'M561.05,391.66h0V104.26h79V312.7a79,79,0,0,1-79,79',
        }),
        createElement('path', {
          key: 'path-2',
          className: 'cls-2',
          d: 'M845.54,358q-36.88,33.63-77.65,33.65h-18a79.17,79.17,0,0,1-79.17-79.16V104.27H824.14v56.86h-73.9V288c0,10.91,2.83,19.39,8.42,25.54s12.26,9.21,20,9.21c14.73,0,27.15-6.68,37.37-20Z',
        }),
        createElement('path', {
          key: 'path-3',
          className: 'cls-2',
          d: 'M1064.15,339.56q-37.38,41.58-92.91,41.58t-93.7-37.64Q839.38,305.88,839.38,243T878.6,139.79q39.2-40.26,89.74-40.27t83.7,41.59V103.74h79V350.61q0,37.9-13.16,67.38t-35.27,46.32q-43.69,34.76-103.17,34.74a215.89,215.89,0,0,1-64.48-10.26Q882,478.53,857.28,459.58l30.53-59.49q39,29.48,82.38,29.48T1038.88,408q25.27-21.6,25.27-68.43m-11.06-99.75q0-34-18.94-53.43T987.3,166.9q-27.91,0-48.17,19.48t-20.27,53.16q0,33.69,19.75,54.49t48.16,20.79q28.43,0,47.38-20.53t18.94-54.48',
        }),
        createElement('path', {
          key: 'path-4',
          className: 'cls-2',
          d: 'M750.32,79.55A79.56,79.56,0,0,1,670.76,0h70a9.53,9.53,0,0,1,9.53,9.52Z',
        }),
        createElement(
          'g',
          { className: 'cls-3', key: 'layer1' },
          createElement(
            'g',
            { className: 'cls-4' },
            createElement('path', {
              className: 'cls-5',
              d: 'M123.38,35.61,37.47,84.17c-49.36,27.89-49.85,98.82-.88,127.39L354,396.74c49,28.57,110.47-6.75,110.47-63.44V234.61c0-175-188.67-285.11-341-199',
            })
          )
        ),
        createElement(
          'g',
          { className: 'cls-6', key: 'layer2' },
          createElement(
            'g',
            { className: 'cls-7' },
            createElement('path', {
              className: 'cls-5',
              d: 'M156.64,136.65,29.39,208.56c-38.23,21.61-38.61,76.54-.68,98.67L274.53,450.67c37.93,22.13,85.57-5.23,85.57-49.14V255.37c0-104.42-112.56-170.1-203.46-118.72',
            })
          )
        ),
        createElement(
          'g',
          { className: 'cls-8', key: 'layer3' },
          createElement(
            'g',
            { className: 'cls-9' },
            createElement('path', {
              className: 'cls-5',
              d: 'M200.41,224.2,21.09,325.55c-27.9,15.76-28.17,55.84-.5,72L199.91,502.17c27.68,16.14,62.43-3.82,62.43-35.85v-206c0-31.78-34.26-51.77-61.93-36.14',
            })
          )
        ),
      ]),
    ])
  );
}
