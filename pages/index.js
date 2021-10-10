import React, { useCallback, useEffect } from 'react';
import { Button, Card } from 'semantic-ui-react';

import factory from '../ethereum/factory';
import Layout from '../components/Layout';

export default function CampaignIndex(props) {
	const { campaigns } = props;
	/**
	 *
	 */
	useEffect(() => {}, []);

	/**
	 *
	 */
	const renderCampaigns = useCallback(() => {
		const items = campaigns.map((address) => {
			return {
				header: address,
				description: <a>View Campaign</a>,
				fluid: true,
			};
		});

		return <Card.Group items={items} />;
	}, [campaigns]);

	return (
		<Layout>
			<div>
				<h3>Open Campaigns</h3>
				<Button content="Create Campaign" icon="add circle" floated="right" primary={true} />
				{renderCampaigns()}
			</div>
		</Layout>
	);
}

/**
 * Used by Next to inject props in server side rendering
 */
CampaignIndex.getInitialProps = async () => {
	const campaigns = await factory.methods.getDeployedCampaigns().call();

	return { campaigns };
};
