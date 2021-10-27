import React, { useEffect, useState } from 'react';
import { Button, Table } from 'semantic-ui-react';

import { Link } from '../../../routes';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';

const { Body, Header, HeaderCell, Row } = Table;

export default function RequestIndex(props) {
	const { address, approversCount, requests, requestCount } = props;
	const [requestRows, setRequestRows] = useState([]);

	/**
	 *
	 */
	useEffect(() => {
		setRequestRows(
			requests.map((request, index) => (
				<RequestRow
					key={`${address}-${index}`}
					id={index}
					request={request}
					address={address}
					approversCount={approversCount}
				/>
			))
		);
	}, [address, approversCount, requests]);

	/**
	 *
	 */
	return (
		<Layout>
			<h3>Requests</h3>
			<Link route={`/campaigns/${address}/requests/new`}>
				<a>
					<Button primary={true} floated={'right'} style={{ marginBottom: 10 }}>
						Add Request
					</Button>
				</a>
			</Link>
			<Table>
				<Header>
					<Row>
						<HeaderCell>ID</HeaderCell>
						<HeaderCell>Description</HeaderCell>
						<HeaderCell>Amount</HeaderCell>
						<HeaderCell>Recipient</HeaderCell>
						<HeaderCell>Approval Count</HeaderCell>
						<HeaderCell>Approve</HeaderCell>
						<HeaderCell>Finalize</HeaderCell>
					</Row>
				</Header>
				<Body>{requestRows}</Body>
			</Table>
			<div>Found {requestCount} requests.</div>
		</Layout>
	);
}

/**
 *
 */
RequestIndex.getInitialProps = async (props) => {
	const { address } = props.query;
	const campaign = Campaign(address);
	const requestCount = await campaign.methods.getRequestsCount().call();
	const approversCount = await campaign.methods.approversCount().call();

	const requests = await Promise.all(
		Array(parseInt(requestCount))
			.fill(null)
			.map((element, index) => {
				return campaign.methods.requests(index).call();
			})
	);

	return { address, approversCount, requests, requestCount };
};
