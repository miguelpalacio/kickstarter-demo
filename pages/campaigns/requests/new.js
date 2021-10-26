import React, { useState } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';

import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../routes';
import Layout from '../../../components/Layout';

export default function RequestNew(props) {
	const { address } = props;
	const [value, setValue] = useState('');
	const [description, setDescription] = useState('');
	const [recipient, setRecipient] = useState('');
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	/**
	 *
	 */
	const onSubmit = async (event) => {
		event.preventDefault();

		setLoading(true);
		setErrorMessage('');

		const campaign = Campaign(address);

		try {
			const accounts = await web3.eth.getAccounts();
			await campaign.methods.createRequest(description, web3.utils.toWei(value, 'ether'), recipient).send({
				from: accounts[0],
			});

			Router.pushRoute(`/campaigns/${address}/requests`);
		} catch (err) {
			setErrorMessage(err.message);
		}

		setLoading(false);
	};

	return (
		<Layout>
			<Link route={`/campaigns/${address}/requests`}>
				<a>Back</a>
			</Link>
			<h3>Create a Request</h3>
			<Form onSubmit={onSubmit} error={!!errorMessage}>
				<Form.Field>
					<label>Description</label>
					<Input value={description} onChange={(event) => setDescription(event.target.value)} />
				</Form.Field>

				<Form.Field>
					<label>Value in Ether</label>
					<Input value={value} onChange={(event) => setValue(event.target.value)} />
				</Form.Field>

				<Form.Field>
					<label>Recipient</label>
					<Input value={recipient} onChange={(event) => setRecipient(event.target.value)} />
				</Form.Field>

				<Message error={true} header="Oops" content={errorMessage} />
				<Button primary={true} loading={loading}>
					Create!
				</Button>
			</Form>
		</Layout>
	);
}

RequestNew.getInitialProps = async (props) => {
	const { address } = props.query;

	return { address };
};
