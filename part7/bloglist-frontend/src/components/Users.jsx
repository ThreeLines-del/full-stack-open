import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const Users = () => {
  const blogs = useSelector((state) => state.blogs);

  const usersMap = blogs.reduce((acc, blog) => {
    if (!blog.user) return acc;
    const userId = blog.user.id;
    if (!acc[userId]) {
      acc[userId] = {
        name: blog.user.name,
        blogsCount: 0,
        id: blog.user.id,
      };
    }
    acc[userId].blogsCount += 1;
    return acc;
  }, {});

  const usersList = Object.values(usersMap);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Blogs Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usersList.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </TableCell>
                <TableCell>{user.blogsCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Users;
