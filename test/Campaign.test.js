const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compliedFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
	accounts = await web3.eth.getAccounts();

	factory = await new web3.eth.Contract(JSON.parse(compliedFactory.interface))
		.deploy({ data: compliedFactory.bytecode })
		.send({ from: accounts[0], gas: '1000000' });

	await factory.methods.createCampaign('100').send({
		from: accounts[0],
		gas: '1000000',
	});

	[campaignAddress] = await factory.methods.getDeployedCampaigns().call();

	// The contract already exists, just need to pass the ABI and the contract's address
	campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);
});

describe('Campaigns', () => {
	it('deploys a factory and a campaign', () => {
		assert.ok(factory.options.address);
		assert.ok(campaign.options.address);
	});

	it('marks caller as the campaign manager', async () => {
		const manager = await campaign.methods.manager().call();
		assert.equal(accounts[0], manager);
	});

	it('allows people to contribute money and marks them as approvers', async () => {
		await campaign.methods.contribute().send({
			value: '200',
			from: accounts[1],
		});

		const isContributor = await campaign.methods.approvers(accounts[1]).call();
		assert(isContributor);
	});

	it('requires a minimum contribution', async () => {
		let result;

		try {
			await campaign.methods.contribute().send({
				value: '5',
				from: accounts[1],
			});
			result = false;
		} catch (error) {
			result = error;
		} finally {
			assert(result);
		}
	});

	it('allows a manager to make a payment request', async () => {
		await campaign.methods.createRequest('Buy batteries', '100', accounts[1]).send({
			from: accounts[0],
			gas: '1000000',
		});

		const request = await campaign.methods.requests(0).call();

		assert.equal('Buy batteries', request.description);
	});

	it('processes requests', async () => {
		let initialBalance = await web3.eth.getBalance(accounts[1]);
		initialBalance = web3.utils.fromWei(initialBalance, 'ether');
		initialBalance = parseFloat(initialBalance);

		await campaign.methods.contribute().send({
			from: accounts[0],
			value: web3.utils.toWei('10', 'ether'),
		});

		await campaign.methods
			.createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
			.send({ from: accounts[0], gas: '1000000' });

		await campaign.methods.approveRequest(0).send({
			from: accounts[0],
			gas: '1000000',
		});

		await campaign.methods.finalizeRequest(0).send({
			from: accounts[0],
			gas: '1000000',
		});

		let newBalance = await web3.eth.getBalance(accounts[1]);
		newBalance = web3.utils.fromWei(newBalance, 'ether');
		newBalance = parseFloat(newBalance);

		assert(newBalance > initialBalance);
	});
});
