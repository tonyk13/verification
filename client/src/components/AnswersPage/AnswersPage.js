import { React, useState, useEffect } from "react";
import axios from "axios";
import AnswerQuestionButton from "../Buttons/AnswerQuestionButton";
import "./AnswersPage.css";

function AnswersPage({
    selectedQuestion,
    setCurrentPage,
    setDataBaseUpdateTrigger,
}) {
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (selectedQuestion) {
            axios
                .get(
                    `http://localhost:8000/api/questions/${selectedQuestion._id}/answers`
                )
                .then((response) => {
                    setAnswers(Object.values(response.data));
                    setLoading(false);
                })
                .catch((error) => {
                    console.error(error);
                    setLoading(false);
                });
        }
    }, [selectedQuestion, setDataBaseUpdateTrigger]);

    if (selectedQuestion === null || loading) {
        return <div>Loading...</div>;
    }

    return (
        <div id="answersPage">
            <AnswersContainer
                selectedQuestion={selectedQuestion}
                answers={answers}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
}

function AnswersContainer({ selectedQuestion, answers, setCurrentPage }) {
    return (
        <div className="answersContainer">
            <AnswersPageHeader
                selectedQuestion={selectedQuestion}
                setCurrentPage={setCurrentPage}
                numAnswers={answers.length}
            />
            <QuestionWrapper selectedQuestion={selectedQuestion} />
            <AnswersWrapper
                selectedQuestion={selectedQuestion}
                answers={answers}
            />
            <AnswerQuestionButton
                selectedQuestion={selectedQuestion}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
}

function AnswersPageHeader({ selectedQuestion, setCurrentPage, numAnswers }) {
    const loadAskQuestionPage = () => {
        setCurrentPage("askQuestionPage");
    };

    return (
        <div className="answersPageHeader">
            <div className="headerContent">
                <div id="numberOfAnswers">{numAnswers} answers</div>
                <div id="questionTitle">{selectedQuestion.title}</div>
                <button
                    type="button"
                    className="askQuestionButton"
                    onClick={loadAskQuestionPage}
                >
                    Ask Question
                </button>
            </div>
        </div>
    );
}

function formatDate(dateString) {
    const time = new Date(dateString);

    let monthString = "";
    switch (time.getMonth() + 1) {
        case 1:
            monthString = "Jan";
            break;
        case 2:
            monthString = "Feb";
            break;
        case 3:
            monthString = "Mar";
            break;
        case 4:
            monthString = "Apr";
            break;
        case 5:
            monthString = "May";
            break;
        case 6:
            monthString = "Jun";
            break;
        case 7:
            monthString = "Jul";
            break;
        case 8:
            monthString = "Aug";
            break;
        case 9:
            monthString = "Sep";
            break;
        case 10:
            monthString = "Oct";
            break;
        case 11:
            monthString = "Nov";
            break;
        case 12:
            monthString = "Dec";
            break;
        default:
            monthString = "";
            break;
    }

    const currentYear = new Date().getFullYear();
    let minuteString = time.getMinutes();
    let secondsString = time.getSeconds();
    let hourString = time.getHours();

    if (time.getMinutes() < 10) {
        minuteString = `0${time.getMinutes()}`;
    }
    if (time.getSeconds() < 10) {
        secondsString = `0${time.getSeconds()}`;
    }
    if (time.getHours() < 10) {
        hourString = `0${time.getHours()}`;
    }

    const currentTime = new Date();
    const timeDifferenceInSeconds = Math.floor((currentTime - time) / 1000);

    if (timeDifferenceInSeconds < 60) {
        return `${timeDifferenceInSeconds} seconds ago`;
    } else if (time.getFullYear() < currentYear) {
        return `${monthString} ${time.getDate()}, ${time.getFullYear()} at ${hourString}:${minuteString}`;
    } else if (
        time.getDate() > currentTime.getDate() &&
        time.getMonth() !== currentTime.getMonth()
    ) {
        return `${monthString} ${time.getDate()}, at ${hourString}:${minuteString}`;
    } else if (currentTime.getHours() - time.getHours() !== 0) {
        return `${Math.abs(
            currentTime.getHours() - time.getHours()
        )} hours ago`;
    } else if (currentTime.getMinutes() - time.getMinutes() !== 0) {
        return `${currentTime.getMinutes() - time.getMinutes()} minutes ago`;
    } else {
        return `${secondsString} seconds ago`;
    }
}

function QuestionWrapper({ selectedQuestion }) {
    function renderQuestionTextWithLinks(text) {
        const hyperlinkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;

        const textWithLinks = text.replace(
            hyperlinkRegex,
            (match, linkText, linkTarget) => {
                return `<a href="${linkTarget}" target="_blank">${linkText}</a>`;
            }
        );

        return { __html: textWithLinks };
    }

    return (
        <div id="questionWrapper">
            <div className="questionBox">
                <div className="questionNumViews">
                    {selectedQuestion.views} Views
                </div>
                <div
                    className="questionText"
                    dangerouslySetInnerHTML={renderQuestionTextWithLinks(
                        selectedQuestion.text
                    )}
                />
                <div className="askedByName">{selectedQuestion.asked_by}</div>
                <div className="askedByTime">
                    asked {formatDate(selectedQuestion.ask_date_time)}
                </div>
            </div>
        </div>
    );
}

function AnswersWrapper({ answers }) {
    answers.sort((a, b) => new Date(b.ansDate) - new Date(a.ansDate));

    return (
        <div id="answersWrapper">
            {answers.map((answer) => (
                <Answer
                    key={answer._id}
                    answerText={answer.text}
                    answeredByName={answer.ans_by}
                    answeredByTime={answer.ans_date_time}
                />
            ))}
        </div>
    );
}

function Answer({ answerText, answeredByName, answeredByTime }) {
    function renderAnswerWithLinks(text) {
        const hyperlinkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;

        const textWithLinks = text.replace(
            hyperlinkRegex,
            (match, linkText, linkTarget) => {
                return `<a href="${linkTarget}" target="_blank">${linkText}</a>`;
            }
        );

        return { __html: textWithLinks };
    }

    return (
        <div className="answerBox">
            <div
                className="answerText"
                dangerouslySetInnerHTML={renderAnswerWithLinks(answerText)}
            />
            <div className="answeredByName">{answeredByName}</div>
            <div className="answeredByTime">{`answered ${formatDate(
                answeredByTime
            )}`}</div>
        </div>
    );
}

export {
    AnswersPage,
    AnswersContainer,
    AnswersPageHeader,
    QuestionWrapper,
    AnswersWrapper,
    Answer,
};
