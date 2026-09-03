import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Catalog } from "./catalog";

afterEach(() => {
  cleanup();
});

describe("Catalog interactivity", () => {
  it("filters by search and shows an empty state", async () => {
    const user = userEvent.setup();
    render(<Catalog />);

    const search = screen.getByLabelText("Search opportunities");
    await user.type(search, "zzzxq-not-a-real-need");

    expect(screen.getByTestId("result-count")).toHaveTextContent("0 of");
    expect(screen.getByText("No matches")).toBeInTheDocument();
  });

  it("filters by category", async () => {
    const user = userEvent.setup();
    render(<Catalog />);

    await user.click(screen.getByRole("button", { name: "Developer Tools" }));

    const count = screen.getByTestId("result-count");
    expect(count).toHaveTextContent("in Developer Tools");
    expect(count).not.toHaveTextContent("187 of 187");
  });
});
