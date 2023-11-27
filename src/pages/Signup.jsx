import axios from "axios";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { NavLink, NavLink as ReactLink, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  Row,
  Col,
} from "reactstrap";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formVerified, setFormVerified] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [url, setUrl] = useState("");
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  const [random, setRandom] = useState(0);

  const randomNumberInRange = (min, max) => {
    return Math.floor(Math.random()*(max-min+1)) + min;
  };

  useEffect(() => {
    if (email.length && password.length && captcha.length) {
      setFormVerified(true);
    }
  }, [email, password, captcha]);

  useEffect(() => {
    const randNum =randomNumberInRange(1,5000);
    setRandom(randNum);
    const getImage = async () => {
      const response = await axios.get(`http://localhost:8080/users/captcha/${randNum}`);
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
        `http://localhost:8080/users/register/${random}`,
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
      console.error("Error during registration:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    // <div>
    //   <div className="container">
    //     <div className="row mt-4">
    //       <div className="col-sm" style={{ width: "50%", margin: "0 auto" }}>
    //         <div style={{ backgroundColor: "dark", color: "white" }}>
    //           <h3>Register here!!</h3>
    //         </div>
    //         <div>
    //           <form>
    //             <div className="form-group">
    //               <label htmlFor="email"> Enter your email</label>
    //               <input
    //                 type="text"
    //                 placeholder="Enter email"
    //                 id="email"
    //                 className="form-control"
    //                 value={email}
    //                 onChange={(e) => setEmail(e.target.value)}
    //               />
    //             </div>
    //             <div className="form-group">
    //               <label htmlFor="password"> Enter your password</label>
    //               <input
    //                 type="password"
    //                 placeholder="Enter password"
    //                 id="password"
    //                 className="form-control"
    //                 value={password}
    //                 onChange={(e) => setPassword(e.target.value)}
    //               />
    //             </div>
    //             <div>
    //               <div
    //                 style={{
    //                   display: "flex",
    //                   alignItems: "center",
    //                   gap: "1rem",
    //                 }}
    //               >
    //                 <TextField
    //                   required
    //                   margin="normal"
    //                   fullWidth
    //                   name="captcha"
    //                   label="Enter captcha"
    //                   type="text"
    //                   id="captcha"
    //                   onChange={(e) => {
    //                     setCaptcha(e.target.value);
    //                   }}
    //                 />
    //                 <img
    //                   src={`data:image/png;base64,${url}`}
    //                   alt="captcha"
    //                   height="50rem"
    //                   width="150rem"
    //                   style={{ borderRadius: "1rem", marginTop: "0.6rem" }}
    //                 />
    //                 <RotateRightIcon
    //                   onClick={() => setRefresh(!refresh)}
    //                   style={{ marginTop: "0.6rem", fontSize: "2.5rem" }}
    //                 />
    //               </div>
    //             </div>
    //             <div className="text-center">
    //               <button
    //                 style={{
    //                   outline: "none",
    //                   color: "white",
    //                   backgroundColor: "light",
    //                 }}
    //                 onClick={signUpToAccount}
    //                 disabled={!formVerified}
    //               >
    //                 SignUp
    //               </button>
    //             </div>
    //             <p className="mt-3 text-center">
    //               Already have an account?{" "}
    //               <NavLink tag={ReactLink} to="/login">
    //                 Log In
    //               </NavLink>
    //             </p>
    //           </form>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>

    <Container>
      <Row className="mt-4">
        <Col sm={{ size: 4, offset: 4 }}>
          <Card color="dark" inverse>
            <CardHeader>
              <h3>Register here!!</h3>
            </CardHeader>
            <CardBody>
              <Form>
                <FormGroup>
                  <Label for="email"> Enter your email</Label>
                  <Input
                    type="text"
                    placeholder="Enter email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="password"> Enter your password</Label>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormGroup>
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
                    style={{ backgroundColor: "white", borderRadius: "1rem" }}
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
                <Container className="text-center">
                  <Button
                    outline
                    color="light"
                    onClick={signUpToAccount}
                    disabled={!formVerified}
                  >
                    Signup
                  </Button>
                </Container>
                <p className="mt-3 text-center">
                Already have an account?{" "}
                  <NavLink tag={ReactLink} to="/login">
                    Log In
                  </NavLink>
                </p>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
