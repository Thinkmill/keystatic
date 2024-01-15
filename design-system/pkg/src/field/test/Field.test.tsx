import { expect, describe, it } from '@jest/globals';
import { render } from '@testing-library/react';

import { Field, FieldProps } from '..';

function renderField(props: Partial<FieldProps> = {}) {
  return render(
    <Field label="Field label" {...props}>
      {inputProps => <input {...inputProps} />}
    </Field>
  );
}

describe('field/Field', () => {
  it('renders correctly', () => {
    const { getByLabelText } = renderField();
    expect(getByLabelText('Field label')).toHaveAttribute('id');
  });

  describe('description', () => {
    it('renders the description when provided', () => {
      const { getByRole, getByText } = renderField({
        description: 'Description text',
      });

      const description = getByText('Description text');
      expect(description).toBeTruthy();

      const input = getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', description.id);
    });

    it('does not render the description, when none is provided', () => {
      const { getByRole } = renderField();

      const input = getByRole('textbox');
      expect(input).not.toHaveAttribute('aria-describedby');
    });
  });

  describe('error message', () => {
    it('renders the error message when provided', () => {
      const { getByRole, getByText } = renderField({
        errorMessage: 'Error message',
      });

      const errorMessage = getByText('Error message');
      expect(errorMessage).toBeTruthy();
      const input = getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', errorMessage.id);
    });

    it('combines the error message with description text, when both provided', () => {
      const { getByRole } = renderField({
        description: 'Description text.',
        errorMessage: 'Error message.',
      });

      expect(getByRole('textbox')).toHaveAccessibleDescription(
        'Description text. Error message.'
      );
    });
  });
});
