import React, { useState, useEffect } from "react";
import "./SingleTagPage.css";
import axios from "axios";
import UpvoteButton from "../VotingButtons/UpvoteButton";
import DownvoteButton from "../VotingButtons/DownvoteButton";

function QuestionBox({
    answerViewCount,
    questionTitle,
    questionSummary,
    qTagArray,
    askedByName,
    askedByTime,
    setCurrentPage,
    setSelectedQuestion,
    questions,
    tagsArray,
    questionsArray,
    isGuest
}) {
    const tidToTagName = (tid) => {
        const tag = tagsArray.find((tag) => tag._id === tid);
        return tag ? tag.name : "";
    };
    
    const [questionVotes, setQuestionVotes] = useState(questions.votes);
    useEffect(() => {
        if (questions) {
            axios
                .get(`http://localhost:8000/api/questions/${questions._id}/votes`)
                .then((response) => {
                    setQuestionVotes(response.data.votes);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    });

    function handleQuestionUpvote() {
        axios
            .put(`http://localhost:8000/api/questions/${questions._id}/upvote`)
            .then((response) => {
                const updatedQuestion = response.data;
                setQuestionVotes(updatedQuestion.votes);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function handleQuestionDownvote() {
        axios
            .put(`http://localhost:8000/api/questions/${questions._id}/downvote`)
            .then((response) => {
                const updatedQuestion = response.data;
                setQuestionVotes(updatedQuestion.votes);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <div class="questionBox">
            {isGuest ? (
                        <div className="votesBox">
                            <div id="voteError">*</div>
                            <div className="questionVotes">{questionVotes} votes</div>
                        </div>
                    ) : (
                        <div className="votesBox">
                            {<UpvoteButton handleUpvote={handleQuestionUpvote}></UpvoteButton>}
                            <div className="questionVotes">{questionVotes} votes</div>
                            {<DownvoteButton handleDownvote={handleQuestionDownvote}></DownvoteButton>}
                        </div>
            )}
            <div class="titleTagWrapper">
                <p
                    class="questionTitle"
                    onClick={() => {
                        const selectedQuestion = questionsArray.find((question) => question.title === questionTitle);
                        setSelectedQuestion(selectedQuestion);
                        selectedQuestion.views += 1;
                        setCurrentPage("answersPage");
                    }}
                >
                    {questionTitle}
                </p>
                <p class="questionSummary">
                    {questionSummary}
                </p>
                <div class="questionTags">
                    {qTagArray.map((tid) => (
                        <p class="qTag">{tidToTagName(tid)}</p>
                    ))}
                </div>
            </div>
            <div class="askedData">
                <p class="askedByName">{askedByName}</p>
                <p class="askedByTime">{askedByTime}</p>
            </div>
            <p class="answerViewCount">{answerViewCount}</p>
        </div>
    );
}

//getQuestionsBasedOnPageNumber
function getQuestionsBasedOnPageNumber(questions, questionPageNumber, setQuestionPageNumber) {
    const questionPageSize = 5;
    let startIndex = (questionPageNumber - 1) * questionPageSize;
    let endIndex = startIndex + questionPageSize;
    if (startIndex > questions.length) {
        startIndex = 0;
        endIndex = 4;
        setQuestionPageNumber(1);
    }
    if (endIndex > questions.length) {
        endIndex = questions.length;
    }
    let questionsBasedOnPageNumber = [...questions].slice(startIndex, endIndex);
    return questionsBasedOnPageNumber;
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
    } else if (time.getDate() > currentTime.getDate() && time.getMonth() !== currentTime.getMonth()) {
        return `${monthString} ${time.getDate()}, at ${hourString}:${minuteString}`;
    } else if (currentTime.getHours() - time.getHours() !== 0) {
        return `${Math.abs(currentTime.getHours() - time.getHours())} hours ago`;
    } else if (currentTime.getMinutes() - time.getMinutes() !== 0) {
        return `${currentTime.getMinutes() - time.getMinutes()} minutes ago`;
    } else {
        return `${secondsString} seconds ago`;
    }
}

function renderTagResults(
    questions,
    setCurrentPage,
    setSelectedQuestion,
    uniqueTagWordArray,
    tagsArray,
    questionPageNumber,
    setQuestionPageNumber,
    isGuest
) {
    let questionsBasedOnPageNumber = getQuestionsBasedOnPageNumber(
        uniqueTagWordArray,
        questionPageNumber,
        setQuestionPageNumber
    );

    return questionsBasedOnPageNumber.map((question) => (
        <QuestionBox
            key={question.id}
            answerViewCount={`${question.answers.length} answers ${question.views} views`}
            questionTitle={question.title}
            questionSummary={question.summary}
            qTagArray={question.tags}
            askedByName={question.asked_by}
            askedByTime={`asked ${formatDate(question.ask_date_time)}`}
            questions={question}
            setCurrentPage={setCurrentPage}
            setSelectedQuestion={setSelectedQuestion}
            tagsArray={tagsArray}
            isGuest={isGuest}
        />
    ));
}

function SingleTagPage({
    questions,
    setCurrentPage,
    setSelectedQuestion,
    tags,
    databaseUpdateTrigger,
    isGuest,
    tagWord
}){ 

    const [questionsArray, setQuestionsArray] = useState([]);
    useEffect(() => {
        if (questions !== null) {
            setQuestionsArray(questions);
        }
    }, [questions, databaseUpdateTrigger]);
    

    const [tagsArray, setTagsArray] = useState([]);
    useEffect(() => {
        if (tags !== null) {
            setTagsArray(tags);
        }
    }, [tags, databaseUpdateTrigger]);

    let tagWordArray = []

    //Tag Search
    for (const question of questionsArray) {
        for (const tagsPointer of question.tags) {
            const tagsNamePointer = tagsArray.find((tag) => tag._id === tagsPointer).name;
            if (tagsNamePointer === tagWord) {
                tagWordArray.push(question);
            }
        }
    }

     //Removing Dupes
    let tagWordSet = new Set(tagWordArray);
    let uniqueTagWordArray = Array.from(tagWordSet);

    const [questionPageNumber, setQuestionPageNumber] = useState(1);

    const incrementQuestionPageNumber = () => {
        setQuestionPageNumber(questionPageNumber + 1);
    };

    const decrementQuestionPageNumber = () => {
        if (questionPageNumber !== 1) {
            setQuestionPageNumber(questionPageNumber - 1);
        }
    };
    
 



    return(
        <div id="singleTagPage">
            <div id="singleTagPageHeader">
                <div id="stphRow1">
                    <div id="singleTagPageHeTitle">
                        Tag: {tagWord}
                    </div>
                    {isGuest ? (
                            <div id="mustBeLoggedInText">*Must Be Logged In to Ask a Question or Vote</div>
                        ) : (
                            <div></div>
                    )}
                </div>
                <div id ="stphRow2"> 
                    <div id="numberOfQuestions"> {uniqueTagWordArray.length} {uniqueTagWordArray.length === 1 ? "Question" : "Questions"}</div>
                </div>
            </div>

            <div id="singeTagQuestionsWrapper">{
                renderTagResults(
                        questionsArray,
                        setCurrentPage,
                        setSelectedQuestion,
                        uniqueTagWordArray,
                        tagsArray,
                        questionPageNumber,
                        setQuestionPageNumber,
                        isGuest
                )}
            </div>

            <div id="questionPageSelector">
                <button id="nextQuestionPageSelector" onClick={decrementQuestionPageNumber}>
                    &#8592;
                </button>
                <div id="questionPageNumber">Prev | {questionPageNumber} | Next</div>
                <button id="prevQuestionPageSelector" onClick={incrementQuestionPageNumber}>
                    &#8594;
                </button>
            </div>
        </div>
    );
}

export default SingleTagPage;