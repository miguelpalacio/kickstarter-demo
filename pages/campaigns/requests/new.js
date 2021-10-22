import React, { useState } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';

import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../routes';
import Layout from '../../../components/Layout';

export default function RequestNew() {
	const [value, setValue] = useState('');
	const [description, setDescription] = useState('');
	const [recipient, setRecipient] = useState('');

	return (
		<Layout>
			<h3>Create a Request</h3>
			<Form>
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

				<Button primary={true}>Create!</Button>
			</Form>
		</Layout>
	);
}

RequestNew.getInitialProps = async (props) => {
	const { address } = props.query;

	return { address };
};
