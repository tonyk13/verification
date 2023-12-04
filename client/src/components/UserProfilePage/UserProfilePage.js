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

//USERS QUESTIONS CONTENT
function UserQuestionBox({ 
    qid,
    setCurrentPage,
    EditQuestionPage,
    setDataBaseUpdateTrigger,
    tags,
    toggleEditQuestionPage,
    seteqTitle,
    seteqSummary,
    seteqText,
    seteqTags,
    seteqid
}) {
    const [questionData, setQuestionData] = useState('');
    useEffect (() => {
        async function getQuestionData(qid) {
            try {
                const responseQuestionData = await axios.get(`http://localhost:8000/api/questions/${qid}`);
                setQuestionData(responseQuestionData.data);
            } catch (error) {
                console.log(error)
            }
        }
        getQuestionData(qid);
    }, []);

    async function getQuestionDataTags(qdTag) {
        try{
            const qdTagResponse = await axios.get(`http://localhost:8000/api/tags/${qdTag}`);
            return qdTagResponse.data.name;
        } catch (error) {
            console.log(error);
        }
    }
   
    const handleQuestionClick = async (questionName) => {
        seteqTitle(questionData.title);
        seteqSummary(questionData.summary);
        seteqText(questionData.text);
        seteqid(qid);
        const questionDataTagsArray = [];
        for (const qdTag of questionData.tags) {
            const tag = getQuestionDataTags(qdTag);
            questionDataTagsArray.push(tag);
          }
        
          try {
            const qdTagsArrayResolved = await Promise.all(questionDataTagsArray);
            seteqTags(qdTagsArrayResolved);
            toggleEditQuestionPage(true);
          } catch (error) {
            console.log(error);
          }
    };
   

    return (
        <div class="userQuestionBox" onClick={() => handleQuestionClick(questionData.title)}>
            <div class="userQuestionTitle">
                {questionData.title}
            </div>
            <div class="userQuestionSummary">
                {questionData.summary}
            </div>
        </div>        
    )
}

function renderUserQuestions( 
    userQuestions,
    setCurrentPage,
    EditQuestionPage,
    setDataBaseUpdateTrigger,
    tags,
    toggleEditQuestionPage,
    seteqTitle,
    seteqSummary,
    seteqText,
    seteqTags,
    seteqid
) {
    return userQuestions.map((question) => (
        <UserQuestionBox
            key={question} 
            qid={question}
            setCurrentPage={setCurrentPage}
            EditQuestionPage={EditQuestionPage}
            setDataBaseUpdateTrigger={setDataBaseUpdateTrigger}
            tags={tags}
            toggleEditQuestionPage={toggleEditQuestionPage}
            seteqTitle={seteqTitle}
            seteqSummary={seteqSummary}
            seteqText={seteqText}
            seteqTags={seteqTags}
            seteqid={seteqid}
        />
    ));

}


//USERS TAG CONTENT
function TagBox({ 
    tid,
    setCurrentPage,
    setSearchTrigger,
    tagsAndCounts,
    tagsAndEditable
}) {
    const [tagData, setTagData] = useState('');

    useEffect(() => {
        async function getTagData(tid) {
            try {
                const response = await axios.get(`http://localhost:8000/api/tags/${tid}`);
                setTagData(response.data);
            } catch (error) {
                console.error('Error fetching tag data:', error);
            }
        }

        getTagData(tid);
    }, []);

    const handleTagClick = (tagName) => {
        setSearchTrigger(tagName)
        setCurrentPage("singleTagPage")
    };
    


    //EDITING FUNCTIONALITY

    const [tagEditing, setTagEditing] = useState(false);
    const [editedTagName, setEditedTagName] = useState('');
    const handleTagEditClick = () => {
        if(!tagsAndEditable[tid]) {
            window.alert('This tag cannot be edited since it is being used by other users')
        } else {
            setTagEditing(true);
            setEditedTagName(tagData.name);
        }
    }

    const handleInputChange = (e) => {
        setEditedTagName(e.target.value);
    };

    const handleSaveEdit = () => {
        //insert axios
        setTagEditing(false);
    };

    const handleTagDeleteClick = () => {
        if(!tagsAndEditable[tid]) {
            window.alert('This tag cannot be deleted since it is being used by other users')
        }
         //insert axios
        
    }

    return (
        <div  className="tag">
            <div className="tagName">
                {tagEditing ? (
                        <input
                            type="text"
                            value={editedTagName}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <span onClick={() => handleTagClick(tagData.name)}>
                            {tagData.name}
                        </span>
                    )}
                <div
                    className="questionCount"
                    style={{ color: "black" }}
                >
                    {tagsAndCounts[tid] === 1
                        ? `${tagsAndCounts[tid]} question`
                        : `${tagsAndCounts[tid]} questions`}
                </div>
                <button onClick={tagEditing ? handleSaveEdit : handleTagEditClick}>
                    {tagEditing ? 'Save' : 'Edit'}
                </button>
                <button onClick={handleTagDeleteClick}>
                    Delete
                </button>
            </div>
        </div>
    );
}

