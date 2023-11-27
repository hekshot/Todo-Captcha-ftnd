import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { NavLink, NavLink as ReactLink, useNavigate } from "react-router-dom";
import axios from "axios";
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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formVerified, setFormVerified] = useState(false);
  const navigate = useNavigate();
  const [captcha, setCaptcha] = useState("");
  const [url, setUrl] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [random, setRandom] = useState(0);

  const randomNumberInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  useEffect(() => {
    if (email.length && password.length && captcha.length) {
      setFormVerified(true);
    }
  }, [email, password, captcha]);

  useEffect(() => {
    const randNum = randomNumberInRange(1, 5000);
    setRandom(randNum);
    const getImage = async () => {
      const response = await axios.get(
        `http://localhost:8080/users/captcha/${randNum}`
      );
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
      const response = await axios.post(
        `http://localhost:8080/users/login/${random}`,
        {
          userName: email,
          userPassword: password,
          captcha: captcha,
        }
      );

      if (response.status === 200) {
        navigate("/todos", { state: { userId: response.data.userId } });
      } else if (response.message === "wrong") {
        toast.error("wrong captcha");
      } else {
        toast.error("Invalid E-mail or password");
      }
    } catch (error) {
      console.error("Error during Login:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Container>
      <Row className="mt-4">
        <Col sm={{ size: 4, offset: 4 }}>
          <Card color="dark" inverse>
            <CardHeader>
              <h3>Login here!!</h3>
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
                    onClick={login}
                    disabled={!formVerified}
                  >
                    Login
                  </Button>
                </Container>
                <p className="mt-3 text-center">
                  Don't have an account?{" "}
                  <NavLink tag={ReactLink} to="/">
                    Signup
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

export default Login;
