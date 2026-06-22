import { createBrowserRouter, RouterProvider } from "react-router";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Signup from "./pages/Signup.jsx";

const router = createBrowserRouter([
  {path: "/", element: <Home/>},
  {path: "/login", element: <Login/>},
  {path: "/product/:id", element: <ProductDetails/>},
  {path: "/signup", element: <Signup/>}
]);

const App = () => {
  return <RouterProvider router = {router}/>;
}

export default App
