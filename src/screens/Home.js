/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState }  from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  FlatList,
  Button,
  Image
} from 'react-native';

var chance = require('chance').Chance();

import AsyncStorage from '@react-native-async-storage/async-storage';

import { padStart } from "lodash";

const STORAGE_KEY = '@data_list'

function Home({ navigation, route }) {
  const [listData, setListData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  React.useEffect(() => {
    readData()
  }, []);

  React.useEffect(() => {
    const index = listData.length;
    if (route.params?.newItem && route.params?.newItem != listData.length) {
      var randomNumber = (Math.floor(Math.random() * 100) + 1);
      var padded = padStart(randomNumber, 2, 0);
      const newListData = [...listData];
      newListData[index] = {
        title: chance.name({ nationality: 'en' }) + " the " + chance.animal({type: 'zoo'}),
        image: 'https://www.placecage.com/c/200/2' + padded,
      }
      setListData(newListData);
    }
  }, [route.params?.newItem]);

  React.useEffect(() => {
    if(isRefreshing === true) {
      listData.forEach(updateImage);
      setListData(listData);
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  const saveData = async (newListData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newListData))
      alert('Data successfully saved')
    } catch (e) {
      alert('Failed to save the data to the storage')
    }
    console.log('Done.');
  }

  const readData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY)
    console.log(jsonValue);
    const newDataList = JSON.parse(jsonValue);
    setListData(newDataList);
  } catch(e) {
    alert('Failed to fetch the data from storage')
  }

  console.log('Done.')

}


  const renderItem = ({ item }) => (
    <View style={{flexDirection: 'row', flexWrap: 'wrap', flex: 1,}}>
    <Image
        style={styles.logo}
        source={{
          uri: item.image,
        }}
      />
      <Text style={{flexWrap: 'wrap', flex: 1}}>{item.title}</Text>
    </View>
  );

  function onRefresh() {
    setIsRefreshing(true);
  }

  function updateImage(item) {
    var randomNumber = Math.floor(Math.random() * 100) + 1;
    var padded = padStart(randomNumber, 2, 0);
    console.log(item);
    item.image = 'https://www.placecage.com/c/200/2' + padded;
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <FlatList
          onRefresh={onRefresh}
          refreshing={isRefreshing}
          data={listData}
          renderItem={renderItem}
          keyExtractor={item => item.title}
          extraData={listData}
        />
        <Button
          title="Save Me"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
          onPress={() => saveData(listData)}
        />
        <Button
          title="Fill Me"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
          onPress={() => navigation.navigate('Fill', {listData: listData})}
        />
        <Button
          title="Retrieve Me"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
          onPress={() => readData()}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  logo: {
    width: 200,
    height: 200,
},
});


export default Home;
