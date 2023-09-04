import React, { useState } from "react";
import classes from "./Header.module.css";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

const Header = (props) => {
  const getRequestValue = (val) => {
    console.log(val.target.value);
    props.onRequestValue(val.target.value);
  };

  // Initialize a state variable to track whether the class should be applied
  const [isActive, setIsActive] = useState(false);

  // Function to toggle the class when the button is clicked
  const toggleClass = () => {
    setIsActive(!isActive);
  };

  return (
    <React.Fragment>
      <div className={classes.header}>
        <ul className={classes.headerul}>
          <li>
            <NavLink to="/home">Home</NavLink>
          </li>
          <li>
            <NavLink to="/addurl">AddUrl</NavLink>
          </li>
          <li>
            <NavLink to="/card">Card</NavLink>
          </li>
          <li>
            {" "}
            <div>
              <select onChange={getRequestValue} value={props.requestValue}>
                <option value={30000}>30 Seconds</option>
                <option value={60000}>1 minute</option>
                <option value={120000}>2 minutes</option>
                <option value={300000}>5 minutes</option>
              </select>
            </div>
          </li>
        </ul>
      </div>
      <div
        className={isActive ? classes.header_active : classes.header_notactive}
        onClick={toggleClass}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 50 50"
          width="50px"
          height="50px"
        >
          <path d="M 5 8 A 2.0002 2.0002 0 1 0 5 12 L 45 12 A 2.0002 2.0002 0 1 0 45 8 L 5 8 z M 5 23 A 2.0002 2.0002 0 1 0 5 27 L 45 27 A 2.0002 2.0002 0 1 0 45 23 L 5 23 z M 5 38 A 2.0002 2.0002 0 1 0 5 42 L 45 42 A 2.0002 2.0002 0 1 0 45 38 L 5 38 z" />
        </svg>
      </div>
    </React.Fragment>
  );
};

export default Header;

// import React from "react";
// import classes from "./Header.module.css";
// import { NavLink } from "react-router-dom";
// import { Link } from "react-router-dom";

// import React, { useState, useEffect, useRef } from "react";
// import Home from "./Components/Pages/Home";
// import classes from "./App.module.css";
// import { Routes, Route, Navigate } from "react-router-dom";
// import Header from "./Components/Header/Header";
// import View from "./Components/Pages/View";
// import { NavLink } from "react-router-dom";
// import AllFeeds from "./Components/Pages/AllFeeds";
// import AddUrl from "./Components/Pages/AddUrl";
// import Card from "./Components/Pages/Card";

// const Header = (props) => {
//   const getRequestValue = (val) => {
//     console.log(val.target.value);
//     props.onRequestValue(val.target.value);
//   };

//   const CurrentUrl =
//     process.env.NODE_ENV === "development"
//       ? process.env.REACT_APP_URL_DEVELOPMENT
//       : process.env.REACT_APP_URL_PRODUCTION;
//   const serverUrl =
//     process.env.NODE_ENV === "production"
//       ? process.env.REACT_APP_PRODUCTION_SERVER_URL
//       : process.env.REACT_APP_DEVELOPMENT_SERVER_URL;

//   console.log(CurrentUrl);

//   const inputRef = useRef();
//   const [showForm, setShowForm] = useState(false);
//   const [urlValue, setUrlValue] = useState("");
//   const [updateId, setUpdateId] = useState(null);
//   const [readUrls, setReadUrls] = useState([]);
//   const [showSpinner, setShowSpinner] = useState(true);
//   const [requestValue, setRequestValue] = useState(60000);

//   useEffect(() => {
//     if (window.sessionStorage.getItem("requestValue")) {
//       setRequestValue(
//         JSON.parse(window.sessionStorage.getItem("requestValue"))
//       );
//     }
//   }, []);

//   useEffect(() => {
//     window.sessionStorage.setItem("requestValue", requestValue);
//     console.log(requestValue);
//   }, [requestValue]);

//   let urlList = <h2>No Urls Found</h2>;

//   const getRequestValue = (value) => {
//     console.log(value);
//     setRequestValue(value);
//   };

//   useEffect(() => {
//     readUrlHandler();
//   }, []);

