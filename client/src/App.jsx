import { gql, useQuery } from "@apollo/client";

const query = gql`
  query {
    getTodos {
      id
      title
      completed
      user {
        name
      }
    }
  }
`;

function App() {
  const { data, loading } = useQuery(query);

  if (loading) return <h1>Loading...</h1>;
  return (
    <table>
      <tbody>
        {data.getTodos.map((todo) => (
          <tr>
            <td>{todo.title}</td>
            <td>{todo?.user?.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default App;
