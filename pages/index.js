import React, { useEffect } from 'react';
import factory from '../ethereum/factory';

export default CampaignIndex = () => {
	/**
	 *
	 */
	useEffect(() => {
		factory.methods
			.getDeployedCampaigns()
			.call()
			.then((campaigns) => {
				console.log(campaigns);
			});
	}, []);

	return <h1>This is the campaign list page!!!</h1>;
};
