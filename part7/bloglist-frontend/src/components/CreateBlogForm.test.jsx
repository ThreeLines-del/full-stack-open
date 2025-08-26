import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateBlogForm from "./CreateBlogForm";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import blogReducer from "../reducers/blogReducer";

const store = configureStore({ reducer: { blogs: blogReducer } });

test("should call event handler and receive correct data", async () => {
  const mockRef = { current: { toggleVisibility: vi.fn() } };
  const mockCreate = vi.fn();

  render(
    <Provider store={store}>
      <CreateBlogForm createBlogFormRef={mockRef} />
    </Provider>
  );

  const user = userEvent.setup();
  const titleInput = screen.getByPlaceholderText("blog title");
  const authorInput = screen.getByPlaceholderText("blog author");
  const urlInput = screen.getByPlaceholderText("blog url");
  const button = screen.getByText("Create");

  await user.type(titleInput, "Testing React Components");
  await user.type(authorInput, "Test Author");
  await user.type(urlInput, "http://example.com");
  await user.click(button);

  expect(mockRef.current.toggleVisibility).toHaveBeenCalled();
});
