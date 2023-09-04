import React, { useState, useEffect, useRef } from "react";
import Home from "./Components/Pages/Home";
import classes from "./App.module.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./Components/Header/Header";
import View from "./Components/Pages/View";
import { NavLink } from "react-router-dom";
import AllFeeds from "./Components/Pages/AllFeeds";
import AddUrl from "./Components/Pages/AddUrl";
import Card from "./Components/Pages/Card";

function App() {
  const CurrentUrl =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_URL_DEVELOPMENT
      : process.env.REACT_APP_URL_PRODUCTION;
  const serverUrl =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_PRODUCTION_SERVER_URL
      : process.env.REACT_APP_DEVELOPMENT_SERVER_URL;

  const inputRef = useRef();
  const [showForm, setShowForm] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  const [updateId, setUpdateId] = useState(null);
  const [readUrls, setReadUrls] = useState([]);
  const [showSpinner, setShowSpinner] = useState(true);
  const [requestValue, setRequestValue] = useState(60000);

  useEffect(() => {
    if (window.sessionStorage.getItem("requestValue")) {
      setRequestValue(
        JSON.parse(window.sessionStorage.getItem("requestValue"))
      );
    }
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem("requestValue", requestValue);
  }, [requestValue]);

  let urlList = <h2>No Urls Found</h2>;

  const getRequestValue = (value) => {
    setRequestValue(value);
  };

  useEffect(() => {
    readUrlHandler();
  }, []);

  //UPDATE
  const getNewInput = () => {
    setUrlValue(inputRef.current.value);
  };

  const addChangedUrlHandler = (urls) => {
    //shows a form with input field and a button
    setShowForm(true);
    setUpdateId({ id: urls.id, url: urls.url, name: urls.name });
  };

  const formButtonClickFunction = () => {
    if (urlValue.includes("/rss") && urlValue.length > 0) {
      let oldurlsObject = JSON.parse(localStorage.getItem("urlsData"));
      let newurlsObject = {
        ...oldurlsObject,
        [updateId.id]: {
          addedUrl: urlValue,
          uuid: updateId.id,
          addedName: updateId.name,
        },
      };
      localStorage.setItem("urlsData", JSON.stringify(newurlsObject));

      readUrlHandler();
      setShowForm(false);
    } else {
      alert("Invalid Feed Url");
      setUrlValue("");
    }
  };

  //DETETE!!!!
  const deleteUrlHandler = (urls) => {
    let oldurlsToDel = JSON.parse(localStorage.getItem("urlsData"));

    delete oldurlsToDel[`${urls.id}`];

    localStorage.setItem("urlsData", JSON.stringify(oldurlsToDel));
    readUrlHandler();
    setShowForm(false);
  };

  // READ !!!!!!!
  const readUrlHandler = () => {
    const loadedUrls = [];

    let data = JSON.parse(localStorage.getItem("urlsData"));

    if (data != null) {
      for (let key in data) {
        loadedUrls.push({
          id: key,
          name: data[key].addedName,
          url: data[key].addedUrl,
        });
      }
    }
    setReadUrls(loadedUrls);
    setShowSpinner(false);
  };
  let intervalId;

  const getUrlValueHandler = (value) => {
    if (value) {
      setReadUrls((prevUrls) => prevUrls.concat(value));

      fetch(`${serverUrl}?name=${encodeURIComponent(value?.addedUrl)}`)
        .then((response) => response.json())
        .then((feed) => {
          if (feed !== 329) {
            ////////////////////////////////////Notification////////////////////////////////
            if (!("Notification" in window)) {
              alert("This browser does not support desktop notification");
            }

            // Let's check if the user is okay to get some notification
            else if (Notification.permission === "granted") {
              // If it's okay let's create a notification
              var notification = new Notification(feed.items[0].title, {
                body: `${CurrentUrl}view/${value?.id}/${null}`,
              });
            }

            // Otherwise, we need to ask the user for permission
            // Note, Chrome does not implement the permission static property
            // So we have to check for NOT 'denied' instead of 'default'
            else if (Notification.permission !== "denied") {
              Notification.requestPermission(function (permission) {
                // Whatever the user answers, we make sure we store the information
                if (!("permission" in Notification)) {
                  Notification.permission = permission;
                }

                // If the user is okay, let's create a notification
                if (permission === "granted") {
                  var notification = new Notification(feed.items[0].title, {
                    body: `${CurrentUrl}view/${value?.id}/${null}`,
                  });
                }
              });
            } else {
              alert(`Permission is ${Notification.permission}`);
            }

            // At last, if the user already denied any notification, and you
            // want to be respectful there is no need to bother him any more.
            ////////////////////////////////////Notification////////////////////////////////
          } else {
            alert("There was an Error please wait for 2 mins");
            setTimeout(getUrlValueHandler, 120000);
          }
        });
    }

    readUrls.forEach((item) => {
      let notiData = [];
      intervalId = setInterval(function () {
        if (item) {
          fetch(`${serverUrl}?name=${encodeURIComponent(item.url)}`)
            .then((response) => response.json())
            .then((feed) => {
              if (feed !== 329) {
                if (notiData.length === 0) {
                  notiData.push(feed.items[0].title);
                }

                if (feed.items[0].title === notiData[0]) {
                  return;
                } else {
                  let feedPositon = feed.items.findIndex(
                    (e) => e.title === notiData[0]
                  );
                  notiData[0] = feed.items[0].title;

                  if (!("Notification" in window)) {
                    alert("This browser does not support desktop notification");
                  }

                  // Let's check if the user is okay to get some notification
                  else if (
                    Notification.permission === "granted" &&
                    feedPositon > 0
                  ) {
                    // If it's okay let's create a notification
                    var notification = new Notification(
                      item.name + "  :  (" + feedPositon + ") New Jobs ",
                      { body: `${CurrentUrl}view/${item.id}/${feedPositon}` }
                    );
                  }
                  //feed.items[0].link,dir:'rtl'
                  // Otherwise, we need to ask the user for permission
                  // Note, Chrome does not implement the permission static property
                  // So we have to check for NOT 'denied' instead of 'default'
                  else if (Notification.permission !== "denied") {
                    Notification.requestPermission(function (permission) {
                      // Whatever the user answers, we make sure we store the information
                      if (!("permission" in Notification)) {
                        Notification.permission = permission;
                      }

                      // If the user is okay, let's create a notification
                      if (permission === "granted" && feedPositon > 0) {
                        var notification = new Notification(
                          item.name + "  :  (" + feedPositon + ") New Jobs ",
                          {
                            body: `${CurrentUrl}view/${item.id}/${feedPositon}`,
                          }
                        );
                      }
                    });
                  } else {
                    alert(`Permission is ${Notification.permission}`);
                  }
                }

                // At last, if the user already denied any notification, and you
                // want to be respectful there is no need to bother him any more.
                ////////////////////////////////////Notification////////////////////////////////
              } else {
                alert("There was an error please wait 2 minutes");
                clearInterval(intervalId);
                setTimeout(getUrlValueHandler, 120000);
              }
            });
        }
      }, requestValue);
    });
  };

  if (readUrls.length > 0) {
    getUrlValueHandler();
  }

  if (readUrls.length > 0) {
    urlList = (
      <ul className={classes.card}>
        {readUrls.map((urls) => (
          <li key={urls.id}>
            <span className={classes.name}>{urls.name}</span>
            <span className={classes["card-btn"]}>
              <button onClick={() => addChangedUrlHandler(urls)}>UPDATE</button>
              <button onClick={() => deleteUrlHandler(urls)}>DELETE</button>
            </span>
            <NavLink to={"/view/" + urls.id + "/" + null}>
              <p>View</p>
            </NavLink>
          </li>
        ))}
      </ul>
    );
  }
  let content = urlList;

  return (
    <React.Fragment>
      <div className={classes.app}>
        <Header onRequestValue={getRequestValue} requestValue={requestValue} />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route
            path="/home"
            element={
              <Home
                onUrlValue={getUrlValueHandler}
                onReadUrl={readUrlHandler}
                content={content}
                showForm={showForm}
                showSpinner={showSpinner}
              />
            }
          />
          <Route path="/view/:user" element={<Navigate to="/home" />} />
          <Route
            path="/view/:user/:position"
            element={<View onRequestValue={requestValue} />}
          />
          <Route path="/card" element={<Card readUrls={readUrls} />} />
          <Route
            path="/addurl"
            element={
              <AddUrl
                onUrlValue={getUrlValueHandler}
                onReadUrl={readUrlHandler}
              />
            }
          />
        </Routes>

        {/* <div className={classes.urlList}>{content}</div> */}
        {showForm && (
          <div>
            <input
              ref={inputRef}
              onChange={getNewInput}
              value={urlValue}
            ></input>
            <button onClick={formButtonClickFunction}>Change Url</button>
            <button onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

export default App;
