export function getParagraph(length: 1 | 2 | 3 = 2) {
  let parts = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet tristique risus.',
    'In sit amet suscipit lorem. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In condimentum imperdiet metus non condimentum.',
    'Duis eu velit et quam accumsan tempus at id velit. Duis elementum elementum purus, id tempus mauris posuere a. Nunc vestibulum sapien pellentesque lectus commodo ornare.',
  ];

  return parts.slice(0, length).join(' ');
}
