import PropTypes from "prop-types";
import { forwardRef, useImperativeHandle, useState } from "react";

const Togglable = forwardRef(({ children, buttonLabel }, refs) => {
  const [visible, setVisible] = useState(false);
  const showWhenVisible = { display: visible ? "" : "none" };
  const hideWhenVisible = { display: visible ? "none" : "" };

  function toggleVisibility() {
    setVisible((prev) => !prev);
  }

  useImperativeHandle(refs, () => {
    return { toggleVisibility };
  });

  return (
    <div>
      <button onClick={toggleVisibility} style={hideWhenVisible}>
        {buttonLabel}
      </button>
      <div style={showWhenVisible}>
        {children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  );
});

Togglable.displayName = "Togglable";

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

export default Togglable;
