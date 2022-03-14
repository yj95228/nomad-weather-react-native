import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// const SCREEN_WIDTH = Dimensions.get('window').width;

export default function App() {
	const [city, setCity] = useState('Loading...');
	const [location, setLocation] = useState();
	const [ok, setOk] = useState(true);
	const ask = async () => {
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
		setCity(location[0].region);
	};
	useEffect(() => {
		ask();
	}, []);
	return (
		<View style={styles.container}>
			<View style={styles.city}>
				<Text style={styles.cityName}>{city}</Text>
			</View>
			<ScrollView
				pagingEnabled
				horizontal
				showsHorizontalScrollIndicator={true}
				contentContainerStyle={styles.weather}
			>
				<View style={styles.day}>
					<Text style={styles.temp}>27</Text>
					<Text style={styles.description}>Sunny</Text>
				</View>
				<View style={styles.day}>
					<Text style={styles.temp}>27</Text>
					<Text style={styles.description}>Sunny</Text>
				</View>
				<View style={styles.day}>
					<Text style={styles.temp}>27</Text>
					<Text style={styles.description}>Sunny</Text>
				</View>
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
		alignItems: 'center',
	},
	temp: {
		marginTop: 50,
		fontWeight: '600',
		fontSize: 158,
		color: 'white',
	},
	description: {
		marginTop: -30,
		fontSize: 50,
		color: 'white',
	},
});
