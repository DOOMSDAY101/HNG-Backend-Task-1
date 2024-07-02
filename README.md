## Stage One Task - Backend Track

### Task Description

Setup a basic web server in your preferred stack Deploy it to any free hosting platform and expose an API endpoint that conforms to the criteria below:<br>
Endpoint: [GET] `<example.com>/api/hello?visitor_name="Mark"`

Response:<br>

```json
{
  "client_ip": "127.0.0.10", // The IP address of the requester
  "location": "New York", // The city if the requester
  "greeting": "Hello, Mark!, the temperature is 11 degrees Celcius in New York"
}
```
