import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
	JSON.parse(CampaignFactory.interface),
	'0x03Be9B5c18f1f5e9d910d552A7A263ed714aB5D3'
);

export default instance;
