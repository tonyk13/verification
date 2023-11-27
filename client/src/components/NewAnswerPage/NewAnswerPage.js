import React, { useState } from "react";
import axios from "axios";
import "./NewAnswerPage.css";

export default function NewAnswerPage({ selectedQuestion, setCurrentPage }) {
    const [username, setUsername] = useState("");
    const [answer, setAnswer] = useState("");
    const [error, setError] = useState("");

    function handleUsernameChange(e) {
        setUsername(e.target.value);
    }

    function handleAnswerChange(e) {
        setAnswer(e.target.value);
    }

    function checkHyperlinks(answer) {
        const hyperLinkRegex = /\[([^\]]*)\]\(([^)]*)\)/g;

        const hyperlinkMatches = [...answer.matchAll(hyperLinkRegex)];

        let hasInvalidHyperlink = false;

        for (const hl of hyperlinkMatches) {
            let hlURL = hl[2];

            if (
                hlURL.trim() === "" ||
                (!hlURL.startsWith("http://") && !hlURL.startsWith("https://"))
            ) {
                hasInvalidHyperlink = true;
                break;
            }
        }

        return !hasInvalidHyperlink;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!username || !answer) {
            setError("Both fields are mandatory");
            return;
        }

        if (!checkHyperlinks(answer)) {
            setError("Answer contains invalid hyperlinks");
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8000/api/questions/${selectedQuestion._id}/answers`,
                {
                    text: answer,
                    ans_by: username,
                }
            );

            selectedQuestion = response.data.updatedQuestion;

            setCurrentPage("answersPage");
        } catch (error) {
            console.error("Error posting answer:", error);
            setError("Error posting answer. Please try again.");
        }
    }

    return (
        <div id="answerQuestionPage">
            <form onSubmit={handleSubmit}>
                <div className="answerQuestionLabels">
                    <label htmlFor="username">Username*</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                </div>
                <div className="answerQuestionLabels">
                    <label htmlFor="answerText">Answer Text*</label>
                    <textarea
                        value={answer}
                        onChange={handleAnswerChange}
                        id="answerQuestionTextDiv"
                    />
                </div>
                {error && <p className="aqNullError">{error}</p>}
                <div id="answerQuestionLastLine">
                    <button
                        id="postAnswerButton"
                        type="submit"
                        className="answerQuestionButton"
                        onClick={handleSubmit}
                    >
                        Post Answer
                    </button>
                </div>
            </form>
            <p className="footer">* indicates mandatory fields</p>
        </div>
    );
}
