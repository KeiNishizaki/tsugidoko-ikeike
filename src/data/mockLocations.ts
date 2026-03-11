export interface Location {
    id: string;
    name: string;
    category: 'izakaya' | 'cafe' | 'karaoke' | 'arcade' | 'bar';
    distance: string; // e.g. "300m"
    walkTime: string; // e.g. "4分"
    lat: number;
    lng: number;
}

export const mockLocations: Location[] = [
    { id: '1', name: '大衆酒場 どんちゃん', category: 'izakaya', distance: '120m', walkTime: '2分', lat: 35.6812, lng: 139.7671 },
    { id: '2', name: 'ネオンバー ミッドナイト', category: 'bar', distance: '350m', walkTime: '5分', lat: 35.6822, lng: 139.7681 },
    { id: '3', name: '純喫茶 アトモスフィア', category: 'cafe', distance: '200m', walkTime: '3分', lat: 35.6802, lng: 139.7661 },
    { id: '4', name: 'カラオケ スーパーギャラクシー', category: 'karaoke', distance: '400m', walkTime: '6分', lat: 35.6832, lng: 139.7651 },
    { id: '5', name: 'アミューズメントパーク セガドン', category: 'arcade', distance: '550m', walkTime: '8分', lat: 35.6792, lng: 139.7691 },
    { id: '6', name: '立ち飲み 串カツ侍', category: 'izakaya', distance: '50m', walkTime: '1分', lat: 35.6815, lng: 139.7675 },
    { id: '7', name: 'シーシャラウンジ チル', category: 'bar', distance: '280m', walkTime: '4分', lat: 35.6805, lng: 139.7685 },
    { id: '8', name: 'スポーツバー スマッシュ', category: 'bar', distance: '450m', walkTime: '7分', lat: 35.6825, lng: 139.7665 },
];
