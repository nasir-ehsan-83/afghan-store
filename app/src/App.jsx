import { 
  createBrowserRouter, 
  RouterProvider,
  Outlet
} from "react-router";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Signup from "./pages/Signup.jsx";
import Cart from "./pages/Cart.jsx";
import NotFound from "./pages/NotFound.jsx";
import AddProduct from "./admin/AddProduct.jsx";
import EditProduct from "./admin/EditProduct.jsx";
import ProductList from "./admin/ProductList.jsx";
import Navbar from "./components/Navbar.jsx";

const Layout = () => {
  return (
    <>
      <Navbar/>
      <Outlet/>
    </>
  );
};

const router = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      {path: "/", element: <Home/>},
      {path: "/login", element: <Login/>},
      {path: "/products/:id", element: <ProductDetails/>},
      {path: "/signup", element: <Signup/>},
      {path: "/carts/:userId", element: <Cart/>},

      {path: "/admin/products", element: <ProductList/>},
      {path: "/admin/products/add", element: <AddProduct/>},
      {path: "/admin/products/update/:id", element: <EditProduct/>},
      {path: "*", element: <NotFound/>}
    ]
  }
]);

const App = () => {
  return <RouterProvider router={router}/>;
};

export default App;
