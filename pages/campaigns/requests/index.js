import React from 'react';
import { Button } from 'semantic-ui-react';

import { Link } from '../../../routes';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';

export default function RequestIndex(props) {
	const { address } = props;
	return (
		<Layout>
			<h3>Requests</h3>
			<Link route={`/campaigns/${address}/requests/new`}>
				<a>
					<Button primary={true}>Add Request</Button>
				</a>
			</Link>
		</Layout>
	);
}

RequestIndex.getInitialProps = async (props) => {
	const { address } = props.query;
	const campaign = Campaign(address);
	const requestCount = await campaign.methods.getRequestsCount().call();

	const requests = await Promise.all(
		Array(parseInt(requestCount))
			.fill(null)
			.map((element, index) => {
				return campaign.methods.requests(index).call();
			})
	);

	return { address, requests, requestCount };
};
