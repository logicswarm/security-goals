const request = require("graphql-request").request;

export const fetchGraphQL = async query => {
  const endpoint = window.env.api_url;

  if (!endpoint && String(process.env.NODE_ENV) !== "test") {
    console.warn("No process.env.RAZZLE_API_URL passed");
    return false;
  }

  const data = await request(endpoint, query).catch(err => {
    console.error(err.message);
    return err;
  });

  return data;
};
