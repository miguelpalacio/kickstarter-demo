import React, { useCallback, useEffect, useState } from 'react';
import { Button, Table } from 'semantic-ui-react';

import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';

const { Cell, Row } = Table;

export default function RequestRow(props) {
	const { address, approversCount, id, request } = props;
	const { approvalCount, complete, description, recipient, value } = request;
	const [valueInEth, setValueInEth] = useState('');
	const [readyToFinalize, setReadyToFinalize] = useState(false);

	/**
	 *
	 */
	useEffect(() => {
		setValueInEth(web3.utils.fromWei(value, 'ether'));
	}, [value]);

	/**
	 *
	 */
	useEffect(() => {
		setReadyToFinalize(approvalCount > approversCount / 2);
	}, [approvalCount, approversCount]);

	/**
	 *
	 */
	const onApprove = useCallback(async () => {
		const campaign = Campaign(address);
		const accounts = await web3.eth.getAccounts();

		await campaign.methods.approveRequest(id).send({
			from: accounts[0],
		});
	}, [address]);

	/**
	 *
	 */
	const onFinalize = useCallback(async () => {
		const campaign = Campaign(address);
		const accounts = await web3.eth.getAccounts();

		await campaign.methods.finalizeRequest(id).send({
			from: accounts[0],
		});
	}, [address]);

	/**
	 *
	 */
	return (
		<Row disabled={complete} positive={readyToFinalize && !complete}>
			<Cell>{id}</Cell>
			<Cell>{description}</Cell>
			<Cell>{valueInEth}</Cell>
			<Cell>{recipient}</Cell>
			<Cell>
				{approvalCount}/{approversCount}
			</Cell>
			<Cell>
				{!complete && (
					<Button color={'green'} basic={true} onClick={onApprove}>
						Approve
					</Button>
				)}
			</Cell>
			<Cell>
				{!complete && (
					<Button color={'teal'} basic={true} onClick={onFinalize}>
						Finalize
					</Button>
				)}
			</Cell>
		</Row>
	);
}
