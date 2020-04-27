import React, { useState, useContext } from "react";
import "./App.css";
import { withRouter } from "react-router";
import { GlobalStateContext } from "./Context";
import Header from "./Header";

function UpdateCourse(props) {
  const context = useContext(GlobalStateContext);
  const loggedInUser = context.authenticateduser.get;
  const { state = {} } = props.location; // set state to blank if props.location is null
  const { course = {} } = state; // set course to blank if state is null
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description);
  const [estimatedTime, setEstimatedTime] = useState(course.estimatedTime);
  const [materialsNeeded, setMaterialsNeeded] = useState(
    course.materialsNeeded
  );
  const [errorMessage, setErrorMessage] = useState([]);

  const UpdatingCourse = () => {
    // if course is  an empty object
    if (Object.keys(course).length === 0) {
      setErrorMessage(["Course not found"]);
      return;
    }
    const updateData = {
      title: title,
      description: description,
      estimatedTime: estimatedTime,
      materialsNeeded: materialsNeeded,
      userId: course.User.id,
    };

    const email = loggedInUser.email;
    const password = loggedInUser.password;

    let base64 = require("base-64");
    let url = "http://localhost:5000/api/courses/update/" + course.id;
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append(
      "Authorization",
      "Basic " + base64.encode(email + ":" + password)
    );

    fetch(url, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(updateData),
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
        <h1>Update Course</h1>
        {errorMessage.length > 0 &&
          errorMessage.map((error, index) => (
            <p key={index} style={{ color: "red" }}>
              {" "}
              {error}{" "}
            </p>
          ))}
        <div>
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
              <button className="button" type="button" onClick={UpdatingCourse}>
                Update Course
              </button>
              <button
                className="button button-secondary"
                //redirect to course details if user clicks on cancel
                // with state containing the information of the course
                // to be passed to CourseDetails as props
                onClick={() =>
                  props.history.push({
                    pathname: "/courses/" + course.id,
                    state: {
                      course: course,
                    },
                  })
                }
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

export default withRouter(UpdateCourse);
