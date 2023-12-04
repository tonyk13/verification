import { React, useState, useEffect } from "react";
import Header from "./components/Header/Header.js";
import Sidebar from "./components/Sidebar/Sidebar.js";
import QuestionsPage from "./components/QuestionsPage/QuestionsPage.js";
import { TagsPage } from "./components/TagsPage/TagsPage.js";
import { AnswersPage } from "./components/AnswersPage/AnswersPage.js";
import AskQuestionPage from "./components/AskQuestionPage/AskQuestionPage.js";
import NewAnswerPage from "./components/NewAnswerPage/NewAnswerPage.js";
import WelcomePage from "./components/WelcomePage/WelcomePage.js";
import UserProfilePage from "./components/UserProfilePage/UserProfilePage.js";
import SingleTagPage from "./components/SingleTagPage/SingleTagPage.js";
import EditQuestionPage from "./components/EditQuestionPage/EditQuestionPage.js";
import axios from "axios";
import Cookie from "js-cookie";

function App() {
    const [currentPage, setCurrentPage] = useState("welcomePage");
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [currentSearch, setSearch] = useState("");
    const [questions, setQuestions] = useState([]);
    const [tags, setTags] = useState([]);
    const [databaseUpdateTrigger, setDataBaseUpdateTrigger] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isGuest, setIsGuest] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [searchTrigger, setSearchTrigger] = useState("");

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
        };

        const handleOffline = () => {
            setIsOnline(false);
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    useEffect(() => {
        const user = Cookie.get("auth");
        if (user) {
            console.log("THERE IS A USER IN THE COOKIE:", user);
            if (user !== "GUEST") {
                setIsLoggedIn(true);
            } else {
                setIsGuest(true);
            }
            setCurrentPage("questionsPage");
        } else {
            console.log("NO USER IN THE COOKIE");
        }
    }, []);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/questions");
                setQuestions(Object.values(response.data));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchQuestions();
    }, [databaseUpdateTrigger]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/tags");
                setTags(Object.values(response.data));
            } catch (error) {
                console.error("Error fetching tags:", error);
            }
        };
        fetchTags();
    }, [databaseUpdateTrigger]);

    const handleLogout = async () => {
        if (!isGuest) {
            try {
                const response = await axios.post("http://localhost:8000/api/logout", null, {
                    withCredentials: true,
                });
                console.log(response.data);
                if (response.data.success) {
                    Cookie.remove("auth");
                    Cookie.remove("userid");
                    setIsLoggedIn(false);
                    setCurrentPage("welcomePage");
                    console.log("Logged out successfully!");
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            setIsGuest(false);
            Cookie.remove("auth");
            setCurrentPage("welcomePage");
        }
    };

   
     
    useEffect(() => {
      if(searchTrigger!==""){
        setCurrentPage("singleTagPage")
      }
      console.log(searchTrigger)
    }, []);
     

    const renderCurrentPage = () => {
        //setSearchTrigger("");
        if (currentPage === "questionsPage") {
            return (
                <QuestionsPage
                    setSelectedQuestion={setSelectedQuestion}
                    questions={questions}
                    setCurrentPage={setCurrentPage}
                    currentSearch={currentSearch}
                    setSearch={setSearch}
                    tags={tags}
                    databaseUpdateTrigger={databaseUpdateTrigger}
                    isGuest={isGuest}
                />
            );
        } else if (currentPage === "tagsPage") {
            return (
                <TagsPage
                    questions={questions}
                    tags={tags}
                    setCurrentPage={setCurrentPage}
                    currentSearch={currentSearch}
                    setSearch={setSearch}
                    databaseUpdateTrigger={databaseUpdateTrigger}
                    currentPage={currentPage}
                    setSearchTrigger={setSearchTrigger}
                />
            );
        } else if (currentPage === "askQuestionPage") {
            return (
                <AskQuestionPage
                    setCurrentPage={setCurrentPage}
                    setDataBaseUpdateTrigger={setDataBaseUpdateTrigger}
                    tags={tags}
                />
            );
        } else if (currentPage === "newAnswerPage") {
            return (
                <NewAnswerPage
                    selectedQuestion={selectedQuestion}
                    setCurrentPage={setCurrentPage}
                    setDataBaseUpdateTrigger={setDataBaseUpdateTrigger}
                />
            );
        } else if (currentPage === "answersPage") {
            return (
                <AnswersPage
                    selectedQuestion={selectedQuestion}
                    setCurrentPage={setCurrentPage}
                    setDataBaseUpdateTrigger={setDataBaseUpdateTrigger}
                    tags={tags}
                    isGuest={isGuest}
                />
            );
        } else if (currentPage === "userProfilePage") {
            return (
                <UserProfilePage
                    isGuest={isGuest}
                    setCurrentPage={setCurrentPage}
                    setSearchTrigger={setSearchTrigger}
                    EditQuestionPage={EditQuestionPage}
                    setDataBaseUpdateTrigger={setDataBaseUpdateTrigger}
                    tags={tags}
                />
            );
        } else if (currentPage === "singleTagPage") {
            return (
                <SingleTagPage
                    questions={questions}
                    setCurrentPage={setCurrentPage}
                    setSelectedQuestion={setSelectedQuestion}
                    tags={tags}
                    databaseUpdateTrigger={databaseUpdateTrigger}
                    isGuest={isGuest}
                    tagWord={searchTrigger}
                />
            );
        }
    };

    return (
        <div className="app">
            {isOnline && (isLoggedIn || isGuest) ? (
                <div className="page">
                    <Header 
                        setSearch={setSearch} 
                        handleLogout={handleLogout} 
                        isGuest={isGuest} 
                    />
                    <Sidebar 
                        currentPage={currentPage} 
                        setCurrentPage={setCurrentPage} 
                        setSearchTrigger={setSearchTrigger}
                    />
                    <div className="content">{renderCurrentPage()}</div>
                </div>
            ) : (
                <div className="content">
                    <WelcomePage
                        setCurrentPage={setCurrentPage}
                        setIsLoggedIn={setIsLoggedIn}
                        isGuest={isGuest}
                        setIsGuest={setIsGuest}
                        isOnline={isOnline}
                    />
                </div>
            )}
        </div>
    );
}

export default App;
