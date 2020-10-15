import path, { resolve } from 'path';
import fetch from 'isomorphic-fetch';
import { graphql } from 'gatsby';

const turnPizzasIntoPages = async ({graphql, actions}) => {
    //Get template
    const pizzaTemplate = path.resolve('./src/templates/Pizza.js');
    //Query all pizzas
    const { data } = await graphql(`
        query {
            pizzas: allSanityPizza {
                nodes {
                    name
                    slug {
                        current
                    }
                }
            }
        }
    `);
    //Loop over each pizza and create page
    data.pizzas.nodes.forEach(pizza => {
        actions.createPage({
            //url for new page
            path: `pizza/${pizza.slug.current}`,
            component: pizzaTemplate,
            context: {
                slug: pizza.slug.current,
            }
        });
    })
}

const turnToppingsIntoPages = async ({graphql, actions}) => {
    const toppingsTemplate = path.resolve('./src/pages/pizzas.js');
    const { data } = await graphql(`
        query {
            toppings: allSanityTopping {
                nodes {
                    name
                    id
                }
            }
        }
    `);

    data.toppings.nodes.forEach(topping => {
        actions.createPage({
            path: `topping/${topping.name}`,
            component: toppingsTemplate,
            context: {
                topping: topping.name,
                //TODO Regex for topping
            }
        });
    })
}

const fetchBeersAndTurnIntoNodes = async ({
    actions,
    createNodeId,
    createContentDigest,
  }) => {
    // 1. Fetch a  list of beers
    const res = await fetch('https://sampleapis.com/beers/api/ale');
    const beers = await res.json();
    // 2. Loop over each one
    for (const beer of beers) {
      // create a node for each beer
      const nodeMeta = {
        id: createNodeId(`beer-${beer.name}`),
        parent: null,
        children: [],
        internal: {
          type: 'Beer',
          mediaType: 'application/json',
          contentDigest: createContentDigest(beer),
        },
      };
      // 3. Create a node for that beer
      actions.createNode({
        ...beer,
        ...nodeMeta,
      });
    }
  }

const turnSlicemastersIntoPages = async ({ graphql, actions }) => {
    //Query all slicemasters
    const { data } = await graphql(`
    query {
      slicemasters: allSanityPerson {
        totalCount
        nodes {
          name
          id
          slug {
            current
          }
        }
      }
    }
  `);
    //Turn each slicemaster into their own page
    data.slicemasters.nodes.forEach(slicemaster => {
        actions.createPage({
            component: resolve('./src/templates/Slicemaster.js'),
            path: `/slicemaster/${slicemaster.slug.current}`,
            context: {
                name: slicemaster.person,
                slug: slicemaster.slug.current,
            }
        })
    })
    //Figure out how many pages there are 

    const pageSize = parseInt(process.env.GATSBY_PAGE_SIZE);
    const pageCount = Math.ceil(data.slicemasters.totalCount / pageSize);
    console.log(
      `There are ${data.slicemasters.totalCount} total people. And we have ${pageCount} pages with ${pageSize} per page`
    );
    
    //Loop from 1 to n and create pages for them
    Array.from({ length: pageCount }).forEach((_, i) => {
        console.log(`creating page ${i}`);
        actions.createPage({
            path: `/slicemasters/${i+1}`,
            component: path.resolve('./src/pages/slicemasters.js'),
            context: {
                skip: i * pageSize,
                currentPage: i + 1,
                pageSize,
            }
        })
    })
}

export const sourceNodes = async (params) => {
    //Fetch list of beers and source them into the gatsby api
    await Promise.all([fetchBeersAndTurnIntoNodes(params)]);
}

export const createPages = async (params) => {
    //Create pages dynamically
    
    await Promise.all([
        turnPizzasIntoPages(params),
        turnToppingsIntoPages(params),
        turnSlicemastersIntoPages(params),
    ])
    

}
