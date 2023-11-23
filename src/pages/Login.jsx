import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { NavLink, NavLink as ReactLink, useNavigate } from "react-router-dom";
import axios from "axios";
import TextField from "@mui/material/TextField";
import RotateRightIcon from "@mui/icons-material/RotateRight";
//import ReCAPTCHA from "react-google-recaptcha";
//import UserContext from "../UserContext";

//const UserContext = createContext();

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [verified, setVerified] = useState(false);
  const [formVerified, setFormVerified] = useState(false);
  const navigate = useNavigate();

  const [captcha, setCaptcha] = useState("");
  const [url, setUrl] = useState("");
  const [refresh, setRefresh] = useState(false);

  //const [tasks, setTasks] = useState([]);
  //const [userId, setUserId] = useState([]);

  // function onChange(value) {
  //   setVerified(true);
  // }

  useEffect(() => {
    if (email.length && password.length && captcha.length) {
      setFormVerified(true);
    }
  }, [email, password, captcha]);

  useEffect(() => {
    const getImage = async () => {
      const response = await axios.get("http://localhost:8080/users/captcha");
      const imageUrl = response.data.imageUrl;
      setUrl(imageUrl);
    };

    getImage();
  }, [refresh]);

  const login = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      toast.error("Fill up all the fields");
      return;
    }
    try {
      const response = await axios.post("http://localhost:8080/users/login", {
        userName: email,
        userPassword: password,
        captcha: captcha,
      });

      if (response.status === 200) {
        const userid = await response.data.userId;
        const todoList = response.data.todoList;
        //setTasks(todoList);
        //setUserId(userid);
        //console.log(userId);
        navigate("/todos", { state: { tasks: todoList, userId: userid } });
      } else {
        toast.error("wrong captcha");
      }
    } catch (error) {
      console.error("Error during Login:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      <div>
        <div className="mt-4">
          <div
            style={{ marginLeft: "auto", marginRight: "auto", width: "50%" }}
          >
            <div style={{ backgroundColor: "dark", color: "white" }}>
              <h3>Login here!!</h3>
            </div>
            <div>
              <form>
                <div>
                  <label htmlFor="email"> Enter your email</label>
                  <input
                    type="text"
                    placeholder="Enter email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password"> Enter your password</label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {/* <ReCAPTCHA
                    sitekey="6LeekxMpAAAAAJQO-XFP-tPwnwR7Swf93F9APfOe"
                    onChange={onChange}
                  /> */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <TextField
                      required
                      margin="normal"
                      fullWidth
                      name="captcha"
                      label="Enter captcha"
                      type="text"
                      id="captcha"
                      onChange={(e) => {
                        setCaptcha(e.target.value);
                      }}
                    />
                    <img
                      src={`data:image/png;base64,${url}`}
                      alt="captcha"
                      height="50rem"
                      width="150rem"
                      style={{ borderRadius: "1rem", marginTop: "0.6rem" }}
                    />
                    <RotateRightIcon
                      onClick={() => setRefresh(!refresh)}
                      style={{ marginTop: "0.6rem", fontSize: "2.5rem" }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <button
                    style={{
                      outline: "none",
                      color: "white",
                      backgroundColor: "light",
                    }}
                    onClick={login}
                    disabled={!formVerified}
                  >
                    Login
                  </button>
                </div>
                <p className="mt-3 text-center">
                  Don't have an account?{" "}
                  <NavLink tag={ReactLink} to="/signup">
                    Signup
                  </NavLink>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
