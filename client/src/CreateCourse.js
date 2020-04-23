import React, { useState, useContext } from "react";
import { withRouter } from "react-router";
import Header from "./Header";
import "./App.css";
import { GlobalStateContext } from "./Context";

function CreateCourse(props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [materialsNeeded, setMaterialsNeeded] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const context = useContext(GlobalStateContext);
  const loggedInUser = context.authenticateduser.get;

  const AddCourse = () => {
    const course = {
      title: title,
      description: description,
      estimatedTime: estimatedTime,
      materialsNeeded: materialsNeeded,
      userId: loggedInUser.userId, // add a book belonging to that user
    };

    const email = loggedInUser.email;
    const password = loggedInUser.password;
    let base64 = require("base-64");
    let url = "http://localhost:5000/api/courses/create";
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append(
      "Authorization",
      "Basic " + base64.encode(email + ":" + password)
    );

    fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(course),
    })
      .then((response) => response.json())
      .then((json) => {
        // if the course Id could be found from the db
        if (json.id) {
          props.history.push("/courses");
        } else {
          setErrorMessage(json.errors);
        }
      });
  };

  return (
    <>
      <Header />
      <div className="bounds course--detail">
        <h1>Create Course</h1>
        <div>
          <div>
            <div className="validation-errors">
              {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            </div>
          </div>
          <form>
            <div className="grid-66">
              <div className="course--header">
                <h4 className="course--label">Course</h4>
                <div>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    className="input-title course--title--input"
                    placeholder="Course title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>
              <div className="course--description">
                <div>
                  <textarea
                    id="description"
                    name="description"
                    className=""
                    placeholder="Course description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="grid-25 grid-right">
              <div className="course--stats">
                <ul className="course--stats--list">
                  <li className="course--stats--list--item">
                    <h4>Estimated Time</h4>
                    <div>
                      <input
                        id="estimatedTime"
                        name="estimatedTime"
                        type="text"
                        className="course--time--input"
                        placeholder="Hours"
                        value={estimatedTime}
                        onChange={(e) => setEstimatedTime(e.target.value)}
                      />
                    </div>
                  </li>
                  <li className="course--stats--list--item">
                    <h4>Materials Needed</h4>
                    <div>
                      <textarea
                        id="materialsNeeded"
                        name="materialsNeeded"
                        className=""
                        placeholder="List materials..."
                        value={materialsNeeded}
                        onChange={(e) => setMaterialsNeeded(e.target.value)}
                      ></textarea>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="grid-100 pad-bottom">
              <button className="button" type="button" onClick={AddCourse}>
                Create Course
              </button>
              <button
                className="button button-secondary"
                //onClick="event.preventDefault(); location.href='index.html';"
                onClick={() => props.history.push("/courses")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// export as WithRouter to access props
export default withRouter(CreateCourse);
