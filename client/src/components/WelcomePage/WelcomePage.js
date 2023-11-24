import { React, useState } from "react";
import axios from "axios";
import "./WelcomePage.css";

function WelcomePage({ setCurrentPage, setIsLoggedIn, isGuest, setIsGuest }) {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);

    if (!isLoggingIn && !isCreatingAccount) {
        return (
            <div id="welcomePage">
                <h1>FAKE STACK OVERFLOW</h1>
                <h2>Got questions? We have the answers.</h2>
                <WelcomePageBox
                    isLoggingIn={isLoggingIn}
                    setIsLoggingIn={setIsLoggingIn}
                    setCurrentPage={setCurrentPage}
                    setIsLoggedIn={setIsLoggedIn}
                    isCreatingAccount={isCreatingAccount}
                    setIsCreatingAccount={setIsCreatingAccount}
                    isGuest={isGuest}
                    setIsGuest={setIsGuest}
                ></WelcomePageBox>
            </div>
        );
    } else if (isLoggingIn) {
        return (
            <div id="welcomePage">
                <h1>FAKE STACK OVERFLOW</h1>
                <h2>Log In</h2>
                <WelcomePageBox
                    isLoggingIn={isLoggingIn}
                    setIsLoggingIn={setIsLoggingIn}
                    setCurrentPage={setCurrentPage}
                    setIsLoggedIn={setIsLoggedIn}
                    isCreatingAccount={isCreatingAccount}
                    setIsCreatingAccount={setIsCreatingAccount}
                    isGuest={isGuest}
                    setIsGuest={setIsGuest}
                ></WelcomePageBox>
            </div>
        );
    } else if (isCreatingAccount) {
        return (
            <div id="welcomePage">
                <h1>FAKE STACK OVERFLOW</h1>
                <h2>Create Account</h2>
                <WelcomePageBox
                    isLoggingIn={isLoggingIn}
                    setIsLoggingIn={setIsLoggingIn}
                    setCurrentPage={setCurrentPage}
                    setIsLoggedIn={setIsLoggedIn}
                    isCreatingAccount={isCreatingAccount}
                    setIsCreatingAccount={setIsCreatingAccount}
                    isGuest={isGuest}
                    setIsGuest={setIsGuest}
                ></WelcomePageBox>
            </div>
        );
    }
}

function WelcomePageBox({
    isLoggingIn,
    setIsLoggingIn,
    setCurrentPage,
    setIsLoggedIn,
    isCreatingAccount,
    setIsCreatingAccount,
    isGuest,
    setIsGuest,
}) {
    function handleLoginClick() {
        setIsLoggingIn(true);
        console.log("Logging in...");
    }

    function handleCreateAccountClick() {
        setIsCreatingAccount(true);
        console.log("Creating account...");
    }

    function handleContinueAsGuestClick() {
        setCurrentPage("questionsPage");
        setIsLoggedIn(false);
        setIsGuest(true);
        console.log("Continuing as guest...");
    }

    if (isLoggingIn) {
        return (
            <div id="welcomePageBox">
                <LoginForm
                    setIsLoggingIn={setIsLoggingIn}
                    setIsLoggedIn={setIsLoggedIn}
                    setCurrentPage={setCurrentPage}
                ></LoginForm>
            </div>
        );
    } else if (isCreatingAccount) {
        return (
            <div id="welcomePageBox">
                <CreateAccountForm
                    setIsLoggingIn={setIsLoggingIn}
                    setIsCreatingAccount={setIsCreatingAccount}
                ></CreateAccountForm>
            </div>
        );
    } else {
        return (
            <div id="welcomePageBox">
                <LoginButton handleLoginClick={handleLoginClick}></LoginButton>
                <CreateAccountButton handleCreateAccountClick={handleCreateAccountClick}></CreateAccountButton>
                <text id="welcomePageBoxText">Just taking a look around?</text>
                <GuestButton handleContinueAsGuestClick={handleContinueAsGuestClick}></GuestButton>
            </div>
        );
    }
}

