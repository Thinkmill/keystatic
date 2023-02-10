/** @jest-environment node */
import path from 'path';
import localConfig from './local-config';
import { createReader } from './src/reader';

test('list', async () => {
  const reader = createReader(path.join(__dirname, 'test-data'), localConfig);
  const result = await reader.collections.posts.list();
  expect(result).toMatchInlineSnapshot(`
    [
      "2023-is-finally-here",
    ]
  `);
});

test('read', async () => {
  const reader = createReader(path.join(__dirname, 'test-data'), localConfig);
  const result = await reader.collections.posts.read('2023-is-finally-here');
  expect(result).toMatchInlineSnapshot(`
    {
      "authors": [
        {
          "bio": [Function],
          "name": "Dan",
        },
      ],
      "content": [Function],
      "heroImage": "heroImage.png",
      "slug": "2023-is-finally-here",
      "title": "oh my there is dark mode, thank god Joss",
    }
  `);
  const content = await result!.content();
  expect(content).toMatchInlineSnapshot(`
    [
      {
        "children": [
          {
            "text": "Cool, and things are direct to GitHub?",
          },
        ],
        "type": "paragraph",
      },
      {
        "children": [
          {
            "children": [
              {
                "text": "",
              },
            ],
            "type": "component-inline-prop",
          },
        ],
        "component": "image",
        "props": {
          "alt": "",
          "image": "blank.png",
        },
        "type": "component-block",
      },
      {
        "children": [
          {
            "text": "",
          },
        ],
        "type": "paragraph",
      },
    ]
  `);
});
