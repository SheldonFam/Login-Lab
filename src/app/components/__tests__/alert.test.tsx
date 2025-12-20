import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Alert from "../alert";

describe("Alert Component", () => {
  describe("Rendering", () => {
    it("renders error alert with correct message", () => {
      render(<Alert type="error" message="Test error message" />);

      expect(screen.getByText("Test error message")).toBeInTheDocument();
    });

    it("renders success alert with correct message", () => {
      render(<Alert type="success" message="Test success message" />);

      expect(screen.getByText("Test success message")).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("applies error styles correctly", () => {
      const { container } = render(<Alert type="error" message="Error" />);

      const alertDiv = container.querySelector(".bg-red-50");
      expect(alertDiv).toBeInTheDocument();

      const icon = container.querySelector(".text-red-400");
      expect(icon).toBeInTheDocument();

      const text = container.querySelector(".text-red-800");
      expect(text).toBeInTheDocument();
    });

    it("applies success styles correctly", () => {
      const { container } = render(<Alert type="success" message="Success" />);

      const alertDiv = container.querySelector(".bg-green-50");
      expect(alertDiv).toBeInTheDocument();

      const icon = container.querySelector(".text-green-400");
      expect(icon).toBeInTheDocument();

      const text = container.querySelector(".text-green-800");
      expect(text).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA attributes", () => {
      const { container } = render(<Alert type="error" message="Error" />);

      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });

    it("renders icon with correct viewBox", () => {
      const { container } = render(<Alert type="success" message="Success" />);

      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("viewBox", "0 0 20 20");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty message", () => {
      render(<Alert type="error" message="" />);

      const text = screen.queryByText(/.+/);
      expect(text).not.toBeInTheDocument();
    });

    it("handles very long messages", () => {
      const longMessage = "A".repeat(500);
      render(<Alert type="error" message={longMessage} />);

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it("handles special characters in message", () => {
      const specialMessage = '<script>alert("xss")</script>';
      render(<Alert type="error" message={specialMessage} />);

      expect(screen.getByText(specialMessage)).toBeInTheDocument();
    });
  });
});