function LoginForm({ setIsLoggingIn, setIsLoggedIn, setCurrentPage }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setEmailError("");
        setPasswordError("");

        if (email === "") {
            setEmailError("Email field cannot be empty");
        }

        if (password === "") {
            setPasswordError("Password field cannot be empty");
        }

        if (emailError !== "" || passwordError !== "") {
            return;
        }

        try {
            const response = await axios.post("http://localhost:8000/api/login", {
                email,
                password,
            });

            const data = response.data;

            if (!data.success) {
                if (data.message === "There is no account registered with this email") {
                    setEmailError("There is no account registered with this email");
                    return;
                } else if (data.message === "Incorrect password") {
                    setPasswordError("Incorrect password");
                    return;
                }
            } else {
                setEmail("");
                setPassword("");

                setIsLoggingIn(false);
                setIsLoggedIn(true);
                setCurrentPage("questionsPage");

                console.log("Successfully logged in");

                return;
            }
        } catch (error) {
            console.error("Login failed:", error.message);
        }
    };

    return (
        <div className="loginForm">
            <form onSubmit={handleSubmit}>
                <div id="emailDiv">
                    <label
                        htmlFor="email"
                        style={{
                            color: "#fff",
                            display: "block",
                            fontFamily: "sans-serif",
                            fontSize: "12px",
                        }}
                    >
                        Enter your email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                    <label
                        htmlFor="email"
                        className="emailError"
                        style={{
                            display: emailError !== "" ? "block" : "none",
                        }}
                    >
                        {emailError}
                    </label>
                </div>
                <div id="passwordDiv">
                    <label
                        htmlFor="password"
                        style={{
                            color: "#fff",
                            display: "block",
                            fontFamily: "sans-serif",
                            fontSize: "12px",
                        }}
                    >
                        Enter your password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                    <label
                        htmlFor="password"
                        className="passwordError"
                        style={{
                            display: passwordError !== "" ? "block" : "none",
                        }}
                    >
                        {passwordError}
                    </label>
                </div>
                {/* Log In button */}
                <span>
                    <input type="submit" id="loginButton" value="Log In" onClick={handleSubmit} />
                </span>
                {/* Go Back button */}
                <span>
                    <input type="button" id="goBackButton" value="Go Back" onClick={() => setIsLoggingIn(false)} />
                </span>

                {/* <div style={{ display: "flex", justifyContent: "center" }}>
                    <button id="loginButton" type="submit">
                        Log In
                    </button>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <button id="goBackButton" onClick={() => setIsLoggingIn(false)}>
                        Go Back
                    </button>
                </div> */}
            </form>
        </div>
    );
}

function LoginButton({ handleLoginClick }) {
    return (
        <div className="loginButton" onClick={handleLoginClick}>
            Log In
        </div>
    );
}

