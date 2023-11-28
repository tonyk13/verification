import React, { useState, useEffect, useRef } from "react";
import "./QuestionsPage.css";
import axios from "axios";

//questionBox
function QuestionBox({
    answerViewCount,
    questionTitle,
    qTagArray,
    askedByName,
    askedByTime,
    setCurrentPage,
    setSelectedQuestion,
    questions,
    tagsArray,
    questionsArray,
}) {
    const tidToTagName = (tid) => {
        const tag = tagsArray.find((tag) => tag._id === tid);
        return tag ? tag.name : "";
    };

    return (
        <div class="questionBox">
            <p class="answerViewCount">{answerViewCount}</p>
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

//All Questions
function renderAllQuestions(questions, setCurrentPage, setSelectedQuestion, tagsArray) {
    questions.sort((x, y) => x.ask_date_time - y.ask_date_time);

    return questions.map((question) => (
        <QuestionBox
            key={question.id}
            answerViewCount={`${question.answers.length} answers ${question.views} views`}
            questionTitle={question.title}
            qTagArray={question.tags}
            askedByName={question.asked_by}
            askedByTime={`asked ${formatDate(question.ask_date_time)}`}
            questions={question}
            setCurrentPage={setCurrentPage}
            setSelectedQuestion={setSelectedQuestion}
            tagsArray={tagsArray}
            questionsArray={questions}
        />
    ));
}

//
function getQuestionfromAnswer(questionsArray, answerID) {
    for (const q of questionsArray) {
        for (const a of q.answers) {
            if (a === answerID) {
                return q;
            }
        }
    }
    return null;
}

function activeSort(questionsArray, answersArray) {
    let returnArray = [];

    const activeSortTempArray = answersArray.sort((a, b) => new Date(a.ans_date_time) - new Date(b.ans_date_time));

    for (const answer of activeSortTempArray) {
        const question = getQuestionfromAnswer(questionsArray, answer._id);
        if (question && !returnArray.includes(question)) {
            returnArray.push(question);
        }
    }
    return returnArray;
}

//Render Active Questions
function renderActiveQuestions(questions, answers, setCurrentPage, setSelectedQuestion, tagsArray) {
    let activeQuestions = activeSort(questions, answers);
    return activeQuestions.map((question) => (
        <QuestionBox
            key={question.id}
            answerViewCount={`${question.answers.length} answers ${question.views} views`}
            questionTitle={question.title}
            qTagArray={question.tags}
            askedByName={question.asked_by}
            askedByTime={`asked ${formatDate(question.ask_date_time)}`}
            questions={question}
            setCurrentPage={setCurrentPage}
            setSelectedQuestion={setSelectedQuestion}
            tagsArray={tagsArray}
        />
    ));
}

//Render Unanswered Questions
function renderUnansweredQuestions(questions, setCurrentPage, setSelectedQuestion, tagsArray) {
    questions.sort((x, y) => x.ask_date_time - y.ask_date_time);

    let unansweredQuestions = questions.filter((question) => question.answers.length === 0);

    if (unansweredQuestions.length === 0) {
        return "No Questions Found";
    }
    return unansweredQuestions.map((question) => (
        <QuestionBox
            key={question.id}
            answerViewCount={`${question.answers.length} answers ${question.views} views`}
            questionTitle={question.title}
            qTagArray={question.tags}
            askedByName={question.asked_by}
            askedByTime={`asked ${formatDate(question.ask_date_time)}`}
            questions={questions}
            setCurrentPage={setCurrentPage}
            setSelectedQuestion={setSelectedQuestion}
            tagsArray={tagsArray}
        />
    ));
}

function renderSearchResults(questions, setCurrentPage, setSelectedQuestion, searchResultsQuestionArrayRef, tagsArray) {
    return searchResultsQuestionArrayRef.current.map((question) => (
        <QuestionBox
            key={question.id}
            answerViewCount={`${question.answers.length} answers ${question.views} views`}
            questionTitle={question.title}
            qTagArray={question.tags}
            askedByName={question.asked_by}
            askedByTime={`asked ${formatDate(question.ask_date_time)}`}
            questions={questions}
            setCurrentPage={setCurrentPage}
            setSelectedQuestion={setSelectedQuestion}
            tagsArray={tagsArray}
        />
    ));
}

function QuestionsPage({
    questions,
    setCurrentPage,
    setSelectedQuestion,
    currentSearch,
    setSearch,
    tags,
    databaseUpdateTrigger,
    tagClicked,
    setTagClicked,
    isGuest,
}) {
    /*Convert questions and tags into an Array*/
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

    const [sort, setSort] = useState("Newest");
    const [noq, setNoq] = useState(questionsArray.length);

    useEffect(() => {
        setNoq(questionsArray.length);
    }, [questionsArray]);

    //Creating Answers Master List
    const [answersArray, setAnswersArray] = useState([]);

    useEffect(() => {
        const fetchAnswers = async () => {
            try {
                let allAnswers = [];
                for (const question of questionsArray) {
                    const response = await axios.get(`http://localhost:8000/api/questions/${question._id}/answers`);
                    const answers = response.data;

                    allAnswers = allAnswers.concat(answers);
                }
                setAnswersArray(allAnswers);
            } catch (error) {
                console.error("Error fetching answers:", error);
            }
        };
        fetchAnswers();
    }, [questionsArray]);

    /*Display Question Order Types*/
    const displayAllQuestions = () => {
        setSort("Newest");
        setNoq(questionsArray.length);
    };

    const displayActiveQuestions = () => {
        setSort("Active");
        setNoq(activeSort(questionsArray, answersArray).length);
    };

    const displayUnansweredQuestions = () => {
        setSort("Unanswered");
        setNoq(questionsArray.filter((question) => question.answers.length === 0).length);
    };

    //Searching Functionality
    const keywordSearchArray = useRef([]);
    const tagSearchArray = useRef([]);
    const searchResultsQuestionArrayRef = useRef([]);

    useEffect(() => {
        if (currentSearch !== "") {
            parseSearch(currentSearch);
            searchResultsQuestionArrayRef.current = keywordTagArraysToSearchArray(
                keywordSearchArray.current,
                tagSearchArray.current
            );
            setSort("Search");
            setNoq(searchResultsQuestionArrayRef.current.length);
        } else {
            displayAllQuestions();
        }
    }, [currentSearch]);

    function parseSearch(searchString) {
        // Update the searchString variable
        searchString = searchString.toLowerCase();
        let keywordSearchArrayTemp = [];
        let tagSearchArrayTemp = [];

        searchString = searchString.replace(/(\[[^\]]+\])/g, " $1 ");

        searchString.split(/\s+/).forEach((word) => {
            if (word.startsWith("[") && word.endsWith("]")) {
                tagSearchArrayTemp.push(word.substring(1, word.length - 1));
            } else {
                keywordSearchArrayTemp.push(word);
            }
        });
        keywordSearchArray.current = keywordSearchArrayTemp;
        tagSearchArray.current = tagSearchArrayTemp;
    }

    function keywordTagArraysToSearchArray(keywordSearchArray, tagSearchArray) {
        let searchResultsQuestionArray = [];
        keywordSearchArray = keywordSearchArray.filter((word) => word !== "");
        for (const searchWord of keywordSearchArray) {
            for (const question of questionsArray) {
                if (question.title.toLowerCase().match(searchWord) || question.text.toLowerCase().match(searchWord)) {
                    searchResultsQuestionArray.push(question);
                }
            }
        }

        //Search Tag Query
        for (const question of questionsArray) {
            for (const tagWord of tagSearchArray) {
                for (const tagsPointer of question.tags) {
                    const tagsNamePointer = tagsArray.find((tag) => tag._id === tagsPointer).name;
                    if (tagsNamePointer === tagWord) {
                        searchResultsQuestionArray.push(question);
                    }
                }
            }
        }

        //Removing Dupes
        let uniqueSearchResultsSet = new Set(searchResultsQuestionArray);
        let uniqueSearchResultsQuestionArray = Array.from(uniqueSearchResultsSet);
        return uniqueSearchResultsQuestionArray;
    }

    //Ask Question Page
    const loadAskQuestionPage = () => {
        setCurrentPage("askQuestionPage");
    };

    return (
        <div id="questionsPage">
            <div id="questionsPageHeader">
                <div id="qphRow1">
                    <div id="qphTitle">
                        {sort === "Newest" && "All Questions"}
                        {sort === "Active" && "Active Questions"}
                        {sort === "Unanswered" && "Unanswered Questions"}
                        {sort === "Search" && "Search Results"}
                    </div>
                    {!isGuest && (
                        <button type="button" className="askQuestionButton" onClick={loadAskQuestionPage}>
                            Ask Question
                        </button>
                    )}
                </div>

                <div id="qphRow2">
                    <div id="numberOfQuestions">{noq} questions</div>
                    <div id="questionsStatusButtons">
                        <button onClick={displayAllQuestions}>Newest</button>
                        <button onClick={displayActiveQuestions}>Active</button>
                        <button onClick={displayUnansweredQuestions}>Unanswered</button>
                    </div>
                </div>
            </div>

            <div id="questionsWrapper">
                {sort === "Newest" &&
                    renderAllQuestions(questionsArray, setCurrentPage, setSelectedQuestion, tagsArray)}

                {sort === "Active" &&
                    renderActiveQuestions(questionsArray, answersArray, setCurrentPage, setSelectedQuestion, tagsArray)}
                {sort === "Unanswered" &&
                    renderUnansweredQuestions(questionsArray, setCurrentPage, setSelectedQuestion, tagsArray)}
                {sort === "Search" &&
                    renderSearchResults(
                        questionsArray,
                        setCurrentPage,
                        setSelectedQuestion,
                        searchResultsQuestionArrayRef,
                        tagsArray
                    )}
            </div>
        </div>
    );
}

export default QuestionsPage;
