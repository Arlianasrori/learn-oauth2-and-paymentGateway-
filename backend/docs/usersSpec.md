# register 
end point post /users/register

req body : 
```json
    {
        "email" : "",
        "no_hp" : 92372,
        "name" : "bil",
        "alamat" : 6,
        "refresh_token" : "hjsca",
        "refresh_token_seller" : "hsjhd"
    }
```

res body succes:
```json
    {
        "status" : "insert succes",
        "data" : []
    }
```
res body error:
```json
    {
        "msg" : "email required",
    }
```
# tobeseller 
end point post /users/register

auth

req body : 
```json
    {
        "email" : "",
        "no_hp" : 92372,
        "password" : "sasnjan",
        "token" : "k,jgkf"
    }
```

res body succes:
```json
    {
        "status" : "succes",
        "token" : "hxjs"
    }
```
res body error:
```json
    {
        "msg" : "email required",
    }
```
☻
# get SpesifikUser 
end point get /users/: by email by phone by name by alamat

res body succes:
```json
    {
        "status" : "succes",
        "data" :[]
    }
```

# get user 
end point get /users

res body succes:
```json
    {
        "status" : "succes",
        "data" :[]
    }
```

# update user

auth token

req body : 
```json
    {
        "name" : "anyting"
    }
```
res body :
```json
    {
        "data" : {}
    }
```
res body error : 
```json
    {
        "msg" : "user not found"
    }
```