import { gql } from "apollo-angular";

export const LOGIN = gql`
    mutation GenerateToken($email: String!, $password: String!) {
        generateToken(authRequest: { email: $email, password: $password }) {
            token
            message
        }
    }
`


  