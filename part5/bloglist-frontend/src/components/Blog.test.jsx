import { getByText, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
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
    const mockUpdate = vi.fn();
    const mockDelete = vi.fn();

    render(
      <Blog
        blog={blog}
        handleUpdateBlog={mockUpdate}
        handleDeleteBlog={mockDelete}
        user={{ username: "testuser" }}
      />
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

  test("should render url and likes on button click", async () => {
    const mockUpdate = vi.fn();
    const mockDelete = vi.fn();

    render(
      <Blog
        blog={blog}
        handleUpdateBlog={mockUpdate}
        handleDeleteBlog={mockDelete}
        user={{ username: "testuser" }}
      />
    );

    const user = userEvent.setup();
    const button = screen.getByText("View");
    await user.click(button);

    expect(
      screen.getByText("http://example.com", { exact: false })
    ).toBeInTheDocument();
    expect(screen.getByText("5", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("Test User", { exact: false })).toBeInTheDocument();
  });

  test("should call event handler twice if like is clicked twice", async () => {
    const mockUpdate = vi.fn();
    const mockDelete = vi.fn();

    render(
      <Blog
        blog={blog}
        handleUpdateBlog={mockUpdate}
        handleDeleteBlog={mockDelete}
        user={{ username: "testuser" }}
      />
    );

    const user = userEvent.setup();
    const viewButton = screen.getByText("View");
    await user.click(viewButton);
    const button = screen.getByText("like");
    await user.dblClick(button);

    expect(mockUpdate.mock.calls).toHaveLength(2);
  });
});
