import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { downloadFile } from '../../utils/photo-downloader';
import { Photo } from '../../utils/photo-info-fetcher';

const host = 'http://10.0.2.2:8000/';

export default ({ photo }: {photo: Photo})=> {
    const uri = host + 'get_thumbnail.cgi?DIR=' + photo.path + photo.name + "." + photo.instances[0].type;
    
    // const [style, setStyle] = useState(styles.thumbnail);
  
    // useEffect(() => {
    //   Image.getSize(uri, (width, height) => {
    //     setStyle({
    //       ...style,
    //       width,
    //       height
    //     });
    //   })
    // }, []);
  
    const onPress = () => {
      downloadFile(photo, photo.instances[0].type, host);
    };
  
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={onPress} underlayColor={'#ccc'}>
          <View style={styles.innerContainer}>
            <Text>{photo.name}</Text>
            <Image
              style={styles.thumbnail}
              source={{
                uri
              }}
            />
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      height: 150,
      justifyContent: 'center',
      marginVertical: 8,
      marginHorizontal: 16,
      borderColor: '#999999',
      borderWidth: 1,
    },
    innerContainer: {
      padding: 20,
    },
    thumbnail: {
      width: 100,
      height: 100,
    }
  });
