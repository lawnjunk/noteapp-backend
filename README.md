# note app API

# Resources
* List
``` javascript
{
  _id: String, 
  name: String,
  notes: [Note]
}
```

* Note
``` javascript
{
  _id: String,
  name: String,
  content: String,
  listId: List._id,

}
```

# Endpoints
## POST `/api/list`
> To create a new list make a POST request to `/api/list`   

* expected Headers
 * `Accept: application/json`
 * `Content-Type: application/json`
* expected JSON data 
``` JSON
{
  "name": "todo list"
}
```  
#### Response
``` JSON
{
  "_id": "57a10f8653481f70fc61f71d",
  "_v": 0,
  "name": "todo list",
  "notes" []
}
```

## GET`/api/list/:id`
> To fetch a specific list make a GET request to `/api/list/:id`  

* expected Headers
 * `Accept: application/json`  
#### Response
``` JSON
{
  "_id": "57a10f8653481f70fc61f71d",
  "_v": 0,
  "name": "todo list",
  "notes" []
}
```

## GET`/api/list`
> To fetch an array of all the lists make a GET request to `/api/list`  

* expected Headers
 * `Accept: application/json`   
#### Response
``` JSON
[
  {
    "_id": "57a10f8653481f70fc61f71d",
    "_v": 0,
    "name": "todo list",
    "notes" []
  },
  {
    "_id": "57a10f8653481f70fcaslfdk",
    "_v": 0,
    "name": "work list",
    "notes" []
  }
]
```

## PUT `/api/list/:id`
> To update an existing list make a PUT request to `/api/list/:id`   

* expected Headers
 * `Accept: application/json`
 * `Content-Type: application/json`
* expected JSON data 
``` JSON
{
  "name": "example list name"
} 
```  
#### Response
``` JSON
{
  "_id": "57a10f8653481f70fc61f71d",
  "_v": 0,
  "name": "example list name",
  "notes" []
}
```

## DELETE `/api/list/:id`
> To delete a specific list make a GET request to `/api/list/:id`  

* expected Headers
 * `Accept: application/json`  
#### Response 
``` JSON
{
  "_id": "5ka10f8653481f70fc61f71d",
  "_v": 0,
  "name": "todo list",
  "notes": []
}
```


