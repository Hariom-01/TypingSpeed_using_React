import React, { useEffect, useState, useRef } from 'react';
import './Type.css';

const paragraph = `This code provides a simple calculator with basic arithmetic operations: addition, subtraction, multiplication, and division. The user inputs two numbers, and the result is displayed upon clicking the corresponding operation button.`;

const Type = () => {
  const maxTime = 60;
  const [timeleft, setTimeLeft] = useState(maxTime);
  const [mistakes, setMistakes] = useState(0);
  const [WPM, setWPM] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [CPM, setCPM] = useState(0);
  const inputRef = useRef(null);
  const charRef = useRef([]);
  const [correctWrong, setCorrectWrong] = useState([]);

  useEffect(() => {
    inputRef.current.focus();
    setCorrectWrong(Array(paragraph.length).fill(''));
  }, []);

  useEffect(() => {
    let interval;
    if (isTyping && timeleft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeleft === 0) {
      setIsTyping(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTyping, timeleft]);

  useEffect(() => {
    if (!isTyping && timeleft < maxTime) {
      const elapsedTime = maxTime - timeleft;
      const wordsTyped = charIndex / 5;
      setWPM(Math.round((wordsTyped / elapsedTime) * 60));
      setCPM(Math.round((charIndex / elapsedTime) * 60));
    }
  }, [isTyping, timeleft, charIndex]);

  const handleChange = (e) => {
    const characters = charRef.current;
    const currentChar = characters[charIndex];
    const typedChar = e.target.value.slice(-1);

    if (charIndex < characters.length && timeleft > 0) {
      if (!isTyping) {
        setIsTyping(true);
      }

      if (typedChar === currentChar.textContent) {
        setCorrectWrong((prev) => {
          const newCorrectWrong = [...prev];
          newCorrectWrong[charIndex] = "correct";
          return newCorrectWrong;
        });
      } else {
        setCorrectWrong((prev) => {
          const newCorrectWrong = [...prev];
          newCorrectWrong[charIndex] = "wrong";
          return newCorrectWrong;
        });
        setMistakes((prevMistakes) => prevMistakes + 1);
      }

      setCharIndex((prevIndex) => prevIndex + 1);

      if (charIndex === characters.length - 1) {
        setIsTyping(false);
      }
    } else {
      setIsTyping(false);
    }

    e.target.value = ''; // Clear the input
  };

  const resetTest = () => {
    setTimeLeft(maxTime);
    setMistakes(0);
    setWPM(0);
    setCPM(0);
    setCharIndex(0);
    setIsTyping(false);
    setCorrectWrong(Array(paragraph.length).fill(''));
    inputRef.current.focus();
  };

  return (
    <div>
      <div className="container">
        <input
          type="text"
          ref={inputRef}
          onChange={handleChange}
          className='text'
        />
        <div className="paragraph">
          {paragraph.split("").map((char, index) => (
            <span
              key={index}
              className={`char ${index === charIndex ? "active" : ""} ${correctWrong[index]}`}
              ref={(el) => (charRef.current[index] = el)}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
      <div className="result">
        <p>Time Left: {timeleft}s</p>
        <p>Mistakes: {mistakes}</p>
        <p>WPM: {WPM}</p>
        <p>CPM: {CPM}</p>
        <button className="btn" onClick={resetTest}>Try Again</button>
      </div>
    </div>
  );
};

export default Type;
