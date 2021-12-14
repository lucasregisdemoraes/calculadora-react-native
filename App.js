import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';

export default function App() {
  const [darkMode, setDarkmode] = useState(true)

  let [currentNumber, setCurrentNumber] = useState("")
  const [lastNumber, setLastNumber] = useState("")


  const utils = {
    endsWithAOperator: () => {
      let chars = currentNumber.split("")
      let lastChar = chars[chars.length - 1]
      return lastChar === " " ? true : false // se a ultima letra for um espaço(por causa do operador) retorna verdadeiro
    },
    lastChar: () => {
      let chars = currentNumber.split("")
      return chars[chars.length - 1] // retorna a ultima letra
    },
    lastCharIsANumber: () => {
      const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
      let isANumber = false
      // numbers.forEach(number => {
      // isANumber = utils.lastChar() === number ? true : false
      // })

      numbers.forEach((number) => {
        if (utils.lastChar() === number) isANumber = true
      })
      return isANumber
    }
  }

  function calculate() {
    if (utils.endsWithAOperator()) {
      throw new Error("insira o segundo valor")
      // setLastNumber("insira o segundo valor")
      // return
    }
    let splitNumbers = currentNumber.split(" ")
    let firstNumber = parseFloat(splitNumbers[0])
    let operator = splitNumbers[1]
    let lastNumber = parseFloat(splitNumbers[2])

    switch (operator) {
      case "+":
        setCurrentNumber(String(firstNumber + lastNumber))
        return
      case "-":
        setCurrentNumber(String(firstNumber - lastNumber))
        return
      case "*":
        setCurrentNumber(String(firstNumber * lastNumber))
        return
      case "/":
        setCurrentNumber(String(firstNumber / lastNumber))
        return
      case "%":
        setCurrentNumber(String((lastNumber / 100) * firstNumber))
    }
  }


  function handleInput(buttonPressed) {
    if (buttonPressed === "/" || buttonPressed === "*" || buttonPressed === "-" || buttonPressed === "+" || buttonPressed === "%") {
      if (currentNumber === "") {
        setLastNumber("insira primeiro um valor")
        return
      }
      if (currentNumber.split(" ").length < 3 && !utils.endsWithAOperator()) {
        setCurrentNumber(currentNumber + " " + buttonPressed + " ")
        return
      } else {
        setLastNumber("somente 1 operador")
        return
      }
    }



    switch (buttonPressed) {
      case "DEL":
        utils.endsWithAOperator() ?
          setCurrentNumber(currentNumber.substring(0, currentNumber.length - 3))
          :
          setCurrentNumber(currentNumber.substring(0, currentNumber.length - 1))
        return
      case "AC":
        setCurrentNumber("")
        setLastNumber("")
        return
      case "+/-":
        if (utils.lastChar() !== "-" && !utils.lastCharIsANumber()) {
          setCurrentNumber(currentNumber + '-')
        }
        return
      case "=":
        setLastNumber(currentNumber + " = ")
        try {
          calculate()
          return
        } catch (error) {
          setLastNumber(error.message)
          return
        }
    }

    setCurrentNumber(String(currentNumber) + String(buttonPressed))
  }

  const buttons = ["AC", "DEL", "%", "/", 7, 8, 9, "*", 4, 5, 6, "-", 1, 2, 3, "+", 0, ".", "+/-", "="]

  const styles = StyleSheet.create({
    container: {
      backgroundColor: darkMode ? "#282f3b" : "#f5f5f5",
    },
    results: {
      width: "100%",
      minHeight: 190,
      alignItems: "flex-end",
      justifyContent: "flex-end",
    },
    darkModeButton: {
      backgroundColor: darkMode ? "#7b8084" : "#e5e5e5",
      alignSelf: "flex-start",
      marginLeft: 20,
      padding: 10,
      borderRadius: 30,
    },
    historyText: {
      color: darkMode ? "#B5B7BB" : "#7c7c7c",
      fontSize: 30,
      marginRight: 15,
    },
    resultText: {
      color: darkMode ? "#f5f5f5" : "#282F38",
      fontSize: 40,
      marginRight: 15,
      marginBottom: 20,
    },
    keyboard: {
      // height: "60%",
      flexWrap: "wrap",
      flexDirection: "row",
    },
    button: {
      borderWidth: 0.5,
      borderColor: darkMode ? "#3f4d5b" : "#e5e5e5",
      // height: 50,
      minHeight: 90,
      minWidth: 90,
      flex: 2,
      alignItems: "center",
      justifyContent: "center",
    },
    textButton: {
      color: darkMode ? "#b5b7bb" : "#7c7c7c",
      fontSize: 20,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.results}>
        <TouchableOpacity style={styles.darkModeButton}>
          <Entypo name={darkMode ? "light-up" : "moon"} color={darkMode ? "white" : "black"} size={24} onPress={() => darkMode ? setDarkmode(false) : setDarkmode(true)} />
        </TouchableOpacity>
        <Text style={styles.historyText}>{lastNumber}</Text>
        <Text style={styles.resultText}>{currentNumber}</Text>
      </View>
      <View style={styles.keyboard}>
        {buttons.map((button) =>
          button === "=" ?
            <TouchableOpacity onPress={() => handleInput(button)} key={button} style={[styles.button, { backgroundColor: "#9DBC7B" }]}>
              <Text style={[styles.textButton, { fontSize: 30, color: "white" }]}>{button}</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={() => handleInput(button)} key={button} style={[styles.button,
            { backgroundColor: typeof (button) === "number" ? darkMode ? "#303946" : "#fff" : darkMode ? "#414853" : "#ededed" }]}>
              <Text style={styles.textButton}>{button}</Text>
            </TouchableOpacity>
        )}
      </View>
    </View>
  );
}