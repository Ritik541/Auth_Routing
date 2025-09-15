import {useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";


const Login = () => {
     
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [result,setResult] = useState(false);
     
    const login = async () => {
        const data = {email,password};
        const res = await axios.post("http://localhost:3000/api/auth/loginUser",data);
        setResult(res.data);
        console.log(res.data);
    }

    const reset = () => {
        setEmail("");
        setPassword("");
    }

    return <>
      {!result ? 
      <div> 
        <label><b>Email : </b></label> &nbsp;&nbsp;
        <input type="text" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}/> <br/><br/>
        <label><b>Password : </b></label> &nbsp;&nbsp;
        <input type="text" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}/> <br/><br/>
        <br/>
        <button onClick={login}>Login</button> &nbsp;&nbsp;&nbsp; &nbsp;
        <button onClick={reset}>Reset</button> 
        <br/><br/><br/>
        <span>If not registered yet then click here</span> &nbsp; 
        <Link to="/">Register</Link>
      </div>
       : 
        <div>
         {result.success ? "Login successfully" : "Login failed"}
        </div>
      }
      </>

}

export default Login;