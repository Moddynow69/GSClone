import React, { useState, useEffect } from 'react';
import { Image } from 'react-native';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import XLSX from 'xlsx';

const App = () => {
  // States
  const cols = 5;
  const rows = 10;
  const [gridData, setGridData] = useState(Array(rows).fill(Array(cols).fill('')));
  const [colTop, setCol] = useState(Array(cols).fill(''));

  // Async Storage code 
  useEffect(() => {
    setCol(' ABCDE'.split(''));
    const loadData = async () => {
      try {
        const data = await AsyncStorage.getItem('gridDataGsclone');
        if (data) {
          setGridData(JSON.parse(data));
        }
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
      }
    };
    loadData();
  }, []);

  //download handle
  const handleDownload = () => {
    const wb = XLSX.utils.book_new();
    const wsData = gridData.map((row) => row.map((col) => col));
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const blob = XLSX.write(wb, { bookType: 'xlsx', type: 'blob' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gridData.xlsx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // saving state of evert elemenet
  const handleInputChange = (row, col, text) => {
    let newData = [...gridData];
    newData[row][col] = text;
    setGridData(newData);
    AsyncStorage.setItem('gridDataGsclone', JSON.stringify(newData));
  };

  // Style
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      justifyContent: 'center',
    },
    row: {
      flexDirection: 'row',
    },
    input: {
      flex: 1,
      borderWidth: 1,
      padding: 10,
    },
    navbar: {
      marginTop: 2,
      backgroundColor: '#0ef',
      borderBlockColor: '#000',
      borderWidth: 1,
      marginBottom: 10,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#000',
    },
    colTop: {
      flexDirection: 'row',
    },
    colside: {
      flexDirection: 'column',
    },
    box: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    comp: {
      flex: 1,
      borderWidth: 1,
      padding: 10,
      textAlign: 'center',
      backgroundColor: '#E0E0E0',
    },
    boxRight: {
      width: 350,
    },
    tinyLogo: {
      width: 20,
      height: 20,
    },
    button: {
      color: '#000',
    }
  });


  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Button style={styles.button} title='Download' onPress={handleDownload} />
        <Image style={styles.tinyLogo} source={require('./assets/download.png')} />
      </View>
      <View style={styles.box}>
        <View style={styles.boxRight}>
          <View style={styles.colTop}>
            {colTop.map((col, colIndex) => (
              <Text style={styles.comp}>{col}</Text>
            ))}
          </View>
          {gridData.map((row, rowIndex) => (
            <View style={styles.row} key={rowIndex}>
              <Text style={styles.comp}>{rowIndex + 1}</Text>
              {row.map((col, colIndex) => (
                <TextInput
                  key={rowIndex * cols + colIndex}
                  style={styles.input}
                  value={gridData[rowIndex][colIndex]}
                  onChangeText={(text) => handleInputChange(rowIndex, colIndex, text)}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default App;
