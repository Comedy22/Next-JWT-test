import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import Login from "./Login";

describe("Login Component", () => {
  test("renders login form with inputs and login button", () => {
    render(<Login />);

    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  test("input fields update correctly", () => {
    render(<Login />);

    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "testpassword" } });

    expect(usernameInput.value).toBe("testuser");
    expect(passwordInput.value).toBe("testpassword");
  });

  test("displays error message for incorrect login", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ success: false }),
      })
    );

    render(<Login />);

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    const errorMessage = await screen.findByText(
      "Incorrect username or password."
    );
    expect(errorMessage).toBeInTheDocument();
  });
});
