import React, { useCallback, useState } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';

import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

export default function ContributeForm(props) {
	const { address } = props;
	const [value, setValue] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [loading, setLoading] = useState(false);

	/**
	 *
	 */
	const onSubmit = useCallback(
		async (event) => {
			event.preventDefault();

			setErrorMessage('');
			setLoading(true);

			const campaign = Campaign(address);

			try {
				const accounts = await web3.eth.getAccounts();
				await campaign.methods.contribute().send({
					from: accounts[0],
					value: web3.utils.toWei(value, 'ether'),
				});

				Router.replaceRoute(`/campaigns/${address}`);
			} catch (err) {
				setErrorMessage(err.message);
			}

			setLoading('');
			setValue('');
		},
		[address, value]
	);

	return (
		<Form onSubmit={onSubmit} error={!!errorMessage}>
			<Form.Field>
				<label>Amount to Contribute</label>
				<Input
					value={value}
					onChange={(event) => setValue(event.target.value)}
					label="ether"
					labelPosition="right"
				/>
			</Form.Field>
			<Message error={true} header="Oops!" content={errorMessage} />
			<Button primary={true} loading={loading}>
				Contribute!
			</Button>
		</Form>
	);
}
