// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************

import { React, useState, useEffect } from "react";
import Header from "./components/Header/Header.js";
import Sidebar from "./components/Sidebar/Sidebar.js";
import QuestionsPage from "./components/QuestionsPage/QuestionsPage.js";
import { TagsPage } from "./components/TagsPage/TagsPage.js";
import { AnswersPage } from "./components/AnswersPage/AnswersPage.js";
import AskQuestionPage from "./components/AskQuestionPage/AskQuestionPage.js";
import NewAnswerPage from "./components/NewAnswerPage/NewAnswerPage.js";
import WelcomePage from "./components/WelcomePage/WelcomePage.js";
import axios from "axios";

function App() {
    const [currentPage, setCurrentPage] = useState("welcomePage");
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [currentSearch, setSearch] = useState("");
    const [questions, setQuestions] = useState([]);
    const [tags, setTags] = useState([]);
    const [databaseUpdateTrigger, setDataBaseUpdateTrigger] = useState(0);
    const [tagClicked, setTagClicked] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isGuest, setIsGuest] = useState(false);

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
                    setIsLoggedIn(false);
                    setCurrentPage("welcomePage");
                    console.log("Logged out successfully!");
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            setIsGuest(false);
            setCurrentPage("welcomePage");
        }
    };

    const renderCurrentPage = () => {
        // if (currentPage === "welcomePage") {
        //     return <WelcomePage setCurrentPage={setCurrentPage} setIsLoggedIn={setIsLoggedIn} />;
        // } else if (currentPage === "questionsPage") {
        //     return (
        //         <QuestionsPage
        //             setSelectedQuestion={setSelectedQuestion}
        //             questions={questions}
        //             setCurrentPage={setCurrentPage}
        //             currentSearch={currentSearch}
        //             setSearch={setSearch}
        //             tags={tags}
        //             databaseUpdateTrigger={databaseUpdateTrigger}
        //             tagClicked={tagClicked}
        //             setTagClicked={setTagClicked}
        //         />
        //     );
        // } else if (currentPage === "tagsPage") {
        //     return (
        //         <TagsPage
        //             questions={questions}
        //             tags={tags}
        //             setCurrentPage={setCurrentPage}
        //             currentSearch={currentSearch}
        //             setSearch={setSearch}
        //             databaseUpdateTrigger={databaseUpdateTrigger}
        //             currentPage={currentPage}
        //             setTagClicked={setTagClicked}
        //         />
        //     );
        // } else if (currentPage === "askQuestionPage") {
        //     return (
        //         <AskQuestionPage
        //             setCurrentPage={setCurrentPage}
        //             setDataBaseUpdateTrigger={setDataBaseUpdateTrigger}
        //             tags={tags}
        //         />
        //     );
        // } else if (currentPage === "newAnswerPage") {
        //     return (
        //         <NewAnswerPage
        //             selectedQuestion={selectedQuestion}
        //             setCurrentPage={setCurrentPage}
        //             setDataBaseUpdateTrigger={setDataBaseUpdateTrigger}
        //         />
        //     );
        // } else if (currentPage === "answersPage") {
        //     return (
        //         <AnswersPage
        //             selectedQuestion={selectedQuestion}
        //             setCurrentPage={setCurrentPage}
        //             setDataBaseUpdateTrigger={setDataBaseUpdateTrigger}
        //         />
        //     );
        // }

        if (!isLoggedIn && !isGuest) {
            return (
                <WelcomePage
                    setCurrentPage={setCurrentPage}
                    setIsLoggedIn={setIsLoggedIn}
                    isGuest={isGuest}
                    setIsGuest={setIsGuest}
                />
            );
        } else {
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
                        tagClicked={tagClicked}
                        setTagClicked={setTagClicked}
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
                        setTagClicked={setTagClicked}
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
                    />
                );
            }
        }
    };

    // if (currentPage !== "welcomePage") {
    //     return (
    //         <div className="app">
    //             <Header setSearch={setSearch} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    //             <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
    //             <div className="content">{renderCurrentPage()}</div>
    //         </div>
    //     );
    // } else {
    //     return (
    //         <div className="app">
    //             <div className="content">{renderCurrentPage()}</div>
    //         </div>
    //     );
    // }

    if (!isLoggedIn && !isGuest) {
        return (
            <div className="app">
                <div className="content">
                    <WelcomePage
                        setCurrentPage={setCurrentPage}
                        setIsLoggedIn={setIsLoggedIn}
                        isGuest={isGuest}
                        setIsGuest={setIsGuest}
                    />
                </div>
            </div>
        );
    } else {
        return (
            <div className="app">
                <Header setSearch={setSearch} handleLogout={handleLogout} isGuest={isGuest} />
                <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
                <div className="content">{renderCurrentPage()}</div>
            </div>
        );
    }
}

export default App;
