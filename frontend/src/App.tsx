import { Button } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login";
import Register from "./pages/Register";

const Home = () => {
  return <div>
    <Button>Click me!</Button>
  </div>
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App
