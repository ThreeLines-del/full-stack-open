import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Blog from "./Blog";

describe("<Blog />", () => {
  const blog = {
    id: "123",
    title: "Testing React Components",
    author: "Test Author",
    url: "http://example.com",
    likes: 5,
    user: {
      username: "testuser",
      name: "Test User",
    },
  };

  test("should render title and author by default", () => {
    render(
      <MemoryRouter>
        <Blog blog={blog} />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Testing React Components", { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Test Author", { exact: false })
    ).toBeInTheDocument();

    expect(screen.queryByText("http://example.com")).toBeNull();
    expect(screen.queryByText("5")).toBeNull();
    expect(screen.queryByText("Test User")).toBeNull();
  });
});
