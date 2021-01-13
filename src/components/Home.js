import React, { useState, Fragment, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from 'native-base';
import { StyleSheet, View, FlatList, Text, StatusBar, Image, TouchableOpacity, TextInput } from 'react-native';
import Loading from './Loading';

const Home = ({ route, navigation }) => {

    const [userName, setUserName] = useState('');
    const [books, setBooks] = useState([]);
    const [booksView, setBooksView] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [optionFilter, setOptionFilter] = useState('');
    const [searchTxt, setSearchTxt] = useState(''); 

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            var tokenId = route.params.tokenId;
            var username = route.params.userName;
            console.log(username);
            if(tokenId !== undefined && tokenId !== null && tokenId !== ""){
                setUserName(username);
                callBooks();
            }else{
                navigation.navigate('Login');
            }
        });
        return unsubscribe;
      }, [navigation]);

    useEffect(() => {
        /*Funcion para filtrar los books */
        const filterItems = () => {
            var booksTmp;

            switch(optionFilter){
                case "like":
                    booksTmp = books.filter(data => (
                        data.bookingId.toString().indexOf(searchTxt) > -1 || 
                        data.bookingPrice.toString().indexOf(searchTxt) > -1 ? data.bookingId : null) );
                    break;
                case ">":
                    booksTmp = books.filter(data => (
                        data.bookingId < searchTxt || 
                        data.bookingPrice > searchTxt ? data.bookingId : null) );
                    break;
                case "<":
                    booksTmp = books.filter(data => (
                        data.bookingId < searchTxt || 
                        data.bookingPrice < searchTxt ? data.bookingId : null) );
                    break;
                case ">=":
                    booksTmp = books.filter(data => (
                        data.bookingId >= searchTxt || 
                        data.bookingPrice >= searchTxt ? data.bookingId : null) );
                    break;
                case "<=":
                    booksTmp = books.filter(data => (
                        data.bookingId <= searchTxt || 
                        data.bookingPrice <= searchTxt ? data.bookingId : null) );
                    break;
                default:
                    booksTmp = books;
            }

            setBooksView(booksTmp);
        }

        filterItems();

    }, [searchTxt,optionFilter,books]);

    const setMistake = msg =>{
        setErrorMsg(msg);
        setLoading(false);
        setTimeout(() => {
          setErrorMsg('');
        }, 3000);
    }

    const callBooks = async () => {
        var whatEmail = 'contacto@tuten.cl';

        // Armamos la cabecera
        const headerItem = new Headers({ 
            'Content-Type': 'application/json',
            'adminemail': await AsyncStorage.getItem('userName'),
            'token': await AsyncStorage.getItem('tokenId'),
            'email': whatEmail,
            'app': 'APP_BCK',
            'Accept': 'application/json'
        });

        console.log(headerItem);

        setLoading(true);
        //Llamamos a la api
        fetch(`https://dev.tuten.cl:443/TutenREST/rest/user/${encodeURIComponent(whatEmail)}/bookings?current=true`,{
            method: 'GET',
            headers: headerItem
        }).then(response => {
            // Validamos el status
            switch(response.status){
                case 200:
                    setLoading(false);
                    // SI todo salio bien, guardamos la data
                    let data = response.json();
                    data.then(data => {
                        setBooks(data);
                        //console.log(data);
                        setBooksView(data);
                    })
                    break;
                case 400:
                    setMistake('Invalid something');
                    break;
                default:
                    setMistake('Error interno');
                    break;
            }
            
        }).catch(e => {
            console.error(e);
            setMistake('Error interno');
        });
    }

    const logout = async() => {

        try {
            await AsyncStorage.setItem('tokenId', '');
            await AsyncStorage.setItem('userName', '');
        } catch(e) {
            console.warn("fetch Error: ", e)
        }

        navigation.navigate('Login');
    }

    /*Funcion para retornar una fecha visible para el usuario */
    const transformDate = time => {
        let date = new Date(time);
        return `${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()}`;
    }
    
    const renderItem = ( item, index ) => {
        return (
            <View key={index} style={styles.rowBox}>
                <View style={[styles.rowItem,{backgroundColor: (index % 2 === 0 ? '#FFF' : '#EEE')}]}>
                    <View style={[styles.colItem,styles.colHeader]}>
                        <Text style={styles.colDsc}>BookingId</Text>
                    </View>
                    <View style={styles.colItem}>
                        <Text style={styles.colDsc}>{item.bookingId}</Text>
                    </View>
                </View>
                <View style={[styles.rowItem,{backgroundColor: (index % 2 === 0 ? '#FFF' : '#EEE')}]}>
                    <View style={[styles.colItem,styles.colHeader]}>
                        <Text style={styles.colDsc}>Cliente</Text>
                    </View>
                    <View style={styles.colItem}>
                        <Text style={styles.colDsc}>{`${item.tutenUserClient.firstName} ${item.tutenUserClient.lastName}`}</Text>
                    </View>
                </View>
                <View style={[styles.rowItem,{backgroundColor: (index % 2 === 0 ? '#FFF' : '#EEE')}]}>
                    <View style={[styles.colItem,styles.colHeader]}>
                        <Text style={styles.colDsc}>Fecha de Creación</Text>
                    </View>
                    <View style={styles.colItem}>
                        <Text style={styles.colDsc}>{transformDate(item.bookingTime)}</Text>
                    </View>
                </View>
                <View style={[styles.rowItem,{backgroundColor: (index % 2 === 0 ? '#FFF' : '#EEE')}]}>
                    <View style={[styles.colItem,styles.colHeader]}>
                        <Text style={styles.colDsc}>Dirección</Text>
                    </View>
                    <View style={styles.colItem}>
                        <Text style={styles.colDsc}>{item.locationId.streetAddress}</Text>
                    </View>
                </View>
                <View style={[styles.rowItem,{backgroundColor: (index % 2 === 0 ? '#FFF' : '#EEE')}]}>
                    <View style={[styles.colItem,styles.colHeader]}>
                        <Text style={styles.colDsc}>Precio</Text>
                    </View>
                    <View style={styles.colItem}>
                        <Text style={styles.colDsc}>{item.bookingPrice}</Text>
                    </View>
                </View>
            </View>
        );
    }

    const styles = StyleSheet.create({
        navBar: {
            backgroundColor: '#3d3d3d',
            height: 50,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20
        },
        iconApp: {
            height: 30,
            width: 30,
        },
        userLogout: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        userLabel: {
            color: '#FFF',
            marginRight: 15,
            fontSize: 16,
            fontFamily: 'Montserrat-SemiBold'
        },
        rowBox: {
            marginHorizontal: 20,
            marginVertical: 10,
            flexDirection: 'column',
        },
        rowItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
        },
        colItem: {
            width: '40%',
        },
        colHeader: {
            justifyContent: 'center',
        },
        colDsc: {
            fontFamily: 'OpenSans-Regular',
            color: '#3d3d3d'
        },
        welcome: {
            textAlign: 'center', 
            fontFamily: 'Montserrat-Bold',
            fontSize: 18,
        },
        welcomeBox: {
            marginVertical: 15,
        },
        searchInput: {
            marginTop: 10,
            borderRadius: 10,
            borderWidth: 0.5,
            marginHorizontal: 15,
            height: 40,
            borderRadius: 27,
            paddingHorizontal: 15
        },
        pickerFilter: { 
            color: '#646464',
            height: 40,
        }
    });

    return (
        <Fragment>
            <StatusBar backgroundColor='#3d3d3d' barStyle='ligth-content' animated={true} />
            { loading ? <Loading /> : null}
            {/* Cabecera */}
            <View style={styles.navBar}>
                <View>
                    <Image source={require('../images/logo.png')} style={styles.iconApp}/>
                </View>
                <View style={styles.userLogout}>
                    <Text style={styles.userLabel}>{userName}</Text>
                    <TouchableOpacity onPress={logout}>
                        <Image source={require('../images/logout.png')} style={styles.iconApp} />
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList 
                ListHeaderComponent={
                    <View>
                        <View style={styles.welcomeBox}>
                            <Text style={styles.welcome}>Welcome!</Text>
                        </View>
                        <View style={{flexDirection: 'column'}}>
                            <TextInput value={searchTxt}
                                onChangeText={txt => setSearchTxt(txt)}
                                style={styles.searchInput}
                                keyboardType="number-pad"
                                placeholder="Buscar..."/>
                            <View style={styles.searchInput}>
                                <Picker
                                    note 
                                    mode="dropdown"
                                    style={styles.pickerFilter}
                                    onValueChange={txt => setOptionFilter(txt)}
                                    selectedValue={optionFilter}>
                                    <Picker.Item label="Selecione..." value=""/>
                                    <Picker.Item label="Like" value="like"/>
                                    <Picker.Item label="<" value="<"/>
                                    <Picker.Item label=">" value=">"/>
                                    <Picker.Item label="<=" value="<="/>
                                    <Picker.Item label=">=" value=">="/>
                                </Picker>
                            </View>
                        </View>
                    </View>
                }
                data={booksView}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => renderItem(item, index)}
            />

        </Fragment>
    );
}

export default Home;