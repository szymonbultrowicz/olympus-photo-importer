export type PhotoType = "ORF" | "JPG";

export interface PhotoInstance {
    type: PhotoType;
    size: number;
    modified: Date;
}

export interface Photo {
    path: string;
    name: string;
    instances: PhotoInstance[];
}

const notUndefined = <T>(value: T | undefined): value is T => value !== undefined;

const modifiedTimeComparator = (p1: Photo, p2: Photo) => p1.instances[0].modified.getTime() - p2.instances[0].modified.getTime();

const deserializeImageInfo = (info: string): Photo | undefined => {
    const match = info.match(/wlansd\[\d+\]="([^,]*),([^,]*),(\d+),(\d+),(\d+),(\d+)";/);
    if (!match) {
        return undefined;
    }
    const [, path, filename, size, , date, time] = match;
    return {
        path,
        name: filename.split('.').slice(0, -1).join('.'),
        instances: [{
            type: filename.split('.').pop() === 'JPG' ? 'JPG' : 'ORF',
            size: parseInt(size, 10),
            modified: new Date(),
        }]
    };
};

const mergeInstances = (photos: Photo[]) => {
    const map = photos.reduce((result, p) => {
            const key = p.path + p.name;
            if (result.has(key)) {
                result.get(key)?.instances.push(p.instances[0]);
            } else {
                result.set(key, p);
            }
            return result;
        }, new Map<string, Photo>());
    return [...map.values()]
        .sort(modifiedTimeComparator);
};

export const fetchPhotoInfos = async (host: string) => {
    const html = await (await fetch(`${host}DCIM/100OLYMP/`)).text();
    const matches = html.match(/wlansd\[\d+\].*/g);
    if (!matches) {
        return [];
    }
    return mergeInstances(
        [...matches]
            .map(deserializeImageInfo)
            .filter(notUndefined)
    );
}