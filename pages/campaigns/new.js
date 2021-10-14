import React, { useCallback, useState } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';

import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

export default function CampaignNew() {
	const [minimumContribution, setMinimumContribution] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [loading, setLoading] = useState(false);

	/**
	 *
	 */
	const onSubmit = useCallback(
		async (event) => {
			event.preventDefault();

			if (loading) return; // avoid submitting the same request many times

			setLoading(true);
			setErrorMessage('');

			try {
				const accounts = await web3.eth.getAccounts();
				await factory.methods.createCampaign(minimumContribution).send({
					from: accounts[0],
				});

				Router.pushRoute('/');
			} catch (error) {
				setErrorMessage(error.message);
			}

			setLoading(false);
		},
		[minimumContribution]
	);

	return (
		<Layout>
			<h3>New Campaign!</h3>
			<Form onSubmit={onSubmit} error={!!errorMessage}>
				<Form.Field>
					<label>Minimum Contribution</label>
					<Input
						label="wei"
						labelPosition="right"
						value={minimumContribution}
						onChange={(event) => setMinimumContribution(event.target.value)}
					/>
				</Form.Field>

				<Message error={true} header="Oops!" content={errorMessage} />
				<Button primary={true} loading={loading}>
					Create!
				</Button>
			</Form>
		</Layout>
	);
}
