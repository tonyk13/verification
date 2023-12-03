import React, { useState, useEffect } from "react";
import Cookie from "js-cookie";
import axios from "axios";
import "./UserProfilePage.css";




/*
//QuestionBox
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
        <div class="questionBox" key={questions._id}>
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
                    ))
                    }
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
//All Questions
function renderUserQuestions(
    questions,
    setCurrentPage,
    setSelectedQuestion,
    tagsArray,
    questionPageNumber,
    setQuestionPageNumber,
    isGuest
) {
    questions.sort((x, y) => x.ask_date_time - y.ask_date_time);
    let questionsBasedOnPageNumber = getQuestionsBasedOnPageNumber(
        questions,
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
            questionsArray={questions}
            isGuest={isGuest}
        />
    ));
}
*/


export default function UserProfilePage({ isGuest }) { 

/****
-Menu
-Main Section of the page
    -Length of time the user has been a member of fakeso
    -Reputation
-Set of questions titles asked by the user
-Link to each new question page to modify ---> edit, post it again/ delete it

-Link to all tags created
-Link to all questions answered

-Same format of all tags page
    -option to delete or edit a tag
        -if delete a tag, it will not be shown with the question
        -a tag can be edited or deleted only if it is not being used by any other user



--User Profile Admin
    */

//GUEST USER
    const [userReputation, setUserReputation] = useState('');
    const [username, setUsername] = useState('');
    const [userDateCreated, setUserDateCreated] = useState('');
    useEffect(() => {
        if (!isGuest) {
            async function fetchData() {
                const userid = Cookie.get("userid");
                try {
                    const responseUsername = await axios.get(`http://localhost:8000/api/getUsername/${userid}`);
                    setUsername(responseUsername.data.username);
                } catch (error) {
                    console.error('Error fetching username:', error);
                }

                try {
                    const responseUserReputation = await axios.get(`http://localhost:8000/api/getUserReputation/${userid}`);
                    setUserReputation(responseUserReputation.data.reputation);
                } catch (error) {
                    console.error('Error fetching user reputation:', error);
                }

                try {
                    const responseUserDateCreated = await axios.get(`http://localhost:8000/api/getUserDateCreated/${userid}`);
                    setUserDateCreated(responseUserDateCreated.data.userDateCreated)
                } catch (error) {
                    console.error('Error fetching user date created:', error);
                }

                try {
                    const userQuestions = await axios.get(`http://localhost:8000/api/getUserQuestions/${userid}`);
                    console.log(userQuestions)
                } catch (error) {
                    console.error('Error fetching user questions:', error);
                }
            }
            fetchData();
        }
    }, []);

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
            return `${timeDifferenceInSeconds} seconds`;
        } else if (time.getFullYear() < currentYear) {
            return `${monthString} ${time.getDate()}, ${time.getFullYear()} at ${hourString}:${minuteString}`;
        } else if (time.getDate() > currentTime.getDate() && time.getMonth() !== currentTime.getMonth()) {
            return `${monthString} ${time.getDate()}, at ${hourString}:${minuteString}`;
        } else if (currentTime.getHours() - time.getHours() !== 0) {
            return `${Math.abs(currentTime.getHours() - time.getHours())} hours`;
        } else if (currentTime.getMinutes() - time.getMinutes() !== 0) {
            return `${currentTime.getMinutes() - time.getMinutes()} minutes`;
        } else {
            return `${secondsString} seconds`;
        }
    }




    const [userDisplay, setUserDisplay] = useState("userQuestions");
    
    
    //Display Users Questions
    const displayUserQuestions = () => { 
        setUserDisplay("userQuestions");
        //renderUserQuestions();
    }

    const displayUserTags = () => { 
        setUserDisplay("userTags");
    } 
    
    const displayUserAnswers = () => { 
        setUserDisplay("userAnswers");
    }


    return (
        <div id="userProfilePage">
            {isGuest ? (
                        <div id="userProfilePageHeader">
                            <div id="mustBeLoggedInText">
                                <div id="mustBeLoggedInText">
                                    *Must Be Logged In to Access User Profile Page
                                </div> 
                                
                            </div>
                        </div>
                    ) : (
                    <div>
                        <div id="userProfilePageHeader">
                            <div id="upphRow1">
                                User:
                                <div class="userData">
                                    {username}
                                </div> 
                            </div>
                            <div id="upphRow2">
                                Reputation:
                                <div class="userData">
                                    {userReputation}
                                    </div> 
                            </div>
                            <div id="upphRow3">
                                Joined: 
                                <div class="userData">
                                    {formatDate(userDateCreated)}
                                </div> 
                            </div>
                            <div id="upphRow4">
                                <div id="userProfileStatusButtons">
                                    <button onClick={displayUserQuestions}>
                                        My Questions
                                    </button>
                                    <button onClick={displayUserTags}>
                                        My Tags
                                    </button>
                                    <button onClick={displayUserAnswers}>
                                        My Answers
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div>
                            {userDisplay}
                        </div>








                    </div>
            )}      
        </div>
    );
}


