import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Entypo } from '@expo/vector-icons'; // importa alguns ícones

export default function App() {
  const [darkMode, setDarkmode] = useState(true) // cria a função para ativar/desativar o Dark Mode

  const [currentNumber, setCurrentNumber] = useState("") // cria a função para definir o número atual
  const [lastNumber, setLastNumber] = useState("") // cria a função para difinir o último número digitado

  const utils = {
    isLastChar: char => { // retorna verdadeiro se a ultima letra é a mesma que a passada no parâmetro
      let chars = currentNumber.split("")
      return chars[chars.length - 1] === char ? true : false
    },
    endsWithAOperator: () => { // se a ultima letra for um espaço (por causa do operador) retorna verdadeiro
      return utils.isLastChar(" ")
    },
    lastCharIsANumber: () => { // se o último caracter for um número retorna verdadeiro
      const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
      let isANumber = false

      numbers.forEach(number => { // para cada um dos números verifica se ele é o último caracter
        if (utils.isLastChar(number)) isANumber = true
      })
      return isANumber
    }
  }

  const calculatorsFunctions = {
    calculate: () => { // faz o calculo
      if (utils.endsWithAOperator() || utils.isLastChar(".") || utils.isLastChar("-")) { // se o ultimo valor digitado é um operador dispara um erro
        throw new Error("insira o segundo valor")
      }

      const splitNumbers = currentNumber.split(" ")
      const firstNumber = parseFloat(splitNumbers[0])
      const operator = splitNumbers[1]
      const lastNumber = parseFloat(splitNumbers[2])

      switch (operator) { // faz a conta pra cada operador
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
    },
    DELFunction: () => {
      utils.endsWithAOperator() ?
        setCurrentNumber(currentNumber.substring(0, currentNumber.length - 3))
        :
        setCurrentNumber(currentNumber.substring(0, currentNumber.length - 1))
    },
    ACFunction: () => {
      setCurrentNumber("")
      setLastNumber("")
    },
    negativeSignalFunction: () => {
      if (!utils.isLastChar("-") && !utils.isLastChar(".") && !utils.lastCharIsANumber()) {
        setCurrentNumber(currentNumber + '-')
      }
    },
    equalsFunction: () => {
      setLastNumber(currentNumber + " =")
      try {
        calculatorsFunctions.calculate()
      } catch (error) {
        setLastNumber(error.message)
      }
    }
  }

  function handleInput(buttonPressed) { // lida com o botão pressionado
    if (buttonPressed === "/" || buttonPressed === "*" || buttonPressed === "-" || buttonPressed === "+" || buttonPressed === "%") {
      if (currentNumber === "" || currentNumber === "-" || currentNumber === ".") { // se o valor atual é vazio ou um -(sinal de negativo) ou um .(ponto) dispara um erro
        throw new Error("insira o primeiro valor")
      }
      if (currentNumber.split(" ").length < 3 && !utils.endsWithAOperator()) { // verifica se já tem um operador(se tiver mais que 3 itens no array significa que já tem um operador) ou se o último valor inserido não é um operador
        setCurrentNumber(currentNumber + " " + buttonPressed + " ") // adiciona espaços ao lado do operador para poder separar os valores na função calculate()
        return
      } else { // se não se encaixar na condição acima dispara um erro
        throw new Error("somente 1 operador")
      }
    }

    switch (buttonPressed) { // para cada caso de um botão com função especial ser pressionado
      case "DEL":
        calculatorsFunctions.DELFunction()
        return
      case "AC":
        calculatorsFunctions.ACFunction()
        return
      case "+/-":
        calculatorsFunctions.negativeSignalFunction()
        return
      case "=":
        calculatorsFunctions.equalsFunction()
        return
    }

    setCurrentNumber(String(currentNumber) + String(buttonPressed)) // adiciona o valor do botão pressionado (transformado em string para não ter problemas na função split())
  }

  const buttons = ["AC", "DEL", "%", "/", 7, 8, 9, "*", 4, 5, 6, "-", 1, 2, 3, "+", 0, ".", "+/-", "="] // lista dos botões que serão utilizados

  const styles = StyleSheet.create({ // cria a estilização do APP
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
      flexWrap: "wrap",
      flexDirection: "row",
    },
    button: {
      borderWidth: 0.5,
      borderColor: darkMode ? "#3f4d5b" : "#e5e5e5",
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
          {/* Componente usado para inserir ícones */}
          <Entypo name={darkMode ? "light-up" : "moon"} color={darkMode ? "white" : "black"} size={24} onPress={() => darkMode ? setDarkmode(false) : setDarkmode(true)} />
        </TouchableOpacity>
        {/* coloca a variável lastNumber no Componente Text */}
        <Text style={styles.historyText}>{lastNumber}</Text>
        {/* coloca a variável currentNumber no Componente Text */}
        <Text style={styles.resultText}>{currentNumber}</Text>
      </View>

      <View style={styles.keyboard}>
        {/* faz um loop no array buttons e insere cada botão */}
        {buttons.map(button =>
          button === "=" ? // verifica se o botão é o =(igual) e retorna o Componente com uma cor diferente
            <TouchableOpacity onPress={() => {
              try {
                handleInput(button)
              } catch (error) {
                setLastNumber(error.message)
              }
            }} key={button} style={[styles.button, { backgroundColor: "#9DBC7B" }]}>
              <Text style={{fontSize: 30, color: "white"}}>{button}</Text>
            </TouchableOpacity>
            : // se o botão não for o =(igual) retorna o Componente com uma cor diferente
            <TouchableOpacity onPress={() => {
              try {
                handleInput(button)
              } catch (error) {
                setLastNumber(error.message)
              }
            }} key={button} style={[styles.button,
              // verifica se o botão é um número(do tipo number) para mudar a cor dele
            { backgroundColor: typeof (button) === "number" ? darkMode ? "#303946" : "#fff" : darkMode ? "#414853" : "#ededed" }]}>
              <Text style={styles.textButton}>{button}</Text>
            </TouchableOpacity>
        )}
      </View>
    </View>
  );
}