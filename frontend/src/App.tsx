import { Button } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom"

const Home = () => {
  return <div>
    <Button>Click me!</Button>
  </div>
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App
