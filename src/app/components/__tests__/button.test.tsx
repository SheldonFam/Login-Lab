import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../button'

describe('Button Component', () => {
  describe('Rendering', () => {
    it('renders button with text', () => {
      render(<Button>Click me</Button>)
      
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
    })

    it('renders with icon', () => {
      const icon = <span data-testid="test-icon">🔍</span>
      render(<Button icon={icon}>Search</Button>)
      
      expect(screen.getByTestId('test-icon')).toBeInTheDocument()
      expect(screen.getByText('Search')).toBeInTheDocument()
    })

    it('shows loading spinner when isLoading is true', () => {
      const { container } = render(<Button isLoading>Loading</Button>)
      
      const spinner = container.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
      expect(screen.getByText('Loading')).toBeInTheDocument()
    })
  })

  describe('Variants', () => {
    it('applies primary variant styles by default', () => {
      render(<Button>Primary</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-indigo-600')
      expect(button).toHaveClass('text-white')
    })

    it('applies secondary variant styles', () => {
      render(<Button variant="secondary">Secondary</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-white')
      expect(button).toHaveClass('ring-gray-300')
    })

    it('applies social variant styles', () => {
      render(<Button variant="social">Social</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-white')
      expect(button).toHaveClass('ring-gray-300')
    })
  })

  describe('Sizes', () => {
    it('applies medium size by default', () => {
      render(<Button>Medium</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-4')
      expect(button).toHaveClass('py-2')
    })

    it('applies small size', () => {
      render(<Button size="sm">Small</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-3')
      expect(button).toHaveClass('py-1.5')
    })

    it('applies large size', () => {
      render(<Button size="lg">Large</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-6')
      expect(button).toHaveClass('py-3')
    })
  })

  describe('States', () => {
    it('is disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('opacity-50')
      expect(button).toHaveClass('cursor-not-allowed')
    })

    it('is disabled when isLoading is true', () => {
      render(<Button isLoading>Loading</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('opacity-50')
    })

    it('applies fullWidth class', () => {
      render(<Button fullWidth>Full Width</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('w-full')
    })
  })

  describe('Interactions', () => {
    it('calls onClick handler when clicked', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      
      render(<Button onClick={handleClick}>Click me</Button>)
      
      await user.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick when disabled', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      
      render(<Button onClick={handleClick} disabled>Click me</Button>)
      
      await user.click(screen.getByRole('button'))
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('does not call onClick when loading', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      
      render(<Button onClick={handleClick} isLoading>Click me</Button>)
      
      await user.click(screen.getByRole('button'))
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('can be focused and activated with keyboard', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      
      render(<Button onClick={handleClick}>Click me</Button>)
      
      const button = screen.getByRole('button')
      await user.tab()
      expect(button).toHaveFocus()
      
      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Custom Props', () => {
    it('forwards additional HTML attributes', () => {
      render(
        <Button type="submit" data-testid="custom-button" aria-label="Submit form">
          Submit
        </Button>
      )
      
      const button = screen.getByTestId('custom-button')
      expect(button).toHaveAttribute('type', 'submit')
      expect(button).toHaveAttribute('aria-label', 'Submit form')
    })

    it('merges custom className with default classes', () => {
      render(<Button className="custom-class">Custom</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
      expect(button).toHaveClass('bg-indigo-600') // Still has default classes
    })
  })

  describe('Loading State', () => {
    it('displays loading spinner with correct styles', () => {
      const { container } = render(<Button isLoading>Loading</Button>)
      
      const svg = container.querySelector('.animate-spin')
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveClass('h-4')
      expect(svg).toHaveClass('w-4')
    })

    it('hides icon when loading', () => {
      const icon = <span data-testid="icon">Icon</span>
      const { rerender } = render(<Button icon={icon}>Button</Button>)
      
      expect(screen.getByTestId('icon')).toBeInTheDocument()
      
      rerender(<Button icon={icon} isLoading>Button</Button>)
      expect(screen.queryByTestId('icon')).not.toBeInTheDocument()
    })
  })
})
