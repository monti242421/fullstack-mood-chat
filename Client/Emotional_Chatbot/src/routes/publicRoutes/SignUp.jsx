import { Link, useNavigate } from "react-router";
import { useRef } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { IoChatbox } from "react-icons/io5";

const SignUp = () => {
  const userName = useRef();
  const userEmail = useRef();
  const userPassword = useRef();
  const navigate = useNavigate();
  const HandleSignup = async (e) => {
    e.preventDefault();
    const obj = {
      name: userName.current.value,
      email: userEmail.current.value,
      password: userPassword.current.value,
    };

    try {
      const res = await axios.post(import.meta.env.VITE_SIGNUP_URL, obj);
      alert("Successfully Signed up");
      navigate("/login");
    } catch (err) {
      console.log(err);
      alert(err.response.data.err);
    }
  };
  return (
    <div className="signincontainer">
      <form onSubmit={HandleSignup}>
        {" "}
        <center style={{ marginBottom: "10px" }}>
          <div
            style={{
              position: "relative",
              display: "inline-block",
            }}
          >
            <IoChatbox size={100} style={{ color: "#97a9f0" }} />
            <span
              style={{
                position: "absolute",
                top: "10px",
                left: "25px",
                fontSize: "38px",
                pointerEvents: "none",
              }}
            >
              🙂
            </span>
          </div>
          <h1>Mood Chat</h1>
          <h4>Conversions with Emotion</h4>
          <div style={{ fontWeight: "normal" }}>
            Your conversations dynamically change theme and tone based on the
            emotion and mood of the chat. Get Ai-powered reply suggestions and a
            vibrant visual experience.
          </div>
        </center>
        <div className="form-floating">
          {" "}
          <input
            type="text"
            className="form-control loginelements"
            ref={userName}
            id="floatingInput"
            placeholder="name@example.com"
          />{" "}
          <label htmlFor="floatingInput">Please Enter Your Name</label>{" "}
        </div>{" "}
        <div className="form-floating">
          {" "}
          <input
            type="email"
            ref={userEmail}
            className="form-control loginelements"
            id="floatingInput"
            placeholder="name@example.com"
          />{" "}
          <label htmlFor="floatingInput">Email address</label>{" "}
        </div>{" "}
        <div className="form-floating">
          {" "}
          <input
            type="password"
            ref={userPassword}
            className="form-control loginelements"
            id="floatingPassword"
            placeholder="Password"
          />{" "}
          <label htmlFor="floatingPassword">Password</label>{" "}
        </div>{" "}
        <button
          className="btn btn-primary w-100 py-2 loginelements"
          type="submit"
        >
          Register Me
        </button>{" "}
      </form>
      <div className="loginelements">
        <Link to="/login"> Already have an account? Login here</Link>
      </div>
    </div>
  );
};
export default SignUp;
