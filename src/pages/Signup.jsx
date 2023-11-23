import axios from "axios";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { NavLink, NavLink as ReactLink, useNavigate } from "react-router-dom";
//import ReCAPTCHA from "react-google-recaptcha";
import TextField from "@mui/material/TextField";
import RotateRightIcon from "@mui/icons-material/RotateRight";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const [verified, setVerified] = useState(false);
  const [formVerified, setFormVerified] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [url, setUrl] = useState("");
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  // function onChange(value) {
  //   //console.log("Captcha value:", value);
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

  const signUpToAccount = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Fill up all the fields");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Email format is wrong");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be of 6 characters");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/users/register",
        {
          userName: email,
          userPassword: password,
          captcha: captcha,
        }
      );

      if (response.data === "success") {
        toast.success("Signup success");
        navigate("/login");
      } else {
        toast.error("wrong captcha");
      }
    } catch (error) {
      // Handle any API request errors
      console.error("Error during registration:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      <div className="container">
        <div className="row mt-4">
          <div className="col-sm" style={{ width: "50%", margin: "0 auto" }}>
            <div style={{ backgroundColor: "dark", color: "white" }}>
              <h3>Register here!!</h3>
            </div>
            <div>
              <form>
                <div className="form-group">
                  <label htmlFor="email"> Enter your email</label>
                  <input
                    type="text"
                    placeholder="Enter email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password"> Enter your password</label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {/* <ReCAPTCHA
                  sitekey="6LeekxMpAAAAAJQO-XFP-tPwnwR7Swf93F9APfOe"
                  onChange={onChange}
                  type="image"
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
                    onClick={signUpToAccount}
                    disabled={!formVerified}
                  >
                    SignUp
                  </button>
                </div>
                <p className="mt-3 text-center">
                  Already have an account?{" "}
                  <NavLink tag={ReactLink} to="/login">
                    Log In
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

export default Signup;
