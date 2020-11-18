import React, { useEffect, useState } from 'react';
import { Modal, SafeAreaView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { downloadFile } from '../../utils/photo-downloader';
import { Photo, PhotoType } from '../../utils/photo-info-fetcher';

const host = 'http://10.0.2.2:8000/';

const Menu = ({photo, onDownload}: {photo: Photo, onDownload: (photoType: PhotoType) => void}) => {
    type ItemType = {id: PhotoType, title: string};
    const items = photo.instances.map((i): ItemType => ({
      id: i.type,
      title: `Download ${i.type}`,
    }));

    const onPress = (item: ItemType) => {
      onDownload(item.id);
    };
  
    const renderItem = (item: ItemType) => {
      return (
        <TouchableHighlight style={styles.button} onPress={() => onPress(item)} key={item.id}>
          <View>
            <Text>{item.title}</Text>
          </View>
        </TouchableHighlight>
      );
    };
  
  
    return (
      <SafeAreaView style={styles.list}>
        {items.map(renderItem)}
      </SafeAreaView>
    );
  };

export default (props: {photo: Photo, visible: boolean}) => {
  const [visible, setVisible] = useState(props.visible);

  useEffect(() => {
    setVisible(props.visible);
  }, [props.visible]);

  const onDownload = (photoType: PhotoType) => {
    downloadFile(props.photo, photoType, host);
    setVisible(false);
  };

  return (
      <Modal
        visible={visible}
        transparent={true}
      >
        <View style={styles.container}>
          <Menu photo={props.photo} onDownload={onDownload} />
        </View>
      </Modal>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    list: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    },
    button: {
      width: '100%',
    }
  });