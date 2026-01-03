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
      render(<Alert type="error" message="Error" />);

      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass("bg-red-50");
      expect(alert).toHaveClass("rounded-md");
      expect(alert).toHaveClass("p-4");
    });

    it("applies success styles correctly", () => {
      render(<Alert type="success" message="Success" />);

      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass("bg-green-50");
      expect(alert).toHaveClass("rounded-md");
      expect(alert).toHaveClass("p-4");
    });
  });

  describe("Accessibility", () => {
    it("has proper alert role for screen readers", () => {
      render(<Alert type="error" message="Error message" />);

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByRole("alert")).toHaveTextContent("Error message");
    });

    it("has icon marked as decorative with aria-hidden", () => {
      const { container } = render(<Alert type="error" message="Error" />);

      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("aria-hidden", "true");
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

    it("escapes HTML to prevent XSS attacks", () => {
      const xssMessage = '<script>alert("xss")</script>';
      render(<Alert type="error" message={xssMessage} />);

      const alertText = screen.getByText(xssMessage);
      expect(alertText).toBeInTheDocument();
      // Verify HTML is escaped (React escapes by default, but we test it explicitly)
      expect(alertText.innerHTML).not.toContain("<script>");
    });
  });
});
