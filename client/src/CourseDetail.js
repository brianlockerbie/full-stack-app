import React, { useState, useContext } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import Header from "./Header";
import "./App.css";
import ReactMarkdown from "react-markdown";
import { GlobalStateContext } from "./Context";

// No need to use useEffect here,
// Because useEffect will render after the first render
// pass course details using props from Main.js
function CourseDetail(props) {
  const context = useContext(GlobalStateContext);
  const loggedInUser = context.authenticateduser.get;
  const { state = {} } = props.location; // set state to blank if props.location is nulll
  const { course = {} } = state; // set course to blank if state is nulll
  const { User: user = {} } = course; //course.User: the author of the book we got from backend,
  // set user to blank if User is null
  const [errorMessage, setErrorMessage] = useState("");

  console.log(course);
  console.log(loggedInUser);

  const DeletingCourse = () => {
    // if course is an empty object
    if (Object.keys(course).length === 0) {
      setErrorMessage("Course not found");
      return;
    }

    const email = loggedInUser.email;
    const password = loggedInUser.password;

    let base64 = require("base-64");
    let url = "http://localhost:5000/api/courses/delete/" + course.id;
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append(
      "Authorization",
      "Basic " + base64.encode(email + ":" + password)
    );

    fetch(url, {
      method: "DELETE",
      headers: headers,
    })
      .then((response) => response.json())
      .then((json) => {
        // if response returned successmessage from backend
        if (json.successmessage) {
          props.history.push("/courses");
        } else {
          setErrorMessage(json.message);
        }
      });
  };

  return (
    <>
      <Header />
      <div>
        <div className="actions--bar">
          <div className="bounds">
            <div className="grid-100">
              {" "}
              {/* if the course the user picked belongs to the user who logged in, then display update, delete */}
              {loggedInUser.userId === course.userId && (
                <span>
                  <Link
                    className="button"
                    to={{
                      pathname: "/courses/" + course.id + "/update",
                      state: {
                        course: course,
                      },
                    }}
                  >
                    Update Course
                  </Link>
                  <button
                    className="button"
                    type="button"
                    onClick={DeletingCourse}
                  >
                    Delete Course
                  </button>
                </span>
              )}
              <Link className="button button-secondary" to="/courses">
                Return to List
              </Link>
            </div>
          </div>
        </div>
        <div className="bounds course--detail">
          <div className="grid-66">
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <div className="course--header">
              <h4 className="course--label">Course</h4>
              <h3 className="course--title">{course.title}</h3>
              <p>
                By {user.firstName} {user.lastName} {/*author of the book*/}
              </p>
            </div>
            <div className="course--description">
              <ReactMarkdown source={course.description} />
            </div>
          </div>
          <div className="grid-25 grid-right">
            <div className="course--stats">
              <ul className="course--stats--list">
                <li className="course--stats--list--item">
                  <h4>Estimated Time</h4>
                  <h3>{course.estimatedTime}</h3>
                </li>
                <li className="course--stats--list--item">
                  <h4>Materials Needed</h4>
                  <ul>
                    {course.materialsNeeded &&
                      course.materialsNeeded.split("*").map(
                        (item, index) =>
                          item && (
                            <li key={index}>
                              <ReactMarkdown source={item}></ReactMarkdown>
                            </li>
                          )
                      )}
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default withRouter(CourseDetail);
