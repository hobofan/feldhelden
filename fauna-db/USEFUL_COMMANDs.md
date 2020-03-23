# Create a User
```
mutation CreateUser(
   $data: UserInput!) {
  createUser(
    data: $data
  ) {
    email
  }
}
```
variables:
```
{"data":  {
    "userType":"HELPER",
    "firstName":"Max",
    "lastName":"Goisser",
    "email":"max@test.de",
    "phone":"017634557235"}
}
``` 



# 

# Auth0 - Query all non-test users

```
logins_count:{0 TO *] - user_metadata.test_user:true
```
