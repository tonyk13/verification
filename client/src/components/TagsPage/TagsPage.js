import React, { useEffect, useState } from "react";
import "./TagsPage.css";

function TagsPage({
    questions,
    tags,
    setCurrentPage,
    currentSearch,
    setSearch,
    databaseUpdateTrigger,
    setTagClicked,
}) {
    const [tagsArray, setTagsArray] = useState([]);
    useEffect(() => {
        if (tags !== null) {
            setTagsArray(tags);
        }
    }, [tags, databaseUpdateTrigger]);

    const [questionsArray, setQuestionsArray] = useState([]);
    useEffect(() => {
        if (questions !== null) {
            setQuestionsArray(questions);
        }
    }, [questions, databaseUpdateTrigger]);

    return (
        <div>
            <TagsPageHeader
                tagsArray={tagsArray}
                setCurrentPage={setCurrentPage}
            />
            <TagsContainer
                questionsArray={questionsArray}
                tagsArray={tagsArray}
                currentSearch={currentSearch}
                setSearch={setSearch}
                setCurrentPage={setCurrentPage}
                setTagClicked={setTagClicked}
            />
        </div>
    );
}

function TagsPageHeader({ tagsArray, setCurrentPage }) {
    const loadAskQuestionPage = () => {
        setCurrentPage("askQuestionPage");
    };

    return (
        <div className="tagsPageHeader">
            <TagsLength tagsArray={tagsArray} />
            <div>All Tags</div>
            <button
                type="button"
                className="askQuestionButton"
                onClick={loadAskQuestionPage}
            >
                Ask Question
            </button>
        </div>
    );
}

function TagsLength({ tagsArray }) {
    const uniqueTags = Array.from(
        new Set(tagsArray.map((obj) => obj.name))
    ).map((name) => tagsArray.find((obj) => obj.name === name));

    const tagsLength = uniqueTags.length;

    return (
        <div>
            {tagsLength} {tagsLength === 1 ? "Tag" : "Tags"}
        </div>
    );
}

function TagsContainer({
    questionsArray,
    tagsArray,
    currentSearch,
    setSearch,
    setCurrentPage,
    setTagClicked,
}) {
    const [tagsAndCounts, setTagsAndCounts] = useState({});
    setTagClicked(false);
    useEffect(() => {
        const updatedTagsAndCounts = questionsArray
            .map((question) =>
                question.tags.map(
                    (tagId) => tagsArray.find((tag) => tag._id === tagId)?.name
                )
            )
            .flat()
            .reduce((count, tagName) => {
                count[tagName] = (count[tagName] || 0) + 1;
                return count;
            }, {});
        setTagsAndCounts(updatedTagsAndCounts);
    }, [questionsArray, tagsArray]);

    //Fix timing on handling Click
    const handleTagClick = (tagName) => {
        setTagClicked(true);
        const formattedTag = `[${tagName}]`;
        if (currentSearch === formattedTag) {
            setSearch("");
        }
        setCurrentPage("questionsPage");
        setTimeout(() => {
            setSearch(formattedTag);
        }, "10");
    };

    return (
        <div id="tagsContainer">
            {Object.keys(tagsAndCounts).map((tagId) => {
                const count = tagsAndCounts[tagId];
                return (
                    <div className="tag" id={`tag-${tagId}`} key={tagId}>
                        <div className="tagName">
                            <span onClick={() => handleTagClick(tagId)}>
                                {tagId}
                            </span>
                        </div>
                        <div
                            className="questionCount"
                            style={{ color: "black" }}
                        >
                            {count === 1
                                ? `${count} question`
                                : `${count} questions`}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export { TagsPage, TagsPageHeader, TagsLength, TagsContainer };
