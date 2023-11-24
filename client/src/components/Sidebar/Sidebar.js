import React from "react";
import "./Sidebar.css";

export default function Sidebar({ currentPage, setCurrentPage }) {
    const loadQuestionsPage = () => {
        setCurrentPage("questionsPage");
    };

    const loadTagsPage = () => {
        setCurrentPage("tagsPage");
    };

    return (
        <div className="sidebar">
            <div className="sidebarButtons">
                <button
                    type="button"
                    className="sidebarButton"
                    id="questionsButton"
                    onClick={loadQuestionsPage}
                >
                    Questions
                </button>
                <button
                    type="button"
                    className="sidebarButton"
                    id="tagsButton"
                    onClick={loadTagsPage}
                >
                    Tags
                </button>
            </div>
        </div>
    );
}
