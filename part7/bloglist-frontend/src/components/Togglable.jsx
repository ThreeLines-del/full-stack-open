import PropTypes from "prop-types";
import { forwardRef, useImperativeHandle, useState } from "react";
import Button from "@mui/material/Button";

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
      <Button
        type="button"
        variant="contained"
        color="primary"
        onClick={toggleVisibility}
        style={hideWhenVisible}
        sx={{ mt: 2 }}
      >
        {buttonLabel}
      </Button>
      <div style={showWhenVisible}>
        {children}
        <Button
          type="button"
          variant="contained"
          color="primary"
          onClick={toggleVisibility}
          sx={{ mt: 2 }}
        >
          CANCEL
        </Button>
      </div>
    </div>
  );
});

Togglable.displayName = "Togglable";

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

export default Togglable;
