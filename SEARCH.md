# Search

## Background 

The Apollos Project is setup to index and search Content Items via Algolia. By default, all items will be re-indexed every 24 hours using a background job service powered by Redis (using bull)

## Setup

Two additional components are needed in order to enable the search API in your apollos app, assuming you are using the latest version of the Apollos packages are are up to date with the `apollos-church-api` project. 

1. You will need to setup an Alogolia Instance. Sign up for an account on https://algolia.com. Once you are signed up, obtain your **Admin API** key from your settings screen. *Not* the search API key. 
- After obtaining your admin API key, you will need to fill in the relevant details in your `config.yml`. Replace `ALGOLIA.APPLLICATION_ID` with your application ID and the `ALGOLIA.API_KEY` field with your Admin API key.
- You will also need to create an Index to store the content you will be indexing. We named ours `test_ContentItems`, but you can name yours whatever you want. Make sure you reflect your index name in the `config.yml`


2. In order to schedule search indexing jobs, you will need to have *Bull* running. Bull works automatically as long as you have Redis running, and a `REDIS_URL` environmental variable setup that will connect you to that Redis instance. 
- Locally, you will need to install Redis, and then start it. I recommend using `brew` and `brew services` for both needs. 
- In production, you will need to setup a Redis instance accessible to your API. If you use our terraform config, a free Heroku Redis instance will be setup and configured by running `terraform apply`

## Monitoring

Once you you have completed the setup steps, you can monitor your indexing jobs by visiting the bull admin dashboard. You can visit your dashboard at http://localhost:4000/admin/queues (replace localhost:4000 with the URL of your specific API instance.)
