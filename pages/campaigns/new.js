import React, { useCallback, useState } from 'react';
import { Button, Form, Input } from 'semantic-ui-react';
import Layout from '../../components/Layout';

import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';

export default function CampaignNew() {
	const [minimumContribution, setMinimumContribution] = useState('');

	/**
	 *
	 */
	const onSubmit = useCallback(
		async (event) => {
			event.preventDefault();

			const accounts = await web3.eth.getAccounts();

			await factory.methods.createCampaign(minimumContribution).send({
				from: accounts[0],
			});
		},
		[minimumContribution]
	);

	return (
		<Layout>
			<h3>New Campaign!</h3>
			<Form onSubmit={onSubmit}>
				<Form.Field>
					<label>Minimum Contribution</label>
					<Input
						label="wei"
						labelPosition="right"
						value={minimumContribution}
						onChange={(event) => setMinimumContribution(event.target.value)}
					/>
				</Form.Field>

				<Button primary={true}>Create!</Button>
			</Form>
		</Layout>
	);
}
