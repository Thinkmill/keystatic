import { describe, expect, it } from '@jest/globals';

import { renderWithProvider } from '#test-utils';
import { BreadcrumbItem, Breadcrumbs } from '..';

describe('breadcrumbs/Breadcrumbs', () => {
  it('renders an accessible static collection', () => {
    let result = renderWithProvider(
      <Breadcrumbs id="breadcrumbs-id" aria-label="Breadcrumbs">
        <BreadcrumbItem href="/one">Folder 1</BreadcrumbItem>
        <BreadcrumbItem href="/one/two">Folder 2</BreadcrumbItem>
        <BreadcrumbItem href="/one/two/three">Folder 3</BreadcrumbItem>
      </Breadcrumbs>
    );

    let list = result.getByRole('list', { name: 'Breadcrumbs' });
    expect(list).toHaveAttribute('id', 'breadcrumbs-id');
    expect(result.getAllByRole('listitem')).toHaveLength(3);
    expect(result.getByText('Folder 1')).toHaveAttribute('href', '/one');
    expect(result.getByText('Folder 2')).toHaveAttribute('href', '/one/two');
    expect(result.getByText('Folder 3')).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(result.getByText('Folder 3')).not.toHaveAttribute('href');
  });

  it('renders a dynamic collection', () => {
    let items = [
      { id: 'one', label: 'Folder 1', href: '/one' },
      { id: 'two', label: 'Folder 2', href: '/one/two' },
    ];
    let result = renderWithProvider(
      <Breadcrumbs aria-label="Breadcrumbs" items={items}>
        {item => <BreadcrumbItem href={item.href}>{item.label}</BreadcrumbItem>}
      </Breadcrumbs>
    );

    expect(result.getAllByRole('listitem')).toHaveLength(2);
    expect(result.getByText('Folder 1')).toHaveAttribute('href', '/one');
    expect(result.getByText('Folder 2')).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('forwards accessibility and custom DOM props', () => {
    let result = renderWithProvider(
      <>
        <span id="breadcrumb-label">Location</span>
        <span id="breadcrumb-description">Current folder</span>
        <Breadcrumbs
          aria-labelledby="breadcrumb-label"
          aria-describedby="breadcrumb-description"
          data-testid="breadcrumbs"
        >
          <BreadcrumbItem>Folder 1</BreadcrumbItem>
        </Breadcrumbs>
      </>
    );

    let list = result.getByTestId('breadcrumbs');
    expect(list).toHaveAttribute('aria-labelledby', 'breadcrumb-label');
    expect(list).toHaveAttribute('aria-describedby', 'breadcrumb-description');
  });

  it('disables all items when the collection is disabled', () => {
    let result = renderWithProvider(
      <Breadcrumbs aria-label="Breadcrumbs" isDisabled>
        <BreadcrumbItem href="/one">Folder 1</BreadcrumbItem>
        <BreadcrumbItem>Folder 2</BreadcrumbItem>
      </Breadcrumbs>
    );

    for (let link of result.getAllByRole('link')) {
      expect(link).toHaveAttribute('aria-disabled', 'true');
    }
  });

  it('does not pass an empty href to the rendered element', () => {
    let result = renderWithProvider(
      <Breadcrumbs aria-label="Breadcrumbs">
        <BreadcrumbItem href="">Folder 1</BreadcrumbItem>
      </Breadcrumbs>
    );

    expect(result.getByText('Folder 1')).not.toHaveAttribute('href');
  });
});