function CreateAccountForm({ setIsLoggingIn, setIsCreatingAccount }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVerification, setPasswordVerification] = useState("");

    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordVerificationError, setPasswordVerificationError] = useState("");

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setUsernameError("");
        setEmailError("");
        setPasswordError("");
        setPasswordVerificationError("");

        if (username === "") {
            setUsernameError("Username field cannot be empty");
        }

        if (email === "") {
            setEmailError("Email field cannot be empty");
        } else if (!validateEmail(email)) {
            setEmailError("Invalid email format");
        }

        if (password === "") {
            setPasswordError("Password field cannot be empty");
        } else if (password.includes(username) && username !== "") {
            setPasswordError("Password cannot contain username");
        } else if (password.includes(email) && email !== "") {
            setPasswordError("Password cannot contain email");
        }

        if (passwordVerification === "") {
            setPasswordVerificationError("Password verification field cannot be empty");
        } else if (password !== passwordVerification) {
            setPasswordVerificationError("Passwords do not match");
        }

        if (usernameError !== "" || emailError !== "" || passwordError !== "" || passwordVerificationError !== "") {
            return;
        }

        const passwordHash = password;

        try {
            const response = await axios.post("http://localhost:8000/api/createaccount", {
                email,
                username,
                passwordHash,
            });

            console.log("Result of attempting to create account: ", response.data);

            if (response.data.message === "User account with this email already exists") {
                setEmailError(response.data.message);
                return;
            }

            setUsername("");
            setEmail("");
            setPassword("");
            setPasswordVerification("");

            setIsCreatingAccount(false);
            setIsLoggingIn(true);
        } catch (error) {
            console.error("Error creating account:", error);
        }
    };

    return (
        <div className="createAccountForm">
            <form onSubmit={handleSubmit}>
                {/* Username input */}
                <div id="usernameDiv">
                    <label
                        htmlFor="username"
                        style={{
                            color: "#fff",
                            display: "block",
                            fontFamily: "sans-serif",
                            fontSize: "12px",
                        }}
                    >
                        Enter your username
                    </label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        required
                    />
                    <label
                        htmlFor="username"
                        className="usernameError"
                        style={{
                            display: usernameError !== "" ? "block" : "none",
                        }}
                    >
                        {usernameError}
                    </label>
                </div>
                {/* Email input */}
                <div id="emailDiv">
                    <label
                        htmlFor="email"
                        style={{
                            color: "#fff",
                            display: "block",
                            fontFamily: "sans-serif",
                            fontSize: "12px",
                        }}
                    >
                        Enter your email
                    </label>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                    <label
                        htmlFor="email"
                        className="emailError"
                        style={{
                            display: emailError !== "" ? "block" : "none",
                        }}
                    >
                        {emailError}
                    </label>
                </div>
                {/* Password input */}
                <div id="passwordDiv">
                    <label
                        htmlFor="password"
                        style={{
                            color: "#fff",
                            display: "block",
                            fontFamily: "sans-serif",
                            fontSize: "12px",
                        }}
                    >
                        Enter your password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                    <label
                        htmlFor="password"
                        className="passwordError"
                        style={{
                            display: passwordError !== "" ? "block" : "none",
                        }}
                    >
                        {passwordError}
                    </label>
                </div>
                {/* Password verification input */}
                <div id="passwordVerificationDiv">
                    <label
                        htmlFor="passwordVerification"
                        style={{
                            color: "#fff",
                            display: "block",
                            fontFamily: "sans-serif",
                            fontSize: "12px",
                        }}
                    >
                        Verify your password
                    </label>
                    <input
                        type="password"
                        id="passwordVerification"
                        value={passwordVerification}
                        onChange={(e) => setPasswordVerification(e.target.value)}
                        placeholder="Verify your password"
                        required
                    />
                    <label
                        htmlFor="passwordVerification"
                        className="passwordVerificationError"
                        style={{
                            display: passwordVerificationError !== "" ? "block" : "none",
                        }}
                    >
                        {passwordVerificationError}
                    </label>
                </div>
                {/* Create Account button */}
                <span>
                    <input type="submit" id="loginButton" value="Create Account" onClick={handleSubmit} />
                </span>
                {/* Go Back button */}
                <span>
                    <input
                        type="button"
                        id="goBackButton"
                        value="Go Back"
                        onClick={() => setIsCreatingAccount(false)}
                    />
                </span>
            </form>
        </div>
    );
}

function CreateAccountButton({ handleCreateAccountClick }) {
    return (
        <div className="signupButton" onClick={handleCreateAccountClick}>
            Create Account
        </div>
    );
}

function GuestButton({ handleContinueAsGuestClick }) {
    return (
        <div className="guestButton" onClick={handleContinueAsGuestClick}>
            Continue as Guest
        </div>
    );
}

export default WelcomePage;
