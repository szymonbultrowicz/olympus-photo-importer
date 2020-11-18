import React, { useEffect, useState } from "react";
import { SafeAreaView, VirtualizedList } from "react-native";
import { Photo, fetchPhotoInfos } from "../../utils/photo-info-fetcher";
import GalleryItem from './GalleryItem';

const host = 'http://10.0.2.2:8000/';

const getItem = (data: Photo[], index: number) => data[index];

const Gallery = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);

    useEffect(() => {
      fetchPhotoInfos(host)
        .then(setPhotos)
        .catch(console.error);
    }, []);

    return (
        <SafeAreaView>
            <VirtualizedList 
                data={photos}
                initialNumToRender={4}
                renderItem={({ item }) => <GalleryItem photo={item} />}
                keyExtractor={item => item.path + item.name}
                getItemCount={(data) => data.length}
                getItem={getItem}
            />
        </SafeAreaView>
    );
};

export default Gallery;
