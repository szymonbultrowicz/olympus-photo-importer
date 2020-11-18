import { Alert, PermissionsAndroid, Platform } from "react-native";
import { Photo, PhotoType } from "./photo-info-fetcher";
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import CameraRoll from "@react-native-community/cameraroll";
import path from 'path';

const ensurePermissions = async () => {
    if (Platform.OS !== 'android') {
        return true;
    }

    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
        } else {
            Alert.alert(
                'Download image',
                'Cannot download image without access to the storage. Aborting...',
            );
            return false;
        }
    } catch(e) {
        Alert.alert(
            'Download image',
            'Failed to obtain storage permission. Unable to download the image',
        );
        return false;
    }
};

export const downloadFile = async (photo: Photo, type: PhotoType, host: string) => {
    const granted = await ensurePermissions();
    if (!granted) {
        return;
    }

    const renameTmpFile = async (tmpPath: string) => {
        const newPath = `${path.dirname(tmpPath)}/${photo.name}.${type.toLocaleLowerCase()}`;
        if (await RNFS.exists(newPath)) {
            await RNFS.unlink(newPath);
        }
        await RNFS.moveFile(tmpPath, newPath);
        return newPath;
    };

    RNFetchBlob.config({
        fileCache: true,
        appendExt: type.toLocaleLowerCase(),
    }).fetch(
        'GET', 
        `${host}${photo.path}${photo.name}${type}`
    ).then(async res => 
        renameTmpFile(res.path())
    ).then(path => {
        CameraRoll.save(path, {
            type: 'photo',
            album: 'OLYMPUS',
        }).then(() => {
            Alert.alert(
                'Download image',
                'Saved image',
            );
            RNFS.unlink(path);
        });
    });
};