//   //UPDATE
//   const getNewInput = () => {
//     setUrlValue(inputRef.current.value);
//   };

//   const addChangedUrlHandler = (urls) => {
//     //shows a form with input field and a button
//     setShowForm(true);
//     setUpdateId({ id: urls.id, url: urls.url, name: urls.name });
//   };

//   const formButtonClickFunction = () => {
//     console.log(urlValue);
//     if (urlValue.includes("/rss") && urlValue.length > 0) {
//       let oldurlsObject = JSON.parse(localStorage.getItem("urlsData"));
//       let newurlsObject = {
//         ...oldurlsObject,
//         [updateId.id]: {
//           addedUrl: urlValue,
//           uuid: updateId.id,
//           addedName: updateId.name,
//         },
//       };
//       localStorage.setItem("urlsData", JSON.stringify(newurlsObject));

//       readUrlHandler();
//       setShowForm(false);
//     } else {
//       alert("Invalid Feed Url");
//       setUrlValue("");
//     }
//   };

//   //DETETE!!!!
//   const deleteUrlHandler = (urls) => {
//     let oldurlsToDel = JSON.parse(localStorage.getItem("urlsData"));

//     delete oldurlsToDel[`${urls.id}`];
//     console.log(oldurlsToDel);
//     localStorage.setItem("urlsData", JSON.stringify(oldurlsToDel));
//     readUrlHandler();
//     setShowForm(false);
//   };

//   // READ !!!!!!!
//   const readUrlHandler = () => {
//     const loadedUrls = [];

//     let data = JSON.parse(localStorage.getItem("urlsData"));
//     console.log(data);
//     if (data != null) {
//       for (let key in data) {
//         loadedUrls.push({
//           id: key,
//           name: data[key].addedName,
//           url: data[key].addedUrl,
//         });
//       }
//     }
//     setReadUrls(loadedUrls);
//     setShowSpinner(false);
//   };
//   let intervalId;

//   const getUrlValueHandler = (value) => {
//     console.log("get value handler called");

//     if (value) {
//       setReadUrls((prevUrls) => prevUrls.concat(value));

//       fetch(`${serverUrl}?name=${encodeURIComponent(value?.addedUrl)}`)
//         .then((response) => response.json())
//         .then((feed) => {
//           if (feed !== 329) {
//             console.log(feed);

//             ////////////////////////////////////Notification////////////////////////////////
//             if (!("Notification" in window)) {
//               alert("This browser does not support desktop notification");
//             }

//             // Let's check if the user is okay to get some notification
//             else if (Notification.permission === "granted") {
//               // If it's okay let's create a notification
//               var notification = new Notification(feed.items[0].title, {
//                 body: `${CurrentUrl}view/${value?.id}/${null}`,
//               });
//             }

//             // Otherwise, we need to ask the user for permission
//             // Note, Chrome does not implement the permission static property
//             // So we have to check for NOT 'denied' instead of 'default'
//             else if (Notification.permission !== "denied") {
//               Notification.requestPermission(function (permission) {
//                 // Whatever the user answers, we make sure we store the information
//                 if (!("permission" in Notification)) {
//                   Notification.permission = permission;
//                 }

//                 // If the user is okay, let's create a notification
//                 if (permission === "granted") {
//                   var notification = new Notification(feed.items[0].title, {
//                     body: `${CurrentUrl}view/${value?.id}/${null}`,
//                   });
//                 }
//               });
//             } else {
//               alert(`Permission is ${Notification.permission}`);
//             }

//             // At last, if the user already denied any notification, and you
//             // want to be respectful there is no need to bother him any more.
//             ////////////////////////////////////Notification////////////////////////////////
//           } else {
//             alert("There was an Error please wait for 2 mins");
//             setTimeout(getUrlValueHandler, 120000);
//           }
//         });
//     }

//     console.log(readUrls);
//     readUrls.forEach((item) => {
//       let notiData = [];
//       intervalId = setInterval(function () {
//         if (item) {
//           fetch(`${serverUrl}?name=${encodeURIComponent(item.url)}`)
//             .then((response) => response.json())
//             .then((feed) => {
//               if (feed !== 329) {
//                 console.log(feed.items[0].title);
//                 console.log("fetch success");
//                 if (notiData.length === 0) {
//                   notiData.push(feed.items[0].title);
//                 }
//                 console.log(notiData[0]);

