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

import { padStart } from "lodash";

function Home({ navigation, route }) {
  const [listData, setListData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  React.useEffect(() => {
    const index = listData.length;
    if (route.params?.newItem && route.params?.newItem != listData.length) {
      var randomNumber = (Math.floor(Math.random() * 100) + 1);
      var padded = padStart(randomNumber, 2, 0);
      console.log
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
        />
        <Button
          title="Fill Me"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
          onPress={() => navigation.navigate('Fill', {listData: listData})}
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
