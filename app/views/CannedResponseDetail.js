import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import I18n from '../i18n';

import SafeAreaView from '../containers/SafeAreaView';
import StatusBar from '../containers/StatusBar';
import Button from '../containers/Button';
import { useTheme } from '../theme';
import RocketChat from '../lib/rocketchat';
import Navigation from '../lib/Navigation';

import sharedStyles from './Styles';
import { themes } from '../constants/colors';


const styles = StyleSheet.create({
	container: {
		marginTop: 12,
		marginHorizontal: 22
	},
	label: {
		fontSize: 14,
		...sharedStyles.textSemibold
	},
	cannedText: {
		marginTop: 8,
		marginBottom: 16,
		fontSize: 14,
		lineHeight: 20,
		paddingTop: 0,
		paddingBottom: 0,
		...sharedStyles.textRegular
	},
	cannedTagWrap: {
		borderRadius: 4,
		marginRight: 4,
		marginTop: 8,
		height: 16
	},
	cannedTagContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	cannedTag: {
		fontSize: 12,
		lineHeight: 16,
		paddingTop: 0,
		paddingBottom: 0,
		paddingHorizontal: 4,
		...sharedStyles.textRegular
	},
	button: {
		margin: 24,
		position: 'absolute',
		bottom: 24,
		left: 0,
		right: 0
	}
});

const CannedResponseDetail = ({ navigation, route }) => {
	const { cannedResponse } = route?.params;
	const { theme } = useTheme();
	const { isMasterDetail } = useSelector(state => state.app);
	const { rooms } = useSelector(state => state.room);

	useEffect(() => {
		navigation.setOptions({
			title: `!${ cannedResponse?.shortcut }`
		});
	}, []);

	const goRoom = (item) => {
		const { room } = route.params;
		const { name, username } = room;
		const params = {
			rid: room.rid,
			name: RocketChat.getRoomTitle({
				t: room.t,
				fname: name,
				name: username
			}),
			t: room.t,
			roomUserId: RocketChat.getUidDirectMessage(room),
			usedCannedResponse: item.text
		};

		if (room.rid) {
			// if it's on master detail layout, we close the modal and replace RoomView
			if (isMasterDetail) {
				Navigation.navigate('DrawerNavigator');
				goRoom({ item: params, isMasterDetail });
			} else {
				let navigate = navigation.push;
				// if this is a room focused
				if (rooms.includes(room.rid)) {
					({ navigate } = navigation);
				}
				navigate('RoomView', params);
			}
		}
	};

	return (
		<SafeAreaView>
			<StatusBar />
			<View style={styles.container}>
				<Text style={[styles.label, { color: themes[theme].titleText }]}>{I18n.t('Shortcut')}:</Text>
				<Text style={[styles.cannedText, { color: themes[theme].auxiliaryTintColor }]}>!{cannedResponse?.shortcut}</Text>

				<Text style={[styles.label, { color: themes[theme].titleText }]}>{I18n.t('Content')}:</Text>
				<Text style={[styles.cannedText, { color: themes[theme].auxiliaryTintColor }]}>{cannedResponse?.text}</Text>

				<Text style={[styles.label, { color: themes[theme].titleText }]}>{I18n.t('Sharing')}:</Text>
				<Text style={[styles.cannedText, { color: themes[theme].auxiliaryTintColor }]}>{cannedResponse?.scopeName}</Text>

				<Text style={[styles.label, { color: themes[theme].titleText }]}>{I18n.t('Tags')}:</Text>
				<View style={styles.cannedTagContainer}>
					{
						cannedResponse?.tags?.length > 0
							? cannedResponse.tags.map(t => (
								<View style={[styles.cannedTagWrap, { backgroundColor: themes[theme].searchboxBackground }]}>
									<Text style={[styles.cannedTag, { color: themes[theme].auxiliaryTintColor }]}>{t}</Text>
								</View>
							))
							: <Text style={[styles.cannedText, { color: themes[theme].auxiliaryTintColor }]}>-</Text>
					}
				</View>
			</View>
			<Button
				title={I18n.t('Use')}
				theme={theme}
				style={[styles.button]}
				type='primary'
				onPress={() => goRoom(cannedResponse)}
			/>
		</SafeAreaView>
	);
};

CannedResponseDetail.propTypes = {
	navigation: PropTypes.object,
	route: PropTypes.object
};

export default CannedResponseDetail;
