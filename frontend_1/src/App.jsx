import {Link,Routes,Route} from "react-router-dom";
import Register from "./components/register";
import Login from "./components/login";


const App = () => {
     return <>
        <h2>Welcome to my Web</h2>
        <Link to="/"></Link>
        <Link to="/login"></Link>
        <Routes>
           <Route path="/" element={<Register/>}/>
           <Route path="/login" element={<Login/>}/>
        </Routes>
     </>

}

export default App;