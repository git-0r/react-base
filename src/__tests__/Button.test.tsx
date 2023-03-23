import { render } from '@testing-library/react';
import Button from '../components/Button';

describe('Button', () => {
  it('renders button text', () => {
    const { getByText } = render(<Button />);
    expect(getByText('Enter')).toBeInTheDocument();
  });
});
