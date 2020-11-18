import React, { useEffect, useState } from "react";
import { Image, SafeAreaView, StyleSheet, Text, View, VirtualizedList } from "react-native";
import { Photo, fetchPhotoInfos } from "../../utils/photo-info-fetcher";

const getItem = (data: Photo[], index: number) => data[index];

const Item = ({ photo }: {photo: Photo})=> {
  const uri = 'http://10.0.2.2:8000/' + 'get_thumbnail.cgi?DIR=' + photo.path + photo.name + "." + photo.instances[0].type;
  
  const [style, setStyle] = useState(styles.thumbnail);

  // useEffect(() => {
  //   Image.getSize(uri, (width, height) => {
  //     setStyle({
  //       ...style,
  //       width,
  //       height
  //     });
  //   })
  // }, []);

  return (
    <View style={styles.item}>
      <Text style={styles.title}>{photo.name}</Text>
      <Image
        style={style}
        source={{
          uri
        }}
      />
    </View>
  );
}

const Gallery = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);

    useEffect(() => {
      fetchPhotoInfos()
        .then(setPhotos)
        .catch(console.error);
    }, []);

    return (
        <SafeAreaView>
            <VirtualizedList 
                data={photos}
                initialNumToRender={4}
                renderItem={({ item }) => <Item photo={item} />}
                keyExtractor={item => item.path + item.name}
                getItemCount={(data) => data.length}
                getItem={getItem}
            />
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 0,
    },
    item: {
      backgroundColor: '#f9c2ff',
      height: 150,
      justifyContent: 'center',
      marginVertical: 8,
      marginHorizontal: 16,
      padding: 20,
    },
    title: {
      fontSize: 32,
    },
    thumbnail: {
      width: 100,
      height: 100,
    }
  });

export default Gallery;
