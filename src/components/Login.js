import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, ScrollView, Dimensions, TextInput, TouchableOpacity, Image, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Loading from './Loading';

const imageSize = Dimensions.get('window').width * 0.30;
const eyeSize = Dimensions.get('window').width * 0.07;

const Login = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [showPwd, setShowPwd] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        setLoading(false);
    }, []);

    const setMistake = msg =>{
        setErrorMsg(msg);
        setLoading(false);
        setTimeout(() => {
          setErrorMsg('');
        }, 3000);
    }

    const handleSubmit = () => {

        //Validamos que los campos no esten vacios
        if(email === '' || pwd === ''){
            setMistake('Campos vacíos');
            return null;
        }

        setLoading(true);

        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                var rsp = "";
                if(this.responseText !== ""){
                    rsp = JSON.parse(this.responseText);
                    response(this.status, this.responseText);
                }else{
                    response(this.status, this.responseText);
                }
            }
        };

        xhttp.open("PUT",`https://dev.tuten.cl/TutenREST/rest/user/${encodeURIComponent(email.toLowerCase())}`, true);

        xhttp.setRequestHeader('Content-Type','application/json');
        xhttp.setRequestHeader('email', email.toLowerCase());
        xhttp.setRequestHeader('password',pwd);
        xhttp.setRequestHeader('app','APP_BCK');
        xhttp.setRequestHeader('Accept','application/json');

        // Armamos la cabecera
        async function response(status, respx) {
            console.log(status);
            console.log(respx);
            switch(status){
                case 200:
                    // SI todo salio bien, guardamos el token
                    let data = JSON.parse(respx);
                    console.log(data);

                    setLoading(false);

                    try {
                        await AsyncStorage.setItem('tokenId', data.sessionTokenBck);
                        await AsyncStorage.setItem('userName', data.email);
                    } catch(e) {
                        console.warn("fetch Error: ", e)
                    }
                        
                    navigation.navigate('Home', {
                        tokenId: data.sessionTokenBck,
                        userName: data.email
                    });
                    break;
                case 400:
                    setMistake('Invalid something');
                    break;
                default:
                    setMistake('Error interno');
                    break;
            }
        }

        xhttp.send();
    }

    const styles = StyleSheet.create({
        gradientMain: {
            flex: 1
        },
        loginBox: {
            borderRadius: 27,
            width: '80%',
            backgroundColor: '#FFF',
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 15,
            paddingHorizontal: 25,
            minHeight: 450,
        },
        logo: {
            width: imageSize,
            height: imageSize,
            marginBottom: 10
        },
        title: {
            fontSize: 18,
            fontFamily: 'Montserrat-SemiBold',
            marginBottom: 12,
            color: '#000'
        },
        buttonLogin: {
            width: 120,
            marginBottom: 5,
            backgroundColor: '#49ABED',
            borderRadius: 10,
            alignSelf: 'center',
            justifyContent: 'center',
            padding: 5,
            marginTop: 20,
        },
        erroMsg:{
            color: '#F00',
            fontSize: 14,
            fontFamily: 'OpenSans-SemiBold',
            marginBottom: 15,
            textAlign: 'center'
        },
        mainBox: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        },
        inputLabel: {
            width: '100%',
            flexDirection: 'column',
            marginBottom: 10,
        },
        input: {
            borderRadius: 10,
            borderWidth: 0.5,
            height: 40,
        },
        label: {
            fontSize: 14,
            fontFamily: 'OpenSans-Regular',
            marginBottom: 5,
            color: '#454545'
        },
        inputPasswordBox: {
            borderRadius: 10,
            borderWidth: 0.5,
            height: 40,
            flexDirection: 'row'
        },
        eyeSize: {
            height: eyeSize,
            width: eyeSize,
        },
        alignEye: {
            justifyContent: 'center', 
            alignItems: 'center',
        },
        buttonTextPrincipal: {
            color: '#FFF',
            fontSize: 15,
            fontFamily: 'OpenSans-bold',
            margin: 10,
            textAlign: 'center'
        },
        inputBox: {
            height: 40, 
            width: '86%'
        }
    });

    return (
        <LinearGradient colors={['#49ABED', '#0267AB']} style={styles.gradientMain}>
            <StatusBar backgroundColor='#49ABED' barStyle='ligth-content' animated={true} />
            { loading ? <Loading /> : null}
            <ScrollView contentContainerStyle={styles.mainBox} style={{flex: 1}}>
                {/* Caja del login */}
                <View style={styles.loginBox}>
                    {/* Logo de la aplicacion */}
                    <Image source={require('../images/logo.png')} 
                        style={styles.logo}></Image>
                    {/* Titulo */}
                    <Text style={styles.title}>Library</Text>

                    {/* Mensaje de errores */}
                    { errorMsg != '' ? (
                        <Text style={styles.erroMsg}>{ errorMsg }</Text>
                    ) : null}

                    {/* Input label correo */}
                    <View style={styles.inputLabel}>
                        <Text style={styles.label}>Correo electrónico:</Text>
                        <TextInput style={styles.input}
                        value={email}
                        placeholder="Correo electrónico..."
                        onChangeText={txt => setEmail(txt)}
                        autoCompleteType='email'
                        keyboardType='email-address'/>
                    </View>

                    {/* Input label pwd */}
                    <View style={styles.inputLabel}>
                        <Text style={styles.label}>Contraseña:</Text>
                        <View style={styles.inputPasswordBox}>
                            <TextInput style={styles.inputBox}
                                autoCompleteType='password'
                                placeholder="Contraseña..."
                                value={pwd}
                                onChangeText={txt => setPwd(txt)}
                                secureTextEntry={showPwd} />
                            <TouchableOpacity style={styles.alignEye}
                                onPress={() => setShowPwd(!showPwd)}>
                                <Image source={showPwd ? require('../images/eyeShow.png') : require('../images/eyeNoShow.png')} 
                                style={styles.eyeSize}></Image>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Boton para iniciar sesion */}
                    <TouchableOpacity style={styles.buttonLogin}
                        onPress={handleSubmit}>
                        <Text style={styles.buttonTextPrincipal}>Iniciar sesión</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

export default Login;