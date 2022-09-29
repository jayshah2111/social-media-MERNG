import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MenuBar from "./components/Menubar.component";
//import 'semantic-ui-css/semantic.min.css';
import { Container } from 'semantic-ui-react';
import "./App.css";


const webLink = from([
  new HttpLink({ uri: "http://localhost:3000" }),
]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: webLink,
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Container>
          <MenuBar />
          <Routes>
            <Route exact path="/" element={<Homepage/>} />
            <Route exact path="/login" element={<Login/>} />
            <Route exact path="/register" element={<Register/>} />
          </Routes>
        </Container>
      </Router>
    </ApolloProvider>
  );
}

export default App;