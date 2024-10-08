import { useAuthStore } from "../stores/AuthStore";
import { useDeviceStore } from "../stores/DeviceStore";
import {
	fetchDevices,
	playTrack,
	pausePlayback,
	connectToSpotify,
	fetchSongData,
} from "../helpers/SpotifyHelper";

import { usePlayerStore } from "../stores/PlayerStore";
import { Linking } from "react-native";

export const useSpotifyApi = () => {
	const token = useAuthStore((state) => state.token);
	const deviceId = useDeviceStore((state) => state.activeDevice?.id);
	const trackId = usePlayerStore((state) => state.trackId);
	const setDevices = useDeviceStore((state) => state.setDevices);
	const setLoading = useDeviceStore((state) => state.setLoading);
	const setPlayerState = usePlayerStore((state) => state.setPlayerState);
	const setId = usePlayerStore((state) => state.setTrackId);

	const authenticateOnSpotify = () => {
		connectToSpotify(
			process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID ?? "",
			"exp://192.168.68.131:8081"
		);
	};

	const fetchTrackData = async (url: string) => {
		const data = await fetchSongData(url);
		return data?.spotifyId;
	};

	const fetchUserDevices = async () => {
		if (token) {
			setLoading(true);
			await fetchDevices(token, setDevices, setLoading);
			setLoading(false);
		}
	};

	const playUserTrack = (id?: string) => {
		console.log("play");
		if (!token || !deviceId) return;

		var playId = trackId;
		if (id) {
			setId(id);
			playId = id;
		}

		playTrack(token, `spotify:track:${playId}`, deviceId).then((val) =>
			setPlayerState(val)
		);
	};

	const pauseUserTrack = () => {
		console.log("pause");
		if (token && deviceId) {
			pausePlayback(token, deviceId).then((val) => setPlayerState(!val));
		}
	};

	const openSpotifyAndActivate = () => {
		Linking.openURL("spotify:track:3mkOlbSv5RYadx0JsjTrKq");
	};

	return {
		fetchUserDevices,
		fetchTrackData,
		playUserTrack,
		pauseUserTrack,
		authenticateOnSpotify,
		openSpotifyAndActivate,
	};
};
