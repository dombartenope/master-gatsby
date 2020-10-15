import dotenv from 'dotenv'
dotenv.config({path: '.env'})

export default {
    siteMetadata: {
        title: 'Slicks Slices',
        siteUrl: 'https://gatsby.pizza',
        description: 'The best pizza in NJ!',
        twitter: '@slicksSlices'
    },
    plugins: [
        'gatsby-plugin-styled-components',
        'gatsby-plugin-react-helmet',
        {
            resolve: 'gatsby-source-sanity',
            options: {
                projectId: 'nsbrmp61',
                dataset: 'production',
                watchMode: true,
                token: process.env.SANITY_TOKEN,
            }
        }
    ]
}