//                 if (feed.items[0].title === notiData[0]) {
//                   return;
//                 } else {
//                   console.log("feed changed>>>>>>>");
//                   let feedPositon = feed.items.findIndex(
//                     (e) => e.title === notiData[0]
//                   );
//                   notiData[0] = feed.items[0].title;
//                   console.log(notiData[0]);

//                   if (!("Notification" in window)) {
//                     alert("This browser does not support desktop notification");
//                   }

//                   // Let's check if the user is okay to get some notification
//                   else if (
//                     Notification.permission === "granted" &&
//                     feedPositon > 0
//                   ) {
//                     // If it's okay let's create a notification
//                     var notification = new Notification(
//                       item.name + "  :  (" + feedPositon + ") New Jobs ",
//                       { body: `${CurrentUrl}view/${item.id}/${feedPositon}` }
//                     );
//                   }
//                   //feed.items[0].link,dir:'rtl'
//                   // Otherwise, we need to ask the user for permission
//                   // Note, Chrome does not implement the permission static property
//                   // So we have to check for NOT 'denied' instead of 'default'
//                   else if (Notification.permission !== "denied") {
//                     Notification.requestPermission(function (permission) {
//                       // Whatever the user answers, we make sure we store the information
//                       if (!("permission" in Notification)) {
//                         Notification.permission = permission;
//                       }

//                       // If the user is okay, let's create a notification
//                       if (permission === "granted" && feedPositon > 0) {
//                         var notification = new Notification(
//                           item.name + "  :  (" + feedPositon + ") New Jobs ",
//                           {
//                             body: `${CurrentUrl}view/${item.id}/${feedPositon}`,
//                           }
//                         );
//                       }
//                     });
//                   } else {
//                     alert(`Permission is ${Notification.permission}`);
//                   }
//                 }

//                 // At last, if the user already denied any notification, and you
//                 // want to be respectful there is no need to bother him any more.
//                 ////////////////////////////////////Notification////////////////////////////////
//               } else {
//                 alert("There was an error please wait 2 minutes");
//                 clearInterval(intervalId);
//                 setTimeout(getUrlValueHandler, 120000);
//               }
//             });
//         }
//       }, requestValue);
//     });
//   };

//   if (readUrls.length > 0) {
//     getUrlValueHandler();
//   }

//   console.log(readUrls);
//   if (readUrls.length > 0) {
//     urlList = (
//       <ul className={classes.card}>
//         {readUrls.map((urls) => (
//           <li key={urls.id}>
//             <span className={classes.name}>{urls.name}</span>
//             <span className={classes["card-btn"]}>
//               <button onClick={() => addChangedUrlHandler(urls)}>UPDATE</button>
//               <button onClick={() => deleteUrlHandler(urls)}>DELETE</button>
//             </span>
//             <NavLink to={"/view/" + urls.id + "/" + null}>
//               <p>View</p>
//             </NavLink>
//           </li>
//         ))}
//       </ul>
//     );
//   }
//   let content = urlList;

//   return (
//     <React.Fragment>
//       <div className={classes.header}>
//         <ul className={classes.headerul}>
//           <li>
//             <NavLink to="/home">Home</NavLink>
//           </li>
//           <li>
//             <NavLink to="/home/allfeeds">All Feeds</NavLink>
//           </li>
//           <li>
//             <NavLink to="/home/addurl">AddUrl</NavLink>
//           </li>

//           {/* <Link to="/card">Go to Card</Link> */}
//           {/* <Link to="/home/card">Card</Link>
//           <li> */}

//           <li>
//             <NavLink to={"/view/" + urls.id + "/" + null}>
//               <p>Card</p>
//             </NavLink>
//             <li />{" "}
//             <div>
//               <select onChange={getRequestValue} value={props.requestValue}>
//                 <option value={30000}>30 Seconds</option>
//                 <option value={60000}>1 minute</option>
//                 <option value={120000}>2 minutes</option>
//                 <option value={300000}>5 minutes</option>
//               </select>
//             </div>
//           </li>
//         </ul>
//       </div>
//     </React.Fragment>
//   );
// };

// export default Header;
