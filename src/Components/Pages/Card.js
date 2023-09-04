import React, { useState, useEffect } from "react";
import classes from "../../App.module.css";

const Card = (props) => {
  const serverUrl =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_PRODUCTION_SERVER_URL
      : process.env.REACT_APP_DEVELOPMENT_SERVER_URL;
  const [allCards, setAllCards] = useState([]);
  console.log("urls>>>", props.readUrls);

  useEffect(() => {
    for (let i = 0; i < props.readUrls.length; i++) {
      let url = props?.readUrls[i].url;
      let name = props?.readUrls[i].name;

      fetch(`${serverUrl}?name=${encodeURIComponent(url)}`)
        .then((response) => response.json())
        .then((feed) => {
          if (feed !== 329) {
            console.log("feed>>>>", feed);
            feed.name = name;
            setAllCards((prevCards) => [
              ...prevCards, // Spread the previous cards
              feed, // Add the new item to the end of the array
            ]);
          } else {
            if (!window.sessionStorage.getItem("errorValue")) {
              alert("There was an error please wait for 2 mins");
            }
          }
        });
    }
  }, [props.readUrls]);

  console.log("allCards>>>", allCards);

  return (
    <React.Fragment>
      <div>Card</div>
      <ul className={classes.card} >
        {allCards?.map((element, index) => (
          <li key={index}>
            <span className={classes.cardname} >Card </span>
            <span className={classes.cardheading}> {element.name}</span>
            <span className={classes.cardsubheading}> {element.items[0].title}</span>
            <span className={classes.carddiscripton}> {element.items[0].content}</span>
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
};

export default Card;
