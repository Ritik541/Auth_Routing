import {useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";


const Register = () => {
    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [phone,setPhone] = useState("");

    const [result,setResult] = useState(false);


    const register = async() => {
        const data = {username,email,password,phone};
        const res = await axios.post("https://auth-routing.onrender.com/api/auth/registerUser",data);
        console.log(res);
        setResult(res.data);
    }

    const reset = () => {
        setUsername("");
        setEmail("");
        setPassword("");
        setPhone("");
    }

    return <>
      {!result ?
      <div>
        <label><b>Name : </b></label> &nbsp;&nbsp;
        <input type="text" placeholder="Enter name" value={username} onChange={(e) => setUsername(e.target.value)}/> <br/><br/>
        <label><b>Email : </b></label> &nbsp;&nbsp;
        <input type="text" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}/> <br/><br/>
        <label><b>Password : </b></label> &nbsp;&nbsp;
        <input type="text" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}/> <br/><br/>
        <label><b>Mobile No : </b></label> &nbsp;&nbsp;
        <input type="number" placeholder="Enter mobile number" value={phone} onChange={(e) => setPhone(e.target.value)}/> <br/><br/>
        <br/>
        <button onClick={register}>Register</button> &nbsp;&nbsp;&nbsp; &nbsp;
        <button onClick={reset}>Reset</button> 
        <br/><br/><br/>
        <span>If already registered then click here</span> &nbsp;
        <Link to="/login">Login</Link>  
      </div>
      : 
        <div>
        {result.success ? "Registration Successful": "Registration failed" }

        
        <br/><br/>
        <Link to="/login">Go to Login</Link>  
        </div> 
       
       }

      </>

}

export default Register;