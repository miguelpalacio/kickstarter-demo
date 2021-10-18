import React, { useEffect, useState } from 'react';
import { Card, Grid } from 'semantic-ui-react';
import ContributeForm from '../../components/ContributeForm';

import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';

export default function CampaignShow(props) {
	const { address, approversCount, balance, manager, minimumContribution, requestsCount } = props;
	const [cards, setCards] = useState(<></>);

	/**
	 *
	 */
	useEffect(() => {
		const items = [
			{
				header: manager,
				meta: 'Address of Manager',
				description: 'The manager created this campaign and can create requests to withdraw money',
				style: { overflowWrap: 'break-word' },
			},
			{
				header: minimumContribution,
				meta: 'Minimum Contribution (wei)',
				description: 'You must contribute this much wei to become an approver',
			},
			{
				header: requestsCount,
				meta: 'Number of Requests',
				description:
					'A request tries to withdraw money from the contract. Requests must be approved by approvers',
			},
			{
				header: approversCount,
				meta: 'Number of Approvers',
				description: 'Number of people who have already donated to this campaign',
			},
			{
				header: web3.utils.fromWei(balance, 'ether'),
				meta: 'Campaign Balance (ether)',
				description: 'The balance is how much money this campaign has left to spend',
			},
		];

		setCards(<Card.Group items={items} />);
	}, [approversCount, balance, manager, minimumContribution, requestsCount]);

	/**
	 *
	 */
	return (
		<Layout>
			<h3>Campaign Show</h3>
			<Grid>
				<Grid.Column width={10}>{cards}</Grid.Column>
				<Grid.Column width={6}>
					<ContributeForm address={address} />
				</Grid.Column>
			</Grid>
		</Layout>
	);
}

/**
 *
 */
CampaignShow.getInitialProps = async (props) => {
	const address = props.query.address;
	const campaign = Campaign(address);
	const summary = await campaign.methods.getSummary().call();

	return {
		address,
		minimumContribution: summary[0],
		balance: summary[1],
		requestsCount: summary[2],
		approversCount: summary[3],
		manager: summary[4],
	};
};
