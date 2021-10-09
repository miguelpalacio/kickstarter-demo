const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compliedFactory = require('./build/CampaignFactory.json');

// Connect to some target network (Rinkeby in this case), and unlock an acount for use on that network
const provider = new HDWalletProvider(
	'flee artist guard faith myself bubble true paddle drift taste upon fashion', // metamask mnemonic
	'https://rinkeby.infura.io/v3/503ffb3f1ca242e195e90920068a58f2' // Infura API key to connect to Rinkeby network
);
const web3 = new Web3(provider);

const deploy = async () => {
	const accounts = await web3.eth.getAccounts();

	console.log('Attempting to deploy from account', accounts[0]);

	const result = await new web3.eth.Contract(JSON.parse(compliedFactory.interface))
		.deploy({ data: compliedFactory.bytecode })
		.send({ gas: '1000000', gasPrice: '5000000000', from: accounts[0] });

	console.log('Contract deployed to', result.options.address);
};
deploy();
