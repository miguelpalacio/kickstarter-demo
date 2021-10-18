import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
	JSON.parse(CampaignFactory.interface),
	'0x6A0d1b877D10D500319429eEf13DbC07A6b01360'
);

export default instance;
