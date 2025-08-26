import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const Blog = ({ blog }) => {
  return (
    <Card variant="outlined" sx={{ mb: 2, p: 1 }}>
      <CardContent>
        <Typography variant="body1">
          <Link
            to={`/blogs/${blog.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {blog.title} | {blog.author}
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Blog;
