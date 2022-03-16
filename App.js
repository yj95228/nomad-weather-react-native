import { Fontisto } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Dimensions,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// const SCREEN_WIDTH = Dimensions.get('window').width;
const API_KEY = 'd308d51adf6d7ee602a1d3c53ddd0946';

const icons = {
	Clear: 'day-sunny',
	Clouds: 'cloudy',
	Rain: 'rain',
	Atmosphere: 'cloudy-gusts',
	Snow: 'snow',
	Drizzle: 'day-rain',
	Thunderstorm: 'lightning',
};
export default function App() {
	const [city, setCity] = useState('Loading...');
	const [days, setDays] = useState([]);
	const [location, setLocation] = useState();
	const [ok, setOk] = useState(true);
	const getWeather = async () => {
		const { granted } = await Location.requestForegroundPermissionsAsync();
		if (!granted) {
			setOk(false);
		}
		const {
			coords: { latitude, longitude },
		} = await Location.getCurrentPositionAsync({ accuracy: 5 });
		const location = await Location.reverseGeocodeAsync(
			{ latitude, longitude },
			{ useGoogleMaps: false }
		);
		setCity(location[0].region.substring(0, 2));
		const response = await fetch(
			`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude={alerts}&appid=${API_KEY}&units=metric`
		);
		const json = await response.json();
		setDays(json.daily);
	};
	useEffect(() => {
		getWeather();
	}, []);
	return (
		<View style={styles.container}>
			<StatusBar style="light" />
			<View style={styles.city}>
				<Text style={styles.cityName}>{city}</Text>
			</View>
			<ScrollView
				pagingEnabled
				horizontal
				showsHorizontalScrollIndicator={true}
				contentContainerStyle={styles.weather}
			>
				{days.length === 0 ? (
					<View style={{ ...styles.day, alignItems: 'center' }}>
						<ActivityIndicator
							color="white"
							style={{ marginTop: 10 }}
							size="large"
						/>
					</View>
				) : (
					days.map((day, index) => (
						<View key={index} style={styles.day}>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'flex-end',
									width: '100%',
									justifyContent: 'space-between',
								}}
							>
								<Text style={styles.temp}>
									{parseFloat(day.temp.day).toFixed(1)}
								</Text>
								<Fontisto
									name={icons[day.weather[0].main]}
									size={68}
									color="white"
								/>
							</View>
							<Text style={styles.description}>{day.weather[0].main}</Text>
							<Text style={styles.tinyText}>{day.weather[0].description}</Text>
						</View>
					))
					// <View style={styles.day}>
					// </View>
				)}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'black',
	},
	city: {
		flex: 1.2,
		justifyContent: 'center',
		alignItems: 'center',
	},
	cityName: {
		fontSize: 58,
		fontWeight: '500',
		color: 'white',
	},
	weather: {
		// backgroundColor: 'blue',
	},
	day: {
		width: SCREEN_WIDTH,
		alignItems: 'flex-start',
		paddingHorizontal: 20,
	},
	temp: {
		marginTop: 50,
		fontWeight: '600',
		fontSize: 100,
		color: 'white',
	},
	description: {
		marginTop: -10,
		fontSize: 30,
		color: 'white',
		fontWeight: '500',
	},
	tinyText: {
		fontSize: 20,
	},
});
