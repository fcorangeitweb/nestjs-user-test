```bash
curl --location 'http://localhost:8081/auth/register' \
--header 'Content-Type: application/json' \
--data '{
    "username": "admin1",
    "password": "testpa2",
    "roles": [
        "user"
    ]
}'
```