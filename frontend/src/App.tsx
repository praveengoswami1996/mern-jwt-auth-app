import { Button } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login";

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
    </Routes>
  );
}

export default App
