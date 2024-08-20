import React, { useEffect, useState } from "react";
import "./Loader.css"; // Make sure to style the loader as needed
import loaderGif from "../../assets/images/loading.gif"; // Adjust the path accordingly
import Logo from "../CommonComponents/Logo";

const quotes = [
    "Design is not just what it looks like and feels like. Design is how it works. - Steve Jobs",
    "The details are not the details. They make the design. - Charles Eames",
    "An interior is the natural projection of the soul. - Coco Chanel",
    "Good design is obvious. Great design is transparent. - Joe Sparano",
    "The best rooms have something to say about the people who live in them. - David Hicks",
];

const Loader = () => {
    const [quote, setQuote] = useState("");

    useEffect(() => {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(randomQuote);
    }, []);

    return (
        <div className="loader-container">
            <Logo type="primary-text-lg" />
            <h2>{quote}</h2>
            <img src={loaderGif} alt="Loading..." className="loader-image" />
        </div>
    );
};

export default Loader;
