import React from 'react';
import Layout from '../../../components/Layout';
import { Link } from '../../../routes';
import { Button } from 'semantic-ui-react';

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
	return { address };
};
