import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormInput from "../form-input";

describe("FormInput Component", () => {
  describe("Text Input Rendering", () => {
    it("renders text input with label", () => {
      render(<FormInput id="name" name="name" label="Full Name" type="text" />);

      expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toHaveAttribute("type", "text");
    });

    it("renders with placeholder", () => {
      render(
        <FormInput
          id="email"
          name="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
        />
      );

      const input = screen.getByPlaceholderText("Enter your email");
      expect(input).toBeInTheDocument();
    });

    it("renders asterisk when showAsterisk is true", () => {
      render(<FormInput id="email" name="email" label="Email" showAsterisk />);

      expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("renders helper text when provided", () => {
      render(
        <FormInput
          id="password"
          name="password"
          label="Password"
          helperText="Must be at least 8 characters"
        />
      );

      expect(
        screen.getByText("Must be at least 8 characters")
      ).toBeInTheDocument();
    });
  });

  describe("Password Input", () => {
    it("renders password input with toggle button", () => {
      render(
        <FormInput
          id="password"
          name="password"
          label="Password"
          type="password"
          showPasswordToggle
        />
      );

      const input = screen.getByLabelText("Password");
      expect(input).toHaveAttribute("type", "password");
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("toggles password visibility when button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <FormInput
          id="password"
          name="password"
          label="Password"
          type="password"
          showPasswordToggle
        />
      );

      const input = screen.getByLabelText("Password");
      const toggleButton = screen.getByRole("button");

      expect(input).toHaveAttribute("type", "password");

      await user.click(toggleButton);
      expect(input).toHaveAttribute("type", "text");

      await user.click(toggleButton);
      expect(input).toHaveAttribute("type", "password");
    });

    it("does not show toggle button when showPasswordToggle is false", () => {
      render(
        <FormInput
          id="password"
          name="password"
          label="Password"
          type="password"
        />
      );

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("Checkbox Input", () => {
    it("renders checkbox input", () => {
      render(
        <FormInput
          id="remember"
          name="remember"
          label="Remember me"
          type="checkbox"
        />
      );

      expect(screen.getByRole("checkbox")).toBeInTheDocument();
      expect(screen.getByText("Remember me")).toBeInTheDocument();
    });
  });

  describe("Error States", () => {
    const errors = {
      email: {
        message: "Email is required",
        type: "required",
      },
    };

    it("shows error message when showError is true", () => {
      render(
        <FormInput
          id="email"
          name="email"
          label="Email"
          errors={errors}
          showError
        />
      );

      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });

    it("applies error styling when error exists", () => {
      render(
        <FormInput
          id="email"
          name="email"
          label="Email"
          errors={errors}
          showError
        />
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("ring-red-500");
    });

    it("does not show error when showError is false", () => {
      render(
        <FormInput
          id="email"
          name="email"
          label="Email"
          errors={errors}
          showError={false}
        />
      );

      expect(screen.queryByText("Email is required")).not.toBeInTheDocument();
    });

    it("hides helper text when error is shown", () => {
      render(
        <FormInput
          id="email"
          name="email"
          label="Email"
          errors={errors}
          showError
          helperText="Enter a valid email"
        />
      );

      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.queryByText("Enter a valid email")).not.toBeInTheDocument();
    });

    it("sets aria-invalid when error exists", () => {
      render(
        <FormInput
          id="email"
          name="email"
          label="Email"
          errors={errors}
          showError
        />
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("links error message with aria-describedby", () => {
      render(
        <FormInput
          id="email"
          name="email"
          label="Email"
          errors={errors}
          showError
        />
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-describedby", "email-error");

      const errorMessage = screen.getByText("Email is required");
      expect(errorMessage).toHaveAttribute("id", "email-error");
      expect(errorMessage).toHaveAttribute("role", "alert");
    });
  });

  describe("Focus States", () => {
    it("applies focus styles on focus", async () => {
      const user = userEvent.setup();
      render(<FormInput id="email" name="email" label="Email" />);

      const input = screen.getByRole("textbox");
      await user.click(input);

      expect(input).toHaveClass("ring-indigo-300");
    });
  });

  describe("Disabled State", () => {
    it("disables input when disabled prop is true", () => {
      render(<FormInput id="email" name="email" label="Email" disabled />);

      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
      expect(input).toHaveClass("bg-gray-50");
      expect(input).toHaveClass("cursor-not-allowed");
    });
  });

  describe("React Hook Form Integration", () => {
    it("accepts registerProps from react-hook-form", () => {
      const mockRegister = {
        onChange: vi.fn(),
        onBlur: vi.fn(),
        ref: vi.fn(),
        name: "email",
      };

      render(
        <FormInput
          id="email"
          name="email"
          label="Email"
          registerProps={mockRegister}
        />
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("name", "email");
    });
  });

  describe("AutoComplete", () => {
    it("applies autoComplete attribute", () => {
      render(
        <FormInput id="email" name="email" label="Email" autoComplete="email" />
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("autocomplete", "email");
    });
  });

  describe("Accessibility", () => {
    it("associates label with input via htmlFor and id", () => {
      render(<FormInput id="test-input" name="test" label="Test Label" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("id", "test-input");

      const label = screen.getByText("Test Label");
      expect(label).toHaveAttribute("for", "test-input");
    });

    it("provides aria-describedby for helper text", () => {
      render(
        <FormInput
          id="email"
          name="email"
          label="Email"
          helperText="Enter your email address"
        />
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-describedby", "email-description");

      const helperText = screen.getByText("Enter your email address");
      expect(helperText).toHaveAttribute("id", "email-description");
    });
  });

  describe("User Interactions", () => {
    it("accepts user input", async () => {
      const user = userEvent.setup();
      render(<FormInput id="email" name="email" label="Email" />);

      const input = screen.getByRole("textbox") as HTMLInputElement;
      await user.type(input, "test@example.com");

      expect(input.value).toBe("test@example.com");
    });

    it("calls onChange handler", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <FormInput
          id="email"
          name="email"
          label="Email"
          onChange={handleChange}
        />
      );

      const input = screen.getByRole("textbox");
      await user.type(input, "a");

      expect(handleChange).toHaveBeenCalled();
    });
  });
});
