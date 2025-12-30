import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Form from "../form";

// Test schema
const testSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type TestFormData = z.infer<typeof testSchema>;

// Test wrapper component
function TestFormWrapper({
  onSubmit,
  isLoading = false,
}: {
  onSubmit: (data: TestFormData) => void;
  isLoading?: boolean;
}) {
  const { register, handleSubmit, formState } = useForm<TestFormData>({
    resolver: zodResolver(testSchema),
  });

  return (
    <Form
      fields={[
        {
          id: "email",
          name: "email",
          type: "email",
          label: "Email",
          placeholder: "Enter email",
        },
        {
          id: "password",
          name: "password",
          type: "password",
          label: "Password",
          placeholder: "Enter password",
          showPasswordToggle: true,
        },
      ]}
      register={register}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      errors={formState.errors}
      isSubmitted={formState.isSubmitted}
      submitLabel="Submit"
      isLoading={isLoading}
    />
  );
}

describe("Form Component", () => {
  describe("Rendering", () => {
    it("renders all form fields", () => {
      const mockSubmit = vi.fn();
      render(<TestFormWrapper onSubmit={mockSubmit} />);

      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Submit" })
      ).toBeInTheDocument();
    });

    it("renders with noValidate attribute", () => {
      const mockSubmit = vi.fn();
      const { container } = render(<TestFormWrapper onSubmit={mockSubmit} />);

      const form = container.querySelector("form");
      expect(form).toHaveAttribute("noValidate");
    });

    it("renders all field types correctly", () => {
      function TestComponent() {
        const mockSubmit = vi.fn();
        const { register, handleSubmit, formState } = useForm<{
          email: string;
          remember: boolean;
        }>({
          defaultValues: { email: "", remember: false },
        });

        return (
          <Form
            fields={[
              {
                id: "email",
                name: "email",
                type: "email",
                label: "Email",
              },
              {
                id: "remember",
                name: "remember",
                type: "checkbox",
                label: "Remember me",
              },
            ]}
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={mockSubmit}
            errors={formState.errors}
            isSubmitted={formState.isSubmitted}
            submitLabel="Login"
          />
        );
      }

      render(<TestComponent />);

      expect(screen.getByRole("textbox")).toBeInTheDocument();
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("calls onSubmit with form data when submitted with valid data", async () => {
      const user = userEvent.setup();
      const mockSubmit = vi.fn();

      render(<TestFormWrapper onSubmit={mockSubmit} />);

      await user.type(screen.getByLabelText("Email"), "test@example.com");
      await user.type(screen.getByLabelText("Password"), "Password123!");
      await user.click(screen.getByRole("button", { name: "Submit" }));

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalled();
        expect(mockSubmit.mock.calls[0][0]).toEqual({
          email: "test@example.com",
          password: "Password123!",
        });
      });
    });

    it("does not call onSubmit with invalid data", async () => {
      const user = userEvent.setup();
      const mockSubmit = vi.fn();

      render(<TestFormWrapper onSubmit={mockSubmit} />);

      await user.type(screen.getByLabelText("Email"), "invalid-email");
      await user.type(screen.getByLabelText("Password"), "short");
      await user.click(screen.getByRole("button", { name: "Submit" }));

      await waitFor(() => {
        expect(mockSubmit).not.toHaveBeenCalled();
      });
    });

    it("shows validation errors after submission attempt", async () => {
      const user = userEvent.setup();
      const mockSubmit = vi.fn();

      render(<TestFormWrapper onSubmit={mockSubmit} />);

      await user.click(screen.getByRole("button", { name: "Submit" }));

      await waitFor(() => {
        expect(screen.getByText("Invalid email")).toBeInTheDocument();
        expect(
          screen.getByText("Password must be at least 8 characters")
        ).toBeInTheDocument();
      });
    });

    it("submits form with Enter key", async () => {
      const user = userEvent.setup();
      const mockSubmit = vi.fn();

      render(<TestFormWrapper onSubmit={mockSubmit} />);

      await user.type(screen.getByLabelText("Email"), "test@example.com");
      await user.type(screen.getByLabelText("Password"), "Password123!{Enter}");

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalled();
      });
    });
  });

  describe("Loading State", () => {
    it("disables submit button when isLoading is true", () => {
      const mockSubmit = vi.fn();
      render(<TestFormWrapper onSubmit={mockSubmit} isLoading />);

      const submitButton = screen.getByRole("button", { name: "Submit" });
      expect(submitButton).toBeDisabled();
    });

    it("shows loading spinner when isLoading is true", () => {
      const mockSubmit = vi.fn();
      const { container } = render(
        <TestFormWrapper onSubmit={mockSubmit} isLoading />
      );

      const spinner = container.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });

    it("does not submit form when loading", async () => {
      const user = userEvent.setup();
      const mockSubmit = vi.fn();

      render(<TestFormWrapper onSubmit={mockSubmit} isLoading />);

      await user.type(screen.getByLabelText("Email"), "test@example.com");
      await user.type(screen.getByLabelText("Password"), "Password123!");
      await user.click(screen.getByRole("button", { name: "Submit" }));

      expect(mockSubmit).not.toHaveBeenCalled();
    });
  });

  describe("Field Configuration", () => {
    it("passes field props to FormInput components", () => {
      function TestComponent() {
        const mockSubmit = vi.fn();
        const { register, handleSubmit, formState } = useForm();

        return (
          <Form
            fields={[
              {
                id: "email",
                name: "email",
                type: "email",
                label: "Email Address",
                placeholder: "you@example.com",
                autoComplete: "email",
                showAsterisk: true,
                helperText: "We will never share your email",
              },
            ]}
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={mockSubmit}
            errors={formState.errors}
            isSubmitted={formState.isSubmitted}
            submitLabel="Submit"
          />
        );
      }

      render(<TestComponent />);

      expect(
        screen.getByPlaceholderText("you@example.com")
      ).toBeInTheDocument();
      expect(screen.getByText("*")).toBeInTheDocument();
      expect(
        screen.getByText("We will never share your email")
      ).toBeInTheDocument();
    });

    it("renders password fields with toggle", () => {
      function TestComponent() {
        const mockSubmit = vi.fn();
        const { register, handleSubmit, formState } = useForm();

        return (
          <Form
            fields={[
              {
                id: "password",
                name: "password",
                type: "password",
                label: "Password",
                showPasswordToggle: true,
              },
            ]}
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={mockSubmit}
            errors={formState.errors}
            isSubmitted={formState.isSubmitted}
            submitLabel="Submit"
          />
        );
      }

      render(<TestComponent />);

      // Should have password input and toggle button
      expect(screen.getByLabelText("Password")).toHaveAttribute(
        "type",
        "password"
      );
      expect(screen.getAllByRole("button")).toHaveLength(2); // Toggle + Submit
    });
  });

  describe("Error Display", () => {
    it("shows errors only after form is submitted", async () => {
      const user = userEvent.setup();
      const mockSubmit = vi.fn();

      render(<TestFormWrapper onSubmit={mockSubmit} />);

      // Errors should not be visible initially
      expect(screen.queryByText("Invalid email")).not.toBeInTheDocument();

      // Submit empty form
      await user.click(screen.getByRole("button", { name: "Submit" }));

      // Errors should now be visible
      await waitFor(() => {
        expect(screen.getByText("Invalid email")).toBeInTheDocument();
      });
    });

    it("clears errors when valid data is entered", async () => {
      const user = userEvent.setup();
      const mockSubmit = vi.fn();

      render(<TestFormWrapper onSubmit={mockSubmit} />);

      // Submit to trigger errors
      await user.click(screen.getByRole("button", { name: "Submit" }));

      await waitFor(() => {
        expect(screen.getByText("Invalid email")).toBeInTheDocument();
      });

      // Enter valid email
      await user.type(screen.getByLabelText("Email"), "test@example.com");

      // Error should disappear
      await waitFor(() => {
        expect(screen.queryByText("Invalid email")).not.toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("has proper form structure", () => {
      const mockSubmit = vi.fn();
      const { container } = render(<TestFormWrapper onSubmit={mockSubmit} />);

      const form = container.querySelector("form");
      expect(form).toBeInTheDocument();
    });

    it("maintains proper field spacing", () => {
      const mockSubmit = vi.fn();
      const { container } = render(<TestFormWrapper onSubmit={mockSubmit} />);

      const form = container.querySelector("form");
      expect(form).toHaveClass("space-y-6");
    });
  });

  describe("Multiple Fields", () => {
    it("handles forms with many fields", () => {
      function TestComponent() {
        const mockSubmit = vi.fn();
        const { register, handleSubmit, formState } = useForm();

        const fields = Array.from({ length: 10 }, (_, i) => ({
          id: `field${i}`,
          name: `field${i}`,
          type: "text" as const,
          label: `Field ${i}`,
        }));

        return (
          <Form
            fields={fields}
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={mockSubmit}
            errors={formState.errors}
            isSubmitted={formState.isSubmitted}
            submitLabel="Submit"
          />
        );
      }

      render(<TestComponent />);

      Array.from({ length: 10 }, (_, i) => {
        expect(screen.getByLabelText(`Field ${i}`)).toBeInTheDocument();
      });
    });
  });
});
