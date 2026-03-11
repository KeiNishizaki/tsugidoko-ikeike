import { useState, useCallback } from 'react';

interface GeoState {
    lat: number | null;
    lng: number | null;
    error: string | null;
    loading: boolean;
}

export const useGeolocation = () => {
    const [state, setState] = useState<GeoState>({
        lat: null,
        lng: null,
        error: null,
        loading: false,
    });

    const fetchLocation = useCallback((): Promise<{lat: number, lng: number}> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                const errorMsg = 'Geolocation is not supported';
                setState((prev) => ({ ...prev, loading: false, error: errorMsg }));
                reject(new Error(errorMsg));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setState({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        error: null,
                        loading: false,
                    });
                    resolve({ lat: position.coords.latitude, lng: position.coords.longitude });
                },
                (error) => {
                    setState({
                        lat: null,
                        lng: null,
                        error: error.message,
                        loading: false,
                    });
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        });
    }, []);

    return { ...state, fetchLocation };
};
