import React, { useState, useEffect } from "react";
import Cookie from "js-cookie";
import axios from "axios";
import "./UserProfilePage.css";

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
                                Member for: 
                                <div class="userData">
                                    {formatDate(userDateCreated)}
                                </div> 
                            </div>
                            <div id="upphRow4">
                                <div id="userProfileStatusButtons">
                                    <button>My Questions</button>
                                    <button>My Tags</button>
                                    <button>My Answers</button>
                                </div>
                            </div>
                        </div>








                    </div>
            )}      
        </div>
    );
}


