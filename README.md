## Requirements

```
node -v
v16.17.0
```

```
npm i -g @nestjs/cli@8.0.0
```

## Login as Admin

```
POST: https://localhost:3000/auth/login

Payload:
{
    "email": "admin@graphql.org",
    "password": "admin.2022"
}
```

## User Profile

```
GET: https://localhost:3000/auth/profile

Header: Auth: 'Bearer <toke>'
```

## Refresh Token

```
POST: https://localhost:3000/auth/refresh

{
    "refreshToken": "<refresh_token>"
}
```

## Logout Endpoint

```
GET: https://localhost:3000/auth/logout

Header: Auth: 'Bearer <toke>'
```

## [API Doc]

```
https://localhost:3000/graphql
```
