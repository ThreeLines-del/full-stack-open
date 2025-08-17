import { getByText, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import CreateBlogForm from "./CreateBlogForm";

describe("<CreateBlogForm />", () => {
  test("should call event handler and received correct data", async () => {
    const mockCreate = vi.fn();

    render(<CreateBlogForm handleCreateBlog={mockCreate} />);

    const user = userEvent.setup();
    const titleInput = screen.getByPlaceholderText("blog title");
    const authorInput = screen.getByPlaceholderText("blog author");
    const urlInput = screen.getByPlaceholderText("blog url");
    const button = screen.getByText("create");

    await user.type(titleInput, "Testing React Components");
    await user.type(authorInput, "Test Author");
    await user.type(urlInput, "http://example.com");
    await user.click(button);

    expect(mockCreate.mock.calls).toHaveLength(1);
    expect(mockCreate.mock.calls[0][0].title).toBe("Testing React Components");
  });
});