function renderUserTags(
    userTags,
    setCurrentPage,
    setSearchTrigger,
    tagsAndCounts,
    tagsAndEditable
) {
    return userTags.map((tag) => (
        <TagBox 
            key={tag} 
            tid={tag}
            setCurrentPage={setCurrentPage}
            setSearchTrigger={setSearchTrigger}
            tagsAndCounts={tagsAndCounts}
            tagsAndEditable={tagsAndEditable}
        />
    ));
}

export default function UserProfilePage({ 
    isGuest, 
    setCurrentPage,
    setSearchTrigger,
    EditQuestionPage,
    setDataBaseUpdateTrigger,
    tags
}) { 

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
    const [userReputation, setUserReputation] = useState('');
    const [username, setUsername] = useState('');
    const [userDateCreated, setUserDateCreated] = useState('');
    const [userQuestions, setUserQuestions] = useState('');
    const [userTags, setUserTags] = useState('');
    const [userAnswers, setUserAnswers] = useState('');
    const [questions, setQuestions] = useState('');



    //USER DATA
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
                    const responseUserQuestions = await axios.get(`http://localhost:8000/api/getUserQuestions/${userid}`);
                    setUserQuestions(responseUserQuestions.data.userQuestions)
                } catch (error) {
                    console.error('Error fetching user questions:', error);
                }
                try {
                    const userTags = await axios.get(`http://localhost:8000/api/getUserTags/${userid}`);
                    setUserTags(userTags.data.userTags)
                } catch (error) {
                    console.error('Error fetching user questions:', error);
                }
                try {
                    const allQuestions = await axios.get(`http://localhost:8000/api/questions/`);
                    setQuestions(allQuestions.data)
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
    const tagsAndCounts = {};
    const tagsAndEditable = {};
    
    for (const ut of userTags) {
        tagsAndEditable[ut] = true; 
    
        for (const q of questions) {
            for (const qt of q.tags) {
                if (ut === qt) {
                    tagsAndCounts[ut] = (tagsAndCounts[ut] || 0) + 1;
                    if (q.asked_by !== username) {
                        tagsAndEditable[ut] = false; 
                    }
                }
            }
        }
    }

    //Edit Question Page Functionality
    const [editQuestionPage, toggleEditQuestionPage] = useState(false);
    const [eqTitle, seteqTitle] = useState('');
    const [eqSummary, seteqSummary] = useState('');    
    const [eqText, seteqText] = useState('');    
    const [eqTags, seteqTags] = useState('');
    const [eqid, seteqid] = useState('');
    

    const [userDisplay, setUserDisplay] = useState("userQuestions");
    
    //Display Users Questions
    const displayUserQuestions = () => { 
        setUserDisplay("userQuestions");
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
                *Must Be Logged In to Access User Profile Page
              </div>
            </div>
          ) : (
            <div>
              {editQuestionPage ? (
                <div> 
                    <EditQuestionPage
                          setCurrentPage={setCurrentPage}
                          setDataBaseUpdateTrigger={setDataBaseUpdateTrigger}
                          tags={tags}
                          eqTitle={eqTitle}
                          eqSummary={eqSummary}
                          eqText={eqText}
                          eqTags={eqTags}
                          eqid={eqid}
                          toggleEditQuestionPage={toggleEditQuestionPage}
                    />
                </div>
              ) : (
                <div>
                  <div id="userProfilePageHeader">
                    <div id="upphRow1">
                      User:
                      <div className="userData">
                        {username}
                      </div>
                    </div>
                    <div id="upphRow2">
                      Reputation:
                      <div className="userData">
                        {userReputation}
                      </div>
                    </div>
                    <div id="upphRow3">
                      Joined:
                      <div className="userData">
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
                    <br />
                    {userDisplay === "userQuestions" && (
                      <div>
                        My Questions: {userQuestions.length}{" "}
                        {userQuestions.length === 1 ? "Question" : "Questions"}
                        <br />
                        Click on a Question to Modify/Delete
                      </div>
                    )}
      
                    {userDisplay === "userTags" && (
                      <div>
                        My Tags: {userTags.length}{" "}
                        {userTags.length === 1 ? "Tag" : "Tags"}
                        <br />
                        Click on a Tag to Modify/Delete
                      </div>
                    )}
      
                    {userDisplay === "userAnswers" && (
                      <div>
                        My Answers
                      </div>
                    )}
                  </div>
                  <div id="userProfileContentWrapper">
                    {userDisplay === "userQuestions" && userQuestions && (
                      <div id="userQuestionsContent">
                        {renderUserQuestions(
                          userQuestions,
                          setCurrentPage,
                          EditQuestionPage,
                          setDataBaseUpdateTrigger,
                          tags,
                          toggleEditQuestionPage,
                          seteqTitle,
                          seteqSummary,
                          seteqText,
                          seteqTags,
                          seteqid
                        )}
                      </div>
                    )}
                    {userDisplay === "userTags" && userTags && (
                      <div id="userTagsContent">
                        {renderUserTags(
                          userTags,
                          setCurrentPage,
                          setSearchTrigger,
                          tagsAndCounts,
                          tagsAndEditable
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      );
}


