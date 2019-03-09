import cardState from './cardState';
import trelloActivityState from './trelloActivityState';

export default interface boardState {
	id: string;
	url: string;
	cards: Array<cardState>;
	activity: Array<trelloActivityState>;
}