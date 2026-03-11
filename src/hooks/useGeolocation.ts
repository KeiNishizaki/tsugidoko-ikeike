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

    const fetchLocation = useCallback(() => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        if (!navigator.geolocation) {
            setState((prev) => ({ ...prev, loading: false, error: 'Geolocation is not supported' }));
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
            },
            (error) => {
                setState({
                    lat: null,
                    lng: null,
                    error: error.message,
                    loading: false,
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    }, []);

    return { ...state, fetchLocation };
};
