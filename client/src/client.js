import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { ApolloLink } from 'apollo-link'
import { setContext } from 'apollo-link-context'
import gql from 'graphql-tag'

const http = new HttpLink({uri: 'http://localhost:4000/'})

// TODO: ADD DELAY
const delay = setContext(request => {
    new Promise ((success) => {
        setTimeout(() => {
            success()
        }, 800)
    })
})

// TODO: ADD LINK AND PUT THEM IN THE ORDER IN WHICH WE WANT THEM TO RUN
const link = ApolloLink.from([
    delay,
    http
])

const cache = new InMemoryCache()

const client = new ApolloClient({
    link,
    cache
})

export default client
