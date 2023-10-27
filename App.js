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
  const cols = 5;
  const rows = 10;
  const [gridData, setGridData] = useState(Array(cols).fill(Array(rows).fill('')));
  const [colTop, setCol] = useState(Array(cols).fill(''));
  const [rowTop, setRow] = useState(Array(rows).fill(''));

  useEffect(() => {
    setCol('ABCDE'.split(''));
    const loadData = async () => {
      try {
        const data = await AsyncStorage.getItem('gridData');
        if (data) {
          setGridData(JSON.parse(data));
        }
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
      }
    };
    loadData();
  }, []);

  
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
  const handleInputChange = (row, col, text) => {
    let newData = [...gridData];
    newData[row][col] = text;
    setGridData(newData);
    AsyncStorage.setItem('gridData', JSON.stringify(newData));
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Button style={styles.button} title='Download' onPress={handleDownload} />
          <Image style={styles.tinyLogo} source={require('./assets/download.png')} />
      </View>
      <View style={styles.box}>
        <View style={styles.rowside}>
          <Text style={styles.comp}></Text>
          {rowTop.map((row, rowIndex) => (
            <Text style={styles.comp}>{rowIndex + 1}</Text>
          ))
          }
        </View>
        <View style={styles.boxRight}>
          <View style={styles.colTop}>
            {colTop.map((col, colIndex) => (
              <Text style={styles.comp}>{col}</Text>
            ))
            }
          </View>
          {gridData.map((row, rowIndex) => (
            <View style={styles.row} key={rowIndex}>
              {row.map((col, colIndex) => (
                <TextInput
                  key={colIndex}
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
    flexDirection: 'row',
  },
  comp: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    textAlign: 'center',
    backgroundColor: '#E0E0E0',
  },
  boxRight: {
    width: 300,
  },
  tinyLogo: {
    width: 20,
    height: 20,
  },
  button: {
    color: '#000',
  }
});

export default App;
