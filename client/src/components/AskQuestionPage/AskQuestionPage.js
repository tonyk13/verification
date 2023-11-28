import React, { useState, useEffect } from "react";
import "./AskQuestionPage.css";
import Cookie from "js-cookie";

export default function AskQuestionPage({ 
    setCurrentPage, 
    setDataBaseUpdateTrigger, 
    tags
}) {
    //PQ Title Handler
    const [pqNE1, setpqNE1] = useState(true);
    const [pqTitleText, setpqTitleText] = useState('');
    const handlepqTiteTextarea = (event) => {
        const updatepqTitleText = event.target.value.replace(/\n/g, '');
        setpqTitleText(updatepqTitleText);
    
        if (updatepqTitleText.replace(/\s/g, '') !== "") {
            setpqNE1(false);
        } else {
            setpqNE1(true);
        }
    };

    //PQ Summary Handler
    const [pqNE2, setpqNE2] = useState(true);
    const [pqSummaryText, setpqSummaryText] = useState('');
    const handlepqSummaryTextarea = (event) => {
        const updatepqSummaryText = event.target.value.replace(/\n/g, '');
        setpqSummaryText(updatepqSummaryText);
    
        if (updatepqSummaryText.replace(/\s/g, '') !== "") {
            setpqNE2(false);
        } else {
            setpqNE2(true);
        }
    };

    //PQ Text Handler
    const [pqNE3, setpqNE3] = useState(true);
    const [pqHLE1, setpqHLE1] = useState(false);
    const handlepqQuestionTextarea = (event) => {
        const pqQuestionText = event.target.value;
        if (pqQuestionText.replace(/[\s\n]/g, '') !== "") {
            setpqNE3(false);
        } else {
            setpqNE3(true);
        }

        //HyperLink Checking
        const hyperLinkRegex = /\[([^\]]*)\]\(([^)]*)\)/g;
        const hyperlinkMatches = [...pqQuestionText.matchAll(hyperLinkRegex)];
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
        setpqHLE1(hasInvalidHyperlink);
    };


    
    //PQ Tags Handler
    const [pqNE4, setpqNE4] = useState(true);
    const [pqTE1, setpqTE1] = useState(false);
    const [pqTagsText ,setpqTagsText] = useState('');
    const [pqTagStringArray, setpqTagStringArray] = useState([]);

    function askQuestionValidTagsCheck(pqTagStringArray) {
        let ret = true;
        for (const tag of pqTagStringArray) {
            if (tag.length > 10 || pqTagStringArray.length > 5) {
                ret = false;
            }
        }
        return ret;
    }

    //Returns Array of tags, adds new tags if not in already and returns array of questions tag tids
    const [tagsArray, setTagsArray] = useState([]);
    useEffect(() => {
      if (tags !== null) {
        setTagsArray(tags);
      }
    }, [tags]);
    
    async function checkQuestionTags(tagStringArray) {
        let returnArray = [];
        for (const newTag of tagStringArray) {
            let addNewTag = true;
            for (const tag of tagsArray) {
                if (tag.name === newTag) {
                    addNewTag = false;
                    returnArray.push(tag._id);
                }
            }
            if (addNewTag) {
                let postTag = {
                    name: newTag
                };
                let postTagId = 0;
                try {
                    const response = await fetch('http://localhost:8000/api/tags', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(postTag),
                    });
                    const data = await response.json();
                    postTagId = data._id;
                    } catch (error) {
                        console.error('Error:', error);
                }
                returnArray.push(postTagId);
            }
        }
        return returnArray;
    }

    const handlepqTagsTextarea = (event) => {
        const updatepqTagsText = event.target.value.replace(/\n/g, '');
        setpqTagsText(updatepqTagsText);
        setpqTagStringArray(pqTagsText.toLowerCase().trim().split(/\s+/));

        if (updatepqTagsText.replace(/\s/g, '') !== "") {
            setpqNE4(false);
        } else {
            setpqNE4(true);
        }

        if (!pqNE3) {
            if (askQuestionValidTagsCheck(pqTagStringArray)) {
                setpqTE1(false);
            } else {
                setpqTE1(true);
            }
        }
    };













    // Post Question Button
    const handlePostQuestionButton = async (event) => {
        try {
        event.preventDefault();
    
        if (!pqNE1 && !pqNE2 && !pqHLE1 && !pqNE3 && !pqTE1 && !pqNE4) {
            let pqTagArray = await checkQuestionTags(pqTagStringArray);
            const pqUsername = Cookie.get("auth");
    
            // Post Question
            let postQuestion = {
                title: document.getElementById("pqTitle").value,
                summary: document.getElementById("pqSummary").value,
                text: document.getElementById("pqText").value,
                tags: pqTagArray,
                answers: new Array(0),
                asked_by: pqUsername,
                ask_date_time: new Date(),
                views: 0,
            };
    
            // Fetch
            const response = await fetch('http://localhost:8000/api/questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postQuestion),
            });
    
            const data = await response.json();
    
            setCurrentPage("questionsPage");
    
            // Update trigger
            await handleUpdateTrigger();
        }
        } catch (error) {
        console.error('Error:', error);
        }
    };
    
    // Updated handleUpdateTrigger function
    const handleUpdateTrigger = async () => {
        return new Promise((resolve) => {
        setDataBaseUpdateTrigger((prev) => {
            setTimeout(() => {
            resolve(); // Resolve the promise after the timeout
            }, 1000);
            return prev + 1;
        });
        });
    };
  
    return (
        <div id="askQuestionPage">
            <form id="askQuestionForm">
                <div>
                    <label className="askQuestionLabels">
                        Question Title*
                    </label>
                    <label className="askQuestionSubLabels">
                        Limit title to 50 characters or less
                    </label>
                    <textarea
                        id="pqTitle"
                        maxLength="50"
                        onChange={handlepqTiteTextarea}
                        value={pqTitleText}
                    ></textarea>
                    <label
                        id="pqNE1"
                        className="pqNullError"
                        style={{ display: pqNE1 ? "block" : "none" }}
                    >
                        Please fill in a value
                    </label>
                </div>

                <div> 
                    <label className="askQuestionLabels">
                        Question Summary*
                    </label>
                    <label className="askQuestionSubLabels">
                        Limit title to 140 characters or less
                    </label>
                    <textarea
                        id="pqSummary"
                        maxLength="140"
                        onChange={handlepqSummaryTextarea}
                        value={pqSummaryText}
                    ></textarea>
                    <label
                        id="pqNE2"
                        className="pqNullError"
                        style={{ display: pqNE2 ? "block" : "none" }}
                    >
                        Please fill in a value
                    </label>
                </div>

                <div id="askQuestionTextDiv">
                    <label className="askQuestionLabels">
                        Question Text*
                    </label>
                    <label className="askQuestionSubLabels">
                        Add details
                    </label>
                    <textarea
                        id="pqText"
                        onChange={handlepqQuestionTextarea}
                    ></textarea>
                    <label
                        id="pqNE3"
                        className="pqNullError"
                        style={{ display: pqNE3 ? "block" : "none" }}
                    >
                        Please fill in a value
                    </label>
                    <label
                        id="pqHLE1"
                        className="pqNullError"
                        style={{ display: pqHLE1 ? "block" : "none" }}
                    >
                        Hyperlink must begin with https:// or http://
                    </label>
                </div>

                <div>
                    <label className="askQuestionLabels">
                        Tags*
                    </label>
                    <label className="askQuestionSubLabels">
                        Add keywords separated by whitespace
                    </label>
                    <textarea
                        id="pqTags"
                        onChange={handlepqTagsTextarea}
                        value={pqTagsText}
                    ></textarea>
                    <label
                        id="pqNE4"
                        className="pqNullError"
                        style={{ display: pqNE4 ? "block" : "none" }}
                    >
                        Please fill in a value
                    </label>
                    <label
                        id="pqTE1"
                        className="pqNullError"
                        style={{ display: pqTE1 ? "block" : "none" }}
                    >
                        Tags must be under 10 characters and a maximum of 5 tags
                    </label>
                </div>

                <span id="askQuestionLastLine">
                    <input
                        type="submit"
                        id="postQuestionButton"
                        value="Post Question"
                        className="askQuestionButton"
                        onClick={handlePostQuestionButton}
                    />
                    <span id="askQuestionErrors">
                        *Indicates Mandatory fields
                    </span>
                </span>
            </form>
        </div>
    );
}
