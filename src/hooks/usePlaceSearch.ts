/// <reference types="@types/google.maps" />
import { useState, useCallback } from 'react';
import { type Location } from '../data/mockLocations';

export const usePlaceSearch = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchPlaces = useCallback(async (lat: number, lng: number, keyword: string): Promise<Location[]> => {
        setLoading(true);
        setError(null);

        return new Promise((resolve, reject) => {
            if (!window.google || !window.google.maps || !window.google.maps.places) {
                const errMsg = 'Google Maps API is not loaded.';
                setError(errMsg);
                setLoading(false);
                reject(new Error(errMsg));
                return;
            }

            const currentPos = new google.maps.LatLng(lat, lng);

            // ダミーの要素を作成（PlacesServiceに必要）
            const mapDiv = document.createElement('div');
            const map = new google.maps.Map(mapDiv, {
                center: currentPos,
                zoom: 15,
            });

            const service = new google.maps.places.PlacesService(map);

            const request: google.maps.places.PlaceSearchRequest = {
                location: currentPos,
                radius: 1000, // 1km圏内
                keyword: keyword,
            };

            service.nearbySearch(request, (results: google.maps.places.PlaceResult[] | null, status: google.maps.places.PlacesServiceStatus) => {
                setLoading(false);
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                    // Google APIからの結果をLocation型に変換
                    const mappedLocations: Location[] = [];
                    
                    results.forEach(place => {
                        // 距離計算の概算 (簡易的な直線距離)
                        let distanceStr = '近く';
                        let distanceNum = 0;
                        if (place.geometry && place.geometry.location) {
                            const pLat = place.geometry.location.lat();
                            const pLng = place.geometry.location.lng();
                            const R = 6371; // km
                            const dLat = (pLat - lat) * Math.PI / 180;
                            const dLng = (pLng - lng) * Math.PI / 180;
                            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                                      Math.cos(lat * Math.PI / 180) * Math.cos(pLat * Math.PI / 180) *
                                      Math.sin(dLng/2) * Math.sin(dLng/2);
                            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                            const d = R * c * 1000; // meters
                            
                            distanceNum = d;
                            distanceStr = `${Math.round(d)}m`;
                        }

                        // TextSearchやNearbySearchでキーワードによるバイアスによって
                        // 遠すぎる有名店が紛れ込むのを防ぐため、直線距離で1.5km以上のものは候補から外す
                        if (distanceNum > 1500) return;

                        // カテゴリの推測
                        let category = 'お店';
                        if (place.types) {
                            if (place.types.includes('restaurant') || place.types.includes('food')) category = '飲食店';
                            if (place.types.includes('bar')) category = '居酒屋・バー';
                            if (place.types.includes('cafe')) category = 'カフェ';
                        }
                        
                        // 画像URLの取得
                        let photoUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(keyword)}`;
                        if (place.photos && place.photos.length > 0) {
                            photoUrl = place.photos[0].getUrl({ maxWidth: 400 });
                        }

                        mappedLocations.push({
                            id: place.place_id || Math.random().toString(),
                            name: place.name || '不明な店舗',
                            category: category,
                            distance: distanceStr,
                            walkTime: `約${Math.max(1, Math.round(distanceNum / 80))}分`,
                            image: photoUrl,
                            lat: place.geometry?.location?.lat() || 0,
                            lng: place.geometry?.location?.lng() || 0,
                            address: place.formatted_address || place.vicinity || '',
                        });
                    });
                    
                    if (mappedLocations.length === 0) {
                        reject(new Error('近くにお店が見つかりませんでした。別の条件で試すか、自力で探せ！'));
                    } else {
                        resolve(mappedLocations);
                    }
                } else {
                    const errMsg = `お店の検索に失敗しました。ステータス: ${status}`;
                    setError(errMsg);
                    reject(new Error(errMsg));
                }
            });
        });
    }, []);

    return { loading, error, searchPlaces };
};
