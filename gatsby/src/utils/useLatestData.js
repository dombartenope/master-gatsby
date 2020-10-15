import { useEffect, useState } from 'react';

const gql = String.raw;
const deets = gql`
    name
    _id
    image {
        asset {
            url
            metadata {
                lqip
            }
        }
    }
`;
const useLatestData = () => {
	const [hotSlices, setHotSlices] = useState();
	const [slicemasters, setSlicemasters] = useState();
	//Side effect to fetch data from graphql endpoint
	useEffect(() => {
		fetch(process.env.GATSBY_GRAPHQL_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				query: gql`
                    query {
                        StoreSettings(id: "downtown") {
                            name
                            slicemasters {
                                ${deets}
                            }
                            hotSlices {
                                ${deets}
                            }
                        }
                    }
                `,
			}),
		})
			.then((res) => res.json())
			.then((res) => {
				//TODO: check for errors
				setHotSlices(res.data.StoreSettings.hotSlices);
				setSlicemasters(res.data.StoreSettings.slicemasters);
			})
			.catch((err) => {
				throw new Error(err.message);
			});
	}, []);
	return {
		hotSlices,
		slicemasters,
	};
};

export default useLatestData;
