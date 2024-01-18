import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ImageBackground, Image } from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
//Aula 71: importando o arquivo do bd
import db from "../config";

//Aula 70: Adicionar as imagens (logotipo, fundo e nomeApp)
const bgImage= require("../assets/background2.png");
const appIcon= require("../assets/appIcon.png");
const appName= require("../assets/appName.png");

export default class TransactionScreen extends Component {
  //Aula 69: Definir os estados iniciais em nosso App:
  constructor(props){
    super(props);
    this.state = {
      //Aula 70: Adicionar 2 novos estados: identificação do aluno e do livro
      bookId: "",
      studentId: "",
      domState: "normal", //Estado do modo: Modo Digitalizar ou Modo Digitalizado
      hasCameraPermissions: null, //Estado de permissões: Se o usuário deu ou não permissão 
      scanned: false, //Estado Digitalizado: Digitalização foi concluída ou não.
    };
  }

  //Aula 69: Criar a função para solicitar permissão para a câmera
  getCameraPermissions = async domState => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    this.setState({
      /*status === "granted" é true (verdadeiro) se o usuário concedeu permissão
        status === "granted" é false (falso) se o usuário não concedeu permissão
      */
      hasCameraPermissions: status === "granted",
      domState: domState,
      scanned: false
    });
  };

  //Aula 69: Criar função para digitalização concluída
  //Aula 70: Após o scanner é necessário saber qual QRCode foi lido - Separar bookId e studentId
  handleBarCodeScanned = async ({ type, data }) => {
    const {domState}= this.state;

    if(domState==="bookId"){
      this.setState({
        bookId: data,
        domState: "normal",
        scanned: true
      });
    } else if(domState===studentId){
      this.setState({
        studentId: data,
        domState: "normal",
        scanned: true
      });
    }
    
  };
  
  //Aula 71: função para efetuar as transações
  handleTransaction= () => {
    let {bookId}= this.state;
    db.collection("books")
      .doc(bookId)
      .get()
      .then(doc => {
        console.log(doc.data())
        let book= doc.data();
        if(book.is_book_available){
          this.initiateBookIssue();
        } else{
          this.initiateBookReturn();
        }
      });
  };

  initiateBookIssue= () => {
    console.log("Livro emprestado para o aluno");
  }

  initiateBookReturn= () => {
    console.log("Livro devolvido pelo aluno");
  }

  render() {
    //Aula 69: Chamar os estados iniciais
    //Aula 70: Atualizar os estados iniciais
    const { bookId, studentId, domState, scanned } = this.state;
    
    //Aula 69: Condição para análise de "domState" para ação de scanear
    if (domState !== "normal") {
      return (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      );
    }

    /*Aula 70: Personalização da tela de Transação
    Inserção de Imagem de Fundo e imagens de ícones
    Inserção do formulário de entrada para receber o ID Livro com um botão lateral de scanner */

    //Aula 70: Inserir o formulário de entrada para receber o ID Aluno  com um botão lateral de scanner
    //Aula 70: Na sequencia, criar um botão de envio das informações inseridas
    return (
      <View style={styles.container}>
      <ImageBackground source={bgImage} style={styles.bgImage}>
        <View style={styles.upperContainer}>
          <Image source={appIcon} style={styles.appIcon} />
          <Image source={appName} style={styles.appName} />
        </View>
        <View style={styles.lowerContainer}>
          <View style={[styles.textinputContainer, {marginTop:25}]}>
            <TextInput
              style={styles.textinput}
              placeholder={"ID do Livro"}
              placeholderTextColor={"#FFFFFF"}
              value={bookId}
            />
            <TouchableOpacity
              style={styles.scanbutton}
              onPress={() => this.getCameraPermissions("bookId")}
            >
              <Text style={styles.scanbuttonText}>Digitalizar</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.textinputContainer, {marginTop:10}]}>
            <TextInput
              style={styles.textinput}
              placeholder={"ID do Aluno"}
              placeholderTextColor={"#fff"}
              value={studentId}
            />
            <TouchableOpacity
              style={styles.scanbutton}
              onPress={() => this.getCameraPermissions("studentId")}
            >
              <Text style={styles.scanbuttonText}>Digitalizar</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPrees={this.handleTransaction()}>
            <Text style={styles.buttonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  bgImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  upperContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  appIcon: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginTop: 80
  },
  appName: {
    width: 180,
    resizeMode: "contain"
  },
  lowerContainer: {
    flex: 0.5,
    alignItems: "center"
  },
  textinputContainer: {
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: "row",
    backgroundColor: "#9DFD24",
    borderColor: "#FFFFFF"
  },
  textinput: {
    width: "57%",
    height: 50,
    padding: 10,
    borderColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 3,
    fontSize: 18,
    backgroundColor: "#5653D4",
    fontFamily: "Rajdhani_600SemiBold",
    color: "#FFFFFF"
  },
  scanbutton: {
    width: 100,
    height: 50,
    backgroundColor: "#9DFD24",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  scanbuttonText: {
    fontSize: 20,
    color: "#0A0101",
    fontFamily: "Rajdhani_600SemiBold"
  },
  button:{
    width: "43%",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f48d20",
    borderRadius: 15,
    marginTop: 25,
  },
  buttonText:{
    fontSize: 24,
    color: "#fff",
    fontFamily: "Rajdhani_600SemiBold",
  },
});